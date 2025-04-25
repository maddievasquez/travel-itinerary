import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime, timedelta
from uuid import UUID
import random

from server.apps.user.models import User
from server.apps.itinerary.models import Itinerary
from server.apps.location.models import Location
from server.apps.activity.models import Activity

@pytest.mark.django_db
class TestItineraryViewSet:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def test_user(self):
        return User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='testuser'
        )

    @pytest.fixture
    def authenticated_client(self, api_client, test_user):
        client = api_client
        client.force_authenticate(user=test_user)
        return client

    @pytest.fixture
    def sample_location(self):
        return Location.objects.create(
            name='Test Location',
            city='Barcelona',
            address='123 Test St',
            latitude=41.3851,
            longitude=2.1734,
            category='attraction'
        )

    @pytest.fixture
    def sample_itinerary(self, test_user):
        return Itinerary.objects.create(
            user=test_user,
            title='Test Itinerary',
            city='Barcelona',
            start_date='2023-01-01',
            end_date='2023-01-03'
        )

    @pytest.fixture
    def sample_activity(self, sample_itinerary, sample_location):
        return Activity.objects.create(
            itinerary=sample_itinerary,
            location=sample_location,
            description='Visit Test Location',
            date='2023-01-01',
            start_time='09:00:00',
            end_time='12:00:00'
        )

    # CRUD Tests
    def test_create_itinerary(self, authenticated_client, sample_location):
        data = {
            'city': 'Barcelona',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03',
            'title': 'New Itinerary'
        }
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=data,
            format='json'
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert 'itinerary' in response.data
        assert 'days' in response.data
        assert Itinerary.objects.filter(title='New Itinerary').exists()

    def test_list_itineraries(self, authenticated_client, sample_itinerary):
        response = authenticated_client.get(reverse('itinerary-list'))
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['title'] == 'Test Itinerary'

    def test_retrieve_itinerary(self, authenticated_client, sample_itinerary):
        response = authenticated_client.get(
            reverse('itinerary-detail', kwargs={'id': sample_itinerary.id})
        )
        assert response.status_code == status.HTTP_200_OK
        assert response.data['itinerary']['title'] == 'Test Itinerary'

    def test_update_itinerary(self, authenticated_client, sample_itinerary):
        update_data = {
            'title': 'Updated Title',
            'city': sample_itinerary.city,  # Keep existing city
            'start_date': '2023-01-01',  # Already formatted string
            'end_date': '2023-01-03'     # Already formatted string
        }
        response = authenticated_client.patch(
            reverse('itinerary-detail', kwargs={'id': sample_itinerary.id}),
            data=update_data,
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        sample_itinerary.refresh_from_db()
        assert sample_itinerary.title == 'Updated Title'

    def test_delete_itinerary(self, authenticated_client, sample_itinerary):
        response = authenticated_client.delete(
            reverse('itinerary-detail', kwargs={'id': sample_itinerary.id})
        )
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Itinerary.objects.filter(id=sample_itinerary.id).exists()

    

    def test_create_itinerary_end_before_start(self, authenticated_client):
        data = {
            'city': 'Barcelona',
            'start_date': '2023-01-03',
            'end_date': '2023-01-01'  # End before start
        }
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=data,
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'error' in response.data

    def test_create_itinerary_nonexistent_city(self, authenticated_client):
        data = {
            'city': 'Nonexistent City',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03'
        }
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=data,
            format='json'
        )
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'error' in response.data

    # Authentication Tests
    def test_unauthenticated_access(self, api_client, sample_itinerary):
        endpoints = [
            ('get', reverse('itinerary-list')),
            ('get', reverse('itinerary-detail', kwargs={'id': sample_itinerary.id})),
            ('post', reverse('itinerary-list')),
            ('patch', reverse('itinerary-detail', kwargs={'id': sample_itinerary.id})),
            ('delete', reverse('itinerary-detail', kwargs={'id': sample_itinerary.id})),
            ('post', reverse('itinerary-generate')),
            ('get', reverse('itinerary-map-data', kwargs={'id': sample_itinerary.id})),
            ('get', reverse('itinerary-daily-routes', kwargs={'id': sample_itinerary.id}))
        ]

        for method, url in endpoints:
            if method == 'get':
                response = api_client.get(url)
            elif method == 'post':
                response = api_client.post(url)
            elif method == 'patch':
                response = api_client.patch(url)
            elif method == 'delete':
                response = api_client.delete(url)
            
            assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]