from rest_framework import serializers
from .models import Team, Player
from django.contrib.auth.hashers import make_password
import uuid

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['ign', 'name', 'role']

class TeamRegistrationSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Team
        fields = ['team_name', 'email', 'password', 'player']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        player_data = validated_data.pop('player')
        password = validated_data.pop('password')
        
        # Generate a unique team_id
        team_id = str(uuid.uuid4())
        
        # Create the team
        team = Team.objects.create(
            team_id=team_id,
            password_hash=password,
            **validated_data
        )
        
        # Create the associated player
        Player.objects.create(team=team, **player_data)
        
        return team 