from django import forms
from django.forms.fields import Field, FileField
from django.core.exceptions import ValidationError
from django.forms.utils import ErrorDict
from django.core.exceptions import NON_FIELD_ERRORS


class APIForm(forms.Form):
    def full_clean(self):
        """
        Clean all of self.data and populate self._errors and self.cleaned_data.
        """
        self._errors = ErrorDict()
        if not self.is_bound:  # Stop further processing.
            return
        self.cleaned_data = {}
        # If the form is permitted to be empty, and none of the form data has
        # changed from the initial data, short circuit any validation.
        if self.empty_permitted and not self.has_changed():
            return

        self._clean_fields()
        if len(self._errors) > 0:
            return

        self._clean_form()
        if len(self._errors) > 0:
            return

        self._post_clean()

    def _clean_fields(self):
        for name, field in self.fields.items():
            self._clean_field(name, field)

    def _clean_field(self, name, field):
        # value_from_datadict() gets the data from the data dictionaries.
        # Each widget type knows how to retrieve its own data, because some
        # widgets split data over several HTML fields.
        if field.disabled:
            value = self.get_initial_for_field(field, name)
        else:
            value = field.widget.value_from_datadict(self.data, self.files, self.add_prefix(name))
        if value is None and field.required:
            value = self.get_initial_for_field(field, name)

        try:
            if isinstance(field, FileField):
                initial = self.get_initial_for_field(field, name)
                value = field.clean(value, initial)
            else:
                value = field.clean(value)

            self.cleaned_data[name] = value
            if hasattr(self, 'clean_%s' % name):
                value = getattr(self, 'clean_%s' % name)()
                self.cleaned_data[name] = value
        except ValidationError as e:
            self.add_error(name, e)

    def get_initial_for_field(self, field, field_name):
        """
        Return initial data for field on form. Use initial data from the form
        or the field, in that order. Evaluate callable values.
        """
        value = self.initial.get(field_name, field.initial)
        if value is None:
            vale = field.initial
        if callable(value):
            value = value()
        return value

    def add_prefix(self, field_name):
        field = self.fields[field_name]
        if field.label is not None:
            return field.label
        return field_name

    def _post_clean(self):
        if hasattr(self, 'name_map'):
            self.cleaned_data = {
                self.name_map[k] if k in self.name_map else k: v
                for k, v in self.cleaned_data.items()
            }

    def get_errors(self):
        errors = {}
        for name, value in self._errors.items():
            if name != NON_FIELD_ERRORS:
                errors[self.add_prefix(name)] = value
            else:
                errors[NON_FIELD_ERRORS] = value
        return errors


class FormField(forms.Field):
    def __init__(self, form, form_kwargs, **kwargs):
        super().__init__(**kwargs)
        self.form = form
        self.form_kwargs = form_kwargs

    def to_python(self, value):
        return self.form(value, **self.form_kwargs)

    def validate(self, value):
        super().validate(value)

        if not value.is_valid():
            raise ValidationError('form validation fail')


class ListField(forms.Field):
    def __init__(self, field, **kwargs):
        super().__init__(**kwargs)
        self.field = field

    def to_python(self, value):
        return [self.field.to_python(ele) for ele in value]

    def validate(self, value):
        for ele in value:
            self.field.validate(ele)
