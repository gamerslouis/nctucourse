from django.urls import path, include
from rest_framework import routers

from . import views

urlpatterns = [
    path('semesters/', views.SupportSemesterView.as_view()),
]

router = routers.SimpleRouter()
router.register('', views.CourseViewSet)
router.register('feedbacks/my', views.MyFeedBackViewSet)
router.register('feedbacks', views.FeedBackViewSet)
urlpatterns += router.urls
