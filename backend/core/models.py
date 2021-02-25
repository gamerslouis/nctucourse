from django.db import models

# Create your models here.


class Bulletin(models.Model):
    CATEGORY_CHOICES = (
        (0, u'通知'),
        (1, u'更新'),
        (2, u'錯誤'),
        (3, u'修復'),
    )

    category = models.IntegerField(choices=CATEGORY_CHOICES)
    content = models.TextField(default='', blank=True)
    title = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated_time = models.DateTimeField(auto_now=True)
    priority = models.IntegerField(default=0)
    
