# pyrefly: ignore [missing-import]
from geopy.distance import geodesic
from rest_framework import serializers
from .constants import OFFICE_LOCATION, MAX_DISTANCE


def validate_gps_coordinates(latitude, longitude):
    """
    Validates if the given coordinates are within the allowed radius of the office.
    """
    try:
        user_location = (float(latitude), float(longitude))
        distance = geodesic(OFFICE_LOCATION, user_location).meters
        
        if distance > MAX_DISTANCE:
            return False, distance
        return True, distance
    except (TypeError, ValueError):
        return False, 0


def gps_validator(value):
    """
    DRF field validator for coordinates (if needed as a standalone).
    """
    # This is a placeholder if we want to use it directly in serializer fields
    pass