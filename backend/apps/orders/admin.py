from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "quantity", "price", "line_total")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer_name", "customer_email", "total_amount", "status", "created_at")
    list_filter = ("status", "shipping_region", "created_at")
    search_fields = ("customer_name", "customer_email", "customer_phone", "shipping_address")
    inlines = [OrderItemInline]
    readonly_fields = ("total_amount", "created_at", "updated_at")
    ordering = ("-created_at",)
