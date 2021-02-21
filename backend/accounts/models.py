from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


class Profile(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    nickname = models.CharField(default="", max_length=50)


class CoursesHistory(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    data = models.TextField()
    last_updated_time = models.DateTimeField(auto_now=True)


class TrialSimulationData(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    data = models.TextField(default="")
    imported_courses = models.TextField(default="")
    last_updated_time = models.DateTimeField(blank=True, null=True) # last update imported courses time
