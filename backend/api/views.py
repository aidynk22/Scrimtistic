from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Login
from .serializers import LoginSerializer

# Create your views here.

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"})

@api_view(['POST'])
def register_user(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        try:
            serializer.save()
            return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = Login.objects.get(username=username)
        if check_password(password, user.password_hash):
            return Response({"message": "Login successful"})
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    except Login.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def test_db(request):
    try:
        # Print all users for debugging
        all_users = Login.objects.all().values()
        print("All users in database:", all_users)
        
        # Try to get the specific test user
        test_user = Login.objects.get(username='will')
        return Response({
            'message': 'Database connection successful',
            'user_found': {
                'username': test_user.username,
                'email': test_user.email,
                'player_ign': test_user.player_ign
            }
        })
    except Login.DoesNotExist:
        return Response({
            "error": "Test user not found",
            "details": "Could not find user with username 'will'"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": str(e),
            "type": type(e).__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
