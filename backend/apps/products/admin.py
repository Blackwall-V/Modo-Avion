from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "price", "stock", "stock_status", "is_kit", "is_active", "sort_order")
    list_filter = ("is_active", "is_kit", "stock")
    search_fields = ("name", "slug", "description")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("price", "stock", "is_active", "is_kit", "sort_order")
    ordering = ("sort_order", "id")
