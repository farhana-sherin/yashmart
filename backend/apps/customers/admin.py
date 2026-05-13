from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('user', 'loyalty_id', 'phone', 'total_points', 'pending_balance', 'joined_at', 'is_active')
    search_fields = ('user__email', 'user__name', 'phone', 'loyalty_id')
    list_filter = ('is_active', 'joined_at')
    readonly_fields = ('loyalty_id', 'total_points', 'pending_balance', 'joined_at', 'created_at', 'updated_at')
    ordering = ('-joined_at',)
