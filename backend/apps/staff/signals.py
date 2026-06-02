from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from .models import Staff

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_staff_profile(sender, instance, created, **kwargs):
    if created and getattr(instance, 'role', '') == 'STAFF':
        Staff.objects.get_or_create(
            user=instance, 
            defaults={
                'phone': getattr(instance, 'phone', None),
                'is_active': getattr(instance, 'is_active', True)
            }
        )
