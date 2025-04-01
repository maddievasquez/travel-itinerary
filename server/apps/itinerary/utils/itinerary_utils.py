# itinerary/utils/itinerary_utils.py
import random
from math import radians, sin, cos, sqrt, atan2
from datetime import timedelta
from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES
from server.apps.activity.models import Activity
from server.apps.location.models import Location

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    return R * c

def generate_daily_activities(itinerary, date, locations):
    """Generate activities for a single day"""
    activities = []
    for loc in locations:
        category = getattr(loc, 'category', 'general')
        template_choices = ACTIVITY_TEMPLATES.get(category, ["Explore {name}"])
        activity_desc = random.choice(template_choices).format(name=loc.name)
        
        activities.append(Activity.objects.create(
            itinerary=itinerary,
            location=loc,
            description=activity_desc,
            date=date,
            start_time="10:00",
            end_time="18:00",
            cost=random.randint(10, 50),
            category=category
        ))
    return activities

def distribute_locations(locations, num_days):
    """Distribute locations across days with geographic clustering"""
    if not locations or num_days <= 0:
        return []

    itinerary_days = []
    used_locations = set()
    daily_limit = 4  # Max locations per day
    
    for day in range(1, num_days + 1):
        if len(used_locations) >= len(locations):
            break
            
        # Find an unused starting location
        start_loc = next((loc for loc in locations if loc.id not in used_locations), None)
        if not start_loc:
            break
            
        day_locations = [start_loc]
        used_locations.add(start_loc.id)
        
        # Find nearby locations
        for loc in locations:
            if loc.id not in used_locations:
                dist = calculate_distance(
                    float(start_loc.latitude), float(start_loc.longitude),
                    float(loc.latitude), float(loc.longitude)
                )
                if dist < 15:  # Within 15km
                    day_locations.append(loc)
                    used_locations.add(loc.id)
                    if len(day_locations) >= daily_limit:
                        break
                        
        itinerary_days.append(day_locations)
    
    return itinerary_days