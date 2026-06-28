"""
Authentication-facing endpoints.

We keep these thin: Firebase is the source of truth for identity, so the
backend only exposes helpers to surface the resolved Django user to the
frontend, plus health checks for the auth pipeline.
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .serializers import PublicUserSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def whoami(request):
    """Return the authenticated user, or 401 if anonymous."""
    if not request.user or not request.user.is_authenticated:
        return Response(
            {"detail": "Not authenticated."},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    return Response(PublicUserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def sync_profile(request):
    """
    Persist any profile fields the client wants to push after sign-in
    (display name, phone, etc.). Idempotent.
    """
    serializer = PublicUserSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)
