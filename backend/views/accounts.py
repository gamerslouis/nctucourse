from flask_login import login_user, logout_user, current_user
from flask_restful import reqparse, marshal_with, Resource, Api, fields
from flask import Blueprint, request, Response, redirect
import datetime
from utilities.auth import superuser_required
from utilities import nctu_auth
from models.User import User
from models.base import db

blueprint = Blueprint('accounts', __name__)
api = Api(blueprint)


@blueprint.route('/hackLogin')
@superuser_required
def hack_login():
    user = User.query.filter_by(username=request.args.get('username')).first()
    if user is not None:
        login_user(user)
        return '', 200
    else:
        return 'User not found', 200


@blueprint.route('/login')
def login():
    code = request.args.get('code', default='*', type=str)
    if code == '*':
        return redirect(nctu_auth.get_oauth_url())
    else:
        token = nctu_auth.auth_step1(code)
        data = nctu_auth.auth_step2(token)
        user = User.query.filter_by(username=data['username']).first()
        if user is None:
            user = User(**data)
            db.session.add(user)
        user.last_login_date = datetime.datetime.utcnow()
        db.session.commit()
        login_user(user)
        return redirect('/course')


@blueprint.route('/logout')
def logout():
    logout_user()
    return redirect('/')


class Me(Resource):
    resource_fields = {
        'username':   fields.String,
        'is_anonymous': fields.Boolean,
        'email': fields.String
    }

    @marshal_with(resource_fields)
    def get(self, **kwargs):
        current_user.last_login_date = datetime.datetime.utcnow()
        db.session.commit()
        return current_user


api.add_resource(Me, '/me')
