# Generated by Django 5.1.2 on 2024-12-07 03:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_alter_game_game_id_alter_matches_match_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchstatistics',
            name='first_blood',
            field=models.IntegerField(default=0),
        ),
    ]