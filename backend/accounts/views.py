from django.views.generic import View
from django import http
from django.conf import settings
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ImproperlyConfigured, PermissionDenied, ObjectDoesNotExist

from . import nctu_auth
from . import models
from . import serializers
# Create your views here.


class LoginRedirectNCTUOauthView(View):
    _type = "nctu"
    def __init__(self, _type, **kwargs):
        super().__init__(**kwargs)
        self._type = _type

    def get(self, request):
        code = request.GET.get('code', '*')
        if code != '*':
            return oauth_login(request, code, self._type)

        if request.user.is_authenticated:
            return http.HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
        else:
            return http.HttpResponseRedirect(nctu_auth.get_oauth_url(self._type))


def oauth_login(request, code, _type):
    token = nctu_auth.auth_step1(code, _type)
    data = nctu_auth.auth_step2(token, _type)

    try:
        user = User.objects.get(username=data['username'])
        user.email = data['email']
        user.save()
    except ObjectDoesNotExist:
        user = User.objects.create_user(data['username'], data['email'], '')

    if user is not None and user.is_active:
        auth.login(request, user,
                   backend='django.contrib.auth.backends.ModelBackend')
        return http.HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
    else:
        return http.HttpResponseRedirect(settings.LOGIN_FAIL_REDIRECT_URL)


def logout(request):
    auth.logout(request)
    return http.HttpResponseRedirect(settings.LOGOUT_REDIRECT_URL)


class MeView(View):
    def get(self, request):
        if request.user.is_anonymous:
            return http.JsonResponse({
                'is_anonymous': True,
                'username': '',
                'email': ''
            })
        else:
            return http.JsonResponse(
                serializers.UserSerializer(instance=request.user).data
            )


class CoursesHistoryView(LoginRequiredMixin, View):
    def get(self, request):
        history, created = models.CoursesHistory.objects.get_or_create(
            user=request.user,
            defaults={'data': '[]'}
        )

        return http.JsonResponse({
            'data': history.data,
            'last_updated_time': history.last_updated_time
        })

    def post(self, request):
        data = request.JSON.get('data', None)
        if data is None:
            return http.HttpResponseBadRequest()
        if len(data) > 20000:
            return http.HttpResponse(status=413)
        history, created = models.CoursesHistory.objects.get_or_create(
            user=request.user,
            defaults={'data': ''}
        )
        history.data = data
        history.save()
        return http.HttpResponse(status=200)


class TrailSimView(LoginRequiredMixin, View):
    def get(self, request):
        if self.request.user.trialsimulationdata_set.count() == 0:
            return http.JsonResponse({
                'success': False,
                'data': '',
                'last_updated_time': ''
            })
        data = self.request.user.trialsimulationdata_set.first()
        return http.JsonResponse({
            'success': True,
            'data': data.data,
            'last_updated_time': data.last_updated_time if data.last_updated_time is not None else ""
        })

    def post(self, request):
        if self.request.user.trialsimulationdata_set.count() == 0:
            return http.HttpResponseNotFound()
        s = serializers.TrialSimulationDataSerializer(data=request.JSON,
                                                      instance=self.request.user.trialsimulationdata_set.first())
        if not s.is_valid():
            return http.HttpResponseBadRequest()
        s.save()
        return http.HttpResponse(status=204)


class TrialComfirmView(LoginRequiredMixin, View):
    def post(self, request):
        if self.request.user.trialsimulationdata_set.count() == 0:
            ins = models.TrialSimulationData(
                user=request.user
            )
            ins.save()
        return http.HttpResponse(status=204)


class GetTrialCoursesView(LoginRequiredMixin, View):
    def get(self, request):
        if self.request.user.trialsimulationdata_set.count() == 0:
            return http.JsonResponse({
                'success': False,
                'imported': '',
            })
        data = self.request.user.trialsimulationdata_set.first()
        return http.JsonResponse({
            'success': True,
            'imported_courses': data.imported_courses
        })


class ChangeNicknameView(LoginRequiredMixin, View):
    def post(self, request):
        nickname = request.JSON.get('nickname', None)
        if nickname is not None:
            profile = request.user.profile
            profile.nickname = nickname
            profile.save()
        return http.HttpResponse()
        