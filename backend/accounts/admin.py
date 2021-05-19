from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User, Group
from django.contrib.auth import login
from django.urls import path, reverse
from django.utils.html import format_html
from django import http
from django.conf import settings

from . import models

# Register your models here.


class UserAdmin(UserAdmin):
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'account_actions')

    def process_login(self, request, account_id, *args, **kwargs):
        user = User.objects.get(pk=account_id)
        login(request, user)
        return http.HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)

    def get_urls(self):
        return [
            path(
                '<account_id>/login/',
                self.admin_site.admin_view(self.process_login),
                name='auth_user_login',
            ),
        ] + super().get_urls()

    def account_actions(self, obj):
        return format_html(
            '<a class="button" href="{}">Login</a>',
            reverse('admin:auth_user_login', kwargs={'account_id': obj.pk}),
        )


@admin.register(models.CoursesHistory)
class CoursesHistoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    search_fields = ('user__username',)

@admin.register(models.TrialSimulationData)
class TrialSimulationDataAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    search_fields = ('user__username',)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.unregister(Group)
admin.site.register(User, UserAdmin)