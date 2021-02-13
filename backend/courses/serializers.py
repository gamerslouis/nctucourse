from rest_framework import serializers
from core.serializers import RelatedFieldAlternative

from . import models


class CourseSerializer(serializers.ModelSerializer):
    sem_name = serializers.SerializerMethodField()

    def get_sem_name(self, obj):
        mapp = {'1': '上學期', '2': '下學期', 'X': '暑期'}
        return '{}{}'.format(obj.ayc, mapp[obj.sem])

    class Meta:
        model = models.Course
        fields = '__all__'


class SemesterSerializer(serializers.Serializer):
    ayc = serializers.CharField()
    sem = serializers.CharField()
    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        mapp = {'1': '上學期', '2': '下學期', 'X': '暑期'}
        return '{} {}'.format(obj['ayc'], mapp[obj['sem']])


class FeedBackSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    course = CourseSerializer()

    def get_owner(self, obj):
        if obj.anonymous:
            return '匿名'
        else:
            return obj.owner.username

    class Meta:
        model = models.Feedback
        exclude = ('draft', 'anonymous')


class MyFeedBackSerializer(serializers.ModelSerializer):
    owner = serializers.SlugRelatedField(slug_field='username', read_only=True)
    course = RelatedFieldAlternative(
        queryset=models.Course.objects.all(), serializer=CourseSerializer)

    def validate(self, data):
        data = super().validate(data)
        print(data)
        if not data['draft']:
            if data['course'] is None:
                raise serializers.ValidationError()
            if data['title'] == '' or data['content'] == '':
                raise serializers.ValidationError()
        return data

    class Meta:
        model = models.Feedback
        fields = '__all__'
        extra_kwargs = {
            'draft': {'required': False},
            'anonymous': {'required': False},
            'title': {'allow_blank': True},
            'content': {'allow_blank': True},
        }
