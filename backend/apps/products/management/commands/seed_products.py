"""Django management command: seed_products.

Run with ``python manage.py seed_products`` to (re-)populate the catalogue
without running the full migration history. Safe to call repeatedly.
"""
from django.core.management.base import BaseCommand
from apps.products.models import Product


SEED = [
    {
        "name": "KIT MODO AVIÓN",
        "slug": "kit-modo-avion",
        "description": "Tu mejor compañero de aventuras. Fanny pack Cotopaxi con los 6 esenciales de viaje: tenedor multiherramienta, adaptador universal, botella plegable, candado de seguridad, power bank y auriculares inalámbricos.",
        "price": 20000,
        "stock": 50,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        "is_kit": True,
        "sort_order": 1,
    },
    {
        "name": "Tenedor Multiherramienta",
        "slug": "tenedor-multiherramienta",
        "description": "Cubierto 3-en-1: tenedor, cuchillo y destapador. Acero inoxidable 304 apto para lavavajillas.",
        "price": 4500,
        "stock": 80,
        "image_url": "https://images.unsplash.com/photo-1581873372796-635b67ca2008?w=800",
        "is_kit": False,
        "sort_order": 10,
    },
    {
        "name": "Adaptador Universal",
        "slug": "adaptador-universal",
        "description": "Enchufe internacional con puertos USB-A y USB-C. Compatible con más de 150 países.",
        "price": 8900,
        "stock": 60,
        "image_url": "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800",
        "is_kit": False,
        "sort_order": 20,
    },
    {
        "name": "Botella Plegable",
        "slug": "botella-plegable",
        "description": "Botella de silicona flexible grado alimenticio. Se enrolla hasta 5cm de alto. 500ml.",
        "price": 5900,
        "stock": 70,
        "image_url": "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800",
        "is_kit": False,
        "sort_order": 30,
    },
    {
        "name": "Candado de Seguridad",
        "slug": "candado-seguridad",
        "description": "Candado TSA con combinación de 3 dígitos. Cuerpo de aleación de zinc. Aprobado para equipaje de mano.",
        "price": 3200,
        "stock": 90,
        "image_url": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800",
        "is_kit": False,
        "sort_order": 40,
    },
    {
        "name": "Power Bank Portátil",
        "slug": "power-bank-portatil",
        "description": "Batería externa 10000mAh con carga rápida PD 20W. Dos puertos USB-C. Cabe en la palma de la mano.",
        "price": 11900,
        "stock": 40,
        "image_url": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800",
        "is_kit": False,
        "sort_order": 50,
    },
    {
        "name": "Auriculares Inalámbricos",
        "slug": "auriculares-inalambricos",
        "description": "Bluetooth 5.3 con cancelación de ruido activa. 30 horas de batería con estuche de carga.",
        "price": 14500,
        "stock": 35,
        "image_url": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800",
        "is_kit": False,
        "sort_order": 60,
    },
]


class Command(BaseCommand):
    help = "Seed or refresh the MODO AVIÓN product catalogue."

    def handle(self, *args, **options):
        created, updated = 0, 0
        for row in SEED:
            obj, was_created = Product.objects.update_or_create(slug=row["slug"], defaults=row)
            created += int(was_created)
            updated += int(not(was_created))
        self.stdout.write(self.style.SUCCESS(
            f"Seed complete: {created} created, {updated} updated, {len(SEED)} total."
        ))
