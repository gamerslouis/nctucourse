from flask_login import current_user, login_required
from flask_restful import reqparse, marshal_with, Resource, Api, fields
from flask import Blueprint, request, Response, redirect, current_app, jsonify
from models.User import UserCollect
from models.Setting import SemesterMapping
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

    @login_required
    @marshal_with(resource_fileds)
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('sem', default=current_app.config['SEMESTER'])
        args = parser.parse_args()
        courses = UserCollect.query.filter_by(
            uid=current_user.id, sem=args['sem']).all()
        return {'courses': courses}

    @login_required
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

    @login_required
    def delete(self):
        parser = reqparse.RequestParser()
        parser.add_argument('courseId')
        args = parser.parse_args()
        course = UserCollect.query.filter_by(uid=current_user.id, courseId=args['courseId']).first()
        if course is not None:
            db.session.delete(course)
            db.session.commit()
        return '', 200

    @login_required
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
@login_required
def clear_user_courses():
    parser = reqparse.RequestParser()
    parser.add_argument('sem', default=current_app.config['SEMESTER'])
    args = parser.parse_args()
    courses = UserCollect.query.filter_by(
        uid=current_user.id, sem=args['sem']).delete()
    db.session.commit()
    return ''


@blueprint.route('/all')
@login_required
def provide_all_courses():
    parser = reqparse.RequestParser()
    parser.add_argument('sem', default=current_app.config['SEMESTER'])
    args = parser.parse_args()
    file = SemesterMapping.query.filter_by(
        sem=args['sem']
    ).first().file
    return jsonify({
        'sem': args['sem'],
        'url': current_app.config['COURSE_FILE_ROOT'] + file
    })


api.add_resource(User, '/user')
