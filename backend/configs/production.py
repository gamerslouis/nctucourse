from .default import Configs as _Configs
from google.cloud import ndb

class Setting(ndb.Model):
    name = ndb.StringProperty()
    value = ndb.StringProperty()


class NDBConfigLoader(type):
    def __new__(mcls, name, base, attribs):
        client = ndb.Client()
        with client.context():
            for s in Setting.query():
                attribs[s.name] = s.value
        return super().__new__(mcls, name, base, attribs)


class Configs(_Configs, metaclass=NDBConfigLoader):
    pass
