from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.LoginRedirectNCTUOauthView.as_view(), name="login"),
    path('logout/', views.logout, name="logout"),
    path('me/', views.MeView.as_view()),
    path('courses_history/', views.CoursesHistoryView.as_view()),
]
