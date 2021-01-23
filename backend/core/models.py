from django.db import models

# Create your models here.


class Bulletin(models.Model):
    CATEGORY_CHOICES = (
        (u'news', u'最新消息'),
        (u'updated', u'網站更新'),
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    text = models.TextField()
    created_time = models.DateTimeField(auto_now_add=True)
    last_updated_time = models.DateTimeField(auto_now=True)
