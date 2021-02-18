from django.urls import path, include
from rest_framework import routers

from . import views

urlpatterns = [
    path('semesters/', views.SupportSemesterView.as_view()),
]

router = routers.SimpleRouter()
router.register('courses', views.CourseViewSet)
router.register('feedbacks/my', views.MyFeedBackViewSet)
router.register('feedbacks', views.FeedBackViewSet)
print(router.urls)
urlpatterns += router.urls
