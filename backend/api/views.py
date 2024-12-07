from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from .models import Team, Game, Matches, MatchStatistics, Screenshot, Player
from .serializers import TeamRegistrationSerializer, GameSerializer, MatchSerializer, MatchStatisticsSerializer, ScreenshotSerializer
import uuid
from datetime import datetime
import base64

# Create your views here.

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"})

@api_view(['POST'])
def register(request):
    print("Received registration data:", request.data)  # Debug print
    serializer = TeamRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            team = serializer.save()
            return Response({
                'message': 'Registration successful',
                'team_id': team.team_id
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Registration error:", str(e))  # Debug print
            return Response({
                'error': str(e),
                'type': type(e).__name__
            }, status=status.HTTP_400_BAD_REQUEST)
    print("Serializer errors:", serializer.errors)  # Debug print
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        team = Team.objects.get(email=email)
        if check_password(password, team.password_hash):
            return Response({
                'message': 'Login successful',
                'team_id': team.team_id
            })
        else:
            return Response({'error': 'Invalid credentials'}, 
                          status=status.HTTP_401_UNAUTHORIZED)
    except Team.DoesNotExist:
        return Response({'error': 'Team not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def test_db(request):
    try:
        # Print all users for debugging
        all_users = Team.objects.all().values()
        print("All users in database:", all_users)
        
        # Try to get the specific test user
        test_user = Team.objects.get(team_name='fpv')
        return Response({
            'message': 'Database connection successful',
            'user_found': {
                'team_name': test_user.team_name,
                'email': test_user.email
            }
        })
    except Team.DoesNotExist:
        return Response({
            "error": "Test user not found",
            "details": "Could not find user with team name 'will'"
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            "error": str(e),
            "type": type(e).__name__
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_games(request):
    try:
        games = Game.objects.all()
        serializer = GameSerializer(games, many=True)
        return Response(serializer.data)
    except Exception as e:
        print("Error fetching games:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def create_match(request):
    try:
        print("Received data:", request.data)
        team_id = request.data.get('team_id')
        game_title = request.data.get('game_title')
        screenshots = request.data.get('screenshots', [])
        player_stats = request.data.get('player_stats', [])
        
        if not team_id:
            return Response(
                {'error': 'You must be logged in to create a match'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            
        try:
            team = Team.objects.get(team_id=team_id)
        except Team.DoesNotExist:
            return Response(
                {'error': 'Invalid team ID'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        # Get or create the game
        try:
            game = Game.objects.get(title=game_title)
        except Game.DoesNotExist:
            game = Game.objects.create(
                game_id=str(uuid.uuid4()),
                title=game_title,
                genre='Unknown'
            )
            
        match_id = str(uuid.uuid4())
        
        # Create match data with game instance
        match_data = {
            'match_id': match_id,
            'team': team,
            'game': game,
            'match_name': request.data.get('match_name'),
            'match_date': request.data.get('match_date'),
            'match_time': request.data.get('match_time')
        }
        
        # Save match first
        match = Matches.objects.create(**match_data)
        
        # Save player statistics
        for stat in player_stats:
            try:
                player = Player.objects.get(ign=stat['player_ign'])
            except Player.DoesNotExist:
                # Create player if doesn't exist
                player = Player.objects.create(
                    ign=stat['player_ign'],
                    team=team
                )
            
            MatchStatistics.objects.create(
                match=match,
                player=player,
                team_score=request.data.get('team_score'),
                enemy_score=request.data.get('enemy_score'),
                result=request.data.get('result'),
                first_blood=stat.get('first_blood', False),
                kills=stat.get('kills', 0),
                deaths=stat.get('deaths', 0),
                assists=stat.get('assists', 0),
                playtime=stat.get('playtime', '00:00')
            )
        
        # Save screenshots
        for screenshot in screenshots:
            if 'data' in screenshot:
                try:
                    # Convert base64 to binary
                    screenshot_data = base64.b64decode(screenshot['data'])
                    Screenshot.objects.create(
                        screenshot_id=str(uuid.uuid4()),
                        match=match,
                        screenshot_data=screenshot_data,
                        note=screenshot.get('note', '')
                    )
                except Exception as e:
                    print(f"Error saving screenshot: {str(e)}")
                    continue
        
        return Response({'match_id': match_id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error creating match:", str(e))
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_match(request, match_id):
    """Get match details including statistics and screenshots"""
    try:
        match = Matches.objects.select_related('game').get(match_id=match_id)
        
        # Serialize match data
        match_data = {
            'match_id': match.match_id,
            'match_date': match.match_date,
            'match_time': match.match_time,
            'match_name': match.match_name,
            'game': {
                'game_id': match.game.game_id,
                'title': match.game.title
            }
        }
        
        # Get match statistics
        stats = MatchStatistics.objects.filter(match=match).select_related('player')
        stats_data = []
        for stat in stats:
            stats_data.append({
                'Player_IGN': stat.player.ign,
                'Kills': stat.kills,
                'Deaths': stat.deaths,
                'Assists': stat.assists,
                'First_Blood': 1 if stat.first_blood else 0,
                'Score': stat.team_score,
                'Wins': 1 if stat.result.upper() == 'WIN' else 0,
                'Losses': 1 if stat.result.upper() == 'LOSS' else 0,
                'Playtime': stat.playtime.strftime('%H:%M')
            })
        
        # Get screenshots
        screenshots = Screenshot.objects.filter(match=match)
        screenshot_data = []
        for screenshot in screenshots:
            screenshot_data.append({
                'id': screenshot.screenshot_id,
                'data': f"data:image/jpeg;base64,{base64.b64encode(screenshot.screenshot_data).decode('utf-8')}",
                'note': screenshot.note
            })
        
        # Return complete response
        return Response({
            'match': match_data,
            'statistics': stats_data,
            'screenshots': screenshot_data
        })
    except Matches.DoesNotExist:
        return Response(
            {'error': 'Match not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print("Error in get_match:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_team(request, team_id):
    try:
        print(f"Looking for team with ID: {team_id}")
        team = Team.objects.get(team_id=team_id)
        print(f"Found team: {team.team_name}")
        return Response({
            'team_id': team.team_id,
            'team_name': team.team_name,
            'email': team.email
        })
    except Team.DoesNotExist:
        print(f"Team not found with ID: {team_id}")
        # List all teams for debugging
        all_teams = Team.objects.all().values('team_id', 'team_name')
        print(f"Available teams: {list(all_teams)}")
        return Response(
            {'error': 'Team not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print(f"Error in get_team: {str(e)}")
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_team_matches(request, team_id):
    try:
        matches = Matches.objects.filter(team=team_id).order_by('-match_date', '-match_time')
        match_data = []
        
        for match in matches:
            try:
                # Get all statistics for this match
                stats = MatchStatistics.objects.filter(match=match.match_id)
                
                # Aggregate the statistics
                total_kills = sum(stat.kills for stat in stats)
                total_deaths = sum(stat.deaths for stat in stats)
                total_assists = sum(stat.assists for stat in stats)
                first_bloods = sum(1 for stat in stats if stat.first_blood)
                
                # Get the team score and result from any player's stats (should be same for all)
                team_stats = stats.first()
                
                match_data.append({
                    'Match_ID': match.match_id,
                    'Game_Title': match.game.title,
                    'Match_Date': match.match_date,
                    'Match_Time': match.match_time,
                    'Team_Score': team_stats.team_score if team_stats else 0,
                    'Enemy_Score': team_stats.enemy_score if team_stats else 0,
                    'Result': team_stats.result if team_stats else 'N/A',
                    'Total_Kills': total_kills,
                    'Total_Deaths': total_deaths,
                    'Total_Assists': total_assists,
                    'First_Bloods': first_bloods,
                    'Total_Playtime': team_stats.playtime if team_stats else '00:00'
                })
            except Exception as e:
                print(f"Error processing match {match.match_id}: {str(e)}")
                match_data.append({
                    'Match_ID': match.match_id,
                    'Game_Title': match.game.title,
                    'Match_Date': match.match_date,
                    'Match_Time': match.match_time,
                    'Team_Score': 0,
                    'Enemy_Score': 0,
                    'Result': 'N/A',
                    'Total_Kills': 0,
                    'Total_Deaths': 0,
                    'Total_Assists': 0,
                    'First_Bloods': 0,
                    'Total_Playtime': '00:00'
                })
        
        return Response(match_data)
    except Exception as e:
        print("Error in get_team_matches:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def get_team_data(request, team_id):
    """Get team details"""
    try:
        team = Team.objects.get(team_id=team_id)
        return Response({
            'team_id': team.team_id,
            'team_name': team.team_name,
            'email': team.email
        })
    except Team.DoesNotExist:
        return Response(
            {'error': 'Team not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print("Error in get_team_data:", str(e))
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
def update_match_statistics(request, match_id):
    """Update match statistics"""
    try:
        match = Matches.objects.get(match_id=match_id)
        updated_stats = request.data

        for stat in updated_stats:
            try:
                match_stat = MatchStatistics.objects.get(
                    match=match,
                    player__player_ign=stat['Player_IGN']
                )
                
                # Update statistics
                match_stat.team_score = stat['Score']
                match_stat.first_blood = bool(stat['First_Blood'])
                match_stat.kills = stat['Kills']
                match_stat.deaths = stat['Deaths']
                match_stat.assists = stat['Assists']
                match_stat.result = 'WIN' if stat['Wins'] > 0 else 'LOSS'
                match_stat.playtime = stat['Playtime']
                
                match_stat.save()
            except MatchStatistics.DoesNotExist:
                return Response(
                    {'error': f'Statistics not found for player {stat["Player_IGN"]}'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # Get updated statistics
        updated_match_stats = MatchStatistics.objects.filter(match=match).select_related('player')
        stats_data = []
        for stat in updated_match_stats:
            stats_data.append({
                'Player_IGN': stat.player.player_ign,
                'Kills': stat.kills,
                'Deaths': stat.deaths,
                'Assists': stat.assists,
                'First_Blood': 1 if stat.first_blood else 0,
                'Score': stat.team_score,
                'Wins': 1 if stat.result.upper() == 'WIN' else 0,
                'Losses': 1 if stat.result.upper() == 'LOSS' else 0,
                'Playtime': stat.playtime.strftime('%H:%M')
            })

        return Response({'statistics': stats_data})

    except Matches.DoesNotExist:
        return Response(
            {'error': 'Match not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        print("Error in update_match_statistics:", str(e))
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
