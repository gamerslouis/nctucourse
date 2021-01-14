from django.urls import path, include
from . import views

urlpatterns = [
    path('csrf_token/', views.CSRFView.as_view()),
    path('bulletins/', views.BulletinView.as_view()),
]
