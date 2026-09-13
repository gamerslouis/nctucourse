from rest_framework import serializers


class CourseCollectSerializer(serializers.Serializer):
    course_id = serializers.CharField()
    visible = serializers.BooleanField()


class CustomCourseSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=60)
    teacher = serializers.CharField(max_length=60, allow_blank=True, required=False, default='')
    # Old-style time code, e.g. "3EF,4GH": each segment is a weekday 1-7
    # followed by one or more section letters. Anything else breaks the timetable.
    time = serializers.RegexField(r'^(?:[1-7][MNABCDXEFGHYIJKL]+(?:,[1-7][MNABCDXEFGHYIJKL]+)*)?$',
                                  max_length=60, allow_blank=True, required=False, default='')
    # "-" and "," are separators inside a course's time string
    room = serializers.RegexField(r'^[^,-]*$', max_length=60, allow_blank=True,
                                  required=False, default='')
    credit = serializers.FloatField(required=False, default=0)
    color = serializers.RegexField(r'^#[0-9a-fA-F]{6}$', required=False, default='#aebed1')
    visible = serializers.BooleanField(required=False, default=True)
