from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Course(models.Model):
    cname = models.CharField(max_length=50)
    ename = models.CharField(max_length=200)
    ayc = models.CharField(max_length=50)
    sem = models.CharField(max_length=50)
    cos_id = models.CharField(max_length=50)
    perm_id = models.CharField(max_length=50)
    english = models.BooleanField()
    credit = models.FloatField()
    hours = models.FloatField()
    time = models.CharField(max_length=100)  # Old version
    num_limit = models.IntegerField()
    reg_number = models.IntegerField()
    teacher_name = models.CharField(max_length=50)
    memo = models.TextField()

    @property
    def full_id(self):
        return '{}{}_{}'.format(
            self.ayc,
            self.sem,
            self.cos_id
        )

    @property
    def related_feedbacks(self):
        return Feedback.objects.filter(draft=False, course__perm_id=self.perm_id)

    @property
    def history_courses(self):
        return Course.objects.filter(perm_id=self.perm_id)

    class Meta:
        unique_together = (("ayc", "sem", "cos_id"),)


class Feedback(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    draft = models.BooleanField()
    rating1 = models.IntegerField()
    rating2 = models.IntegerField()
    rating3 = models.IntegerField()
