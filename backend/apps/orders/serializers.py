from rest_framework import serializers
from apps.products.models import Product
from .models import Order, OrderItem


class OrderItemInputSerializer(serializers.Serializer):
    """A line the client sends in a checkout payload."""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    line_total = serializers.IntegerField(read_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "product", "product_name", "product_slug", "quantity", "price", "line_total")
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_clp = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "user",
            "status",
            "total_amount",
            "total_clp",
            "shipping_address",
            "shipping_region",
            "customer_name",
            "customer_phone",
            "customer_email",
            "notes",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "user", "status", "total_amount", "items", "created_at", "updated_at")

    def get_total_clp(self, obj: Order) -> str:
        return f"${obj.total_amount:,.0f}".replace(",", ".")


class CheckoutSerializer(serializers.Serializer):
    """Payload the frontend sends to POST /api/orders/."""

    items = OrderItemInputSerializer(many=True, min_length=1)
    shipping_address = serializers.CharField()
    shipping_region = serializers.CharField(max_length=80, default="RM")
    customer_name = serializers.CharField(max_length=120)
    customer_phone = serializers.CharField(max_length=32)
    customer_email = serializers.EmailField()
    notes = serializers.CharField(required=False, allow_blank=True, default="")
