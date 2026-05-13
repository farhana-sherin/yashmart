import random
import string
from django.utils import timezone

def generate_loyalty_id():
    """Generates a unique loyalty ID for a customer."""
    date_str = timezone.now().strftime("%y%m")
    random_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"YM-{date_str}-{random_str}"
