from django.urls import path, include
from . import views

urlpatterns = [
    path('login/', views.LoginRedirectNCTUOauthView.as_view(_type="nctu"), name="login"),
    path('login/nycu/', views.LoginRedirectNCTUOauthView.as_view(_type="nycu")),
    path('logout/', views.logout, name="logout"),
    path('me/', views.MeView.as_view()),
    path('setnickname/',views.ChangeNicknameView.as_view()),
    path('courses_history/', views.CoursesHistoryView.as_view()),
    path('sim_data', views.GetTrailSimView.as_view()),
    path('sim_confirm', views.TrialComfirmView.as_view()),
    path('sim_imported', views.GetTrialCoursesView.as_view()),
    path('sim_update', views.UpdateTrailSimView.as_view()),
]
