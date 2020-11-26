import os
from flask import Flask, send_from_directory, request, jsonify
from flask_login import LoginManager
import models
from models.User import User
import views
from configs import setup_config, load_sql_config


app = Flask(__name__, static_folder='build')
setup_config(app)
db = models.setup_app(app)
if app.config['PRODUCTION_ENV']:
    load_sql_config(app, db)

login_manager = LoginManager()
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    if user_id == 'None':
        return None
    return User.query.get(int(user_id))

views.setup_app(app)


@app.route("/")
def serve():
    """serves React App"""
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path:path>")
def static_proxy(path):
    """static folder serve"""
    file_name = path.split("/")[-1]
    dir_name = os.path.join(app.static_folder, "/".join(path.split("/")[:-1]))
    return send_from_directory(dir_name, file_name)


@app.errorhandler(404)
def handle_404(e):
    if request.path.startswith("/api/"):
        return jsonify(message="Resource not found"), 404
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    import code
    with app.app_context():
        code.interact(local=locals())
