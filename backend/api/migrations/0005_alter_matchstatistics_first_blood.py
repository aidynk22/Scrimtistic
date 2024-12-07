from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('api', '0004_alter_matchstatistics_first_blood'),
    ]

    operations = [
        migrations.AlterField(
            model_name='matchstatistics',
            name='first_blood',
            field=models.IntegerField(db_column='First_Blood', default=0),
        ),
    ] 