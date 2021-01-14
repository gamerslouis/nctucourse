from django.contrib import admin

from . import models

# Register your models here.


@admin.register(models.SimCollect)
class SimCollectAdmin(admin.ModelAdmin):
    list_display = ('user', 'course_id', 'semester', 'visible')
    search_fields = ('user__username', 'course_id', 'semester')
    list_filter = ['semester']


@admin.register(models.SemesterCoursesMapping)
class SemesterCoursesMappingAdmin(admin.ModelAdmin):
    list_display = ('semester', 'file')
