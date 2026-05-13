from rest_framework import serializers
from .models import Offer

class OfferSerializer(serializers.ModelSerializer):
    banner_url = serializers.SerializerMethodField()
    is_valid_offer = serializers.BooleanField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Offer
        fields = [
            'id', 'title', 'slug', 'description', 'banner', 'banner_url',
            'start_date', 'end_date', 'priority', 'is_active', 
            'is_valid_offer', 'is_expired', 'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']

    def get_banner_url(self, obj):
        request = self.context.get('request')
        if obj.banner and hasattr(obj.banner, 'url'):
            if request:
                return request.build_absolute_uri(obj.banner.url)
            return obj.banner.url
        return None

class OfferCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['title', 'description', 'banner', 'start_date', 'end_date', 'priority', 'is_active']

    def validate(self, attrs):
        if attrs.get('start_date') and attrs.get('end_date'):
            if attrs['end_date'] <= attrs['start_date']:
                raise serializers.ValidationError({"end_date": "End date must be greater than start date."})
        return attrs

class OfferUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Offer
        fields = ['title', 'description', 'banner', 'start_date', 'end_date', 'priority', 'is_active']

    def validate(self, attrs):
        start_date = attrs.get('start_date', self.instance.start_date if self.instance else None)
        end_date = attrs.get('end_date', self.instance.end_date if self.instance else None)
        if start_date and end_date and end_date <= start_date:
            raise serializers.ValidationError({"end_date": "End date must be greater than start date."})
        return attrs

class OfferListSerializer(OfferSerializer):
    pass

class OfferDetailSerializer(OfferSerializer):
    pass
