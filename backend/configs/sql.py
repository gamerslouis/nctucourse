from models.Setting import Setting


def load_sql_config(app, db):
    with app.app_context():
        settings = Setting.query.all()
        for setting in settings:
            app.config[setting.key] = setting.value
