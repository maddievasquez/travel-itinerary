# Generated by Django 5.1.3 on 2025-03-27 00:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0003_user_is_premium_usersettings'),
    ]

    operations = [
        migrations.AddField(
            model_name='usersettings',
            name='language',
            field=models.CharField(default='en', max_length=10),
        ),
    ]
