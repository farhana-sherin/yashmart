from django.core.exceptions import ValidationError

def validate_image_size(image):
    max_size_mb = 5
    if getattr(image, 'size', 0) > max_size_mb * 1024 * 1024:
        raise ValidationError(f"Image file size must not exceed {max_size_mb} MB.")
