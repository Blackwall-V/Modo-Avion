"""Initial schema for the products app."""
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120)),
                ("slug", models.SlugField(max_length=140, unique=True)),
                ("description", models.TextField(blank=True)),
                ("price", models.PositiveIntegerField(help_text="Price in Chilean Pesos (CLP). Integer to avoid float drift.")),
                ("stock", models.PositiveIntegerField(default=0)),
                ("image_url", models.URLField(blank=True)),
                ("is_active", models.BooleanField(default=True, help_text="Inactive products are hidden from the public listing.")),
                ("is_kit", models.BooleanField(default=False, help_text="True for the master KIT MODO AVIÓN bundle product.")),
                ("sort_order", models.PositiveIntegerField(default=100)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"ordering": ("sort_order", "id")},
        ),
    ]
