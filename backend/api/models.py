from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.

class Login(models.Model):
    username = models.CharField(db_column='username', max_length=255, primary_key=True)
    password_hash = models.CharField(db_column='password_hash', max_length=255)
    email = models.CharField(db_column='email', max_length=255)
    player_ign = models.CharField(db_column='player_ign', max_length=255)

    def save(self, *args, **kwargs):
        if not self.password_hash.startswith('pbkdf2_sha256$'):
            self.password_hash = make_password(self.password_hash)
        super().save(*args, **kwargs)

    class Meta:
        db_table = 'Login'
        managed = False

class Player(models.Model):
    ign = models.CharField(db_column='IGN', max_length=255, primary_key=True)
    name = models.CharField(db_column='Name', max_length=255)
    role = models.CharField(db_column='Role', max_length=100)

    class Meta:
        db_table = 'Player'
        managed = False
