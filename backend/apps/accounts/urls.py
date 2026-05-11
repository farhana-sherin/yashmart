from django.urls import path

from .views import *

urlpatterns = [

    path('register/', register),

    path('login/', login),

    path('profile/', profile),

    path('complete-profile/', complete_profile),

    path('change-password/', change_password),

    path('logout/', logout),

    path('google-login/', google_login),
]
