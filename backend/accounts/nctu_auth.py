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


def get_oauth_url(_type):
    return "https://id.{}.edu.tw/o/authorize/?client_id={}&response_type=code&scope=profile".format(
        _type, getattr(settings, _type.upper() + '_OAUTH_CLIENT_ID')
    )


@retry()
def auth_step1(code, _type):
    data = {'grant_type': 'authorization_code',
            'code': code,
            'client_id': getattr(settings, _type.upper() + '_OAUTH_CLIENT_ID'),
            'client_secret': getattr(settings, _type.upper() + '_OAUTH_CLIENT_SECRET'),
            'redirect_uri': getattr(settings, _type.upper() + '_OAUTH_REDIRECT_URL')}
    res = requests.post('https://id.{}.edu.tw/o/token/'.format(_type), data=data)
    return res.json()['access_token']


@retry()
def auth_step2(token, _type):
    headers = {
        'Authorization': 'Bearer {}'.format(token)
    }
    res = requests.get('https://id.{}.edu.tw/api/profile/'.format(_type), headers=headers)
    assert 'username' in res.json()
    return res.json()
