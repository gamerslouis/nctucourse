from rest_framework import serializers
from django.contrib.auth.models import User
from social_django.models import UserSocialAuth
from .models import TrialSimulationData


class TrialSimulationDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrialSimulationData
        exclude = ('user',)


class SocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSocialAuth
        fields = ('id', 'uid')


class UserSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source='profile.nickname')
    social = SocialSerializer(source='social_auth', many=True)

    class Meta:
        model = User
        fields = ('is_anonymous', 'username', 'email', 'social', 'nickname')
