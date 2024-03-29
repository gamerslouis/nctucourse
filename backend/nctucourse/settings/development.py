from .base import *
from corsheaders.defaults import default_headers

DEBUG = True

MIDDLEWARE.remove('django.middleware.csrf.CsrfViewMiddleware')
MIDDLEWARE.insert(0, 'corsheaders.middleware.CorsMiddleware')
MIDDLEWARE.insert(10, 'utils.middleware.TestAccountLoginMiddleware')

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = None
ALLOWED_HOSTS = ['*']
CORS_ALLOW_HEADERS = list(default_headers) + [
    'x-xsrf-token',
]

SOCIAL_AUTH_LOGIN_REDIRECT_URL = 'http://127.0.0.1:3000/'
LOGIN_REDIRECT_URL = 'http://127.0.0.1:3000/'
LOGIN_FAIL_REDIRECT_URL = 'http://127.0.0.1:3000/?fail=1'
LOGOUT_REDIRECT_URL = 'http://127.0.0.1:3000/'
NCTU_OAUTH_REDIRECT_URL = 'http://127.0.0.1:8000/api/accounts/login'
NYCU_OAUTH_REDIRECT_URL = 'http://127.0.0.1:8000/api/accounts/login/nycu'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'] = (
    'utils.authentication.CsrfExemptSessionAuthentication',
    'rest_framework.authentication.BasicAuthentication'
)

TEST_AUTH_USER_ID = os.environ.get('TEST_AUTH_USER_ID', -1)
