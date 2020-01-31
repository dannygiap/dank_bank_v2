import falcon

from pathlib import Path

from backend.database_manager import DatabaseManager
from backend.backend_utils import validate_params

from google.oauth2 import id_token
from google.auth.transport import requests

CLIENT_ID = '67665061536-mh57v3d9uef3edep23kjmgeqlqrobb1b.apps.googleusercontent.com'


class GoogleOauth:
    def __init__(self, html_page: str, db: DatabaseManager):
        self.db = db

        html_path = Path(html_page).absolute()
        if not html_path.exists():
            raise FileNotFoundError(f'Could not find frontend html page "{html_page}"')

        with open(html_path, 'r') as f:
            self.html = f.read()

    def on_get(self, req, resp):
        resp.status = falcon.HTTP_OK
        resp.body = self.html

    def on_post(self, req, resp):
        if not validate_params(req.params, 'idtoken'):
            raise falcon.HTTPBadRequest('oauth post requires \'idtoken\' parameter')

        token = req.params['idtoken']
        # example from https://developers.google.com/identity/sign-in/web/backend-auth
        try:
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            userid = idinfo['sub']
            self.db.sign_in_or_create_oauth_user(userid)
        except ValueError:
            raise falcon.HTTPUnauthorized('Token not accepted')
            pass
