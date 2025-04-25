# from django.shortcuts import render

# Create your views here.
# user/views.py
from urllib import request
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from server import settings
from server.apps.user.serializers import SignupSerializer, UserSerializer, UserSettingsSerializer, PasswordResetConfirmSerializer  # serializer for the User model
from server.apps.user.models import UserSettings, UserSettingsHistory 
User = get_user_model()  # Fetch the custom user model if it exists
from rest_framework.generics import ListAPIView
from server.apps.itinerary.models import Itinerary
from server.apps.itinerary.serializers import ItinerarySerializer
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed
class UserView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access this view

    def get(self, request):
        """Retrieve a list of all users."""
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Create a new user."""
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Sign-up
class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            # Generate tokens for immediate login
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'email': user.email
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
# In your views.py
class LoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(
            {"error": "Invalid credentials"}, 
            status=400,
            content_type="application/json"  # Explicitly set content type
        )
        
# Logout
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                # Changed period to match exactly what the test expects
                return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]  # Only authenticated users can access this endpoint

    def get(self, request):
        return Response({"message": "You are authenticated!"})

class AdminOnlyView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "You are an admin!"})

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)
    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        settings, _ = UserSettings.objects.get_or_create(user=request.user)
        serializer = UserSettingsSerializer(settings)
        return Response(serializer.data)

    def post(self, request):
        print("Request data:", request.data)  # Debug
        settings, created = UserSettings.objects.get_or_create(user=request.user)
        print("Settings object found:", settings.id, "Created:", created)  # Debug
        
        serializer = UserSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            print("Serializer is valid. Data:", serializer.validated_data)  # Debug
            saved_settings = serializer.save()
            print("Settings saved:", saved_settings.id)  # Debug
            return Response(serializer.data)
        else:
            print("Serializer errors:", serializer.errors)  # Debug
            return Response(serializer.errors, status=400)
class UserItinerariesView(ListAPIView):
    serializer_class = ItinerarySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Itinerary.objects.filter(user=self.request.user)
    
    def handle_exception(self, exc):
        
        if isinstance(exc, (NotAuthenticated, AuthenticationFailed)):
            return Response(
                {"detail": "Authentication credentials were not provided or are invalid."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        return super().handle_exception(exc)


# Password reset
class PasswordResetView(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            reset_url = request.build_absolute_uri(reverse('password_reset_confirm')) + f"?token={token}&email={email}"

            send_mail(
                "Password Reset Request",
                f"Click the link to reset your password: {reset_url}",
                "admin@yourdomain.com",
                [email],
                fail_silently=False,
            )

            return Response({"message": "Reset link sent to email"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        

class PasswordResetConfirmView(APIView):
    """
    An endpoint for confirming password reset and setting a new password.
    
    Expects URL parameters:
    - uidb64: base64 encoded user ID
    - token: password reset token
    
    And request body:
    - password: new password
    - password_confirm: confirmation of new password
    """
    
    def post(self, request, uidb64, token, *args, **kwargs):
        # Add URL parameters to the request data
        data = request.data.copy()
        data['uid'] = uidb64
        data['token'] = token
        
        serializer = PasswordResetConfirmSerializer(data=data)
        
        if serializer.is_valid():
            # Get the validated user
            user = serializer.validated_data.get('user')
            
            # Set the new password
            user.set_password(serializer.validated_data.get('password'))
            user.save()
            
            return Response(
                {"detail": "Password has been reset successfully."},
                status=status.HTTP_200_OK
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
