from django.contrib import admin
from .models import RewardTransaction

@admin.register(RewardTransaction)
class RewardTransactionAdmin(admin.ModelAdmin):
    list_display = ('reference_id', 'customer', 'transaction_type', 'points', 'balance', 'created_at')
    search_fields = ('reference_id', 'customer__loyalty_id', 'customer__user__email', 'remarks')
    list_filter = ('transaction_type', 'is_active')
    date_hierarchy = 'created_at'
    readonly_fields = ('reference_id', 'created_at', 'updated_at')
    ordering = ('-created_at',)
