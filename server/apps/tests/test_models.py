from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.core.exceptions import ValidationError
from server.apps.location.models import Location
from server.apps.itinerary.models import Itinerary

User = get_user_model()

class ItineraryModelTests(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        
        # Create test location
        self.location = Location.objects.create(
            name='Paris',
            latitude=48.8566,
            longitude=2.3522
        )
        
    def test_itinerary_creation(self):
        """Test that an itinerary can be created with valid data"""
        itinerary = Itinerary.objects.create(
    title='Paris Weekend',
    user=self.user,           # ✅ match the model field
    city='Paris',             # ✅ required field
    start_date=timezone.now().date(),
    end_date=timezone.now().date() + timezone.timedelta(days=3),
)
        self.assertEqual(itinerary.title, 'Paris Weekend')
        self.assertEqual(itinerary.user, self.user)

        
    def test_itinerary_duration(self):
        """Test that the duration calculation works correctly"""
        start_date = timezone.now().date()
        end_date = start_date + timezone.timedelta(days=5)
        
        itinerary = Itinerary.objects.create(
            title='Paris Trip',
            user=self.user, 
            start_date=start_date,
            end_date=end_date,
        )
        
        duration = (itinerary.end_date - itinerary.start_date).days