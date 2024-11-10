from django.urls import path
from . import views

urlpatterns = [
    path('health-check/', views.health_check, name='health-check'),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('test-db/', views.test_db, name='test-db'),
] 