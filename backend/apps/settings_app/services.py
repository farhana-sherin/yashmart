from .models import SystemSettings

class SettingsService:
    @staticmethod
    def get_settings():
        return SystemSettings.load()

    @staticmethod
    def update_settings(data):
        settings = SystemSettings.load()
        for key, value in data.items():
            if hasattr(settings, key):
                setattr(settings, key, value)
        settings.save()
        return settings
