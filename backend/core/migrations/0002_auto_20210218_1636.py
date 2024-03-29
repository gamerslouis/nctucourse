# Generated by Django 3.1.5 on 2021-02-18 08:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bulletin',
            old_name='text',
            new_name='title',
        ),
        migrations.AddField(
            model_name='bulletin',
            name='content',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='bulletin',
            name='priority',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='bulletin',
            name='category',
            field=models.IntegerField(choices=[(0, '通知'), (1, '更新'), (2, '錯誤'), (3, '修復')]),
        ),
    ]
