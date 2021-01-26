from rest_framework import serializers
from collections import OrderedDict


class BulletinSerializer(serializers.Serializer):
    title = serializers.CharField()
    content = serializers.CharField()
    timestamp = serializers.DateTimeField(source='last_updated_time', format='%y/%m/%d')
    type = serializers.IntegerField(source='category')
    priority = serializers.IntegerField()
    
    def to_representation(self, instance):
        result = super().to_representation(instance)
        return OrderedDict([(key, result[key]) for key in result if result[key] != ''])

