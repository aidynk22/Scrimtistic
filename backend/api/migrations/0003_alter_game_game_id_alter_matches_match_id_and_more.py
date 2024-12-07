# Generated by Django 5.1.2 on 2024-12-07 01:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_match_tables'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='game_id',
            field=models.CharField(db_column='Game_ID', max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='matches',
            name='match_id',
            field=models.CharField(db_column='Match_ID', max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='first_blood',
            field=models.IntegerField(db_column='First_Blood', default=0),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='id',
            field=models.AutoField(db_column='ID', primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='player',
            name='ign',
            field=models.CharField(db_column='IGN', max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='screenshot',
            name='screenshot_id',
            field=models.CharField(db_column='Screenshot_ID', max_length=255, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='screenshot',
            name='upload_date',
            field=models.DateTimeField(auto_now_add=True, db_column='Upload_Date'),
        ),
        migrations.AlterField(
            model_name='team',
            name='team_id',
            field=models.CharField(max_length=255, primary_key=True, serialize=False),
        ),
    ]