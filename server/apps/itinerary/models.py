from django.db import models
from server.apps.user.models import User

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

    class Meta:
        ordering = ['-start_date']