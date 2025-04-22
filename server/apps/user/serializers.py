from django.db import IntegrityError
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework.exceptions import ValidationError
from .models import User, UserSettings

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = ['dark_mode', 'notifications_enabled', 'language']

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


class ChangePasswordSerializer(serializers.ModelSerializer):
    currentPassword = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['password', 'currentPassword']

    def update(self, instance, validated_data):
        if not instance.check_password(validated_data['currentPassword']):
            raise serializers.ValidationError({"currentPassword": "Incorrect password."})
        instance.set_password(validated_data['password'])
        instance.save()
        return instance

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
