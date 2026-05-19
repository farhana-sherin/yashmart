from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    CompleteProfileSerializer,
    ChangePasswordSerializer,
    GoogleLoginSerializer,
)

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):

    serializer = RegisterSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "success": True,
        "message": "Register successful",
        "data": {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "email": user.email,
                "role": user.role,
                "is_profile_completed": user.is_profile_completed
            }
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    serializer = LoginSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response({
            "success": False,
            "message": "Login failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.validated_data['user']

    refresh = RefreshToken.for_user(user)

    return Response({
        "success": True,
        "message": "Login successful",
        "data": {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role,
                "is_profile_completed": user.is_profile_completed,
                "is_verified": user.is_verified
            }
        }
    })

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    if request.method == 'GET':
        serializer = ProfileSerializer(request.user)
        return Response({
            "success": True,
            "data": serializer.data
        })
    elif request.method == 'PUT':
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        if not serializer.is_valid():
            return Response({
                "success": False,
                "message": "Validation failed",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        # Ensure name is updated if first_name/last_name change
        first_name = serializer.validated_data.get('first_name', request.user.first_name)
        last_name = serializer.validated_data.get('last_name', request.user.last_name)
        if first_name or last_name:
            serializer.validated_data['name'] = f"{first_name or ''} {last_name or ''}".strip()

        serializer.save()

        return Response({
            "success": True,
            "message": "Profile updated successfully",
            "data": serializer.data
        })

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def complete_profile(request):

    serializer = CompleteProfileSerializer(
        request.user,
        data=request.data,
        partial=True
    )

    if not serializer.is_valid():
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()

    request.user.is_profile_completed = True
    request.user.save()

    return Response({
        "success": True,
        "message": "Profile completed",
        "data": ProfileSerializer(
            request.user
        ).data
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):

    serializer = ChangePasswordSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    user = request.user

    if not user.check_password(
        serializer.validated_data['old_password']
    ):
        return Response({
            "success": False,
            "message": "Old password incorrect"
        }, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(
        serializer.validated_data['new_password']
    )
    user.save()

    return Response({
        "success": True,
        "message": "Password changed successfully"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({
                "success": False,
                "message": "Refresh token is required"
            }, status=status.HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response({
            "success": True,
            "message": "Logout successful"
        })

    except Exception:
        return Response({
            "success": False,
            "message": "Invalid token"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):

    serializer = GoogleLoginSerializer(
        data=request.data
    )

    if not serializer.is_valid():
        return Response({
            "success": False,
            "message": "Validation failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    token = serializer.validated_data['id_token']

    try:
        client_id = settings.GOOGLE_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), client_id)

        email = idinfo.get('email')
        name = idinfo.get('name')
        google_id = idinfo.get('sub')

        user = User.objects.filter(email=email).first()

        if not user:
            user = User(
                email=email,
                name=name,
                google_id=google_id,
                is_google_account=True,
                is_verified=idinfo.get('email_verified', False)
            )
            user.set_unusable_password()
            user.save()
        else:
            if not user.google_id:
                user.google_id = google_id
                user.is_google_account = True
                user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "success": True,
            "message": "Google Login successful",
            "data": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role,
                    "is_profile_completed": user.is_profile_completed,
                    "is_verified": user.is_verified
                }
            }
        })

    except ValueError:
        return Response({
            "success": False,
            "message": "Invalid Google token"
        }, status=status.HTTP_400_BAD_REQUEST)
