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

    def create(self, validated_data):
        player_data = validated_data.pop('player')
        password = validated_data.pop('password')
        team_id = str(uuid.uuid4())
        
        team = Team.objects.create(
            team_id=team_id,
            password_hash=make_password(password),
            **validated_data
        )
        
        Player.objects.create(team=team, **player_data)
        return team