from django.db import models

# Create your models here.

class Team(models.Model):
    team_id = models.CharField(primary_key=True, max_length=255)
    team_name = models.CharField(unique=True, max_length=255)
    password_hash = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)

    class Meta:
        db_table = 'Team'

class Player(models.Model):
    ign = models.CharField(db_column='IGN', primary_key=True, max_length=255)
    name = models.CharField(db_column='Name', max_length=255)
    role = models.CharField(db_column='Role', max_length=100)
    team = models.ForeignKey(Team, models.CASCADE, db_column='Team_ID')

    class Meta:
        db_table = 'Player'

class Game(models.Model):
    game_id = models.CharField(db_column='Game_ID', primary_key=True, max_length=255)
    title = models.CharField(db_column='Title', max_length=255)
    genre = models.CharField(db_column='Genre', max_length=100)

    class Meta:
        db_table = 'Game'

class Matches(models.Model):
    match_id = models.CharField(db_column='Match_ID', primary_key=True, max_length=255)
    team = models.ForeignKey(Team, models.CASCADE, db_column='Team_ID')
    game = models.ForeignKey(Game, models.CASCADE, db_column='Game_ID')
    match_name = models.CharField(db_column='Match_Name', max_length=255, null=True, blank=True)
    match_date = models.DateField(db_column='Match_Date')
    match_time = models.TimeField(db_column='Match_Time')

    class Meta:
        db_table = 'Matches'

class MatchStatistics(models.Model):
    id = models.AutoField(db_column='ID', primary_key=True)
    match = models.ForeignKey(Matches, models.CASCADE, db_column='Match_ID')
    player = models.ForeignKey(Player, models.CASCADE, db_column='Player_IGN')
    team_score = models.IntegerField(db_column='Team_Score', default=0)
    enemy_score = models.IntegerField(db_column='Enemy_Score', default=0)
    result = models.CharField(db_column='Result', max_length=10)
    first_blood = models.BooleanField(db_column='First_Blood', default=False)
    kills = models.IntegerField(db_column='Kills', default=0)
    deaths = models.IntegerField(db_column='Deaths', default=0)
    assists = models.IntegerField(db_column='Assists', default=0)
    playtime = models.TimeField(db_column='Playtime')

    class Meta:
        db_table = 'Match_Statistics'

class Screenshot(models.Model):
    screenshot_id = models.CharField(db_column='Screenshot_ID', primary_key=True, max_length=255)
    match = models.ForeignKey(Matches, models.CASCADE, db_column='Match_ID')
    screenshot_data = models.BinaryField(db_column='Screenshot_Data')
    note = models.TextField(db_column='Note', blank=True, null=True)
    upload_date = models.DateTimeField(db_column='Upload_Date', auto_now_add=True)

    class Meta:
        db_table = 'Screenshot'
