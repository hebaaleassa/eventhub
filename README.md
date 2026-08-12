# EventHub

Organizers can create events at venues, and users can browse events and register for them. The application supports searching and filtering events, event registration with venue-capacity checks, attendee lists, pagination, and basic venue statistics.

## Tech Stack

### Backend
- Node.js 24
- Express 5
- MongoDB 8
- Mongoose

### Frontend
- Vue 3
- Vue Router
- Vite

### Development
- Docker / Docker Compose

## Project Structure

```text
eventhub/
├── backend/
├── frontend/
├── compose.yaml
├── README.md
└── NOTES.md
```

## Requirements

Before running the application, make sure you have:

- Node.js 24+
- npm
- Docker
- Docker Compose

## 1. Start MongoDB

From the project root:

```bash
docker compose up -d
```

MongoDB will be available at:

```text
mongodb://127.0.0.1:27017
```

To confirm that the container is running:

```bash
docker compose ps
```

## 2. Backend Setup

Move to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file based on `.env.example`.

Seed the database:

```bash
npm run seed
```

Start the backend:

```bash
npm start
```

The API runs on:

```text
http://localhost:5000
```

## 3. Frontend Setup

Open another terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vue development server:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Features

The application currently supports:

- Browse events
- Search events by title and description
- Filter events by city
- Filter events by category
- View event details
- View venue and organizer information
- Select the current user using the "Logged in as" dropdown
- Register for an event
- Select the number of tickets
- Prevent duplicate registrations
- Prevent registrations that exceed venue capacity
- View event attendees
- Create new events
- Update events through the API
- Delete events and their registrations
- Pagination support in the events API
- Top venues statistics using a MongoDB aggregation pipeline

## API Endpoints

### Events

```text
GET    /api/events
GET    /api/events/:id
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

`GET /api/events` supports:

```text
q
city
category
page
size
```

Example:

```text
GET /api/events?q=tech&city=Amman&category=Technology&page=1&size=10
```

### Registrations

```text
POST /api/events/:id/register
GET  /api/events/:id/attendees
```

### Users

```text
GET /api/users
```

### Venues

```text
GET /api/venues
```

### Statistics

```text
GET /api/stats/top-venues
```

## Validation and Error Handling

The API validates incoming data and uses appropriate HTTP status codes.

Examples:

```text
400 Bad Request  - invalid input
404 Not Found    - requested resource does not exist
409 Conflict     - duplicate registration
201 Created      - resource created successfully
```

Registrations are rejected when the requested ticket count would exceed the capacity of the event's venue.

## Completed

The core requirements of the assignment are implemented, including:

- Data models and relationships
- REST API
- Vue frontend
- Search and filters
- Registration logic
- Venue-capacity checks
- Attendee lists
- Pagination
- Top-venues aggregation endpoint
- Seed data
- Dockerized MongoDB setup

## Not Implemented

The optional extra-credit features were intentionally not implemented in order to prioritize a complete and stable core application.

## Known Limitations

- Frontend styling is intentionally minimal because the focus of the assignment is functionality and application structure.
