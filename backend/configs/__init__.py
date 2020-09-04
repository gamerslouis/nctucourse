import os
from .sql import load_sql_config
if os.environ.get('PRODUCTION_ENV', False):
    from .production import Configs
else:
    from .devlopment import Configs

def setup_config(app):
    app.config['PRODUCTION_ENV'] = bool(os.environ.get('PRODUCTION_ENV', False))
    app.config.from_object(Configs)
