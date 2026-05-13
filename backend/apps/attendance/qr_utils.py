import qrcode
import io
import base64
from django.utils import timezone
from datetime import timedelta
from .utils import generate_secure_token
from .constants import QR_EXPIRY_MINUTES


def generate_attendance_qr_data():
    """
    Generates a secure token and its expiry for QR attendance.
    """
    token = generate_secure_token()
    expires_at = timezone.now() + timedelta(minutes=QR_EXPIRY_MINUTES)
    return token, expires_at


def create_qr_image_base64(data):
    """
    Generates a QR code image as a base64 string.
    """
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()


def verify_qr_token(stored_token, provided_token, expires_at):
    """
    Verifies if the provided token matches and is not expired.
    """
    if not stored_token or stored_token != provided_token:
        return False, "Invalid QR Token"
    
    if timezone.now() > expires_at:
        return False, "QR Token Expired"
    
    return True, "Valid"
