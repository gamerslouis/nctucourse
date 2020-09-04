from .base import db
from flask_login import UserMixin
import datetime


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    created_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    last_login_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    is_superuser = db.Column(db.Boolean, nullable=False)


class UserCollect(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    courseId = db.Column(db.String(20), nullable=False)
    sem = db.Column(db.String(5), nullable=False)
    visible = db.Column(db.Boolean, nullable=False)
    __table_args__ = (
        db.UniqueConstraint('uid', 'courseId'),
    )


class UserCourseHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    data = db.Column(db.Text, default='')
    last_update_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
