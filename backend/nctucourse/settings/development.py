from .base import *

DEBUG = True

MIDDLEWARE.remove('django.middleware.csrf.CsrfViewMiddleware')

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', 'testserver'] # <-加入'testserver'

NCTU_OAUTH_REDIRECT_URL = 'http://127.0.0.1/api/accounts/login'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}