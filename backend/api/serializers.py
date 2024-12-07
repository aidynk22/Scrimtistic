from rest_framework import serializers
from .models import Team, Player, Matches, Game, MatchStatistics, Screenshot
from django.contrib.auth.hashers import make_password
import uuid

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['ign', 'name', 'role']
        
    def validate_ign(self, value):
        if Player.objects.filter(ign=value).exists():
            raise serializers.ValidationError(
                'This IGN is already taken. Please choose a different one.'
            )
        return value

class TeamRegistrationSerializer(serializers.ModelSerializer):
    player = PlayerSerializer()
    password = serializers.CharField(write_only=True)
    team_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = Team
        fields = ['team_name', 'email', 'password', 'player']

    def validate(self, data):
        # Check if team name is unique
        if Team.objects.filter(team_name=data.get('team_name')).exists():
            raise serializers.ValidationError({
                'team_name': 'This team name is already taken'
            })
            
        # Check if email is unique
        if Team.objects.filter(email=data.get('email')).exists():
            raise serializers.ValidationError({
                'email': 'This email is already registered'
            })
            
        return data

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

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matches
        fields = ['match_id', 'team', 'game', 'match_name', 'match_date', 'match_time']

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['game_id', 'title']

class ScreenshotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Screenshot
        fields = ['screenshot_id', 'match', 'screenshot_data', 'note', 'upload_date']

class MatchStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchStatistics
        fields = ['match', 'team_score', 'enemy_score', 'result']