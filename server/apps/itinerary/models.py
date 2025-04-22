from django.db import models
from server.apps.user.models import User
from django.contrib.auth import get_user_model

class Itinerary(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='itineraries'
    )
    title = models.CharField(max_length=200)
    city = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} in {self.city} ({self.start_date} - {self.end_date})"

   
    def __str__(self):
        return self.title
    
    def is_bookmarked_by(self, user):
        if not user or not user.is_authenticated:
            return False
        return self.bookmarks.filter(user=user).exists()
    
     # class Meta:
    #     ordering = ['-start_date']
    # bookmarked_by = models.ManyToManyField(get_user_model(), related_name='bookmarked_itineraries', blank=True)
