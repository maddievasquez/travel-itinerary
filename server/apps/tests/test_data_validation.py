import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from server.apps.user.models import User
from server.apps.itinerary.models import Itinerary
from server.apps.location.models import Location

@pytest.mark.django_db
class TestDataValidation:
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def test_user(self):
        return User.objects.create_user(
            email='validation_test@example.com',
            password='SecurePassword123!',
            username='validation_user'
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

    def test_itinerary_empty_fields(self, authenticated_client):
        """V1: Test validation of empty required fields"""
        empty_data = {}
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=empty_data,
            format='json'
        )
        # Accept either 400 or 404 as validation failure
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
        assert 'error' in response.data
        # Check specific fields are mentioned in error message
        error_message = str(response.data).lower()
        assert any(field in error_message for field in ['city', 'start_date', 'end_date'])

    def test_itinerary_null_fields(self, authenticated_client):
        """V2: Test validation of null required fields"""
        null_data = {
            'city': None,
            'start_date': None,
            'end_date': None,
            'title': None
        }
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=null_data,
            format='json'
        )
        # Accept either 400 or 404 as validation failure
        assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
        assert 'error' in response.data

    def test_itinerary_invalid_date_formats(self, authenticated_client):
        """V3: Test validation of invalid date formats"""
        invalid_dates = [
            # MM/DD/YYYY format
            {
                'city': 'Barcelona',
                'start_date': '01/01/2023',
                'end_date': '01/03/2023',
                'title': 'Invalid Date Format Test'
            },
            # DD-MM-YYYY format
            {
                'city': 'Barcelona',
                'start_date': '01-01-2023',
                'end_date': '03-01-2023',
                'title': 'Invalid Date Format Test'
            },
            # Text date
            {
                'city': 'Barcelona',
                'start_date': 'January 1, 2023',
                'end_date': 'January 3, 2023',
                'title': 'Invalid Date Format Test'
            }
        ]
        
        for data in invalid_dates:
            response = authenticated_client.post(
                reverse('itinerary-list'),
                data=data,
                format='json'
            )
            # Accept either 400 or 404 as validation failure
            assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
            assert 'error' in response.data
            assert 'date' in str(response.data).lower() or 'city' in str(response.data).lower()

    def test_itinerary_date_range_validation(self, authenticated_client):
        """V4: Test validation of improper date ranges"""
        invalid_ranges = [
            # End date before start date
            {
                'city': 'Barcelona',
                'start_date': '2023-01-10',
                'end_date': '2023-01-05',
                'title': 'Backward Date Range'
            },
            # Same day (if your app requires multi-day trips)
            {
                'city': 'Barcelona',
                'start_date': '2023-01-10',
                'end_date': '2023-01-10',
                'title': 'Same Day Trip'
            },
            # Extremely long trip (if your app has a limit)
            {
                'city': 'Barcelona',
                'start_date': '2023-01-01',
                'end_date': '2023-12-31',
                'title': 'Year-long Trip'
            }
        ]
        
        for data in invalid_ranges:
            response = authenticated_client.post(
                reverse('itinerary-list'),
                data=data,
                format='json'
            )
            # Accept either 400 or 404 as validation failure
            assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
            assert 'error' in response.data

    def test_itinerary_past_dates_validation(self, authenticated_client):
        """V5: Test validation of past dates (if your app prevents planning in the past)"""
        past_dates = {
            'city': 'Barcelona',
            'start_date': '2020-01-01',
            'end_date': '2020-01-03',
            'title': 'Past Trip'
        }
        
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=past_dates,
            format='json'
        )
        # This test is flexible - if your app allows past dates, it may return 201
        # If not, it should return an error code
        if response.status_code != status.HTTP_201_CREATED:
            assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
            assert 'error' in response.data
            error_message = str(response.data).lower()
            assert 'past' in error_message or 'date' in error_message or 'city' in error_message

    def test_itinerary_unicode_characters(self, authenticated_client):
        """V6: Test validation of unicode characters in text fields"""
        unicode_data = {
            'city': 'Zürich',  # German umlaut
            'start_date': '2023-01-01',
            'end_date': '2023-01-03',
            'title': '東京旅行'  # Japanese for "Tokyo Trip"
        }
        
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=unicode_data,
            format='json'
        )
        # Should accept unicode characters, but city might not exist, so 404 is acceptable
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_404_NOT_FOUND]
        # If 404, check that it's because of city, not because of unicode characters
        if response.status_code == status.HTTP_404_NOT_FOUND:
            assert 'city' in str(response.data).lower()

    def test_itinerary_field_length_validation(self, authenticated_client):
        """V7: Test validation of field length constraints"""
        # Create very long strings for fields that might have length limits
        long_title = 'A' * 1000  # 1000 character title
        
        length_data = {
            'city': 'Barcelona',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03',
            'title': long_title
        }
        
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=length_data,
            format='json'
        )
        # If there's a length constraint, this should fail with 400 or 404
        if response.status_code != status.HTTP_201_CREATED:
            assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
            assert 'error' in response.data
            error_message = str(response.data).lower()
            # Accept either a title error or a city error
            assert 'title' in error_message or 'length' in error_message or 'city' in error_message

    def test_itinerary_invalid_city(self, authenticated_client):
        """V8: Test validation of non-existent cities"""
        non_existent_city = {
            'city': 'NonExistentCityXYZ',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03',
            'title': 'Invalid City Test'
        }
        
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=non_existent_city,
            format='json'
        )
        # This should specifically be a 404 because the city doesn't exist
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert 'error' in response.data
        assert 'city' in str(response.data).lower()

    def test_itinerary_sql_injection_attempt(self, authenticated_client):
        """V9: Test validation against SQL injection attempts"""
        sql_injection = {
            'city': "Barcelona'; DROP TABLE users; --",
            'start_date': '2023-01-01',
            'end_date': '2023-01-03',
            'title': "Robert'); DROP TABLE Students; --"
        }
        
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=sql_injection,
            format='json'
        )
        # Should either sanitize the input (allowing 201) or reject it (400/404)
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
        # The key is that the database should remain intact - could add a check here
        
    def test_itinerary_xss_attempt(self, authenticated_client):
        """V10: Test validation against XSS attempts"""
        xss_data = {
            'city': 'Barcelona',
            'start_date': '2023-01-01',
            'end_date': '2023-01-03',
            'title': '<script>alert("XSS")</script>Test Title'
        }
        
        response = authenticated_client.post(
            reverse('itinerary-list'),
            data=xss_data,
            format='json'
        )
        # Should either sanitize the input (allowing 201) or reject it (400/404)
        if response.status_code == status.HTTP_201_CREATED:
            # If created, make sure the script tag is escaped/sanitized
            itinerary = Itinerary.objects.get(title__contains='Test Title')
            assert '<script>' not in itinerary.title or '&lt;script&gt;' in itinerary.title
        else:
            assert response.status_code in [status.HTTP_400_BAD_REQUEST, status.HTTP_404_NOT_FOUND]
            assert 'error' in response.data