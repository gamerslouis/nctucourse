from .base import *
from .log import *

DEBUG = False

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

NCTU_OAUTH_REDIRECT_URL = 'https://' + os.environ.get('HOST_NAME', '127.0.0.1') + '/api/accounts/login'
NYCU_OAUTH_REDIRECT_URL = 'https://' + os.environ.get('HOST_NAME', '127.0.0.1') + '/api/accounts/login/nycu'

SOCIAL_AUTH_REDIRECT_IS_HTTPS = True