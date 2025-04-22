from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from server.apps.location.models import Location
from server.apps.itinerary.models import Itinerary
from server.apps.activity.models import Activity
from server.apps.activity.serializers import ActivitySerializer

User = get_user_model()

class ActivitySerializerTests(TestCase):
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            username='serializeruser',
            email='serializer@example.com',
            password='serializerpass'
        )
        
        # Create test location
        self.location = Location.objects.create(
            name='Rome',
            latitude=41.9028,
            longitude=12.4964
        )
        
        # Create test itinerary
        self.itinerary = Itinerary.objects.create(
            user=self.user,
            title='Rome Adventure',
            city='Rome',
            start_date=timezone.now().date(),
            end_date=timezone.now().date() + timezone.timedelta(days=3),
        )
        
        # Create test activity
        self.activity = Activity.objects.create(
    itinerary=self.itinerary,
    location=self.location,
    description='Explore the ancient Roman Colosseum',
    date=timezone.now().date(),
    start_time=timezone.datetime.strptime('10:00', '%H:%M').time(),
    end_time=timezone.datetime.strptime('12:00', '%H:%M').time(),
    cost=20.00,
    category='history',
    city='Rome'
)

        
    def test_activity_serialization(self):
        """Test that activity is correctly serialized"""
        serializer = ActivitySerializer(self.activity)
        data = serializer.data
        
        # Check that all fields are present and correctly serialized
        # self.assertEqual(data['name'], 'Visit Colosseum')
        self.assertEqual(data['description'], 'Explore the ancient Roman Colosseum')
        self.assertEqual(data['start_time'], '10:00:00')
        self.assertEqual(data['end_time'], '12:00:00')
        self.assertEqual(data['city'], 'Rome')
        self.assertEqual(data['category'], 'history')
