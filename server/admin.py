from django.contrib import admin
from apps.user.models import User
from apps.activity.models import Activity
from apps.location.models import Location
from apps.itinerary.models import Itinerary

admin.site.register(User)
admin.site.register(Location)
admin.site.register(Itinerary)
admin.site.register(Activity)
