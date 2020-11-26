from functools import wraps


def retry(times=3, exception=None, validator=None):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            while times > 0:
                times -= 1
                try:
                    res = func(*args, **kwargs)
                    if validator is not None and not validator(res):
                        continue
                    return res
                except Exception as e:
                    if exception is not None and not isinstance(e, exception):
                        raise e
        return wrapper
    return decorator


def not_none(v=None):
    return v is not None
