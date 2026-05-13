import uuid

def generate_reference_id():
    """Generates a unique reference ID for reward transactions."""
    return f"TXN-{uuid.uuid4().hex[:10].upper()}"
