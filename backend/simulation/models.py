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


class SimCustomCourse(models.Model):
    """A course the user typed in themselves.

    Covers what the crawler cannot know about: a class cross-registered at
    another school, a time change the course database has not caught up with,
    or anything else that simply occupies a slot in the week.
    """
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE,
                             related_name='sim_custom_courses')
    semester = models.CharField(max_length=5)

    name = models.CharField(max_length=60)
    teacher = models.CharField(max_length=60, blank=True)
    # Old-style time code, matching cos_time on real courses (e.g. "3EF").
    time = models.CharField(max_length=60, blank=True)
    room = models.CharField(max_length=60, blank=True)
    credit = models.FloatField(default=0)
    color = models.CharField(max_length=7, default='#aebed1')
    visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
