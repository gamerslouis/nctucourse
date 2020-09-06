from flask_login import LoginManager
from models.User import User

login_manager = LoginManager()


def setup_app(app):
    login_manager.init_app(app)


@login_manager.user_loader
def load_user(user_id):
    if user_id == 'None':
        return None
    return User.query.get(int(user_id))
