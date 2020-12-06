import requests 
from flask import current_app
from .utils import retry

def get_oauth_url():
    return "https://id.nctu.edu.tw/o/authorize/?client_id={}&response_type=code&scope=profile".format(
        current_app.config['NCTU_OAUTH_CLIENT_ID']
    )

@retry()
def auth_step1(code):
    data = {'grant_type':'authorization_code',
            'code':code, 
            'client_id':current_app.config['NCTU_OAUTH_CLIENT_ID'],
            'client_secret':current_app.config['NCTU_OAUTH_CLIENT_SECRET'], 
            'redirect_uri':current_app.config['NCTU_OAUTH_REDIRECT_URL']}
    res = requests.post('https://id.nctu.edu.tw/o/token/', data=data)

    return res.json()['access_token']

@retry()
def auth_step2(token):    
    headers={
        'Authorization' :'Bearer {}'.format(token)
    }
    res = requests.get('https://id.nctu.edu.tw/api/profile/', headers=headers)
    assert 'username' in res.json()
    return res.json()

