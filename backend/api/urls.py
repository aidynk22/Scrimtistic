from django.urls import path
from . import views

urlpatterns = [
    path('matches/', views.create_match, name='create-match'),
    path('matches/<str:match_id>/', views.get_match, name='get-match'),
    path('matches/<str:match_id>/statistics/', views.update_match_statistics, name='update-match-statistics'),
    path('teams/<str:team_id>/', views.get_team, name='get-team'),
    path('teams/<str:team_id>/matches/', views.get_team_matches, name='get-team-matches'),
    path('games/', views.get_games, name='get-games'),
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
] 