from . import accounts
from . import courses
from . import gpa

def setup_app(app):
    app.register_blueprint(accounts.blueprint, url_prefix='/api/accounts')
    app.register_blueprint(courses.blueprint, url_prefix='/api/courses')
    app.register_blueprint(gpa.blueprint, url_prefix='/api/gpa')