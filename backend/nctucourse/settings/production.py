from .base import *

DEBUG = False

ALLOWED_HOSTS = ['course.nctu.xyz']

NCTU_OAUTH_REDIRECT_URL = 'https://course.nctu.xyz/api/accounts/login'
NYCU_OAUTH_REDIRECT_URL = 'https://course.nctu.xyz/api/accounts/login/nycu'

SOCIAL_AUTH_REDIRECT_IS_HTTPS = True