from .default import Configs as _Configs
import os

class Configs(_Configs):
    DEBUG = True
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_DATABASE_URI =  os.environ.get('SQLALCHEMY_DATABASE_URI')
    NCTU_OAUTH_CLIENT_ID =  os.environ.get('NCTU_OAUTH_CLIENT_ID')
    NCTU_OAUTH_CLIENT_SECRET =  os.environ.get('NCTU_OAUTH_CLIENT_SECRET')
    NCTU_OAUTH_REDIRECT_URL = 'http://127.0.0.1/api/accounts/login'
    SEMESTER = '1091'
    COURSE_FILE_ROOT = 'http://127.0.0.1:8000/'
