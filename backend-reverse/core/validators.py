from django.core.validators import RegexValidator
from django.utils.translation import ugettext_lazy as _
import re

english_name_validator = RegexValidator("^[a-z ,.'-]+$",
                                        message=_("This is not a valid english name"),
                                        flags=re.UNICODE | re.IGNORECASE)
chinese_name_validator = RegexValidator("^[\u4E00-\u9FFF]+$",
                                        message=_("This is not a valid chinese name"),
                                        flags=re.UNICODE)
