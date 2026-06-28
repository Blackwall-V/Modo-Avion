from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    """Public product payload, including derived stock messaging."""

    in_stock = serializers.BooleanField(read_only=True)
    stock_status = serializers.CharField(read_only=True)
    price_clp = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "price",
            "price_clp",
            "stock",
            "in_stock",
            "stock_status",
            "image_url",
            "is_active",
            "is_kit",
            "sort_order",
        )
        read_only_fields = fields

    def get_price_clp(self, obj: Product) -> str:
        # Format: 20.000 (CLP thousands separator, no decimals)
        return f"${obj.price:,.0f}".replace(",", ".")
