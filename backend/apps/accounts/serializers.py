from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:

        model = User

        fields = [
            'email',
            'password',
        ]

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():

            raise serializers.ValidationError(
                "Email already exists"
            )

        return value


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField()

    def validate(self, attrs):

        email = attrs.get('email')

        password = attrs.get('password')

        user = authenticate(
            email=email,
            password=password
        )

        if not user:

            raise serializers.ValidationError(
                "Invalid email or password"
            )

        attrs['user'] = user

        return attrs


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            'id',
            'name',
            'email',
            'phone',
            'role',
            'profile_image',
            'is_profile_completed',
            'is_verified',
        ]


class CompleteProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            'name',
            'phone',
            'profile_image',
        ]


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()

    new_password = serializers.CharField(
        min_length=8
    )

class GoogleLoginSerializer(serializers.Serializer):
    id_token = serializers.CharField()
