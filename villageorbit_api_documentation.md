# VillageOrbit API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8001/api/v1`  
**Swagger UI:** `http://localhost:8001/api/v1/swagger-ui.html`

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [User Profile](#2-user-profile)
3. [User Management (Admin)](#3-user-management-admin)
4. [RBAC Management](#4-rbac-management)
5. [Village Management](#5-village-management)
6. [Village Services](#6-village-services)
7. [Marketplace](#7-marketplace)
8. [Forum Posts](#8-forum-posts)
9. [Feedback & Contact](#9-feedback--contact)
10. [Exams](#10-exams)
11. [Health Check](#11-health-check)

---

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description"
  }
}
```

---

## Common Headers

| Header | Description | Required |
|--------|-------------|----------|
| `Authorization` | Bearer JWT token | For protected endpoints |
| `Content-Type` | `application/json` | For POST/PUT requests |
| `X-Village-Id` | Village identifier | For some endpoints |

---

# 1. Authentication

Base path: `/api/v1/auth`

## 1.1 User Signup

**POST** `/auth/signup`

Register a new user account.

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123",
    "fullName": "John Doe",
    "mobile": "9876543210",
    "aadharNumber": "123456789012",
    "villageId": "shivankhed"
  }'
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | Min 8 chars, uppercase, lowercase, number, special char |
| fullName | string | Yes | 3-100 characters |
| mobile | string | No | 10-digit Indian mobile |
| aadharNumber | string | No | 12-digit Aadhar |
| villageId | string | Yes | Village identifier |

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "mobile": "9876543210",
    "approvalStatus": "PENDING",
    "villageId": "shivankhed",
    "isActive": true,
    "roles": [{"id": "uuid", "name": "user"}],
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "User registered successfully"
}
```

### Error Response (400)
```json
{
  "success": false,
  "error": {
    "code": "SIGNUP_ERROR",
    "message": "Email already in use: user@example.com"
  }
}
```

---

## 1.2 User Login

**POST** `/auth/login`

Authenticate and receive tokens.

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@villageorbit.in",
    "password": "SecurePass@123"
  }'
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Registered email |
| password | string | Yes | User password |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "email": "superadmin@villageorbit.in",
      "fullName": "Super Admin",
      "roles": [{"id": "uuid", "name": "super_admin"}],
      "permissions": ["users:view", "users:create", "users:delete"]
    }
  },
  "message": "Login successful"
}
```

### Error Response (401)
```json
{
  "success": false,
  "error": {
    "code": "AUTH_FAILED",
    "message": "Invalid email or password"
  }
}
```

---

## 1.3 Refresh Token

**POST** `/auth/refresh-token`

Get new access token using refresh token.

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/auth/refresh-token" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900
  },
  "message": "Token refreshed successfully"
}
```

### Error Response (401)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired refresh token"
  }
}
```

---

## 1.4 Logout

**POST** `/auth/logout` 🔒

Revoke refresh token.

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/auth/logout" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

---

## 1.5 Get Current User Profile

**GET** `/auth/me` 🔒

Get authenticated user's profile.

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/auth/me" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "superadmin@villageorbit.in",
    "fullName": "Super Admin",
    "mobile": "+91-9876543210",
    "approvalStatus": "APPROVED",
    "villageId": "shivankhed",
    "roles": [
      {
        "id": "uuid",
        "name": "super_admin",
        "permissions": [
          {"id": "uuid", "name": "users:view"},
          {"id": "uuid", "name": "users:create"}
        ]
      }
    ],
    "allPermissions": ["users:view", "users:create", "users:delete"],
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Profile retrieved successfully"
}
```

---

# 2. User Profile

Base path: `/api/v1/users`

## 2.1 Get Profile

**GET** `/users/profile` 🔒

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/users/profile" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "mobile": "9876543210",
    "approvalStatus": "APPROVED",
    "villageId": "shivankhed",
    "roles": [{"id": "uuid", "name": "user"}],
    "allPermissions": [],
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Profile retrieved successfully"
}
```

---

## 2.2 Update Profile

**PUT** `/users/profile` 🔒

### Request
```bash
curl -X PUT "http://localhost:8001/api/v1/users/profile" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Updated",
    "mobile": "9876543211",
    "aadharNumber": "123456789013"
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "user@example.com",
    "fullName": "John Updated",
    "mobile": "9876543211"
  },
  "message": "Profile updated successfully"
}
```

---

# 3. User Management (Admin)

Base path: `/api/v1/admin/users` 🔒

## 3.1 Get All Users

**GET** `/admin/users`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/admin/users?villageId=shivankhed&page=0&size=20&approvalStatus=PENDING" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| villageId | string | default | Filter by village |
| page | int | 0 | Page number (0-indexed) |
| size | int | 20 | Items per page |
| approvalStatus | string | - | Filter: PENDING, APPROVED, REJECTED |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "userId": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe",
        "approvalStatus": "PENDING",
        "villageId": "shivankhed",
        "isActive": true,
        "roles": [{"id": "uuid", "name": "user"}],
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 5,
    "number": 0,
    "size": 20
  },
  "message": "Users retrieved successfully"
}
```

---

## 3.2 Get User By ID

**GET** `/admin/users/{userId}`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000?villageId=shivankhed" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "fullName": "John Doe",
    "mobile": "9876543210",
    "approvalStatus": "PENDING",
    "villageId": "shivankhed",
    "isActive": true,
    "roles": [{"id": "uuid", "name": "user"}],
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "User retrieved successfully"
}
```

### Error Response (404)
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found with ID: 550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## 3.3 Approve User

**POST** `/admin/users/{userId}/approve`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000/approve" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "villageId": "shivankhed"
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "User approved successfully"
}
```

---

## 3.4 Reject User

**POST** `/admin/users/{userId}/reject`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000/reject" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "villageId": "shivankhed",
    "reason": "Incomplete documentation"
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "User rejected successfully"
}
```

---

## 3.5 Delete User

**DELETE** `/admin/users/{userId}`

### Request
```bash
curl -X DELETE "http://localhost:8001/api/v1/admin/users/550e8400-e29b-41d4-a716-446655440000?villageId=shivankhed" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "User deleted successfully"
}
```

---

# 4. RBAC Management

Base path: `/api/v1/rbac` 🔒

## 4.1 Create Permission

**POST** `/rbac/permissions`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/rbac/permissions" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "notices:create",
    "description": "Permission to create notices"
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "notices:create",
    "description": "Permission to create notices",
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Permission created successfully"
}
```

---

## 4.2 Get All Permissions

**GET** `/rbac/permissions`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/rbac/permissions" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "users:view",
      "description": "View users",
      "createdAt": "2025-12-30T10:00:00"
    },
    {
      "id": "uuid",
      "name": "users:create",
      "description": "Create users",
      "createdAt": "2025-12-30T10:00:00"
    }
  ],
  "message": "Permissions retrieved successfully"
}
```

---

## 4.3 Get All Roles

**GET** `/rbac/roles`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/rbac/roles" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "super_admin",
      "description": "Super Administrator with full access",
      "isSystemRole": true,
      "permissions": ["users:view", "users:create", "users:delete"]
    },
    {
      "id": "uuid",
      "name": "user",
      "description": "Regular user",
      "isSystemRole": true,
      "permissions": []
    }
  ],
  "message": "Roles retrieved successfully"
}
```

---

## 4.4 Assign Permissions to Role

**POST** `/rbac/roles/{roleId}/permissions`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/rbac/roles/550e8400-e29b-41d4-a716-446655440000/permissions" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '["permission-uuid-1", "permission-uuid-2"]'
```

### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Permissions assigned to role successfully"
}
```

---

## 4.5 Assign Role to User

**POST** `/rbac/users/{userId}/roles`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/rbac/users/550e8400-e29b-41d4-a716-446655440000/roles" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '["role-uuid-1"]'
```

### Success Response (200)
```json
{
  "success": true,
  "data": null,
  "message": "Roles assigned to user successfully"
}
```

---

# 5. Village Management

Base path: `/api/v1/villages`

## 5.1 List Villages (Public)

**GET** `/villages`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/villages?activeOnly=true"
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Shivankhed Khurd",
      "slug": "shivankhed",
      "district": "Buldhana",
      "taluka": "Mehkar",
      "state": "Maharashtra",
      "pincode": "443301",
      "isActive": true,
      "createdAt": "2025-12-30T10:00:00"
    }
  ],
  "message": "Villages retrieved successfully"
}
```

---

## 5.2 Get Village By ID (Public)

**GET** `/villages/{villageId}`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/villages/550e8400-e29b-41d4-a716-446655440000"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Shivankhed Khurd",
    "slug": "shivankhed",
    "district": "Buldhana",
    "taluka": "Mehkar",
    "state": "Maharashtra",
    "pincode": "443301",
    "isActive": true
  },
  "message": "Village retrieved successfully"
}
```

---

## 5.3 Get Village Config (Public)

**GET** `/villages/{villageId}/config`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/villages/550e8400-e29b-41d4-a716-446655440000/config?language=en"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "villageId": "uuid",
    "language": "en",
    "villageName": "Shivankhed Khurd",
    "sarpanchName": "Shri. Rajesh Kumar",
    "gramsevakName": "Shri. Suresh Patil",
    "contactNumber": "+91-9876543210",
    "configData": {}
  },
  "message": "Village config retrieved successfully"
}
```

---

## 5.4 Create Village 🔒

**POST** `/villages`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/villages" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Village",
    "slug": "new-village",
    "district": "Buldhana",
    "taluka": "Mehkar",
    "state": "Maharashtra",
    "pincode": "443301"
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Village",
    "slug": "new-village"
  },
  "message": "Village created successfully"
}
```

---

# 6. Village Services

Base path: `/api/v1/services`

## 6.1 List Services (Public)

**GET** `/services`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/services?villageId=uuid&category=Medical&page=0&limit=20"
```

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| villageId | string | - | Filter by village |
| category | string | - | Filter by category |
| search | string | - | Search by name/owner |
| page | int | 0 | Page number |
| limit | int | 20 | Items per page |
| sortBy | string | name | Sort field |
| sortOrder | string | asc | asc or desc |

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "uuid",
        "name": "Village Medical Store",
        "description": "24x7 Medical services",
        "category": "Medical",
        "ownerName": "Dr. Ramesh Sharma",
        "contactNumber": "9876543210",
        "address": "Main Road, Shivankhed",
        "villageId": "uuid",
        "rating": 4.5,
        "isActive": true
      }
    ],
    "total": 50,
    "page": 0,
    "limit": 20,
    "totalPages": 3
  },
  "message": "Services retrieved successfully"
}
```

---

## 6.2 Get Service By ID (Public)

**GET** `/services/{serviceId}`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/services/550e8400-e29b-41d4-a716-446655440000"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Village Medical Store",
    "description": "24x7 Medical services",
    "category": "Medical",
    "ownerName": "Dr. Ramesh Sharma",
    "contactNumber": "9876543210",
    "address": "Main Road, Shivankhed",
    "villageId": "uuid",
    "rating": 4.5,
    "isActive": true
  },
  "message": "Service retrieved successfully"
}
```

---

## 6.3 Get Service Categories (Public)

**GET** `/services/categories`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/services/categories"
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {"id": "uuid", "name": "Medical", "icon": "🏥", "isActive": true},
    {"id": "uuid", "name": "Grocery", "icon": "🛒", "isActive": true},
    {"id": "uuid", "name": "Education", "icon": "📚", "isActive": true}
  ],
  "message": "Categories retrieved successfully"
}
```

---

## 6.4 Create Service 🔒

**POST** `/services`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/services" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Service",
    "description": "Service description",
    "category": "Medical",
    "ownerName": "Owner Name",
    "contactNumber": "9876543210",
    "address": "Address",
    "villageId": "village-uuid"
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Service"
  },
  "message": "Service created successfully"
}
```

---

# 7. Marketplace

Base path: `/api/v1/items`

**Required Header:** `X-Village-Id: <village-uuid>`

## 7.1 List Marketplace Items (Public)

**GET** `/items`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/items?category=Electronics&page=0&size=20" \
  -H "X-Village-Id: <village-uuid>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "title": "iPhone 13 Pro",
        "description": "Good condition, 1 year old",
        "price": 55000,
        "category": "Electronics",
        "condition": "GOOD",
        "status": "AVAILABLE",
        "sellerName": "John Doe",
        "sellerContact": "9876543210",
        "images": ["url1", "url2"],
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 50,
    "totalPages": 3
  },
  "message": "Items retrieved successfully"
}
```

---

## 7.2 Get Item Details (Public)

**GET** `/items/{itemId}`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/items/550e8400-e29b-41d4-a716-446655440000" \
  -H "X-Village-Id: <village-uuid>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "iPhone 13 Pro",
    "description": "Good condition, 1 year old",
    "price": 55000,
    "category": "Electronics",
    "condition": "GOOD",
    "status": "AVAILABLE",
    "sellerName": "John Doe",
    "sellerContact": "9876543210",
    "images": ["url1", "url2"]
  },
  "message": "Item retrieved successfully"
}
```

---

## 7.3 Create Item Listing 🔒

**POST** `/items`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/items" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "X-Village-Id: <village-uuid>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 13 Pro",
    "description": "Good condition, 1 year old",
    "price": 55000,
    "category": "Electronics",
    "condition": "GOOD",
    "contactNumber": "9876543210",
    "images": ["url1", "url2"]
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "iPhone 13 Pro",
    "status": "PENDING"
  },
  "message": "Item created successfully. Pending admin approval."
}
```

---

## 7.4 Get My Items 🔒

**GET** `/items/my-items`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/items/my-items?page=0&size=20" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

---

## 7.5 Mark Item as Sold 🔒

**PUT** `/items/{itemId}/sold`

### Request
```bash
curl -X PUT "http://localhost:8001/api/v1/items/550e8400-e29b-41d4-a716-446655440000/sold" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "SOLD"
  },
  "message": "Item marked as sold"
}
```

---

# 8. Forum Posts

Base path: `/api/v1/posts`

**Required Header:** `X-Village-Id: <village-uuid>`

## 8.1 Get Posts (Public)

**GET** `/posts`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/posts?search=announcement&page=0&size=20" \
  -H "X-Village-Id: <village-uuid>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "content": "Village meeting tomorrow at 5 PM",
        "authorId": "uuid",
        "authorName": "Sarpanch",
        "likesCount": 25,
        "commentsCount": 10,
        "isLikedByCurrentUser": false,
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 5
  },
  "message": "Posts retrieved successfully"
}
```

---

## 8.2 Create Post 🔒

**POST** `/posts`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/posts" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "X-Village-Id: <village-uuid>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello village! Important announcement...",
    "images": ["url1"]
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Hello village! Important announcement...",
    "authorName": "John Doe",
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Post created successfully"
}
```

---

## 8.3 Like Post 🔒

**POST** `/posts/{postId}/like`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/posts/550e8400-e29b-41d4-a716-446655440000/like" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likesCount": 26
  },
  "message": "Post liked"
}
```

---

## 8.4 Add Comment 🔒

**POST** `/posts/{postId}/comments`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/posts/550e8400-e29b-41d4-a716-446655440000/comments" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great announcement!"
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Great announcement!",
    "authorName": "John Doe",
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Comment added successfully"
}
```

---

# 9. Feedback & Contact

Base path: `/api/v1`

## 9.1 Submit Feedback (Public)

**POST** `/feedback`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "COMPLAINT",
    "subject": "Road condition",
    "message": "The main road needs repair",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "villageId": "shivankhed"
  }'
```

### Request Body
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | string | Yes | COMPLAINT, SUGGESTION, APPRECIATION, GENERAL |
| subject | string | Yes | Feedback subject |
| message | string | Yes | Feedback message |
| name | string | No | Submitter name |
| email | string | No | Submitter email |
| phone | string | No | Submitter phone |
| villageId | string | No | Village identifier |

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "COMPLAINT",
    "subject": "Road condition",
    "status": "PENDING",
    "referenceNumber": "FB-2025-001",
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Feedback submitted successfully"
}
```

---

## 9.2 Submit Contact Form (Public)

**POST** `/contact`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "subject": "General Inquiry",
    "message": "I would like to know more about..."
  }'
```

### Success Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "referenceNumber": "CT-2025-001",
    "createdAt": "2025-12-30T10:00:00"
  },
  "message": "Contact form submitted successfully"
}
```

---

# 10. Exams

Base path: `/api/v1/exams`

**Required Header:** `X-Village-ID: <village-uuid>`

## 10.1 List Available Exams

**GET** `/exams`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/exams" \
  -H "X-Village-ID: <village-uuid>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "General Knowledge Quiz",
      "description": "Test your GK",
      "subject": "GK",
      "duration": 30,
      "totalQuestions": 20,
      "passingScore": 60,
      "status": "ACTIVE"
    }
  ],
  "message": "Available exams retrieved"
}
```

---

## 10.2 Start Exam Attempt 🔒

**POST** `/exams/{examId}/attempts`

### Request
```bash
curl -X POST "http://localhost:8001/api/v1/exams/550e8400-e29b-41d4-a716-446655440000/attempts" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "John Doe"
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "examId": "uuid",
    "status": "IN_PROGRESS",
    "startedAt": "2025-12-30T10:00:00",
    "expiresAt": "2025-12-30T10:30:00"
  },
  "message": "Exam attempt started"
}
```

---

## 10.3 Submit Answers 🔒

**PUT** `/exams/attempts/{attemptId}`

### Request
```bash
curl -X PUT "http://localhost:8001/api/v1/exams/attempts/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"questionId": "uuid", "selectedOption": "A"},
      {"questionId": "uuid", "selectedOption": "B"}
    ]
  }'
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "status": "COMPLETED",
    "score": 85,
    "passed": true
  },
  "message": "Answers submitted"
}
```

---

## 10.4 Get Exam Results 🔒

**GET** `/exams/attempts/{attemptId}/results`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/exams/attempts/550e8400-e29b-41d4-a716-446655440000/results?includeAnswers=true" \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "attemptId": "uuid",
    "examTitle": "General Knowledge Quiz",
    "score": 85,
    "totalQuestions": 20,
    "correctAnswers": 17,
    "passed": true,
    "timeTaken": "25:30"
  },
  "message": "Results retrieved"
}
```

---

# 11. Health Check

## 11.1 Basic Health Check (Public)

**GET** `/health` or `/api/v1/health`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/health"
```

### Success Response (200)
```json
{
  "status": "UP",
  "service": "villageorbit-api",
  "timestamp": "2025-12-30T10:00:00"
}
```

---

## 11.2 Detailed Health Check (Public)

**GET** `/health/detailed` or `/api/v1/health/detailed`

### Request
```bash
curl -X GET "http://localhost:8001/api/v1/health/detailed"
```

### Success Response (200)
```json
{
  "status": "UP",
  "service": "villageorbit-api",
  "profile": "dev",
  "timestamp": "2025-12-30T10:00:00",
  "uptime": "2h 30m 15s",
  "startedAt": "2025-12-30T07:29:45",
  "build": {
    "version": "1.0.0",
    "artifact": "villageorbit-api",
    "name": "VillageOrbit API"
  },
  "database": {
    "status": "UP",
    "database": "PostgreSQL",
    "version": "16.0"
  }
}
```

---

# Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_FAILED | 401 | Invalid credentials |
| UNAUTHORIZED | 401 | Missing or invalid token |
| INVALID_TOKEN | 401 | Token expired or invalid |
| PERMISSION_DENIED | 403 | Insufficient permissions |
| USER_NOT_FOUND | 404 | User does not exist |
| ITEM_NOT_FOUND | 404 | Resource not found |
| VILLAGE_NOT_FOUND | 404 | Village does not exist |
| SIGNUP_ERROR | 400 | Registration failed |
| VALIDATION_ERROR | 400 | Invalid input data |
| ERROR | 500 | Internal server error |

---

# Authentication Notes

## Token Usage

1. Call `/auth/login` to get `accessToken` and `refreshToken`
2. Include `accessToken` in all protected requests:
   ```
   Authorization: Bearer <accessToken>
   ```
3. When `accessToken` expires (15 min default), call `/auth/refresh-token`
4. `refreshToken` expires in 7 days

## Test Credentials

```
Email: superadmin@villageorbit.in
Password: SecurePass@123
Role: super_admin (full access)
```

---

**Document Version:** 1.0.0  
**Last Updated:** December 30, 2025  
**API Version:** v1
