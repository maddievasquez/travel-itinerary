import random
from datetime import datetime, timedelta
from math import radians, sin, cos, sqrt, atan2
import logging
from server.apps.activity.models import Activity
from server.apps.activity.activity_templates import ACTIVITY_TEMPLATES

logger = logging.getLogger(__name__)

def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate the great circle distance between two points in kilometers"""
    try:
        R = 6371  # Earth radius in km
        lat1, lon1, lat2, lon2 = map(radians, [float(lat1), float(lon1), float(lat2), float(lon2)])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        return R * c
    except Exception as e:
        logger.error(f"Error calculating distance: {str(e)}")
        return float('inf')  # Return large distance if calculation fails

def cluster_locations(locations, max_distance=15):
    """Group locations into clusters based on proximity"""
    try:
        if not locations:
            return []
        
        clusters = []
        unclustered = list(locations)
        
        while unclustered:
            current = unclustered.pop()
            cluster = [current]
            
            i = 0
            while i < len(unclustered):
                loc = unclustered[i]
                try:
                    distance = calculate_distance(
                        current.latitude, current.longitude,
                        loc.latitude, loc.longitude
                    )
                    if distance <= max_distance:
                        cluster.append(unclustered.pop(i))
                    else:
                        i += 1
                except Exception as e:
                    logger.error(f"Error processing location {loc.id}: {str(e)}")
                    i += 1  # Skip problematic location
                    
            clusters.append(cluster)
        
        return clusters
    except Exception as e:
        logger.error(f"Error in cluster_locations: {str(e)}")
        return [[loc] for loc in locations]  # Fallback: treat each location as its own cluster

def generate_daily_activities(itinerary, date, locations):
    """Generate activities for a specific day based on available locations"""
    try:
        activities = []
        start_time = datetime.strptime("09:00", "%H:%M").time()
        
        for location in locations:
            try:
                # Get activity template
                category = getattr(location, 'category', 'general')
                templates = ACTIVITY_TEMPLATES.get(category, ACTIVITY_TEMPLATES['general'])
                # Unified format - now using replace instead of format for consistency
                description = random.choice(templates).replace("{location_name}", location.name)
                
                # Calculate times
                duration = timedelta(hours=random.randint(1, 3))
                end_time_dt = datetime.combine(datetime.today(), start_time) + duration
                end_time = end_time_dt.time()
                
                # Create activity
                activity = Activity.objects.create(
                    itinerary=itinerary,
                    location=location,
                    description=description,
                    date=date,
                    start_time=start_time,
                    end_time=end_time,
                    category=category
                )
                activities.append(activity)
                
                # Set next start time with random break
                break_duration = timedelta(minutes=random.randint(30, 90))
                next_start_dt = end_time_dt + break_duration
                start_time = next_start_dt.time()
                
                # Don't schedule too late
                if start_time > datetime.strptime("20:00", "%H:%M").time():
                    break
                    
            except Exception as e:
                logger.error(f"Error creating activity for location {location.id}: {str(e)}")
                continue  # Skip to next location
        
        return activities
    except Exception as e:
        logger.error(f"Error in generate_daily_activities: {str(e)}")
        return []

def distribute_locations(locations, num_days):
    """Distribute locations across days based on proximity and avoiding repetition"""
    try:
        if not locations or num_days <= 0:
            return []

        # Cluster locations by proximity first
        clusters = cluster_locations(locations)
        
        # Flatten clusters and shuffle
        all_locations = []
        for cluster in clusters:
            random.shuffle(cluster)
            all_locations.extend(cluster)
        
        # Create circular buffer of locations
        location_queue = all_locations.copy()
        random.shuffle(location_queue)
        
        # Track recently used locations
        recently_used = set()
        recent_window_size = min(5, len(all_locations))
        
        itinerary_days = []
        min_locations_per_day = 3
        max_locations_per_day = 5
        
        for day in range(num_days):
            if not location_queue:
                # Refresh queue excluding recently used
                available = [loc for loc in all_locations if loc.id not in recently_used]
                if not available:
                    available = all_locations.copy()
                    recently_used = set()
                
                location_queue = available.copy()
                random.shuffle(location_queue)
            
            # Determine how many locations for this day
            num_locations = random.randint(min_locations_per_day, max_locations_per_day)
            day_locations = []
            
            while len(day_locations) < num_locations and location_queue:
                if not location_queue:
                    break
                    
                loc = location_queue.pop(0)  # Changed from pop() to pop(0) for predictability
                if loc not in day_locations:
                    day_locations.append(loc)
                    recently_used.add(loc.id)
                    
                    # Maintain recent window size
                    if len(recently_used) > recent_window_size:
                        recently_used.pop()
            
            itinerary_days.append(day_locations)
        
        return itinerary_days
    except Exception as e:
        logger.error(f"Error in distribute_locations: {str(e)}")
        # Fallback: simple distribution
        return [list(locations)[i::num_days] for i in range(num_days)]