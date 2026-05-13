from django.core.exceptions import ValidationError
import re

def validate_phone(value):
    if value and not re.match(r'^\+?1?\d{9,15}$', value):
        raise ValidationError("Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

def validate_non_negative(value):
    if value < 0:
        raise ValidationError("Value cannot be negative.")
