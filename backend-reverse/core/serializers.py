from rest_framework import serializers


class BulletinSerializer(serializers.Serializer):
    category = serializers.CharField()
    text = serializers.CharField()
    created_time = serializers.DateTimeField()
    last_updated_time = serializers.DateTimeField()
