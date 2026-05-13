from django.utils import timezone
from django.db import transaction
from .models import Offer
import logging

logger = logging.getLogger(__name__)

class OfferService:
    @staticmethod
    def get_active_offers():
        now = timezone.now()
        return Offer.objects.filter(is_active=True, start_date__lte=now, end_date__gte=now).order_by('-priority', '-start_date')
        
    @staticmethod
    def get_expired_offers():
        now = timezone.now()
        return Offer.objects.filter(end_date__lt=now).order_by('-end_date')

    @staticmethod
    def get_offer_statistics():
        now = timezone.now()
        total_offers = Offer.objects.count()
        active_offers = Offer.objects.filter(is_active=True, start_date__lte=now, end_date__gte=now).count()
        expired_offers = Offer.objects.filter(end_date__lt=now).count()
        
        return {
            "total": total_offers,
            "active": active_offers,
            "expired": expired_offers
        }

    @staticmethod
    def validate_offer_dates(start_date, end_date):
        return start_date and end_date and end_date > start_date

    @staticmethod
    @transaction.atomic
    def create_offer(data, user):
        data['created_by'] = user
        return Offer.objects.create(**data)

    @staticmethod
    @transaction.atomic
    def update_offer(offer, data):
        for key, value in data.items():
            setattr(offer, key, value)
        offer.save()
        return offer

    @staticmethod
    def deactivate_offer(offer):
        offer.deactivate_offer()
        return offer
