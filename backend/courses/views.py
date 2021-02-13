from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.pagination import LimitOffsetPagination
from rest_framework import filters
from rest_framework import viewsets
from rest_framework import mixins
from django.conf import settings

from . import serializers
from . import models

# Create your views here.


class CourseViewSet(mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseSerializer
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['ayc', 'sem']
    search_fields = ['cname', 'ename', 'teacher_name']


class SupportSemesterView(generics.ListAPIView):
    queryset = models.Course.objects.values('ayc', 'sem').distinct()
    serializer_class = serializers.SemesterSerializer


class FeedBackViewSet(mixins.ListModelMixin,
                      mixins.RetrieveModelMixin,
                      viewsets.GenericViewSet):
    queryset = models.Feedback.objects.filter(draft=False)
    serializer_class = serializers.FeedBackSerializer
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['course__ayc', 'course__sem']
    search_fields = ['title', 'course__cname',
                     'course__ename', 'course__teacher_name']


class MyFeedBackViewSet(mixins.ListModelMixin,
                        mixins.CreateModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        viewsets.GenericViewSet):
    queryset = models.Feedback.objects.all()
    serializer_class = serializers.MyFeedBackSerializer
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['course__ayc', 'course__sem']
    search_fields = ['title', 'course__cname',
                     'course__ename', 'course__teacher_name']

    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
