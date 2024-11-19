from django.db import models

# Create your models here.
from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=200)  # Name of the location
    address = models.CharField(max_length=255, blank=True, null=True)  # Address of the location
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)  # Latitude coordinate
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)  # Longitude coordinate
    category = models.CharField(max_length=100, blank=True, null=True)  # Category of the location (e.g., "restaurant", "museum")
    city = models.CharField(max_length=100)  # City where the location is situated

    def __str__(self):
        return self.name
