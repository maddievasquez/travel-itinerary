from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Fields from AbstractUser:
    # - username
    # - email
    # - password
    # - first_name
    # - last_name
    # - is_staff
    # - is_active
    # - date_joined
    avatar = models.ImageField(upload_to='profile_images/', blank=True, null=True)  # For custom avatar
    is_premium = models.BooleanField(default=False)  # Add this field

    # Additional fields from UserProfile:
    def generate_avatar(self):
        """Generate an avatar using the user's initials."""
        initials = ''.join([part[0].upper() for part in self.name.split() if part])  # Get initials
        return initials or 'NN'  # Default to 'NN' if no name is provided

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    dark_mode = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=True)
    
    def __str__(self):
        return self.username
