"""
Firebase authentication for the MODO AVIÓN backend.

Two integration points:
1. ``FirebaseAuthenticationMiddleware`` populates ``request.user`` from the
   ``Authorization: Bearer <Firebase_ID_Token>`` header on every request, so
   the standard ``request.user`` works in views and templates.
2. ``FirebaseAuthentication`` is a DRF authentication class that attaches a
   ``(user, decoded_token)`` tuple to ``request.auth`` for protected API
   endpoints.

Both rely on the ``firebase-admin`` SDK. The SDK is initialised lazily on
first use from the credentials path defined in ``settings.FIREBASE_CREDENTIALS_PATH``.
"""
from __future__ import annotations

import logging
import threading
from typing import Optional, Tuple

from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin
from rest_framework import authentication, exceptions

logger = logging.getLogger(__name__)
User = get_user_model()

# ponytail: lazy singleton — firebase_admin.init_app is global and idempotent
_firebase_lock = threading.Lock()
_firebase_initialised = False


def _ensure_firebase_initialised() -> None:
    """Initialise the firebase-admin SDK exactly once per process."""
    global _firebase_initialised
    if _firebase_initialised:
        return
    with _firebase_lock:
        if _firebase_initialised:
            return
        try:
            import firebase_admin
            from firebase_admin import credentials

            cred_path = getattr(settings, "FIREBASE_CREDENTIALS_PATH", "")
            if cred_path:
                cred = credentials.Certificate(cred_path)
                firebase_admin.initialize_app(cred)
            else:
                # Fallback for local dev without a service account: rely on
                # GOOGLE_APPLICATION_CREDENTIALS env var.
                firebase_admin.initialize_app()
            _firebase_initialised = True
        except Exception as exc:  # pragma: no cover - dev convenience
            logger.warning("Firebase admin initialisation failed: %s", exc)
            _firebase_initialised = True  # don't keep retrying on every request


def _verify_token(raw_token: str) -> Optional[dict]:
    """Return the decoded Firebase ID token, or None on failure."""
    _ensure_firebase_initialised()
    try:
        from firebase_admin import auth

        return auth.verify_id_token(raw_token)
    except Exception as exc:
        logger.debug("Firebase token verification failed: %s", exc)
        return None


def _get_or_create_user(decoded: dict) -> User:
    """Map a decoded Firebase token to a Django user, creating it on first sight."""
    firebase_uid = decoded.get("uid") or decoded.get("user_id")
    email = decoded.get("email") or f"{firebase_uid}@modoavion.local"
    name = decoded.get("name") or ""
    user, _ = User.objects.get_or_create(
        username=firebase_uid or email,
        defaults={
            "email": email,
            "first_name": name.split(" ")[0] if name else "",
            "last_name": " ".join(name.split(" ")[1:]) if name else "",
        },
    )
    return user


# -------------------------------------------------------------------
# Middleware (request.user via Bearer header)
# -------------------------------------------------------------------
class FirebaseAuthenticationMiddleware(MiddlewareMixin):
    """
    Populates ``request.user`` from a Firebase ID token in the Authorization
    header. Anonymous requests are left as-is (``request.user`` stays
    ``AnonymousUser``) so the rest of Django still works.
    """

    def process_request(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.lower().startswith("bearer "):
            return None
        token = auth_header.split(" ", 1)[1].strip()
        if not token:
            return None
        decoded = _verify_token(token)
        if decoded is None:
            return None
        request.user = _get_or_create_user(decoded)
        request.firebase_user = decoded
        return None


# -------------------------------------------------------------------
# DRF authentication class
# -------------------------------------------------------------------
class FirebaseAuthentication(authentication.BaseAuthentication):
    """DRF authenticator that pairs ``request.user`` with the decoded token."""

    keyword = "Bearer"

    def authenticate(self, request) -> Optional[Tuple[User, dict]]:
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header:
            return None
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != self.keyword.lower():
            return None
        decoded = _verify_token(parts[1])
        if decoded is None:
            raise exceptions.AuthenticationFailed("Invalid or expired Firebase ID token.")
        user = _get_or_create_user(decoded)
        return user, decoded

    def authenticate_header(self, request):
        return f'Bearer realm="api"'
