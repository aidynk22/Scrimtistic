from rest_framework import serializers
from .models import Login, Player
from django.contrib.auth.hashers import make_password

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['ign', 'name', 'role']

class LoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Login
        fields = ['username', 'password', 'email', 'player_ign', 'role', 'name']
        extra_kwargs = {
            'username': {'required': True},
            'email': {'required': True},
            'player_ign': {'required': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.pop('role')
        name = validated_data.pop('name')
        
        # Create Player record
        player_data = {
            'ign': validated_data['player_ign'],
            'name': name,
            'role': role
        }
        Player.objects.create(**player_data)
        
        # Create Login record
        validated_data['password_hash'] = make_password(password)
        return Login.objects.create(**validated_data) 