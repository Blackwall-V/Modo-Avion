"""
Order views. Checkout is the only public write — it executes under
``transaction.atomic`` with ``select_for_update`` on the affected Product
rows, which serialises concurrent purchases and prevents overselling under
load.
"""
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.products.models import Product
from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer


class IsAuthenticatedReadOnly(permissions.BasePermission):
    """Order history is private; anonymous users get 401, not 403."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return True


class OrderListCreateView(APIView):
    """
    GET  /api/orders/  → current user's orders
    POST /api/orders/  → create an order atomically
    """

    permission_classes = [IsAuthenticatedReadOnly]

    def get(self, request):
        qs = Order.objects.filter(user=request.user).prefetch_related("items__product")
        return Response(OrderSerializer(qs, many=True).data)

    @transaction.atomic
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Lock the affected product rows for the duration of the transaction.
        product_ids = [line["product_id"] for line in data["items"]]
        products = {
            p.pk: p
            for p in Product.objects.select_for_update().filter(pk__in=product_ids, is_active=True)
        }

        # Validate every line *before* mutating any stock.
        missing = [pid for pid in product_ids if pid not in products]
        if missing:
            return Response(
                {"detail": f"Unknown or inactive products: {missing}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for line in data["items"]:
            if products[line["product_id"]].stock < line["quantity"]:
                p = products[line["product_id"]]
                return Response(
                    {
                        "detail": f"Insufficient stock for {p.name}. "
                                  f"Requested {line['quantity']}, available {p.stock}."
                    },
                    status=status.HTTP_409_CONFLICT,
                )

        # All checks pass: create the order, the items, and decrement stock.
        order = Order.objects.create(
            user=request.user,
            shipping_address=data["shipping_address"],
            shipping_region=data["shipping_region"],
            customer_name=data["customer_name"],
            customer_phone=data["customer_phone"],
            customer_email=data["customer_email"],
            notes=data.get("notes", ""),
            total_amount=0,
        )

        total = 0
        for line in data["items"]:
            product = products[line["product_id"]]
            item = OrderItem.objects.create(
                order=order,
                product=product,
                quantity=line["quantity"],
                price=product.price,
            )
            total += item.line_total
            product.stock -= line["quantity"]
            product.save(update_fields=["stock", "updated_at"])

        order.total_amount = total
        order.save(update_fields=["total_amount", "updated_at"])

        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items__product")
