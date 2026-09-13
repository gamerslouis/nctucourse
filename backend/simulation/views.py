import json

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
        models.SimCustomCourse.objects.filter(user=request.user,
                                              semester=semester).delete()
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


class TimetableExportCollectThemeView(LoginRequiredMixin, View):
    def post(self, request):
        theme = request.JSON.get('theme')
        try:
            if len(theme) > 30:
                json.loads(theme)
            if len(theme) > 500:
                raise ValueError()
        except:
            return http.HttpResponseBadRequest()

        models.UserTimeTableExportTheme.objects.create(
            user=request.user, theme=theme)
        return http.HttpResponse('', status=201)


class CustomCourseListView(LoginRequiredMixin, View):
    def get(self, request):
        semester = request.GET.get('sem', settings.SEMESTER)
        if semester is None:
            return http.HttpResponseBadRequest()
        courses = models.SimCustomCourse.objects.filter(user=request.user,
                                                        semester=semester)
        return http.JsonResponse(
            {'courses': serializers.CustomCourseSerializer(courses, many=True).data})

    def post(self, request):
        semester = request.GET.get('sem', settings.SEMESTER)
        if semester is None:
            return http.HttpResponseBadRequest()

        parser = serializers.CustomCourseSerializer(data=request.JSON)
        if not parser.is_valid():
            return http.HttpResponseBadRequest()
        if not parser.validated_data['name'].strip():
            return http.HttpResponseBadRequest()

        course = models.SimCustomCourse.objects.create(
            user=request.user, semester=semester, **parser.validated_data)
        return http.JsonResponse(
            serializers.CustomCourseSerializer(course).data, status=201)


class CustomCourseDetailView(LoginRequiredMixin, View):
    def _get(self, request, pk):
        try:
            return models.SimCustomCourse.objects.get(pk=pk, user=request.user)
        except ObjectDoesNotExist:
            return None

    def patch(self, request, pk):
        course = self._get(request, pk)
        if course is None:
            return http.HttpResponseNotFound()

        parser = serializers.CustomCourseSerializer(data=request.JSON, partial=True)
        if not parser.is_valid():
            return http.HttpResponseBadRequest()
        if 'name' in parser.validated_data and not parser.validated_data['name'].strip():
            return http.HttpResponseBadRequest()

        for key, value in parser.validated_data.items():
            setattr(course, key, value)
        course.save()
        return http.JsonResponse(serializers.CustomCourseSerializer(course).data)

    def delete(self, request, pk):
        course = self._get(request, pk)
        if course is None:
            return http.HttpResponseNotFound()
        course.delete()
        return http.HttpResponse('')
