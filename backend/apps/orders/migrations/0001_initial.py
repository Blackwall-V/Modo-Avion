"""Initial schema for the orders app."""
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("total_amount", models.PositiveIntegerField(help_text="Snapshot of the order total in CLP at checkout time.")),
                ("status", models.CharField(choices=[("pending", "Pending"), ("paid", "Paid"), ("shipped", "Shipped"), ("delivered", "Delivered"), ("cancelled", "Cancelled")], default="pending", max_length=20)),
                ("shipping_address", models.TextField()),
                ("shipping_region", models.CharField(default="RM", max_length=80)),
                ("customer_name", models.CharField(max_length=120)),
                ("customer_phone", models.CharField(max_length=32)),
                ("customer_email", models.EmailField(max_length=254)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=models.PROTECT, related_name="orders", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ("-created_at",)},
        ),
        migrations.CreateModel(
            name="OrderItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("quantity", models.PositiveIntegerField()),
                ("price", models.PositiveIntegerField(help_text="Unit price snapshot in CLP.")),
                ("order", models.ForeignKey(on_delete=models.CASCADE, related_name="items", to="orders.order")),
                ("product", models.ForeignKey(on_delete=models.PROTECT, related_name="order_items", to="products.product")),
            ],
        ),
    ]
