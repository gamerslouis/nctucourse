from .default import Configs as _Configs
from dotenv import dotenv_values

class DotenvConfigLoader(type):
    def __new__(mcls, name, base, attribs):
        attribs.update(dotenv_values())
        return super().__new__(mcls, name, base, attribs)

class Configs(_Configs, metaclass=DotenvConfigLoader):
    pass