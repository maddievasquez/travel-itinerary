from django.db import models
from django.contrib.auth.models import AbstractUser
from simple_history.models import HistoricalRecords

class User(AbstractUser):
    avatar = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    is_premium = models.BooleanField(default=False) 
    email = models.EmailField(unique=True)

    
 

    def generate_avatar(self):
        """Generate an avatar using the user's initials."""
        initials = ''.join([part[0].upper() for part in self.get_full_name().split() if part])  
        return initials or 'NN'  

class UserSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="settings")
    dark_mode = models.BooleanField(default=False)
    notifications_enabled = models.BooleanField(default=True)
    language = models.CharField(max_length=10, default='en')  # Added a language preference
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.user.username}'s Settings"
class UserSettingsHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='settings_history')
    field_name = models.CharField(max_length=100)
    old_value = models.TextField(null=True, blank=True)
    new_value = models.TextField(null=True, blank=True)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='settings_changes')
    
    
    class Meta:
        ordering = ['-changed_at']