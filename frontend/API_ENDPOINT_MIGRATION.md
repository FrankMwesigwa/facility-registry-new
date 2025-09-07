# Frontend API Endpoint Migration

This document outlines the changes made to update the frontend to use the new refactored API endpoints.

## Changes Made

### 1. Login Component (`/src/pages/Public/Login/index.jsx`)
- **Old endpoint**: `POST /api/users/login`
- **New endpoint**: `POST /api/auth/login`
- **Change**: Updated the API call in the `handleSubmit` function

### 2. Registration Component (`/src/pages/Public/Registration/index.jsx`)
- **Old endpoint**: `POST /api/users/register/public`
- **New endpoint**: `POST /api/auth/register/public`
- **Change**: Updated the API call in the `handleSubmit` function
- **Additional fix**: Fixed the password input field to include proper `name`, `value`, and `onChange` attributes

### 3. Email Verification Component (`/src/pages/Public/Registration/VerifyCode.jsx`)
- **Old endpoint**: `POST /api/users/verifycode`
- **New endpoint**: `POST /api/auth/verifycode`
- **Change**: Updated the API call in the `handleSubmit` function

## API Endpoint Mapping

| Functionality | Old Endpoint | New Endpoint |
|---------------|--------------|--------------|
| User Login | `/api/users/login` | `/api/auth/login` |
| Public Registration | `/api/users/register/public` | `/api/auth/register/public` |
| Email Verification | `/api/users/verifycode` | `/api/auth/verifycode` |
| Password Reset Initiation | `/api/users/forgotpassword` | `/api/auth/forgotpassword` |
| Password Reset | `/api/users/resetpassword/:token` | `/api/auth/resetpassword/:token` |
| Get User Profile | `/api/users/profile` | `/api/auth/profile` |
| Update User Profile | `/api/users/updateprofile` | `/api/auth/updateprofile` |
| Get Current User | `/api/users/me` | `/api/auth/me` |
| Admin User Management | `/api/users/admin` | `/api/admin/users` |
| Admin User Registration | `/api/users/register` | `/api/admin/register` |
| Admin User CRUD | `/api/users/:id` | `/api/admin/users/:id` |

## Notes

1. **Password Reset**: The "Forgot your password?" link in the login component is currently a placeholder and not functional. This would need to be implemented to use the new `/api/auth/forgotpassword` endpoint.

2. **Admin User Management**: The navigation links reference `/admin/users` but there's no corresponding page component yet. If this functionality is needed, it would use the new `/api/admin/users` endpoints.

3. **Profile Management**: If there are any profile management features, they should use the new `/api/auth/profile` and `/api/auth/updateprofile` endpoints.

4. **Authentication Flow**: The authentication flow remains the same - tokens are stored in localStorage and user data is managed the same way.

## Testing

After these changes, the following flows should be tested:

1. **User Registration Flow**:
   - Register a new user → Should call `/api/auth/register/public`
   - Verify email with code → Should call `/api/auth/verifycode`
   - User should be automatically logged in after verification

2. **User Login Flow**:
   - Login with username/password → Should call `/api/auth/login`
   - Should redirect based on user role (admin, planning, public, district)

3. **Error Handling**:
   - Invalid credentials should show appropriate error messages
   - Network errors should be handled gracefully

## Future Enhancements

1. **Password Reset**: Implement the forgot password functionality
2. **Profile Management**: Add user profile management features
3. **Admin User Management**: Create admin interface for user management
4. **Token Refresh**: Implement automatic token refresh if needed
