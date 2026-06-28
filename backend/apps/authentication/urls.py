from django.urls import path
from . import views

app_name = "authentication"

urlpatterns = [
    path("whoami/", views.whoami, name="whoami"),
    path("sync-profile/", views.sync_profile, name="sync-profile"),
]
