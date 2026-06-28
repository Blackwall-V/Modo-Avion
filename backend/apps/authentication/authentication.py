"""
DRF authentication class for Firebase ID tokens.

The real implementation lives in ``middleware.py`` alongside the Django
middleware; this module exists so ``settings.REST_FRAMEWORK`` can reference
``apps.authentication.authentication.FirebaseAuthentication`` as the dotted
import path DRF requires.
"""
from .middleware import FirebaseAuthentication

__all__ = ["FirebaseAuthentication"]
