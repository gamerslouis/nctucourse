from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


class CoursesHistory(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    data = models.TextField()
    last_updated_time = models.DateTimeField(auto_now=True)
