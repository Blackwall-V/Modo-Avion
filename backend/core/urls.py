"""Root URL configuration for the MODO AVIÓN backend."""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def healthcheck(_request):
    return JsonResponse({"status": "ok", "service": "modo-avion-api"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", healthcheck, name="healthcheck"),
    path("api/auth/", include("apps.authentication.urls")),
    path("api/products/", include("apps.products.urls")),
    path("api/orders/", include("apps.orders.urls")),
]
