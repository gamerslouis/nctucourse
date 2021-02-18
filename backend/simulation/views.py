from django.views.generic import View
from django import http
from django.conf import settings
from django.contrib import auth
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User
from django.core.exceptions import ImproperlyConfigured, PermissionDenied, ObjectDoesNotExist

from . import models
from . import serializers
# Create your views here.


class UserCourseCollectView(LoginRequiredMixin, View):
    def get(self, request):
        semester = request.GET.get('sem', settings.SEMESTER)
        if semester is None:
            return http.HttpResponseBadRequest()
        courses = models.SimCollect.objects.filter(user=request.user,
                                                   semester=semester)
        return http.JsonResponse({'courses':
                                  serializers.CourseCollectSerializer(courses, many=True).data})

    def post(self, request):
        parser = serializers.CourseCollectSerializer(data=request.JSON)
        if not parser.is_valid():
            return http.HttpResponseBadRequest()
        course, created = models.SimCollect.objects.get_or_create(user=request.user,
                                                                  course_id=parser.data['course_id'],
                                                                  semester=parser.data['course_id'].split('_')[0])
        course.visible = parser.data['visible']
        course.save()
        return http.HttpResponse('', status=201)

    def delete(self, request):
        course_id = request.JSON.get('course_id')
        if course_id is None:
            return http.HttpResponseBadRequest()
        try:
            course = models.SimCollect.objects.get(
                user=request.user, course_id=course_id)
            course.delete()
        except ObjectDoesNotExist:
            pass
        return http.HttpResponse('')


class ClearUserCoursesView(LoginRequiredMixin, View):
    def get(self, request):
        semester = request.GET.get('sem', settings.SEMESTER)

        courses = models.SimCollect.objects.filter(user=request.user,
                                                   semester=semester)
        courses.delete()
        return http.HttpResponse('', status=200)


class AllCoursesUrlView(View):
    def get(self, request):
        semester = request.GET.get('sem', settings.SEMESTER)

        try:
            mapping = models.SemesterCoursesMapping.objects.get(
                semester=semester)
        except ObjectDoesNotExist:
            return http.HttpResponseNotFound()

        return http.JsonResponse({
            'sem': semester,
            'url': settings.COURSE_FILE_ROOT + mapping.file
        })


class SemesterListView(View):
    def get(self, request):
        sems = models.SemesterCoursesMapping.objects.values(
            'semester').distinct()
        return http.JsonResponse([s['semester'] for s in sems], safe=False)
