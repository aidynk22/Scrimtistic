from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.

class Team(models.Model):
    team_id = models.CharField(primary_key=True, max_length=255)
    team_name = models.CharField(unique=True, max_length=255)
    password_hash = models.CharField(max_length=255)
    email = models.CharField(unique=True, max_length=255)

    def save(self, *args, **kwargs):
        if not self.password_hash.startswith('pbkdf2_sha256$'):
            self.password_hash = make_password(self.password_hash)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Team'
        managed = False

class Player(models.Model):
    ign = models.CharField(db_column='IGN', primary_key=True, max_length=255)
    name = models.CharField(db_column='Name', max_length=255)
    role = models.CharField(db_column='Role', max_length=100)
    team = models.ForeignKey(Team, models.CASCADE, db_column='Team_ID')

    class Meta:
        db_table = 'Player'
        managed = False
