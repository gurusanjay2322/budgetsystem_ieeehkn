# IEEE-HKN International Hackathon

## Team Information

**Team Name:** Team 6 - Tsukkikage

**Team Members:**
- Ruthi Shankari S — Nu Eta Chapter, Sri Sai Ram Engineering College
- Tharushi S — Nu Eta Chapter, Sri Sai Ram Engineering College
- Guru Sanjay R K — IEEE Member, Sri Sai Ram Engineering College

## Project Overview

**Smart Budget** is a comprehensive budget management system designed for IEEE-HKN chapters to plan yearly budgets, manage real-time expenses, track funding deadlines, and visualize spending trends with an intuitive, modern interface.

### Used Technologies

**Backend:**
- Java 21
- Spring Boot 3.5.7
- Spring Security (JWT Authentication)
- Spring Data JPA
- Hibernate Validator
- MySQL 8
- Lombok
- Springdoc OpenAPI (Swagger)

**Frontend:**
- React 19.2.0
- Vite 7.2.2
- Tailwind CSS 4.1.17
- React Router DOM 7.9.6
- Axios 1.13.2
- Recharts 3.5.0 (Data Visualization)
- Lucide React (Icons)
- jsPDF & jsPDF-AutoTable (PDF Export)
- XLSX (Excel Export)

**DevOps:**
- Docker & Docker Compose
- Nginx (Frontend Server)

### Implemented Features

**Core Features:**
-  **User Authentication & Authorization** - JWT-based authentication with role-based access control (ADMIN, TREASURER, MEMBER)
-  **Budget Management** - Create and manage yearly budgets with initial amounts and academic year tracking
-  **Event Management** - Create events linked to budgets with allocated amounts
-  **Transaction Tracking** - Record income and expenses with categories, status (CONFIRMED/PLANNED/RECURRING), and notes
-  **Deadline Management** - Track funding deadlines and important dates
-  **User Management** - Admin can create, update, and manage users with different roles
-  **Dashboard Analytics** - Real-time visualization of budget status, spending trends, and financial summaries
-  **Reports Generation** - Export financial reports as PDF and Excel with transaction details
-  **Responsive Design** - Modern, minimal, and premium UI with smooth animations

**Extra Features:**
-  **Advanced Visualizations** - Interactive charts for budget analysis and spending trends using Recharts
-  **Enhanced Security** - BCrypt password hashing, JWT token validation, and role-based endpoint protection
-  **Mobile Responsive** - Fully responsive design optimized for all screen sizes
-  **Real-time Validation** - Client-side and server-side validation for data integrity

## Running the Project

### Prerequisites
- Docker Desktop installed and running
- Git

### Build and Run with Docker

```bash
# Clone the repository
git clone https://github.com/HKN-HACKATHON/team6-tsukkikage.git
cd team6-tsukkikage

# Build and start all services
docker compose build --no-cache
docker compose up -d

# View logs (optional)
docker compose logs -f
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Documentation (Swagger):** http://localhost:8080/swagger-ui.html

### Default Admin Credentials

```
Username: admin
Password: admin123
```

### Stop the Application

```bash
docker compose down
```

## API

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)
- `POST /api/auth/register` - User registration

### Admin Management
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user

### Budget Management
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/{id}` - Get budget by ID
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/{id}` - Update budget
- `DELETE /api/budgets/{id}` - Delete budget

### Event Management
- `GET /api/events` - Get all events
- `GET /api/events/{id}` - Get event by ID
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

### Transaction Management
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/{id}` - Get transaction by ID
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Deadline Management
- `GET /api/deadlines` - Get all deadlines
- `GET /api/deadlines/{id}` - Get deadline by ID
- `POST /api/deadlines` - Create new deadline
- `PUT /api/deadlines/{id}` - Update deadline
- `DELETE /api/deadlines/{id}` - Delete deadline

## Database Structure

### users
- `id` - BIGINT - PK (Auto Increment)
- `full_name` - VARCHAR(255)
- `email` - VARCHAR(255) - UNIQUE
- `phone` - VARCHAR(255)
- `username` - VARCHAR(255) - UNIQUE
- `password` - VARCHAR(255) - (BCrypt Hashed)
- `role` - ENUM('ADMIN', 'TREASURER', 'MEMBER')
- `created_at` - BIGINT (Unix Timestamp)
- `status` - ENUM('ACTIVE', 'DISABLED')

### budgets
- `id` - BIGINT - PK (Auto Increment)
- `name` - VARCHAR(100)
- `academic_year` - VARCHAR(20)
- `initial_amount` - DECIMAL(12,2)
- `created_by` - BIGINT - FK → users(id)
- `created_at` - BIGINT (Unix Timestamp)

### events
- `id` - BIGINT - PK (Auto Increment)
- `budget_id` - BIGINT - FK → budgets(id)
- `name` - VARCHAR(150)
- `allocated_amount` - DECIMAL(12,2)
- `created_by` - BIGINT - FK → users(id)
- `created_at` - BIGINT (Unix Timestamp)

### transactions
- `id` - BIGINT - PK (Auto Increment)
- `budget_id` - BIGINT - FK → budgets(id)
- `event_id` - BIGINT - FK → events(id) (Nullable)
- `type` - ENUM('INCOME', 'EXPENSE')
- `category` - VARCHAR(100)
- `amount` - DECIMAL(12,2)
- `timestamp` - BIGINT (Unix Timestamp)
- `status` - ENUM('CONFIRMED', 'PLANNED', 'RECURRING')
- `notes` - TEXT
- `created_by` - BIGINT - FK → users(id)

### deadlines
- `id` - BIGINT - PK (Auto Increment)
- `title` - VARCHAR(200)
- `description` - TEXT
- `due_timestamp` - BIGINT (Unix Timestamp)
- `created_by` - BIGINT - FK → users(id)
- `created_at` - BIGINT (Unix Timestamp)

### receipts
- `id` - BIGINT - PK (Auto Increment)
- `transaction_id` - BIGINT - FK → transactions(id)
- `file_url` - VARCHAR(500)
- `uploaded_at` - BIGINT (Unix Timestamp)

## Project Structure

```
team6-tsukkikage/
├── backend/
│   ├── src/main/java/com/example/backend/
│   │   ├── controller/     # REST API Controllers
│   │   ├── entity/         # JPA Entities
│   │   ├── repository/     # Data Access Layer
│   │   ├── service/        # Business Logic
│   │   ├── security/       # JWT & Security Config
│   │   └── dto/            # Data Transfer Objects
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Page Components
│   │   ├── layouts/        # Layout Components
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── router/         # Route Configuration
│   │   └── index.css       # Global Styles & Animations
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## Features Showcase

### Role-Based Access Control
- **ADMIN**: Full access to all features including user management
- **TREASURER**: Manage transactions, budgets, events, and reports
- **MEMBER**: View events and deadlines

### Modern UI Features
- Smooth page transitions with fade-in and slide animations
- Staggered list item animations for better visual hierarchy
- Glassmorphism effects on cards and modals
- Interactive hover states with scale and glow effects
- Responsive sidebar with animated menu items
- Real-time form validation with visual feedback

### Data Visualization
- Budget overview with spending trends
- Transaction history with filtering options
- Category-wise expense breakdown
- Timeline view for deadlines

---

**Developed by Team 6 - Tsukkikage for IEEE-HKN International Hackathon 2025**
