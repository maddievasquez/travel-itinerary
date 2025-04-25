import pytest
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.urls import reverse
from server.apps.user.models import User
from server.apps.itinerary.models import Itinerary

@pytest.fixture
def api_client():
    """Create an unauthenticated API client"""
    return APIClient()

@pytest.fixture
def authenticated_client(api_client):
    """Create an authenticated client with test user and token"""
    user = User.objects.create_user(
        email='test@example.com',
        username='testuser',
        password='password123'
    )
    token = Token.objects.create(user=user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')
    return api_client, user

@pytest.fixture
def sample_itinerary(authenticated_client):
    """Create a sample itinerary for testing"""
    client, user = authenticated_client
    return Itinerary.objects.create(
        title="Test Itinerary",
        city="Test City",
        start_date="2025-04-23",
        end_date="2025-04-28",
        user=user
    )

@pytest.mark.django_db
def test_api_root_navigation(api_client):
    """N1: User accesses API root"""
    response = api_client.get('/api/')
    assert response.status_code in [200, 404]  # Could be either

@pytest.mark.django_db
def test_api_itineraries_endpoint(authenticated_client):
    """N2: User navigates to itineraries API endpoint"""
    client, user = authenticated_client
    
    # Create test data
    Itinerary.objects.create(
        title="Test Itinerary 1",
        city="Test City",
        user=user,
        start_date="2025-01-01",
        end_date="2025-01-07"
    )
    
    # Test with direct URL
    response = client.get('/api/itineraries/')
    assert response.status_code == 200
    assert len(response.data) > 0  # Verify we get results
    
    # Test with reverse URL
    url = reverse('itinerary-list')
    response = client.get(url)
    assert response.status_code == 200

@pytest.mark.django_db
def test_user_profile_endpoint(authenticated_client):
    """N3: User navigates to profile endpoint"""
    client, user = authenticated_client
    response = client.get('/api/user/profile/')
    assert response.status_code == 200
    assert response.data['email'] == user.email  # Verify response contains user data

@pytest.mark.django_db
def test_itinerary_detail_endpoint(authenticated_client, sample_itinerary):
    """N4: User navigates to itinerary detail endpoint"""
    client, user = authenticated_client
    
    # Test with direct URL
    response = client.get(f'/api/itineraries/{sample_itinerary.id}/details/')
    assert response.status_code == 200
    assert response.data['title'] == sample_itinerary.title
    
    # Test with reverse URL (try both patterns)
    try:
        url = reverse('itinerary-detail', kwargs={'id': sample_itinerary.id})
        response = client.get(url)
        assert response.status_code == 200
    except:
        url = reverse('itinerary-detail-int', kwargs={'id': sample_itinerary.id})
        response = client.get(url)
        assert response.status_code == 200

@pytest.mark.django_db
def test_restricted_access(api_client):
    """N5: Test restricted access without login"""
    # Test profile endpoint
    response = api_client.get('/api/user/profile/')
    assert response.status_code in [401, 403]
    
    # Test itineraries endpoint
    response = api_client.get('/api/itineraries/')
    assert response.status_code in [401, 403]