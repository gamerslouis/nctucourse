# Generated by Django 3.1.5 on 2021-02-18 08:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cname', models.CharField(max_length=50)),
                ('ename', models.CharField(max_length=200)),
                ('ayc', models.CharField(max_length=50)),
                ('sem', models.CharField(max_length=50)),
                ('cos_id', models.CharField(max_length=50)),
                ('perm_id', models.CharField(max_length=50)),
                ('english', models.BooleanField()),
                ('credit', models.FloatField()),
                ('hours', models.FloatField()),
                ('time', models.CharField(max_length=100)),
                ('num_limit', models.IntegerField()),
                ('reg_number', models.IntegerField()),
                ('teacher_name', models.CharField(max_length=50)),
                ('memo', models.TextField()),
            ],
            options={
                'unique_together': {('ayc', 'sem', 'cos_id')},
            },
        ),
        migrations.CreateModel(
            name='Feedback',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('content', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('anonymous', models.BooleanField()),
                ('draft', models.BooleanField()),
                ('course', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='courses.course')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
