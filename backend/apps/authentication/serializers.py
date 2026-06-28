from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class PublicUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name")
        read_only_fields = ("id", "username", "email")
