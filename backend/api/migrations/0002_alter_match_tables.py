from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),  # Replace with your last migration
    ]

    operations = [
        # Update MatchStatistics model
        migrations.AlterField(
            model_name='matchstatistics',
            name='id',
            field=models.AutoField(db_column='ID', primary_key=True),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='match',
            field=models.ForeignKey(
                db_column='Match_ID',
                on_delete=django.db.models.deletion.CASCADE,
                to='api.matches'
            ),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='player',
            field=models.ForeignKey(
                db_column='Player_IGN',
                on_delete=django.db.models.deletion.CASCADE,
                to='api.player'
            ),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='team_score',
            field=models.IntegerField(db_column='Team_Score', default=0),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='enemy_score',
            field=models.IntegerField(db_column='Enemy_Score', default=0),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='result',
            field=models.CharField(db_column='Result', max_length=10),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='first_blood',
            field=models.BooleanField(db_column='First_Blood', default=False),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='kills',
            field=models.IntegerField(db_column='Kills', default=0),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='deaths',
            field=models.IntegerField(db_column='Deaths', default=0),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='assists',
            field=models.IntegerField(db_column='Assists', default=0),
        ),
        migrations.AlterField(
            model_name='matchstatistics',
            name='playtime',
            field=models.TimeField(db_column='Playtime'),
        ),

        # Update Screenshot model
        migrations.AlterField(
            model_name='screenshot',
            name='screenshot_id',
            field=models.CharField(db_column='Screenshot_ID', max_length=255, primary_key=True),
        ),
        migrations.AlterField(
            model_name='screenshot',
            name='match',
            field=models.ForeignKey(
                db_column='Match_ID',
                on_delete=django.db.models.deletion.CASCADE,
                to='api.matches'
            ),
        ),
        migrations.AlterField(
            model_name='screenshot',
            name='screenshot_data',
            field=models.BinaryField(db_column='Screenshot_Data'),
        ),
        migrations.AlterField(
            model_name='screenshot',
            name='note',
            field=models.TextField(db_column='Note', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='screenshot',
            name='upload_date',
            field=models.DateTimeField(
                db_column='Upload_Date',
                default=django.utils.timezone.now,
                auto_now_add=True
            ),
        ),

        # Add Meta classes
        migrations.AlterModelTable(
            name='matchstatistics',
            table='Match_Statistics',
        ),
        migrations.AlterModelTable(
            name='screenshot',
            table='Screenshot',
        ),
    ]