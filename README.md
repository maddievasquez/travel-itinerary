
```markdown
# Project README

## Overview

A Django-based web application with a MySQL database and React front-end. The app allows users to manage itineraries, activities, places, and recommendations via API endpoints, utilizing Google OAuth for user authentication.

## Setup Instructions

### Prerequisites

- Python 3.x
- Django 3.x+
- MySQL
- Node.js (for React)
- Postman (for API testing)

### Back-End Setup (Django)

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Set up Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   venv\Scripts\activate  # Windows
   ```

3. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure MySQL Database:**
   Update `settings.py` with your MySQL credentials:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'your_database_name',
           'USER': 'your_mysql_user',
           'PASSWORD': 'your_mysql_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```
   ### Configure Environment Variables

Use environment variables to store sensitive data like database credentials, API keys, etc. Create a `.env` file and add variables like:

```bash
DATABASE_NAME=your_database_name
DATABASE_USER=your_mysql_user
DATABASE_PASSWORD=your_mysql_password
SECRET_KEY=your_secret_key


5. **Apply Migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Run the Server:**
   ```bash
   python manage.py runserver
   ```

   The server will be available at `http://localhost:8000/`.

### Testing API with Postman

- Test endpoints like user authentication, CRUD operations for itineraries, and activity search using Postman.
- Example POST request for user login:
  - **URL:** `http://localhost:8000/api/login/`
  - **Method:** POST
  - **Body:**
    ```json
    {
        "username": "testuser",
        "password": "password123"
    }
    ```

### Front-End Setup (React)

1. **Clone Front-End Repository:**
   ```bash
   git clone <react-repository-url>
   cd <react-project-directory>
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Run React App:**
   ```bash
   npm start
   ```

   The app will be available at `http://localhost:3000/`.

### Integration with Back-End

- Use Axios or Fetch API in React to communicate with Django endpoints.
- Implement state management (e.g., Redux or React Context) to manage user authentication and data.

## Notes

- **Security:** Includes CSRF protection and input validation.
- **Testing:** Use Postman for API testing, and write unit tests for models and views.

## Future Work

- Implement missing CRUD operations and activity search/filter.
- Complete front-end integration and deployment.
```
