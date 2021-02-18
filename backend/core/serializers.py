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


class RelatedFieldAlternative(serializers.PrimaryKeyRelatedField):
    def __init__(self, **kwargs):
        self.serializer = kwargs.pop('serializer', None)
        if self.serializer is not None and not issubclass(self.serializer, serializers.Serializer):
            raise TypeError('"serializer" is not a valid serializer class')

        super().__init__(**kwargs)

    def use_pk_only_optimization(self):
        return False if self.serializer else True

    def to_representation(self, instance):
        if self.serializer:
            return self.serializer(instance, context=self.context).data
        return super().to_representation(instance)