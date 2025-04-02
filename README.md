# Voyaroute - Travel Itinerary Application

Voyaroute is a full-stack travel itinerary application designed to help travelers plan, organize, and manage their trips efficiently. Built with Django (backend) and React (frontend), Voyaroute provides a seamless experience for itinerary creation and customization.

---

## Features

### Backend (Django)
- User authentication (signup, login, logout).
- CRUD operations for itineraries.
- API endpoints for managing user profiles and itineraries.
- Token-based authentication using Django REST Framework (DRF).
- Custom serializers for user and itinerary management.

### Frontend (React)
- User-friendly interface for managing itineraries.
- Form validation for creating and editing itineraries.
- Integration with backend APIs for fetching and updating data.
- Responsive design using Tailwind CSS.
- Error handling and loading states for better user experience.
- **Custom Layouts** for itinerary visualization.

---

## Custom Layouts for Itineraries

Voyaroute offers multiple layout options for users to visualize their itineraries in a personalized way.

### 1. **List View**
- Displays the itinerary in a structured, easy-to-read list format.
- Each item includes time, location, activity, and notes.

### 2. **Timeline View**
- Presents a chronological sequence of planned events.
- Interactive UI elements allow users to adjust the schedule easily.

### 3. **Grid View**
- Organizes the itinerary into a compact grid format for quick access.
- Ideal for short trips with multiple activities per day.

### 4. **Map View**
- Users can see routes, distances, and nearby attractions.

### 5. **Day-by-Day View**
- Each day’s schedule is displayed in an expanded format.


---

## Project Structure

### Backend
- **`server/apps/user`**: Handles user authentication, profile management, and password updates.
- **`server/apps/itinerary`**: Manages itineraries, including CRUD operations and itinerary generation.
- **`server/settings.py`**: Contains project settings, including database configuration and installed apps.

### Frontend
- **`src/components/itinerary`**: Contains React components for itinerary management (e.g., `ItineraryForm`, `ItineraryList`).
- **`src/hooks`**: Custom React hooks for interacting with backend APIs (e.g., `useItinerary`).
- **`src/services`**: Contains API service files (e.g., `auth.js` for authentication).
- **`src/pages`**: Contains page-level components (e.g., `MyItinerariesPage`).
- **`src/layouts`**: Custom layouts for itinerary display (e.g., `ListView`, `TimelineView`, `MapView`).

---

## Prerequisites

### Backend
- Python 3.8+
- Django 4.x
- MySQL or SQLite (configured in `settings.py`)

### Frontend
- Node.js 16+
- npm or yarn

---

## Setup Instructions

### Backend

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/voyaroute.git
   cd voyaroute/server
   ```

2. **Set Up a Virtual Environment**:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure the Database**:
   - Update `DATABASES` in `server/settings.py` with your database credentials.

5. **Run Migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Run the Development Server**:
   ```bash
   python manage.py runserver
   ```

7. **Access the API**:
   - Open your browser and navigate to `http://127.0.0.1:8000/api/`.

---

### Frontend

1. **Navigate to the Frontend Directory**:
   ```bash
   cd voyaroute/client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `client` directory and add the following:
     ```
     REACT_APP_API_URL=http://127.0.0.1:8000/api
     ```

4. **Run the Development Server**:
   ```bash
   npm start
   ```

5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`.

---

## API Endpoints

### User Authentication
- **POST `/api/users/signup/`**: Register a new user.
- **POST `/api/users/login/`**: Log in and obtain access/refresh tokens.
- **GET `/api/users/profile/`**: Fetch the logged-in user's profile.

### Itineraries
- **GET `/api/itineraries/`**: List all itineraries for the logged-in user.
- **POST `/api/itineraries/`**: Create a new itinerary.
- **GET `/api/itineraries/<uuid:id>/`**: Retrieve a specific itinerary.
- **PUT `/api/itineraries/<uuid:id>/`**: Update an itinerary.
- **DELETE `/api/itineraries/<uuid:id>/`**: Delete an itinerary.
- **POST `/api/itineraries/generate/`**: Generate a new itinerary.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

