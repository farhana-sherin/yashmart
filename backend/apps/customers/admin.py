from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('get_name', 'get_email', 'loyalty_id', 'phone', 'total_points', 'pending_balance', 'is_active')
    search_fields = ('user__email', 'user__name', 'phone', 'loyalty_id')
    list_filter = ('is_active', 'joined_at')
    readonly_fields = ('loyalty_id', 'total_points', 'pending_balance', 'joined_at', 'created_at', 'updated_at')
    ordering = ('-joined_at',)

    def get_name(self, obj):
        return obj.user.name
    get_name.short_description = 'Name'
    get_name.admin_order_field = 'user__name'

    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'
    get_email.admin_order_field = 'user__email'
