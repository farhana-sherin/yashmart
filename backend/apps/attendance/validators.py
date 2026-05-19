# pyrefly: ignore [missing-import]
from geopy.distance import geodesic
from rest_framework import serializers


def validate_gps_coordinates(latitude, longitude):
    """
    Validates if the given coordinates are within the allowed radius of the office.
    Uses dynamic settings from SystemSettings.
    """
    from apps.settings_app.models import SystemSettings
    settings = SystemSettings.load()
    
    office_location = (float(settings.office_latitude), float(settings.office_longitude))
    max_distance = float(settings.attendance_radius)
    
    try:
        user_location = (float(latitude), float(longitude))
        distance = float(geodesic(office_location, user_location).meters)
        
        print(f"DEBUG: GPS Check - Distance: {distance}m, Max: {max_distance}m")
        
        if distance > max_distance:
            return False, distance
        return True, distance
    except (TypeError, ValueError) as e:
        print(f"DEBUG: GPS Validation Exception: {str(e)}")
        return False, 0


def gps_validator(value):
    """
    DRF field validator for coordinates (if needed as a standalone).
    """
    # This is a placeholder if we want to use it directly in serializer fields
    pass