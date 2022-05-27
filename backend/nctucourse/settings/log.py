import os

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        '': {  # means "root logger"
            'handlers': ['console'],  # use the above "console" handler
            'level': 'INFO',  # logging level
        }
    }
}