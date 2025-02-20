# from django.shortcuts import render

# Create your views here.
# user/views.py
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .serializers import UserSerializer  # serializer for the User model

User = get_user_model()  # Fetch the custom user model if it exists

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
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login
class LoginView(APIView):
    def post(self, request):
        
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(request, username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response({"error": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
# Logout
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
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
        """Retrieve the profile of the logged-in user."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

