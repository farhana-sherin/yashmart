from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import User


class RegisterSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )
    confirm_password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:

        model = User

        fields = [
            'full_name',
            'email',
            'password',
            'confirm_password'
        ]

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def validate_email(self, value):
        value = value.lower().strip()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        email = validated_data.get('email', '').lower().strip()
        full_name = validated_data.get('full_name', '').strip()
        
        parts = full_name.split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''
        
        user = User.objects.create_user(
            email=email,
            password=validated_data['password'],
            first_name=first_name,
            last_name=last_name,
            name=full_name
        )
        return user


class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField()

    def validate(self, attrs):

        email = attrs.get('email', '').lower().strip()

        password = attrs.get('password')

        if email and password:
            user = authenticate(email=email, password=password)

            if not user:
                raise serializers.ValidationError("Invalid email or password")
                
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled")

            attrs['user'] = user
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'")

        return attrs


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:

        model = User

        fields = [
            'id',
            'name',
            'first_name',
            'last_name',
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
            'first_name',
            'last_name',
            'phone',
            'profile_image',
        ]

    def update(self, instance, validated_data):
        first_name = validated_data.get('first_name', instance.first_name)
        last_name = validated_data.get('last_name', instance.last_name)
        instance.name = f"{first_name} {last_name}".strip()
        return super().update(instance, validated_data)


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()

    new_password = serializers.CharField(
        min_length=8
    )

class GoogleLoginSerializer(serializers.Serializer):
    id_token = serializers.CharField()
