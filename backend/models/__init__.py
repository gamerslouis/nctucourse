from .base import db
from . import User
from . import Setting


def setup_app(app):
    db.init_app(app)
    return db
