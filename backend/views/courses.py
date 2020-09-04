from flask_login import current_user
from flask_restful import reqparse, marshal_with, Resource, Api, fields
from flask import Blueprint, request, Response, redirect, current_app, jsonify
from models.User import UserCollect
from models.base import db
from pymysql.err import IntegrityError

blueprint = Blueprint('courses', __name__)
api = Api(blueprint)


class User(Resource):
    resource_fileds = {
        'courses': fields.List(
            fields.Nested({
                'courseId': fields.String,
                'visible': fields.Boolean
            })
        )
    }

    @marshal_with(resource_fileds)
    def get(self):
        courses = UserCollect.query.filter_by(
            uid=current_user.id, sem=current_app.config['SEMESTER']).all()
        return {'courses': courses}

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        parser.add_argument('visible', type=bool)
        args = parser.parse_args()
        course = UserCollect(uid=current_user.id, **args, sem=args['courseId'].split('_')[0])
        try:
            db.session.add(course)
            db.session.commit()
        except IntegrityError:
            pass
        return '', 201

    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        args = parser.parse_args()
        course = UserCollect.query.filter_by(uid=current_user.id, courseId=args['courseId']).first()
        if course is not None:
            db.session.delete(course)
            db.session.commit()
        return '', 200

    def put(self):
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        parser.add_argument('visible', type=bool)
        args = parser.parse_args()
        course = UserCollect.query.filter_by(uid=current_user.id, courseId=args['courseId']).first()
        course.visible = args['visible']
        db.session.commit()
        return '', 200


@blueprint.route('/user/clear')
def clear_user_courses():
    courses = UserCollect.query.filter_by(
        uid=current_user.id, sem=current_app.config['SEMESTER']).delete()
    db.session.commit()
    return ''


@blueprint.route('/all')
def provide_all_courses():
    return jsonify({
        'url': current_app.config['COURSE_FILE_ROOT'] + 'all.json'
    })


api.add_resource(User, '/user')
