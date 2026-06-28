from rest_framework import generics, permissions
from .models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    """
    Public catalogue endpoint.
    Returns active products plus derived stock fields so the frontend can
    render real-time availability messaging without a second round-trip.
    """

    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True)
        is_kit = self.request.query_params.get("kit")
        if is_kit is not None:
            qs = qs.filter(is_kit=is_kit.lower() in {"1", "true", "yes"})
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Product.objects.filter(is_active=True)
    lookup_field = "slug"
