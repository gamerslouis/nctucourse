from flask_login import current_user, login_required
from flask_restful import reqparse
from flask import Blueprint, request, Response
import datetime
from models.User import UserCourseHistory
from models.base import db
from sqlalchemy.orm.exc import NoResultFound


blueprint = Blueprint('gpa', __name__)


@blueprint.route('/me')
@login_required
def get_user_courses_history():
    uch = UserCourseHistory.query.filter_by(uid=current_user.id).first()
    return {
        'data': uch.data if uch is not None else '[]'
    }


@blueprint.route('/import', methods=['POST'])
@login_required
def import_user_courses_history():
    parser = reqparse.RequestParser()
    parser.add_argument('data', required=True, type=str)
    args = parser.parse_args()
    if len(args) > 20000:
        return '', 413
    uch = UserCourseHistory.query.filter_by(uid=current_user.id).first()
    if uch is not None:
        uch.last_update_date = datetime.datetime.utcnow()
        uch.data = args['data']
    else:
        uch = UserCourseHistory()
        uch.uid = current_user.id
        print(type(args['data']))
        uch.data = args['data']
        db.session.add(uch)
    db.session.commit()
    return '', 200
