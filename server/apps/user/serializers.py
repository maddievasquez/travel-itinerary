from django.db import IntegrityError
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import ValidationError
from .models import User, UserSettings
from django.utils.http import urlsafe_base64_decode

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['dark_mode', 'notifications_enabled', 'language']
    
    def to_representation(self, instance):
        """Override to handle JSON settings field or direct model fields"""
        # If your settings are stored in a JSON field
        if hasattr(instance, 'settings') and isinstance(instance.settings, dict):
            return instance.settings
        
        # If your settings are direct model fields
        return {
            'dark_mode': instance.dark_mode if hasattr(instance, 'dark_mode') else False,
            'notifications_enabled': instance.notifications_enabled if hasattr(instance, 'notifications_enabled') else True,
            'language': instance.language if hasattr(instance, 'language') else 'en'
        }
    
    def update(self, instance, validated_data):
        """Update the settings instance with validated data"""
        # If settings are stored in a JSON field
        if hasattr(instance, 'settings') and isinstance(instance.settings, dict):
            settings = instance.settings.copy()
            settings.update(validated_data)
            instance.settings = settings
        else:
            # Update direct model fields
            for key, value in validated_data.items():
                setattr(instance, key, value)
        
        instance.save()
        return instance
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    settings = UserSettingsSerializer(read_only=True)  

    class Meta:
        model = User
        fields = ['id','email',  'avatar', 'is_premium', 'settings', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password'],
            # name=validated_data.get('name', '')  # Ensure name is included
        )
        UserSettings.objects.create(user=user)  
        return user


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)
    uid = serializers.CharField(required=True)
    password = serializers.CharField(
        required=True, 
        write_only=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')
        token = attrs.get('token')
        uid = attrs.get('uid')

        if password != password_confirm:
            raise serializers.ValidationError({"password": "Password fields didn't match."})

        # Validate the token and get user
        try:
            uid = urlsafe_base64_decode(uid).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError({"uid": "Invalid user ID"})

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError({"token": "Invalid or expired token"})

        attrs['user'] = user
        return attrs

class SignupSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    passwordTwo = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'password', 'passwordTwo')

    def validate(self, attrs):
        if attrs['password'] != attrs['passwordTwo']:
            raise ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        try:
            user = User.objects.create_user(
                username=validated_data['email'],  # Add this line
                email=validated_data['email'],
                password=validated_data['password']
            )
            UserSettings.objects.create(user=user)  # Create settings automatically
            return user
        except IntegrityError:
            raise ValidationError({"email": "A user with this email already exists."})

class UserProfileSerializer(serializers.ModelSerializer):
    avatar = serializers.ImageField(allow_null=True, required=False)
    settings = UserSettingsSerializer(required=False)  # Allow updating settings

    class Meta:
        model = User
        fields = ['email', 'avatar', 'settings']

    def update(self, instance, validated_data):
        settings_data = validated_data.pop('settings', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if settings_data:
            settings_instance, _ = UserSettings.objects.get_or_create(user=instance)
            for attr, value in settings_data.items():
                setattr(settings_instance, attr, value)
            settings_instance.save()

        return instance
