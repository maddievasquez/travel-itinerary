from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from server.apps.location.models import Location
from server.apps.itinerary.models import Itinerary, ItineraryActivity
from server.apps.activity.models import Activity
import datetime
from datetime import timedelta

User = get_user_model()

class TestItineraryGeneratorAPIView(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        
        # Create test location
        self.location = Location.objects.create(
            name="Test Location",
            city="Test City",
            address="123 Test St",
            latitude=40.7128,
            longitude=-74.0060,
            category="attraction"
        )

    def test_create_itinerary_successful(self):
        url = reverse('generate-itinerary')
        data = {
            'city': 'Test City',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('itinerary', response.data)
        self.assertIn('days', response.data)
        self.assertEqual(len(response.data['days']), 3)  # 3 days itinerary

    def test_create_itinerary_missing_fields(self):
        url = reverse('generate-itinerary')
        data = {
            'city': 'Test City',
            # Missing start_date and end_date
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_itinerary_invalid_dates(self):
        url = reverse('generate-itinerary')
        data = {
            'city': 'Test City',
            'start_date': 'invalid-date',
            'end_date': '2023-01-03'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_itinerary_end_before_start(self):
        url = reverse('generate-itinerary')
        data = {
            'city': 'Test City',
            'start_date': '2023-01-03',
            'end_date': '2023-01-01'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_itinerary_nonexistent_city(self):
        url = reverse('generate-itinerary')
        data = {
            'city': 'Non-existent City',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    def test_create_itinerary_no_data(self):
        url = reverse('generate-itinerary')
        response = self.client.post(url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_itinerary_default_title(self):
        url = reverse('generate-itinerary')
        data = {
            'city': 'Test City',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['itinerary']['title'], 'Trip to Test City')

    def test_create_itinerary_unauthenticated(self):
        self.client.logout()
        url = reverse('generate-itinerary')
        data = {
            'city': 'Test City',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)