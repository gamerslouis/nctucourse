from django.views.generic import View
from django import http
from django.conf import settings
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ImproperlyConfigured, PermissionDenied, ObjectDoesNotExist

from . import nctu_auth
from . import models
# Create your views here.


class LoginRedirectNCTUOauthView(View):
    def get(self, request):
        code = request.GET.get('code', '*')
        if code != '*':
            return nctu_login(request, code)

        if request.user.is_authenticated:
            return http.HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
        else:
            return http.HttpResponseRedirect(nctu_auth.get_oauth_url())


def nctu_login(request, code):
    token = nctu_auth.auth_step1(code)
    data = nctu_auth.auth_step2(token)

    try:
        user = User.objects.get(username=data['username'])
        user.email = data['email']
        user.save()
    except ObjectDoesNotExist:
        user = User.objects.create_user(data['username'], data['email'], '')

    if user is not None and user.is_active:
        auth.login(request, user)
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
            return http.JsonResponse({
                'is_anonymous': False,
                'username': request.user.username,
                'email': request.user.email
            })


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
