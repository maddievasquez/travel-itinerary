from django.db import models

# Create your models here.
from django.contrib.auth import get_user_model
from server.apps.itinerary.models import Itinerary

User = get_user_model()

class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    itinerary = models.ForeignKey('itinerary.Itinerary', on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Ensure each user can only bookmark an itinerary once
        unique_together = ('user', 'itinerary')
        
    def __str__(self):
        return f"{self.user.username} - {self.itinerary.title}"