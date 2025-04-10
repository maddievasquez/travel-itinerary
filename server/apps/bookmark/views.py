from django.shortcuts import render

# Create your views here.
# In views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Bookmark, Itinerary
from .serializers import BookmarkSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request, itinerary_id):
    """Toggle bookmark status for an itinerary"""
    try:
        itinerary = Itinerary.objects.get(pk=itinerary_id)
        
        # Check if already bookmarked
        bookmark = Bookmark.objects.filter(user=request.user, itinerary=itinerary).first()
        
        if bookmark:
            # Remove bookmark if it exists
            bookmark.delete()
            return Response({'status': 'success', 'bookmarked': False}, status=status.HTTP_200_OK)
        else:
            # Create bookmark if it doesn't exist
            bookmark = Bookmark.objects.create(user=request.user, itinerary=itinerary)
            return Response({'status': 'success', 'bookmarked': True}, status=status.HTTP_201_CREATED)
            
    except Itinerary.DoesNotExist:
        return Response({'error': 'Itinerary not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_bookmark_status(request, itinerary_id):
    """Check if itinerary is bookmarked by current user"""
    try:
        itinerary = Itinerary.objects.get(pk=itinerary_id)
        is_bookmarked = itinerary.is_bookmarked_by(request.user)
        
        return Response({'isBookmarked': is_bookmarked}, status=status.HTTP_200_OK)
    except Itinerary.DoesNotExist:
        return Response({'error': 'Itinerary not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bookmarks(request):
    """Get all bookmarks for the current user"""
    bookmarks = Bookmark.objects.filter(user=request.user).select_related('itinerary')
    itineraries = [bookmark.itinerary for bookmark in bookmarks]
    
    # Use your existing ItinerarySerializer here
    from .serializers import ItinerarySerializer
    serializer = ItinerarySerializer(itineraries, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)