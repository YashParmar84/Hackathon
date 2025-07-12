# Expense Backend API

This is the backend API for the expense management application with OTP-based user registration.

## Features

- OTP-based email verification for user registration
- JWT-based authentication
- User profile management
- Email notifications
- User discovery and search
- Admin management
- Swap request system

## API Endpoints

### Authentication

#### 1. Send OTP for Registration
- **POST** `/api/v1/auth/send-otp`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to your email"
  }
  ```

#### 2. Verify OTP and Register User
- **POST** `/api/v1/auth/verify-otp-register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "name": "John Doe",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "user@example.com",
        "emailVerified": true,
        "otpVerified": true
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### 3. Resend OTP
- **POST** `/api/v1/auth/resend-otp`
- **Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "New OTP sent successfully to your email"
  }
  ```

#### 4. Login User
- **POST** `/api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "user@example.com",
        "emailVerified": true,
        "otpVerified": true
      },
      "token": "jwt_token_here"
    }
  }
  ```

### User Discovery

#### 1. Get All Users
- **GET** `/api/v1/users?page=1&limit=10&search=john`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "totalPages": 5,
      "currentPage": 1,
      "totalUsers": 50
    }
  }
  ```

#### 2. Get User by ID
- **GET** `/api/v1/users/:userId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "bio": "Software developer",
        "location": "New York",
        "profilePhoto": "http://localhost:8000/api/v1/uploads/profiles/profile-123.jpg",
        "skillsOffered": ["javascript", "react", "node.js"],
        "skillsWanted": ["python", "machine learning"],
        "availability": ["weekdays", "evenings"],
        "totalSwaps": 5,
        "completedSwaps": 3,
        "averageRating": 4.5,
        "totalRatings": 10,
        "joinDate": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### 3. Search Users
- **GET** `/api/v1/users/search?q=javascript&page=1&limit=10`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "totalPages": 3,
      "currentPage": 1,
      "totalUsers": 25,
      "searchQuery": "javascript"
    }
  }
  ```

#### 4. Get Users by Skills
- **GET** `/api/v1/users/skills?skills=javascript,react&page=1&limit=10`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "totalPages": 2,
      "currentPage": 1,
      "totalUsers": 15,
      "searchedSkills": ["javascript", "react"]
    }
  }
  ```

#### 5. Get Users by Location
- **GET** `/api/v1/users/location?location=New York&page=1&limit=10`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "totalPages": 1,
      "currentPage": 1,
      "totalUsers": 8,
      "searchedLocation": "New York"
    }
  }
  ```

#### 6. Get Users Statistics
- **GET** `/api/v1/users/stats`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 1000,
      "publicUsers": 850,
      "verifiedUsers": 800,
      "usersWithSkills": 750,
      "recentUsers": 25
    }
  }
  ```

### Swap Requests

#### 1. Send Swap Request
- **POST** `/api/v1/swap-requests/send`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "toUserId": "user_id",
    "skillOffered": "javascript",
    "skillRequested": "python",
    "message": "I can help you with JavaScript in exchange for Python help"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Swap request sent successfully",
    "data": {
      "swapRequest": {
        "id": "request_id",
        "fromUser": {
          "id": "user_id",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "toUser": {
          "id": "target_user_id",
          "name": "Jane Smith",
          "email": "jane@example.com"
        },
        "skillOffered": "javascript",
        "skillRequested": "python",
        "message": "I can help you with JavaScript in exchange for Python help",
        "status": "pending",
        "requestedAt": "2024-01-15T10:30:00.000Z"
      }
    }
  }
  ```

#### 2. Get My Requests
- **GET** `/api/v1/swap-requests/my-requests?type=incoming&status=pending&page=1&limit=10`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `type`: `incoming`, `outgoing`, or `all`
  - `status`: `pending`, `accepted`, `rejected`, `cancelled`, `completed`
  - `page`: Page number
  - `limit`: Items per page
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "requests": [...],
      "totalPages": 3,
      "currentPage": 1,
      "totalRequests": 25
    }
  }
  ```

#### 3. Accept Swap Request
- **PUT** `/api/v1/swap-requests/:requestId/accept`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "responseMessage": "I'd love to help you with Python!"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Swap request accepted successfully",
    "data": {
      "swapRequest": {
        "status": "accepted",
        "respondedAt": "2024-01-15T11:00:00.000Z"
      }
    }
  }
  ```

#### 4. Reject Swap Request
- **PUT** `/api/v1/swap-requests/:requestId/reject`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "responseMessage": "Sorry, I'm not available right now"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Swap request rejected successfully"
  }
  ```

#### 5. Cancel Swap Request
- **PUT** `/api/v1/swap-requests/:requestId/cancel`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Swap request cancelled successfully"
  }
  ```

#### 6. Complete Swap Request
- **PUT** `/api/v1/swap-requests/:requestId/complete`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Swap request completed successfully"
  }
  ```

#### 7. Get Specific Swap Request
- **GET** `/api/v1/swap-requests/:requestId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "swapRequest": {
        "id": "request_id",
        "fromUser": {...},
        "toUser": {...},
        "skillOffered": "javascript",
        "skillRequested": "python",
        "status": "accepted",
        "message": "I can help you with JavaScript",
        "responseMessage": "I'd love to help you with Python!",
        "requestedAt": "2024-01-15T10:30:00.000Z",
        "respondedAt": "2024-01-15T11:00:00.000Z"
      }
    }
  }
  ```

### Profile Management

#### 1. Get User Profile
- **GET** `/api/v1/profile/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "user@example.com",
        "bio": "Software developer",
        "location": "New York",
        "profilePhoto": "http://localhost:8000/api/v1/uploads/profiles/profile-123.jpg",
        "skillsOffered": ["javascript", "react", "node.js"],
        "skillsWanted": ["python", "machine learning"],
        "availability": ["weekdays", "evenings"],
        "isPublic": true,
        "emailVerified": true,
        "otpVerified": true,
        "totalSwaps": 5,
        "completedSwaps": 3,
        "averageRating": 4.5,
        "totalRatings": 10,
        "joinDate": "2024-01-01T00:00:00.000Z",
        "lastActive": "2024-01-15T10:30:00.000Z"
      }
    }
  }
  ```

#### 2. Update User Profile
- **PUT** `/api/v1/profile/update`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "bio": "Software developer with 5 years experience",
    "location": "New York, NY",
    "skillsOffered": ["javascript", "react", "node.js", "mongodb"],
    "skillsWanted": ["python", "machine learning", "data science"],
    "availability": ["weekdays", "weekends", "evenings"],
    "isPublic": true
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "user@example.com",
        "bio": "Software developer with 5 years experience",
        "location": "New York, NY",
        "profilePhoto": "http://localhost:8000/api/v1/uploads/profiles/profile-123.jpg",
        "skillsOffered": ["javascript", "react", "node.js", "mongodb"],
        "skillsWanted": ["python", "machine learning", "data science"],
        "availability": ["weekdays", "weekends", "evenings"],
        "isPublic": true,
        "emailVerified": true,
        "otpVerified": true
      }
    }
  }
  ```

#### 3. Upload Profile Photo
- **POST** `/api/v1/profile/upload-photo`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `multipart/form-data` with field `profilePhoto` (image file)
- **Response:**
  ```json
  {
    "success": true,
    "message": "Profile photo uploaded successfully",
    "data": {
      "profilePhoto": "http://localhost:8000/api/v1/uploads/profiles/profile-456.jpg"
    }
  }
  ```

#### 4. Get Public Profile
- **GET** `/api/v1/profile/public/:userId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "bio": "Software developer",
        "location": "New York",
        "profilePhoto": "http://localhost:8000/api/v1/uploads/profiles/profile-123.jpg",
        "skillsOffered": ["javascript", "react", "node.js"],
        "skillsWanted": ["python", "machine learning"],
        "availability": ["weekdays", "evenings"],
        "totalSwaps": 5,
        "completedSwaps": 3,
        "averageRating": 4.5,
        "totalRatings": 10,
        "joinDate": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### Admin Management

#### 1. Get All Users
- **GET** `/api/v1/admin/users?page=1&limit=10&status=active&role=user&search=john`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "users": [...],
      "totalPages": 5,
      "currentPage": 1,
      "totalUsers": 50
    }
  }
  ```

#### 2. Get User by ID
- **GET** `/api/v1/admin/users/:userId`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "status": "active",
        "role": "user",
        "emailVerified": true,
        "joinDate": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

#### 3. Update User Status
- **PUT** `/api/v1/admin/users/:userId/status`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "status": "disabled",
    "flagReason": "Violation of terms of service"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User status updated successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "status": "disabled",
        "flagReason": "Violation of terms of service",
        "flaggedAt": "2024-01-15T10:30:00.000Z"
      }
    }
  }
  ```

#### 4. Add Review Notes
- **POST** `/api/v1/admin/users/:userId/review-notes`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Body:**
  ```json
  {
    "reviewNotes": "User account under review for suspicious activity"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Review notes added successfully",
    "data": {
      "user": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "reviewNotes": "User account under review for suspicious activity",
        "reviewedAt": "2024-01-15T10:30:00.000Z"
      }
    }
  }
  ```

#### 5. Get Dashboard Statistics
- **GET** `/api/v1/admin/dashboard/stats`
- **Headers:** `Authorization: Bearer <admin_token>`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "totalUsers": 1000,
      "activeUsers": 850,
      "disabledUsers": 50,
      "underReviewUsers": 100,
      "verifiedUsers": 800,
      "adminUsers": 5,
      "recentUsers": 25
    }
  }
  ```

### Test Route
- **GET** `/api/v1/test`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Server is running successfully!"
  }
  ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
MAIL_HOST=your_smtp_host
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_email_password
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env` file

3. Start the server:
   ```bash
   npm start
   ```

## Registration Flow

1. **Send OTP**: User provides email to receive verification code
2. **Verify OTP**: User enters the OTP along with name and password to complete registration
3. **Resend OTP**: If OTP expires, user can request a new one

## Features

- Email validation
- Password hashing with bcrypt
- JWT token generation
- OTP expiration (10 minutes)
- Automatic cleanup of expired OTPs
- Input validation and sanitization
- Error handling
- User discovery and search
- Profile management
- Admin management
- Swap request system

## Database Models

### User Model
- Basic information (name, email, password)
- Profile information (photo, bio, location)
- Skills system (offered/wanted skills)
- Verification status
- Activity tracking
- Balance management

### OTP Model
- Email association
- 6-digit OTP
- Expiration time
- Usage status
- Automatic cleanup

### BlockedToken Model
- Token blacklisting
- Expiration tracking
- Automatic cleanup

### SwapRequest Model
- User-to-user skill exchange requests
- Status tracking (pending, accepted, rejected, cancelled, completed)
- Rating system
- Message exchange
- Expiration handling

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Email verification required
- Input validation and sanitization
- CORS enabled
- Rate limiting ready (can be added)
- Role-based access control 