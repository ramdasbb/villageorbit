# VillageOrbit API - Missing & Required APIs Documentation

**Version:** 1.0.0  
**Created:** December 30, 2025  
**Purpose:** Document missing APIs required for complete frontend migration from Supabase to VillageOrbit REST API

---

## Table of Contents

1. [Available APIs Summary](#available-apis-summary)
2. [Missing APIs - High Priority](#missing-apis---high-priority)
3. [Missing APIs - Medium Priority](#missing-apis---medium-priority)
4. [Missing APIs - Low Priority](#missing-apis---low-priority)
5. [Future Enhancement APIs](#future-enhancement-apis)

---

## Available APIs Summary

The following APIs are **ALREADY DOCUMENTED** in `villageorbit_api_documentation.md`:

### ✅ Phase 1 - Implemented
| Module | Status | Endpoints |
|--------|--------|-----------|
| Authentication | ✅ Complete | signup, login, refresh-token, logout, me |
| Password Reset | ✅ Complete | forgot-password, validate-reset-token, reset-password |
| User Profile | ✅ Complete | GET/PUT /users/profile |
| User Management (Admin) | ✅ Complete | CRUD + approve/reject |
| RBAC Management | ✅ Complete | roles, permissions, assignments |
| Village Management | ✅ Complete | list, get, config, create |

### ✅ Phase 2 - Documented (Pending Integration)
| Module | Status | Endpoints |
|--------|--------|-----------|
| Village Services | ✅ Documented | list, get, categories, create |
| Marketplace | ✅ Documented | list, get, create, my-items, sold |
| Forum Posts | ✅ Documented | list, create, like, comments |
| Feedback & Contact | ✅ Documented | submit feedback, submit contact |
| Exams | ✅ Documented | list, start, submit, results |
| File Storage | ✅ Documented | upload, download, metadata, signed-url, delete |
| Email Service | ✅ Documented | send, status |
| Rate Limiting (Admin) | ✅ Documented | CRUD + toggle + reset |
| Scheduler Jobs (Admin) | ✅ Documented | list, trigger |
| Health Check | ✅ Documented | basic, detailed |

---

## Missing APIs - High Priority

These APIs are **REQUIRED** for core frontend functionality but are **NOT DOCUMENTED** in the API specification.

---

### 1. Admin Marketplace Management

**Feature Name:** Admin Marketplace Dashboard  
**Screen Name:** `AdminMarketplaceDashboard.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Marketplace APIs only cover user-facing operations. Admin needs to view ALL items (regardless of status), approve/reject items with reasons, and perform bulk operations.

#### Required Endpoints:

##### 1.1 List All Items (Admin)
```
GET /api/v1/admin/items
```
**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 0 | Page number |
| size | int | 20 | Items per page |
| status | string | - | Filter: PENDING, APPROVED, REJECTED, ALL |
| villageId | string | - | Filter by village |

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "title": "iPhone 13",
        "category": "Electronics",
        "price": 55000,
        "status": "PENDING",
        "sellerName": "John Doe",
        "sellerContact": "9876543210",
        "sellerId": "uuid",
        "images": ["url1"],
        "rejectionReason": null,
        "reviewedAt": null,
        "reviewedBy": null,
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 100,
    "totalPages": 5
  }
}
```

##### 1.2 Approve Item (Admin)
```
POST /api/v1/admin/items/{itemId}/approve
```
**Request Body:**
```json
{
  "notifyUsers": true
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "APPROVED" },
  "message": "Item approved successfully"
}
```

##### 1.3 Reject Item (Admin)
```
POST /api/v1/admin/items/{itemId}/reject
```
**Request Body:**
```json
{
  "reason": "Inappropriate content or pricing"
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "status": "REJECTED" },
  "message": "Item rejected successfully"
}
```

##### 1.4 Bulk Approve Items (Admin)
```
POST /api/v1/admin/items/bulk-approve
```
**Request Body:**
```json
{
  "itemIds": ["uuid1", "uuid2", "uuid3"],
  "notifyUsers": true
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": { "approvedCount": 3 },
  "message": "3 items approved successfully"
}
```

##### 1.5 Bulk Reject Items (Admin)
```
POST /api/v1/admin/items/bulk-reject
```
**Request Body:**
```json
{
  "itemIds": ["uuid1", "uuid2"],
  "reason": "Bulk rejection reason"
}
```

##### 1.6 Delete Item (Admin)
```
DELETE /api/v1/admin/items/{itemId}
```

---

### 2. Admin Exam Management

**Feature Name:** Admin Exam Dashboard  
**Screen Name:** `AdminExamDashboard.tsx`, `AdminExamQuestions.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Exam APIs only cover student-facing operations. Admin needs to create/edit/delete exams, manage questions, and import questions from files.

#### Required Endpoints:

##### 2.1 Create Exam (Admin)
```
POST /api/v1/admin/exams
```
**Request Body:**
```json
{
  "title": "General Knowledge Quiz",
  "subject": "GK",
  "description": "Test your knowledge",
  "totalQuestions": 20,
  "durationMinutes": 30,
  "passingScore": 60,
  "scheduledAt": "2025-12-31T10:00:00",
  "endsAt": "2025-12-31T12:00:00",
  "status": "scheduled",
  "isActive": true
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": { "id": "uuid", "title": "General Knowledge Quiz" },
  "message": "Exam created successfully"
}
```

##### 2.2 Update Exam (Admin)
```
PUT /api/v1/admin/exams/{examId}
```

##### 2.3 Delete Exam (Admin)
```
DELETE /api/v1/admin/exams/{examId}
```

##### 2.4 Get Exam Questions (Admin)
```
GET /api/v1/admin/exams/{examId}/questions
```
**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "question": "What is the capital of India?",
      "optionA": "Delhi",
      "optionB": "Mumbai",
      "optionC": "Kolkata",
      "optionD": "Chennai",
      "correctOption": "A",
      "explanation": "New Delhi is the capital",
      "difficulty": "easy",
      "topic": "Geography",
      "marksPerQuestion": 1
    }
  ]
}
```

##### 2.5 Add Question (Admin)
```
POST /api/v1/admin/exams/{examId}/questions
```
**Request Body:**
```json
{
  "question": "What is 2 + 2?",
  "optionA": "3",
  "optionB": "4",
  "optionC": "5",
  "optionD": "6",
  "correctOption": "B",
  "explanation": "Basic arithmetic",
  "difficulty": "easy",
  "topic": "Math"
}
```

##### 2.6 Update Question (Admin)
```
PUT /api/v1/admin/exams/{examId}/questions/{questionId}
```

##### 2.7 Delete Question (Admin)
```
DELETE /api/v1/admin/exams/{examId}/questions/{questionId}
```

##### 2.8 Import Questions from File (Admin)
```
POST /api/v1/admin/exams/{examId}/questions/import
```
**Content-Type:** `multipart/form-data`

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| file | file | Excel/CSV file with questions |
| format | string | excel, csv, json |

**Expected Response:**
```json
{
  "success": true,
  "data": { 
    "imported": 50, 
    "failed": 2,
    "errors": ["Row 15: Missing correct option", "Row 23: Invalid format"]
  },
  "message": "48 questions imported successfully"
}
```

##### 2.9 Exam Analytics (Admin)
```
GET /api/v1/admin/exams/{examId}/analytics
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalAttempts": 150,
    "averageScore": 72.5,
    "passRate": 68.5,
    "topScorers": [
      { "studentName": "John", "score": 98, "timeTaken": "25:30" }
    ],
    "questionStats": [
      { "questionId": "uuid", "correctPercentage": 85 }
    ]
  }
}
```

##### 2.10 Get All Attempts (Admin)
```
GET /api/v1/admin/exams/{examId}/attempts
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number |
| size | int | Items per page |
| sortBy | string | score, timeTaken, createdAt |

---

### 3. Admin Contact Messages Management

**Feature Name:** Contact Messages Admin  
**Screen Name:** `ContactMessagesAdmin.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Contact API only allows submission. Admin needs to list, filter, update status, and export messages.

#### Required Endpoints:

##### 3.1 List Contact Messages (Admin)
```
GET /api/v1/admin/contact
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number |
| size | int | Items per page |
| status | string | new, read, resolved, archived |
| search | string | Search in name, email, message |
| dateFrom | date | Filter by date range |
| dateTo | date | Filter by date range |

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "subject": "Inquiry",
        "message": "I need information...",
        "status": "new",
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 50,
    "totalPages": 3
  }
}
```

##### 3.2 Update Message Status (Admin)
```
PATCH /api/v1/admin/contact/{messageId}/status
```
**Request Body:**
```json
{
  "status": "resolved"
}
```

##### 3.3 Delete Contact Message (Admin)
```
DELETE /api/v1/admin/contact/{messageId}
```

##### 3.4 Export Contact Messages (Admin)
```
GET /api/v1/admin/contact/export
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| format | string | csv, excel |
| status | string | Filter by status |
| dateFrom | date | Filter by date |
| dateTo | date | Filter by date |

**Response:** File download

---

### 4. Admin Feedback Management

**Feature Name:** Feedback Admin Dashboard  
**Screen Name:** Needed - Currently no dedicated admin page  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Feedback API only allows submission. Admin needs to list, filter, respond to, and manage feedback.

#### Required Endpoints:

##### 4.1 List Feedback (Admin)
```
GET /api/v1/admin/feedback
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number |
| size | int | Items per page |
| type | string | COMPLAINT, SUGGESTION, APPRECIATION, GENERAL |
| status | string | PENDING, IN_PROGRESS, RESOLVED, CLOSED |

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "type": "COMPLAINT",
        "subject": "Road condition",
        "message": "The main road needs repair",
        "name": "John Doe",
        "phone": "9876543210",
        "status": "PENDING",
        "referenceNumber": "FB-2025-001",
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 25
  }
}
```

##### 4.2 Update Feedback Status (Admin)
```
PATCH /api/v1/admin/feedback/{feedbackId}/status
```
**Request Body:**
```json
{
  "status": "IN_PROGRESS",
  "adminNote": "Forwarded to PWD"
}
```

##### 4.3 Get Feedback Stats (Admin)
```
GET /api/v1/admin/feedback/stats
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "totalCount": 150,
    "pendingCount": 25,
    "resolvedCount": 120,
    "byType": {
      "COMPLAINT": 50,
      "SUGGESTION": 80,
      "APPRECIATION": 20
    }
  }
}
```

---

### 5. Update Marketplace Item

**Feature Name:** Edit Item  
**Screen Name:** `EditItemDialog.tsx`, `SellerDashboard.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Marketplace APIs don't include an endpoint for users to update their own items.

#### Required Endpoints:

##### 5.1 Update Item
```
PUT /api/v1/items/{itemId}
```
**Authorization:** Bearer token (owner only)

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "price": 50000,
  "category": "Electronics",
  "contactNumber": "9876543210",
  "images": ["url1", "url2"]
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated Title",
    "status": "PENDING"
  },
  "message": "Item updated. Pending re-approval."
}
```

##### 5.2 Delete Item (Owner)
```
DELETE /api/v1/items/{itemId}
```
**Authorization:** Bearer token (owner only)

---

### 6. Forum Post Management

**Feature Name:** Forum Edit/Delete  
**Screen Name:** `ForumPage.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Forum APIs don't include endpoints for users to update/delete their posts or for fetching post details with comments.

#### Required Endpoints:

##### 6.1 Get Post Details
```
GET /api/v1/posts/{postId}
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "Post content...",
    "authorId": "uuid",
    "authorName": "John Doe",
    "likesCount": 25,
    "commentsCount": 10,
    "isLikedByCurrentUser": false,
    "images": ["url1"],
    "createdAt": "2025-12-30T10:00:00"
  }
}
```

##### 6.2 Update Post
```
PUT /api/v1/posts/{postId}
```
**Authorization:** Bearer token (owner only)

**Request Body:**
```json
{
  "content": "Updated content",
  "images": ["url1"]
}
```

##### 6.3 Delete Post
```
DELETE /api/v1/posts/{postId}
```
**Authorization:** Bearer token (owner or admin)

##### 6.4 Get Post Comments
```
GET /api/v1/posts/{postId}/comments
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | int | Page number |
| size | int | Items per page |

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "uuid",
        "content": "Great post!",
        "authorId": "uuid",
        "authorName": "Jane Doe",
        "createdAt": "2025-12-30T10:00:00"
      }
    ],
    "totalElements": 10
  }
}
```

##### 6.5 Delete Comment
```
DELETE /api/v1/posts/{postId}/comments/{commentId}
```
**Authorization:** Bearer token (owner or admin)

##### 6.6 Unlike Post
```
DELETE /api/v1/posts/{postId}/like
```
**Authorization:** Bearer token

---

## Missing APIs - Medium Priority

These APIs would improve functionality but have workarounds available.

---

### 7. Push Notifications

**Feature Name:** Push Notification System  
**Screen Name:** `NotificationSettings.tsx`, `usePushNotifications.tsx`  
**Current Implementation:** Supabase Edge Function  

**Why Existing API is Insufficient:**  
No push notification APIs are documented in the API specification.

#### Required Endpoints:

##### 7.1 Subscribe to Push Notifications
```
POST /api/v1/push/subscribe
```
**Request Body:**
```json
{
  "endpoint": "https://fcm.googleapis.com/...",
  "p256dh": "key...",
  "auth": "key...",
  "isAdmin": false
}
```

##### 7.2 Unsubscribe from Push Notifications
```
DELETE /api/v1/push/unsubscribe
```

##### 7.3 Send Push Notification (Admin)
```
POST /api/v1/admin/push/send
```
**Request Body:**
```json
{
  "title": "New Announcement",
  "body": "Village meeting tomorrow at 5 PM",
  "url": "/announcements",
  "targetAdminsOnly": false,
  "eventType": "announcement"
}
```

---

### 8. Market Prices

**Feature Name:** Market Prices Display  
**Screen Name:** `MarketPricesPage.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
No market prices APIs are documented.

#### Required Endpoints:

##### 8.1 Get Market Prices (Public)
```
GET /api/v1/market-prices
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| villageId | string | Filter by village |

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "cropName": "Wheat",
      "price": 2500,
      "unit": "per quintal",
      "lastUpdated": "2025-12-30T10:00:00"
    }
  ]
}
```

##### 8.2 Update Market Prices (Admin)
```
PUT /api/v1/admin/market-prices/{priceId}
```
**Request Body:**
```json
{
  "price": 2600,
  "unit": "per quintal"
}
```

##### 8.3 Add Market Price (Admin)
```
POST /api/v1/admin/market-prices
```

---

### 9. Tax Payment Integration

**Feature Name:** Tax Payment System  
**Screen Name:** `TaxPaymentPage.tsx`, `TaxPaymentReceipt.tsx`  
**Current Implementation:** Supabase Edge Function + Cashfree  

**Why Existing API is Insufficient:**  
No tax payment APIs are documented.

#### Required Endpoints:

##### 9.1 Create Tax Payment Order
```
POST /api/v1/tax/create-order
```
**Request Body:**
```json
{
  "taxType": "PROPERTY",
  "amount": 500,
  "payerName": "John Doe",
  "payerMobile": "9876543210",
  "payerEmail": "john@example.com",
  "villageAccount": "ACC123"
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "CF_ORDER_123",
    "paymentSessionId": "session_xyz",
    "amount": 500,
    "taxType": "PROPERTY"
  }
}
```

##### 9.2 Verify Tax Payment
```
POST /api/v1/tax/verify
```
**Request Body:**
```json
{
  "orderId": "CF_ORDER_123"
}
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "paymentId": "PAY_123",
    "status": "SUCCESS",
    "amount": 500,
    "paidAt": "2025-12-30T10:00:00"
  }
}
```

##### 9.3 Get Payment Receipt
```
GET /api/v1/tax/receipt/{orderId}
```

##### 9.4 Get Payment History
```
GET /api/v1/tax/history
```
**Authorization:** Bearer token

---

### 10. Village Configuration Management

**Feature Name:** JSON Config Manager  
**Screen Name:** `JsonConfigManager.tsx`  
**Current Implementation:** Supabase direct queries  

**Why Existing API is Insufficient:**  
The documented Village Config API only allows GET. Admin needs to update village configuration.

#### Required Endpoints:

##### 10.1 Update Village Config (Admin)
```
PUT /api/v1/villages/{villageId}/config
```
**Request Body:**
```json
{
  "language": "en",
  "configData": {
    "villageName": "Shivankhed Khurd",
    "sarpanchName": "Updated Name",
    "announcements": [...],
    "notices": [...],
    "gallery": [...]
  }
}
```

##### 10.2 Update Village Details (Admin)
```
PUT /api/v1/villages/{villageId}
```
**Request Body:**
```json
{
  "name": "Shivankhed Khurd",
  "district": "Buldhana",
  "taluka": "Mehkar",
  "state": "Maharashtra",
  "pincode": "443301",
  "isActive": true
}
```

---

## Missing APIs - Low Priority

These APIs are for enhanced functionality and can be deferred.

---

### 11. Announcements Management (Admin)

**Feature Name:** Announcements CRUD  
**Screen Name:** Via `JsonConfigManager.tsx`  
**Current Implementation:** Part of village config JSON  

#### Required Endpoints:

##### 11.1 List Announcements (Public)
```
GET /api/v1/announcements
```

##### 11.2 Create Announcement (Admin)
```
POST /api/v1/admin/announcements
```

##### 11.3 Update Announcement (Admin)
```
PUT /api/v1/admin/announcements/{id}
```

##### 11.4 Delete Announcement (Admin)
```
DELETE /api/v1/admin/announcements/{id}
```

---

### 12. Notices Management (Admin)

**Feature Name:** Notices CRUD  
**Screen Name:** Via `JsonConfigManager.tsx`  
**Current Implementation:** Part of village config JSON  

#### Required Endpoints:

##### 12.1 List Notices (Public)
```
GET /api/v1/notices
```

##### 12.2 Create Notice (Admin)
```
POST /api/v1/admin/notices
```

##### 12.3 Update Notice (Admin)
```
PUT /api/v1/admin/notices/{id}
```

##### 12.4 Delete Notice (Admin)
```
DELETE /api/v1/admin/notices/{id}
```

---

### 13. Gallery Management (Admin)

**Feature Name:** Gallery CRUD  
**Screen Name:** `MediaGalleryPage.tsx`, `JsonConfigManager.tsx`  
**Current Implementation:** Part of village config JSON + Supabase storage  

#### Required Endpoints:

##### 13.1 List Gallery Items (Public)
```
GET /api/v1/gallery
```

##### 13.2 Add Gallery Item (Admin)
```
POST /api/v1/admin/gallery
```

##### 13.3 Delete Gallery Item (Admin)
```
DELETE /api/v1/admin/gallery/{id}
```

---

### 14. Development Works Management

**Feature Name:** Development Projects  
**Screen Name:** `DevelopmentPage.tsx`  
**Current Implementation:** Part of village config JSON  

#### Required Endpoints:

##### 14.1 List Development Works (Public)
```
GET /api/v1/development-works
```

##### 14.2 Add Development Work (Admin)
```
POST /api/v1/admin/development-works
```

##### 14.3 Update Development Work (Admin)
```
PUT /api/v1/admin/development-works/{id}
```

##### 14.4 Delete Development Work (Admin)
```
DELETE /api/v1/admin/development-works/{id}
```

---

### 15. Panchayat Members Management

**Feature Name:** Panchayat Members  
**Screen Name:** `PanchayatPage.tsx`  
**Current Implementation:** Part of village config JSON  

#### Required Endpoints:

##### 15.1 List Panchayat Members (Public)
```
GET /api/v1/panchayat-members
```

##### 15.2 Add Member (Admin)
```
POST /api/v1/admin/panchayat-members
```

##### 15.3 Update Member (Admin)
```
PUT /api/v1/admin/panchayat-members/{id}
```

##### 15.4 Delete Member (Admin)
```
DELETE /api/v1/admin/panchayat-members/{id}
```

---

### 16. Emergency Contacts Management

**Feature Name:** Emergency Contacts  
**Screen Name:** Part of village config  
**Current Implementation:** Part of village config JSON  

#### Required Endpoints:

##### 16.1 List Emergency Contacts (Public)
```
GET /api/v1/emergency-contacts
```

##### 16.2 CRUD Emergency Contacts (Admin)
```
POST/PUT/DELETE /api/v1/admin/emergency-contacts
```

---

## Future Enhancement APIs

These APIs are for future features not yet implemented in the frontend.

---

### 17. Quick Services Submissions

**Feature Name:** Quick Services Form Submissions  
**Screen Name:** `AddService.tsx` (partial)  
**Current Implementation:** Supabase direct insert  

#### Required Endpoints:

##### 17.1 Submit Quick Service Application
```
POST /api/v1/quick-services
```
**Request Body:**
```json
{
  "serviceType": "birth_certificate",
  "applicantName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "fatherMotherName": "Father Name",
  "mobileNumber": "9876543210",
  "address": "Village Address",
  "additionalData": {}
}
```

##### 17.2 List Service Applications (Admin)
```
GET /api/v1/admin/quick-services
```

##### 17.3 Update Application Status (Admin)
```
PATCH /api/v1/admin/quick-services/{id}/status
```

---

### 18. Service Ratings

**Feature Name:** Service Star Ratings  
**Screen Name:** `Services.tsx`, `StarRating.tsx`  
**Current Implementation:** Supabase direct queries  

#### Required Endpoints:

##### 18.1 Submit Service Rating
```
POST /api/v1/services/{serviceId}/rating
```
**Request Body:**
```json
{
  "rating": 4,
  "sessionId": "anonymous-session-id"
}
```

##### 18.2 Get Service Rating Summary
```
GET /api/v1/services/{serviceId}/rating
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "averageRating": 4.2,
    "totalRatings": 150,
    "distribution": { "1": 5, "2": 10, "3": 25, "4": 60, "5": 50 }
  }
}
```

---

### 19. User Activity Logs

**Feature Name:** User Activity Tracking  
**Screen Name:** Admin Dashboard Enhancement  
**Current Implementation:** Not implemented  

#### Required Endpoints:

##### 19.1 Get User Activity Logs (Admin)
```
GET /api/v1/admin/activity-logs
```
**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | string | Filter by user |
| action | string | Filter by action type |
| dateFrom | date | Start date |
| dateTo | date | End date |

---

### 20. Dashboard Analytics

**Feature Name:** Admin Dashboard Stats  
**Screen Name:** `AdminDashboard.tsx`  
**Current Implementation:** Supabase queries with counts  

#### Required Endpoints:

##### 20.1 Get Dashboard Stats (Admin)
```
GET /api/v1/admin/dashboard/stats
```
**Expected Response:**
```json
{
  "success": true,
  "data": {
    "users": { "total": 500, "pending": 10, "approved": 485, "rejected": 5 },
    "items": { "total": 200, "pending": 15, "approved": 180, "rejected": 5 },
    "exams": { "total": 10, "active": 2, "attempts": 1500 },
    "feedback": { "total": 100, "pending": 20 },
    "recentActivity": [...]
  }
}
```

---

## API Versioning Note

All APIs should follow REST best practices:
- Base URL: `{BASE_URL}/api/v1`
- Content-Type: `application/json`
- Authorization: `Bearer {accessToken}`
- Village context: `X-Village-Id: {villageId}` where applicable

---

## Implementation Priority Order

1. **Phase 2A (Next Sprint):**
   - Admin Marketplace Management (1.1 - 1.6)
   - Update/Delete Item for owners (5.1 - 5.2)
   - Forum Post management (6.1 - 6.6)

2. **Phase 2B:**
   - Admin Exam Management (2.1 - 2.10)
   - Admin Contact Messages (3.1 - 3.4)
   - Admin Feedback Management (4.1 - 4.3)

3. **Phase 3:**
   - Push Notifications (7.1 - 7.3)
   - Market Prices (8.1 - 8.3)
   - Tax Payment (9.1 - 9.4)

4. **Phase 4:**
   - Village Config Update (10.1 - 10.2)
   - Announcements/Notices/Gallery Management
   - Dashboard Analytics

---

**Document maintained by:** Frontend Team  
**Last Updated:** December 30, 2025  
**Next Review:** After Phase 2A completion
