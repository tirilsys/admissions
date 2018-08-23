# Generated by Django 2.0.3 on 2018-08-22 18:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('admissions', '0010_auto_20180810_2202'),
    ]

    operations = [
        migrations.AddField(
            model_name='membership',
            name='committee',
            field=models.ForeignKey(
                default=None, on_delete=django.db.models.deletion.CASCADE, to='admissions.Committee'
            ),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='membership',
            unique_together={('user', 'committee')},
        ),
    ]
