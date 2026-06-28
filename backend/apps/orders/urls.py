from django.urls import path
from . import views

app_name = "orders"

urlpatterns = [
    path("", views.OrderListCreateView.as_view(), name="order-list-create"),
    path("<int:pk>/", views.OrderDetailView.as_view(), name="order-detail"),
]
