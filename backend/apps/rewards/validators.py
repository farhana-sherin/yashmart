from django.core.exceptions import ValidationError

def validate_positive_amount(value):
    if value is None or value <= 0:
        raise ValidationError("Amount must be greater than zero.")
