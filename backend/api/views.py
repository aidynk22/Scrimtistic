from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Team
from .serializers import TeamRegistrationSerializer

# Create your views here.

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"})

@api_view(['POST'])
def register(request):
    serializer = TeamRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response({'message': 'Registration successful'}, 
                          status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        team = Team.objects.get(email=email)
        if check_password(password, team.password_hash):
            return Response({'message': 'Login successful'})
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
    except Team.DoesNotExist:
        return Response({'error': 'Team not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def test_db(request):
    try:
        # Print all users for debugging
        all_users = Team.objects.all().values()
        print("All users in database:", all_users)
        
        # Try to get the specific test user
        test_user = Team.objects.get(team_name='fpv')
        return Response({
            'message': 'Database connection successful',
            'user_found': {
                'team_name': test_user.team_name,
                'email': test_user.email
            }
        })
    except Team.DoesNotExist:
        return Response({
            "error": "Test user not found",
            "details": "Could not find user with team name 'will'"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": str(e),
            "type": type(e).__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
