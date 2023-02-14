from django.db import models
from django.contrib.auth import get_user_model

# Create your models here.


class SimCollect(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    course_id = models.CharField(max_length=20)
    semester = models.CharField(max_length=5)
    visible = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'course_id'], name='user_course_id_unique')
        ]


class SemesterCoursesMapping(models.Model):
    semester = models.CharField(max_length=5)
    file = models.TextField()


class UserTimeTableExportTheme(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    theme = models.CharField(max_length=600)
    created_at = models.DateTimeField(auto_now_add=True)
