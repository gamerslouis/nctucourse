import json

from django.conf import settings
from django.contrib.auth import get_user_model, login
from django.utils.deprecation import MiddlewareMixin

class TestAccountLoginMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if int(settings.TEST_AUTH_USER_ID) != -1:
            user = get_user_model().objects.get(pk=settings.TEST_AUTH_USER_ID)
            login(request, user, 'django.contrib.auth.backends.ModelBackend')
