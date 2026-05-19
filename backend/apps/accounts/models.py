
from django.db import models

from django.contrib.auth.models import AbstractUser
from .manager import UserManager







class User(AbstractUser):

    ROLE_CHOICES = (
        ('ADMIN', 'Admin'),
        ('STAFF', 'Staff'),
        ('CUSTOMER', 'Customer'),
    )

    username = None

    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    name = models.CharField(max_length=150, blank=True, null=True)

    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=15,blank=True,null=True)

    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default='CUSTOMER')

    profile_image = models.ImageField(upload_to='profile_images/',blank=True,null=True)

    google_id = models.CharField(max_length=255,blank=True,null=True)

    is_google_account = models.BooleanField(default=False)

    is_profile_completed = models.BooleanField(default=False)

    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.email
    










