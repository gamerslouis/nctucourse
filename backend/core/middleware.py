import json
from django.utils.deprecation import MiddlewareMixin
from django.http.response import HttpResponseBadRequest
from django.conf import settings


class JsonRequestMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.JSON = None
        if request.content_type == 'application/json':
            if request.body:
                try:
                    request.JSON = json.loads(request.body)
                except Exception:
                    return HttpResponseBadRequest()

            else:
                request.JSON = {}
            if 'csrfmiddlewaretoken' in request.JSON:
                request.META[settings.CSRF_HEADER_NAME] = request.JSON['csrfmiddlewaretoken']
