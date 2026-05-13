import uuid
from django.db import models
from django.core.exceptions import ValidationError

class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class BaseActiveModel(models.Model):
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True

class BaseModel(TimeStampedModel, BaseActiveModel):
    """
    Abstract base model to provide common fields for all models.
    Inherits created_at, updated_at, and is_active.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    class Meta:
        abstract = True
