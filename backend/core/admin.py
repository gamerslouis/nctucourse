from django.contrib import admin
# from django.contrib.sites.models import Site

from . import models

# Register your models here.


@admin.register(models.Bulletin)
class BulletinAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'priority', 'last_updated_time')
    list_filter = ('category', )

# admin.register(Site)