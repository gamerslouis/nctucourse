from django.db import models
from django.utils import timezone

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
    last_updated_time = models.DateTimeField(blank=True)
    priority = models.IntegerField(default=0)

    def save(self, *args,**kwargs):
        if self.pk:
            # If self.pk is not None then it's an update.
            cls = self.__class__
            old = cls.objects.get(pk=self.pk)
            # This will get the current model state since super().save() isn't called yet.
            new = self  # This gets the newly instantiated Mode object with the new values.
            changed_fields = []
            for field in cls._meta.get_fields():
                field_name = field.name
                try:
                    if getattr(old, field_name) != getattr(new, field_name):
                        changed_fields.append(field_name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            if(len(set(['title', 'content']).intersection(set(changed_fields)))) > 0:
                self.last_updated_time = timezone.now() 
        else:
            self.last_updated_time = timezone.now() 
        super().save(*args, **kwargs)
    
