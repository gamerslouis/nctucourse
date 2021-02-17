from rest_framework import serializers
from .models import TrialSimulationData


class TrialSimulationDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrialSimulationData
        exclude = ('user',)
