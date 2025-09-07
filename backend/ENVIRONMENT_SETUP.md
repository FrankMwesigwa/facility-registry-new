# Environment Setup for Backend

## Required Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=9000
NODE_ENV=development
SERVER_URL=http://localhost:3000

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=facility_registry
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_db_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Email Configuration
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
EMAIL_USER=your_email@gmail.com

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000
```

## Frontend Environment Variables

Create a `.env` file in the frontend directory with:

```env
# API Configuration
REACT_APP_API_BASE_URL_DEV=http://localhost:9000/api
REACT_APP_API_BASE_URL_PROD=https://your-production-domain.com/api
```

## Important Notes

1. **SERVER_URL**: This should point to your frontend URL (where the React app is running)
2. **EMAIL_USERNAME/EMAIL_PASSWORD**: Configure with your email service credentials
3. **JWT_SECRET**: Use a strong, random secret key
4. **Database credentials**: Update with your actual PostgreSQL credentials

## Current Issue Fix

The "undefined" URL issue is caused by missing `SERVER_URL` environment variable. Set it to your frontend URL (e.g., `http://localhost:3000` for development).
