from django.db import models


class Product(models.Model):
    """A sellable item — both the main KIT MODO AVIÓN and its individual parts."""

    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    description = models.TextField(blank=True)
    price = models.PositiveIntegerField(
        help_text="Price in Chilean Pesos (CLP). Integer to avoid float drift."
    )
    stock = models.PositiveIntegerField(default=0)
    image_url = models.URLField(blank=True)
    is_active = models.BooleanField(
        default=True,
        help_text="Inactive products are hidden from the public listing.",
    )
    is_kit = models.BooleanField(
        default=False,
        help_text="True for the master KIT MODO AVIÓN bundle product.",
    )
    sort_order = models.PositiveIntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("sort_order", "id")

    def __str__(self) -> str:  # pragma: no cover - admin display
        return f"{self.name} (${self.price:,} CLP)"

    @property
    def in_stock(self) -> bool:
        return self.stock > 0

    @property
    def stock_status(self) -> str:
        if not self.is_active:
            return "discontinued"
        if self.stock == 0:
            return "out_of_stock"
        if self.stock < 5:
            return "low_stock"
        return "in_stock"
