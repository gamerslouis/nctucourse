from functools import wraps
from flask import current_app
from flask_login import login_required, current_user


def superuser_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        if current_app.config.get('SUPERUSER_DISABLED'):
            return func(*args, **kwargs)
        elif not current_user.is_superuser:
            return current_app.login_manager.unauthorized()
        return func(*args, **kwargs)
    return login_required(decorated_view)
