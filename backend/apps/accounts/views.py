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
            "status": 6001,
            "message": serializer.errors
        })

    data = serializer.validated_data

    user = User.objects.create_user(
        email=data['email'],
        password=data['password']
    )

    refresh = RefreshToken.for_user(user)

    return Response({

        "status": 6000,

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
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):

    serializer = LoginSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response({
            "status": 6001,
            "message": serializer.errors
        })

    user = serializer.validated_data['user']

    refresh = RefreshToken.for_user(user)

    return Response({

        "status": 6000,

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):

    serializer = ProfileSerializer(
        request.user
    )

    return Response({

        "status": 6000,

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
            "status": 6001,
            "message": serializer.errors
        })

    serializer.save()

    request.user.is_profile_completed = True

    request.user.save()

    return Response({

        "status": 6000,

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
            "status": 6001,
            "message": serializer.errors
        })

    user = request.user

    if not user.check_password(
        serializer.validated_data['old_password']
    ):

        return Response({

            "status": 6001,

            "message": "Old password incorrect"
        })

    user.set_password(
        serializer.validated_data['new_password']
    )

    user.save()

    return Response({

        "status": 6000,

        "message": "Password changed successfully"
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):

    try:

        refresh_token = request.data["refresh"]

        token = RefreshToken(refresh_token)

        token.blacklist()

        return Response({

            "status": 6000,

            "message": "Logout successful"
        })

    except Exception:

        return Response({

            "status": 6001,

            "message": "Invalid token"
        })

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):

    serializer = GoogleLoginSerializer(
        data=request.data
    )

    if not serializer.is_valid():

        return Response({
            "status": 6001,
            "message": serializer.errors
        })

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

            "status": 6000,

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
            "status": 6001,
            "message": "Invalid Google token"
        })
