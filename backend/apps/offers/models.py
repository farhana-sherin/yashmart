from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from django.core.exceptions import ValidationError
from django.utils import timezone
from .validators import validate_image_size
from .utils import generate_unique_slug

class Offer(BaseModel):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    banner = models.ImageField(upload_to='offers/banners/', validators=[validate_image_size])
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    priority = models.IntegerField(default=0, help_text="Higher priority offers show first")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="created_offers")

    class Meta:
        verbose_name = "Offer"
        verbose_name_plural = "Offers"
        ordering = ['-priority', '-start_date']
        indexes = [
            models.Index(fields=['is_active', 'start_date', 'end_date']),
            models.Index(fields=['priority']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(Offer, self.title)
        super().save(*args, **kwargs)

    def clean(self):
        super().clean()
        if self.start_date and self.end_date and self.end_date <= self.start_date:
            raise ValidationError({'end_date': "End date must be greater than start date."})
            
        if getattr(self, 'pk', None) is None:  # creation
            existing = Offer.objects.filter(title=self.title, is_active=True).exists()
            if existing:
                raise ValidationError({'title': "An active offer with this title already exists."})

    def __str__(self):
        return self.title

    @property
    def is_valid_offer(self):
        now = timezone.now()
        return self.is_active and self.start_date <= now <= self.end_date

    @property
    def is_expired(self):
        return timezone.now() > self.end_date

    def activate_offer(self):
        self.is_active = True
        self.save(update_fields=['is_active', 'updated_at'])

    def deactivate_offer(self):
        self.is_active = False
        self.save(update_fields=['is_active', 'updated_at'])
