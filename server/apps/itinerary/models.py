from django.db import models
from server.apps.user.models import User

class Itinerary(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='itineraries'
    )  # Relationship with User
    title = models.CharField(max_length=200)  # Title of the itinerary
    city = models.CharField(max_length=255)  # City of the itinerary
    start_date = models.DateField()  # Start date of the trip
    end_date = models.DateField()  # End date of the trip
    description = models.TextField(blank=True, null=True)  # Description of the trip
    created_at = models.DateTimeField(auto_now_add=True)  # Auto timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # Auto timestamp when updated

    def __str__(self):
        return f"{self.title} in {self.city} ({self.start_date} - {self.end_date})"

    class Meta:
        ordering = ['-start_date']  # Default ordering by start_date descending

