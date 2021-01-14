import requests
from functools import wraps
from django.conf import settings


def retry(times=3, exception=None, validator=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            _times = times
            while _times > 0:
                _times -= 1
                try:
                    res = func(*args, **kwargs)
                    if validator is not None and not validator(res):
                        continue
                    return res
                except Exception as e:
                    if exception is not None and not isinstance(e, exception):
                        raise e
        return wrapper
    return decorator


def get_oauth_url():
    return "https://id.nctu.edu.tw/o/authorize/?client_id={}&response_type=code&scope=profile".format(
        settings.NCTU_OAUTH_CLIENT_ID
    )


@retry()
def auth_step1(code):
    data = {'grant_type': 'authorization_code',
            'code': code,
            'client_id': settings.NCTU_OAUTH_CLIENT_ID,
            'client_secret': settings.NCTU_OAUTH_CLIENT_SECRET,
            'redirect_uri': settings.NCTU_OAUTH_REDIRECT_URL}
    res = requests.post('https://id.nctu.edu.tw/o/token/', data=data)

    return res.json()['access_token']


@retry()
def auth_step2(token):
    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }
    res = requests.get('https://id.nctu.edu.tw/api/profile/', headers=headers)
    assert 'username' in res.json()
    return res.json()
