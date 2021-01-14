from django.urls import path, include
from . import views

urlpatterns = [
    path('user/', views.UserCourseCollectView.as_view()),
    path('user/clear/', views.ClearUserCoursesView.as_view()),
    path('all/', views.AllCoursesUrlView.as_view()),
]
