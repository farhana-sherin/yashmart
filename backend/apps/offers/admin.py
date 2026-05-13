from django.contrib import admin
from django.utils.html import format_html
from .models import Offer

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'priority', 'start_date', 'end_date', 'is_active', 'image_preview')
    search_fields = ('title', 'description')
    list_filter = ('is_active', 'start_date', 'end_date')
    date_hierarchy = 'start_date'
    readonly_fields = ('slug', 'created_at', 'updated_at', 'image_preview')
    
    def image_preview(self, obj):
        if obj.banner:
            return format_html('<img src="{}" style="max-height: 50px;"/>', obj.banner.url)
        return "-"
    image_preview.short_description = 'Banner Preview'
