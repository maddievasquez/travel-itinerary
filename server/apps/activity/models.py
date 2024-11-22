from django.db import models
from server.apps.itinerary.models import Itinerary  # import itinerary models

from server.apps.location.models import Location  # import location models
# Create your models here.
class Activity(models.Model):
    itinerary = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name='activities')  # Relationship with Itinerary
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='activities')  # Relationship with Location
    description = models.TextField()  # Description of the activity
    date = models.DateField()  # Activity date
    start_time = models.TimeField(blank=True, null=True)  # Start time of the activity
    end_time = models.TimeField(blank=True, null=True)  # End time of the activity
    cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)  # Cost of the activity
    category = models.CharField(max_length=100, blank=True, null=True)  # Category of the activity (e.g., "adventure", "leisure")
    city = models.CharField(max_length=100)  # City where the activity takes place

    def __str__(self):
        return f"{self.description[:50]} ({self.city})"
