from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django import http

from . import models, serializers

# Create your views here.


class CSRFView(View):
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        return HttpResponse(status=200)


class BulletinView(View):
    def get(self, request):
        bulletins = models.Bulletin.objects.all()
        return http.JsonResponse({
            'bulletins': serializers.BulletinSerializer(bulletins, many=True).data
        })
