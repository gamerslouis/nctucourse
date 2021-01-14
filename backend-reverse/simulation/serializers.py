from rest_framework import serializers


class CourseCollectSerializer(serializers.Serializer):
    course_id = serializers.CharField()
    visible = serializers.BooleanField()
