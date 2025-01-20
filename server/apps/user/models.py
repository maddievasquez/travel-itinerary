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
    
    # Additional fields from UserProfile:
    image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.username
