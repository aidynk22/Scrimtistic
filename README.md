# Scrimtistic
**Scrimtistic** is a Varsity Scrimmage Data Viewer and Logger that provides users with a platform to track, analyze, and visualize competitive match data. This application helps teams and analysts manage and review scrimmage statistics effectively.

## Project Structure
* `backend/`: Django-based REST API
  - `api/`: Contains the core API implementation
  - `scrimtistic/`: Django project settings and configuration
  
* `frontend/`: React-based web application
  - `src/`: Source code directory
    - `components/`: Reusable React components
    - `pages/`: Individual page components
    - `api/`: API integration utilities
    - `styles/`: CSS stylesheets

## How to Run
1. Backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

3. Frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Environment Variables
### Backend
Create a `.env` file in the `backend/` directory:
```
DEBUG=True
SECRET_KEY=your_secret_key
DB_NAME=your_database_name
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1
```
### Frontend
Create a `.env` file in the `frontend/` directory:
```
REACT_APP_API_URL=http://localhost:8000/api
```

## Features
- User authentication (login/register)
- Match data management
- Statistical analysis
- Match history viewing
- Real-time data updates
- Interactive data visualization

## Dependencies
### Backend
- Django
- Django REST Framework
- Python 3.x
- MySQL Client
- mysqlclient (Python MySQL connector)

### Frontend
- React
- React Router
- Axios
- Node.js >= 14.x

## Development
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## Authors
- Aidyn Kittrell
- Calvin Kwok
- William Zheng

## Acknowledgments
- Thanks to all contributors
- Inspired by the need for better scrimmage data management




