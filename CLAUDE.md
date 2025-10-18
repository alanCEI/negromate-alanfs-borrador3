# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Negromate Creatives is a full-stack e-commerce application for creative services (graphic design, custom clothing, murals). The project uses a monorepo structure with separate backend and frontend directories.

## Architecture

### Backend (Express + MongoDB)
- **Framework**: Express.js with ES modules (`"type": "module"`)
- **Database**: MongoDB Atlas via Mongoose
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Architecture Pattern**: MVC (Models, Controllers, Routes)
- **Deployment**: Configured for Vercel (vercel.json)

Key Backend Structure:
- `backend/config/config.js` - Environment-based configuration (supports .env and .env.production)
- `backend/db/mongoose.js` - Database connection with automatic population of initial data
- `backend/db/models/` - Mongoose schemas (User, Product, Order, Content)
- `backend/controllers/` - Business logic for each route
- `backend/routes/` - API endpoint definitions
- `backend/middlewares/` - Authentication (authMiddleware, adminMiddleware) and error handling

### Frontend (React + Vite)
- **Framework**: React 19 with Vite as the build tool
- **Routing**: React Router DOM v7
- **State Management**: React Context API (AuthContext, CartContext, ThemeContext)
- **Path Alias**: `@/` maps to `/src` (configured in vite.config.js)

Key Frontend Structure:
- `frontend/src/App.jsx` - Main routing configuration
- `frontend/src/pages/` - Page components (LandingPage, AboutUs, Contact, Profile, ShoppingCart, etc.)
- `frontend/src/components/` - Reusable components (Header, Footer, Login, Register, ProtectedRoute, GuestRoute)
- `frontend/src/context/` - React contexts for global state
- `frontend/src/services/api.js` - Centralized API request handling with token support

## Environment Configuration

### Backend (.env)
Required variables:
- `PORT` - Server port (default: 3000)
- `DB_USER` - MongoDB Atlas username
- `DB_PASS` - MongoDB Atlas password
- `CLUSTER` - MongoDB Atlas cluster URL
- `DATABASE` - Database name
- `JWT_SECRET` - Secret for JWT token signing

### Frontend (.env)
Required variables:
- `VITE_API_URL` - Backend API URL (e.g., http://localhost:3000/api)

## Development Commands

### Backend
```bash
cd backend
npm install              # Install dependencies
npm run dev             # Start development server with nodemon
npm start               # Start production server
```

### Frontend
```bash
cd frontend
npm install              # Install dependencies
npm run dev             # Start Vite dev server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## API Structure

All API endpoints are prefixed with `/api`:
- `/api/auth` - Authentication (login, register, profile)
- `/api/users` - User management
- `/api/products` - Product CRUD operations
- `/api/orders` - Order management
- `/api/content` - Dynamic content (About Us, etc.)

## Authentication Flow

1. User registers/logs in via frontend (Login/Register components)
2. Backend validates credentials and returns JWT token
3. Token stored in localStorage (keys: 'userToken', 'userInfo')
4. AuthContext manages user state across the app
5. Protected routes use ProtectedRoute component, guest routes use GuestRoute
6. API requests include token via Authorization header: `Bearer <token>`
7. Backend middleware (authMiddleware) validates JWT on protected endpoints
8. adminMiddleware checks for 'admin' role for admin-only routes

## Database Models

- **User**: username, email, password (hashed), role (user/admin)
- **Product**: name, category (enum: GraphicDesign/CustomClothing/Murals), price, imageUrl, description, details[]
- **Order**: user (ref), items[] (product ref, quantity, price), totalAmount, status (pending/completed/cancelled)
- **Content**: Dynamic content sections for pages

## Key Features

- Auto-population of initial data on first database connection (see mongoose.js:populateDatabase)
- Role-based access control (user/admin roles)
- Shopping cart functionality managed via CartContext
- Theme switching via ThemeContext
- Responsive layout with Header/Footer on all pages
- Protected routes require authentication
- Guest routes redirect authenticated users

## Important Notes

- Backend uses ES modules - all imports must use .js extensions
- Frontend uses `@/` alias for cleaner imports
- CORS is enabled globally on the backend
- Error handling centralized via error.middleware.js
- MongoDB connection URL constructed from environment variables
- Backend serves static files from 'public' directory
- Vercel deployment configured for backend
