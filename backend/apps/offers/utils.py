import string
import random
from django.utils.text import slugify

def generate_unique_slug(model_class, title):
    base_slug = slugify(title)
    slug = base_slug
    while model_class.objects.filter(slug=slug).exists():
        random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        slug = f"{base_slug}-{random_str}"
    return slug
