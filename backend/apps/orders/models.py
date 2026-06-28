from django.conf import settings
from django.db import models


class Order(models.Model):
    """A confirmed checkout. Stock for the products is decremented atomically when the order is created."""

    STATUS_PENDING = "pending"
    STATUS_PAID = "paid"
    STATUS_SHIPPED = "shipped"
    STATUS_DELIVERED = "delivered"
    STATUS_CANCELLED = "cancelled"
    STATUS_CHOICES = [
        (STATUS_PENDING, "Pending"),
        (STATUS_PAID, "Paid"),
        (STATUS_SHIPPED, "Shipped"),
        (STATUS_DELIVERED, "Delivered"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="orders",
    )
    total_amount = models.PositiveIntegerField(help_text="Snapshot of the order total in CLP at checkout time.")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    shipping_address = models.TextField()
    shipping_region = models.CharField(max_length=80, default="RM")
    customer_name = models.CharField(max_length=120)
    customer_phone = models.CharField(max_length=32)
    customer_email = models.EmailField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:  # pragma: no cover - admin display
        return f"Order #{self.pk} — {self.customer_name} — ${self.total_amount:,} CLP"


class OrderItem(models.Model):
    """A single line on an order. Stores a price snapshot to keep history immutable."""

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT, related_name="order_items")
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField(help_text="Unit price snapshot in CLP.")

    @property
    def line_total(self) -> int:
        return self.price * self.quantity

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.quantity} × {self.product.name}"
