from django.db import IntegrityError
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from .models import User
from rest_framework.exceptions import ValidationError

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ChangePasswordSerializer(serializers.ModelSerializer):
    currentPassword = serializers.CharField(write_only=True, required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['password', 'currentPassword']

    def update(self, instance, validated_data):
        result = instance.check_password(validated_data['currentPassword'])
        if not result:
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
                email=validated_data['email'],
                password=validated_data['password']
            )
            return user
        except IntegrityError:  # Catch duplicate email errors
            raise ValidationError({"email": "A user with this email already exists."})
