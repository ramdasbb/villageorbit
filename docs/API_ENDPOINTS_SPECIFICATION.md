# API Endpoints Specification

This document contains the complete API specification with request/response payloads based on the Supabase database schema.

---

## Forum/Posts APIs

### Database Tables

**Table: `posts`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| village_id | uuid | Yes | None |
| user_id | uuid | No | None |
| title | text | No | None |
| content | text | No | None |
| image_url | text | Yes | None |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Table: `comments`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| post_id | uuid | No | None |
| user_id | uuid | No | None |
| content | text | No | None |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Table: `post_likes`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| post_id | uuid | No | None |
| user_id | uuid | No | None |
| created_at | timestamp with time zone | No | now() |

---

### GET `/api/v1/posts`
**Description:** List posts (paginated)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-indexed) |
| limit | integer | No | 20 | Items per page |
| village_id | uuid | No | - | Filter by village |
| user_id | uuid | No | - | Filter by author |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/posts?page=0&limit=20' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "village_id": "123e4567-e89b-12d3-a456-426614174000",
        "user_id": "789e0123-e45b-67c8-d901-234567890abc",
        "title": "Community Meeting Announcement",
        "content": "We will have a community meeting this Saturday...",
        "image_url": "https://storage.example.com/posts/image1.jpg",
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-15T10:30:00Z",
        "author": {
          "id": "789e0123-e45b-67c8-d901-234567890abc",
          "full_name": "Rajesh Kumar",
          "email": "rajesh@example.com"
        },
        "likes_count": 15,
        "comments_count": 5,
        "is_liked": true
      }
    ],
    "total": 45,
    "page": 0,
    "limit": 20,
    "total_pages": 3
  }
}
```

---

### POST `/api/v1/posts`
**Description:** Create a new post

**Request Body:**
```json
{
  "title": "string (required, max 255 chars)",
  "content": "string (required)",
  "image_url": "string (optional, valid URL)",
  "village_id": "uuid (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/posts' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Community Meeting Announcement",
    "content": "We will have a community meeting this Saturday at 5 PM in the village hall.",
    "image_url": "https://storage.example.com/posts/meeting.jpg",
    "village_id": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "village_id": "123e4567-e89b-12d3-a456-426614174000",
    "user_id": "789e0123-e45b-67c8-d901-234567890abc",
    "title": "Community Meeting Announcement",
    "content": "We will have a community meeting this Saturday at 5 PM in the village hall.",
    "image_url": "https://storage.example.com/posts/meeting.jpg",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### PUT `/api/v1/posts/{postId}`
**Description:** Update a post (owner or admin only)

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| postId | uuid | Yes | Post ID |

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "image_url": "string (optional)"
}
```

**Request:**
```bash
curl -X 'PUT' \
  'https://core-api-tlw6.onrender.com/api/v1/posts/550e8400-e29b-41d4-a716-446655440000' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Updated: Community Meeting Announcement",
    "content": "Meeting rescheduled to Sunday at 6 PM."
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Updated: Community Meeting Announcement",
    "content": "Meeting rescheduled to Sunday at 6 PM.",
    "image_url": "https://storage.example.com/posts/meeting.jpg",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
```

---

### DELETE `/api/v1/posts/{postId}`
**Description:** Delete a post (owner or admin only)

**Request:**
```bash
curl -X 'DELETE' \
  'https://core-api-tlw6.onrender.com/api/v1/posts/550e8400-e29b-41d4-a716-446655440000' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### POST `/api/v1/posts/{postId}/like`
**Description:** Like a post

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/posts/550e8400-e29b-41d4-a716-446655440000/like' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "789e0123-e45b-67c8-d901-234567890abc",
    "created_at": "2025-01-15T11:00:00Z"
  }
}
```

---

### DELETE `/api/v1/posts/{postId}/like`
**Description:** Unlike a post

**Request:**
```bash
curl -X 'DELETE' \
  'https://core-api-tlw6.onrender.com/api/v1/posts/550e8400-e29b-41d4-a716-446655440000/like' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Post unliked successfully"
}
```

---

### GET `/api/v1/posts/{postId}/comments`
**Description:** Get comments for a post

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 20 | Items per page |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/posts/550e8400-e29b-41d4-a716-446655440000/comments?page=0&limit=20' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440002",
        "post_id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "889e0123-e45b-67c8-d901-234567890def",
        "content": "Looking forward to the meeting!",
        "created_at": "2025-01-15T11:30:00Z",
        "updated_at": "2025-01-15T11:30:00Z",
        "author": {
          "id": "889e0123-e45b-67c8-d901-234567890def",
          "full_name": "Priya Sharma"
        }
      }
    ],
    "total": 5,
    "page": 0,
    "limit": 20
  }
}
```

---

### POST `/api/v1/posts/{postId}/comments`
**Description:** Add a comment to a post

**Request Body:**
```json
{
  "content": "string (required, max 1000 chars)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/posts/550e8400-e29b-41d4-a716-446655440000/comments' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Looking forward to the meeting!"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "post_id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "889e0123-e45b-67c8-d901-234567890def",
    "content": "Looking forward to the meeting!",
    "created_at": "2025-01-15T11:30:00Z",
    "updated_at": "2025-01-15T11:30:00Z"
  }
}
```

---

### DELETE `/api/v1/comments/{commentId}`
**Description:** Delete a comment (owner or admin only)

**Request:**
```bash
curl -X 'DELETE' \
  'https://core-api-tlw6.onrender.com/api/v1/comments/770e8400-e29b-41d4-a716-446655440002' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Marketplace/Buy-Sell APIs

### Database Table: `items`
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | Yes | None |
| item_name | text | No | None |
| category | text | No | None |
| description | text | Yes | None |
| price | numeric | No | None |
| village | text | No | 'Shivankhed Khurd' |
| contact | text | No | None |
| image_urls | text[] | Yes | ARRAY[]::text[] |
| seller_name | text | Yes | None |
| status | text | No | 'pending' |
| rejection_reason | text | Yes | None |
| is_available | boolean | No | true |
| sold | boolean | Yes | false |
| reviewed_by | uuid | Yes | None |
| reviewed_at | timestamp with time zone | Yes | None |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Status Values:** `pending`, `approved`, `rejected`

---

### GET `/api/v1/items`
**Description:** List marketplace items (paginated)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 20 | Items per page |
| category | string | No | - | Filter by category |
| status | string | No | - | Filter by status (admin only) |
| village | string | No | - | Filter by village |
| user_id | uuid | No | - | Filter by seller |
| is_available | boolean | No | - | Filter by availability |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/items?page=0&limit=20&status=approved' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "880e8400-e29b-41d4-a716-446655440003",
        "user_id": "789e0123-e45b-67c8-d901-234567890abc",
        "item_name": "Tractor for Sale",
        "category": "Agriculture",
        "description": "Well maintained Mahindra tractor, 2020 model",
        "price": 450000,
        "village": "Shivankhed Khurd",
        "contact": "9876543210",
        "image_urls": [
          "https://storage.example.com/items/tractor1.jpg",
          "https://storage.example.com/items/tractor2.jpg"
        ],
        "seller_name": "Ramesh Patil",
        "status": "approved",
        "is_available": true,
        "sold": false,
        "reviewed_by": "admin-uuid",
        "reviewed_at": "2025-01-14T09:00:00Z",
        "created_at": "2025-01-13T15:00:00Z",
        "updated_at": "2025-01-14T09:00:00Z"
      }
    ],
    "total": 25,
    "page": 0,
    "limit": 20,
    "total_pages": 2
  }
}
```

---

### POST `/api/v1/items`
**Description:** Create a new item listing

**Request Body:**
```json
{
  "item_name": "string (required, max 255 chars)",
  "category": "string (required)",
  "description": "string (optional)",
  "price": "number (required, > 0)",
  "village": "string (optional, default: 'Shivankhed Khurd')",
  "contact": "string (required, valid phone)",
  "image_urls": ["string array (optional)"],
  "seller_name": "string (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/items' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "item_name": "Tractor for Sale",
    "category": "Agriculture",
    "description": "Well maintained Mahindra tractor, 2020 model",
    "price": 450000,
    "village": "Shivankhed Khurd",
    "contact": "9876543210",
    "image_urls": ["https://storage.example.com/items/tractor1.jpg"],
    "seller_name": "Ramesh Patil"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "user_id": "789e0123-e45b-67c8-d901-234567890abc",
    "item_name": "Tractor for Sale",
    "category": "Agriculture",
    "description": "Well maintained Mahindra tractor, 2020 model",
    "price": 450000,
    "village": "Shivankhed Khurd",
    "contact": "9876543210",
    "image_urls": ["https://storage.example.com/items/tractor1.jpg"],
    "seller_name": "Ramesh Patil",
    "status": "pending",
    "is_available": true,
    "sold": false,
    "created_at": "2025-01-13T15:00:00Z",
    "updated_at": "2025-01-13T15:00:00Z"
  },
  "message": "Item submitted for review"
}
```

---

### PUT `/api/v1/items/{itemId}`
**Description:** Update an item (owner or admin only)

**Request Body:**
```json
{
  "item_name": "string (optional)",
  "category": "string (optional)",
  "description": "string (optional)",
  "price": "number (optional)",
  "contact": "string (optional)",
  "image_urls": ["string array (optional)"],
  "is_available": "boolean (optional)",
  "sold": "boolean (optional)"
}
```

**Request:**
```bash
curl -X 'PUT' \
  'https://core-api-tlw6.onrender.com/api/v1/items/880e8400-e29b-41d4-a716-446655440003' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "price": 425000,
    "description": "Price reduced! Well maintained Mahindra tractor, 2020 model"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "item_name": "Tractor for Sale",
    "price": 425000,
    "description": "Price reduced! Well maintained Mahindra tractor, 2020 model",
    "updated_at": "2025-01-15T10:00:00Z"
  }
}
```

---

### DELETE `/api/v1/items/{itemId}`
**Description:** Delete an item (owner or admin only)

**Request:**
```bash
curl -X 'DELETE' \
  'https://core-api-tlw6.onrender.com/api/v1/items/880e8400-e29b-41d4-a716-446655440003' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

### POST `/api/v1/items/{itemId}/approve`
**Description:** Admin approve item (changes status to 'approved')

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/items/880e8400-e29b-41d4-a716-446655440003/approve' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "status": "approved",
    "reviewed_by": "admin-uuid",
    "reviewed_at": "2025-01-15T11:00:00Z"
  },
  "message": "Item approved successfully"
}
```

---

### POST `/api/v1/items/{itemId}/reject`
**Description:** Admin reject item (changes status to 'rejected')

**Request Body:**
```json
{
  "reason": "string (required)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/items/880e8400-e29b-41d4-a716-446655440003/reject' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "reason": "Inappropriate content in description"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "880e8400-e29b-41d4-a716-446655440003",
    "status": "rejected",
    "rejection_reason": "Inappropriate content in description",
    "reviewed_by": "admin-uuid",
    "reviewed_at": "2025-01-15T11:00:00Z"
  },
  "message": "Item rejected"
}
```

---

## Exams APIs

### Database Tables

**Table: `exams`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| village_id | uuid | Yes | None |
| title | text | No | None |
| description | text | Yes | None |
| subject | exam_subject (enum) | No | None |
| total_questions | integer | No | 100 |
| total_marks | integer | Yes | 100 |
| pass_marks | integer | Yes | 40 |
| duration_minutes | integer | No | 60 |
| scheduled_at | timestamp with time zone | No | None |
| ends_at | timestamp with time zone | No | None |
| status | exam_status (enum) | No | 'draft' |
| is_active | boolean | Yes | true |
| created_by | uuid | Yes | None |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Enums:**
- `exam_subject`: 'GK', 'Science', 'Math', 'English'
- `exam_status`: 'draft', 'scheduled', 'active', 'completed', 'cancelled'

**Table: `exam_questions`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| exam_id | uuid | No | None |
| question | text | No | None |
| option_a | text | No | None |
| option_b | text | No | None |
| option_c | text | No | None |
| option_d | text | No | None |
| correct_option | text | No | None |
| explanation | text | Yes | None |
| subject | exam_subject | No | None |
| difficulty | text | Yes | None |
| class | text | Yes | '7th Standard' |
| topic | text | Yes | None |
| marks_per_question | integer | Yes | 1 |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Table: `exam_attempts`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| exam_id | uuid | No | None |
| user_id | uuid | No | None |
| student_name | text | No | None |
| start_time | timestamp with time zone | No | now() |
| end_time | timestamp with time zone | Yes | None |
| total_questions | integer | No | None |
| correct_answers | integer | Yes | 0 |
| wrong_answers | integer | Yes | 0 |
| unanswered | integer | Yes | 0 |
| score | integer | Yes | None |
| integrity_pledge_accepted | boolean | No | false |
| start_snapshot_url | text | Yes | None |
| end_snapshot_url | text | Yes | None |
| created_at | timestamp with time zone | No | now() |

**Table: `exam_answers`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| attempt_id | uuid | No | None |
| question_id | uuid | No | None |
| selected_option | text | Yes | None |
| is_correct | boolean | Yes | None |
| answered_at | timestamp with time zone | Yes | now() |

---

### GET `/api/v1/exams`
**Description:** List exams

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 20 | Items per page |
| status | string | No | - | Filter by status |
| subject | string | No | - | Filter by subject |
| is_active | boolean | No | - | Filter by active status |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/exams?page=0&limit=20&status=active' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440004",
        "village_id": "123e4567-e89b-12d3-a456-426614174000",
        "title": "Grade 7 General Knowledge Test",
        "description": "Monthly GK assessment for 7th standard students",
        "subject": "GK",
        "total_questions": 50,
        "total_marks": 50,
        "pass_marks": 20,
        "duration_minutes": 45,
        "scheduled_at": "2025-01-20T09:00:00Z",
        "ends_at": "2025-01-20T10:00:00Z",
        "status": "scheduled",
        "is_active": true,
        "created_by": "admin-uuid",
        "created_at": "2025-01-10T08:00:00Z",
        "updated_at": "2025-01-10T08:00:00Z"
      }
    ],
    "total": 10,
    "page": 0,
    "limit": 20
  }
}
```

---

### GET `/api/v1/exams/{examId}`
**Description:** Get exam details

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/exams/990e8400-e29b-41d4-a716-446655440004' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440004",
    "village_id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Grade 7 General Knowledge Test",
    "description": "Monthly GK assessment for 7th standard students",
    "subject": "GK",
    "total_questions": 50,
    "total_marks": 50,
    "pass_marks": 20,
    "duration_minutes": 45,
    "scheduled_at": "2025-01-20T09:00:00Z",
    "ends_at": "2025-01-20T10:00:00Z",
    "status": "scheduled",
    "is_active": true,
    "created_by": "admin-uuid",
    "created_at": "2025-01-10T08:00:00Z",
    "updated_at": "2025-01-10T08:00:00Z",
    "questions_count": 50,
    "attempts_count": 25
  }
}
```

---

### GET `/api/v1/exams/{examId}/questions`
**Description:** Get exam questions (available during active exam only)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| shuffle | boolean | No | true | Shuffle question order |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/exams/990e8400-e29b-41d4-a716-446655440004/questions' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "exam_id": "990e8400-e29b-41d4-a716-446655440004",
    "questions": [
      {
        "id": "aa0e8400-e29b-41d4-a716-446655440005",
        "question": "What is the capital of India?",
        "option_a": "Mumbai",
        "option_b": "New Delhi",
        "option_c": "Kolkata",
        "option_d": "Chennai",
        "subject": "GK",
        "difficulty": "easy",
        "class": "7th Standard",
        "topic": "Indian Geography",
        "marks_per_question": 1
      }
    ],
    "total_questions": 50
  }
}
```

**Note:** `correct_option` and `explanation` are NOT included in response during exam. Only shown after submission.

---

### POST `/api/v1/exams/{examId}/attempts`
**Description:** Start an exam attempt

**Request Body:**
```json
{
  "student_name": "string (required)",
  "integrity_pledge_accepted": "boolean (required, must be true)",
  "start_snapshot_url": "string (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/exams/990e8400-e29b-41d4-a716-446655440004/attempts' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "student_name": "Amit Kumar",
    "integrity_pledge_accepted": true,
    "start_snapshot_url": "https://storage.example.com/snapshots/start_123.jpg"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "exam_id": "990e8400-e29b-41d4-a716-446655440004",
    "user_id": "789e0123-e45b-67c8-d901-234567890abc",
    "student_name": "Amit Kumar",
    "start_time": "2025-01-20T09:05:00Z",
    "total_questions": 50,
    "integrity_pledge_accepted": true,
    "start_snapshot_url": "https://storage.example.com/snapshots/start_123.jpg"
  }
}
```

---

### PUT `/api/v1/attempts/{attemptId}`
**Description:** Submit exam answers

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": "uuid (required)",
      "selected_option": "string (A/B/C/D or null)"
    }
  ],
  "end_snapshot_url": "string (optional)"
}
```

**Request:**
```bash
curl -X 'PUT' \
  'https://core-api-tlw6.onrender.com/api/v1/attempts/bb0e8400-e29b-41d4-a716-446655440006' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "answers": [
      {
        "question_id": "aa0e8400-e29b-41d4-a716-446655440005",
        "selected_option": "B"
      },
      {
        "question_id": "aa0e8400-e29b-41d4-a716-446655440006",
        "selected_option": "A"
      }
    ],
    "end_snapshot_url": "https://storage.example.com/snapshots/end_123.jpg"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "bb0e8400-e29b-41d4-a716-446655440006",
    "exam_id": "990e8400-e29b-41d4-a716-446655440004",
    "end_time": "2025-01-20T09:45:00Z",
    "total_questions": 50,
    "correct_answers": 35,
    "wrong_answers": 10,
    "unanswered": 5,
    "score": 35,
    "end_snapshot_url": "https://storage.example.com/snapshots/end_123.jpg"
  },
  "message": "Exam submitted successfully"
}
```

---

### GET `/api/v1/attempts/{attemptId}/results`
**Description:** Get detailed exam results

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/attempts/bb0e8400-e29b-41d4-a716-446655440006/results' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "attempt": {
      "id": "bb0e8400-e29b-41d4-a716-446655440006",
      "exam_id": "990e8400-e29b-41d4-a716-446655440004",
      "student_name": "Amit Kumar",
      "start_time": "2025-01-20T09:05:00Z",
      "end_time": "2025-01-20T09:45:00Z",
      "total_questions": 50,
      "correct_answers": 35,
      "wrong_answers": 10,
      "unanswered": 5,
      "score": 35,
      "percentage": 70,
      "passed": true
    },
    "exam": {
      "title": "Grade 7 General Knowledge Test",
      "total_marks": 50,
      "pass_marks": 20
    },
    "answers": [
      {
        "question_id": "aa0e8400-e29b-41d4-a716-446655440005",
        "question": "What is the capital of India?",
        "selected_option": "B",
        "correct_option": "B",
        "is_correct": true,
        "explanation": "New Delhi is the capital of India."
      }
    ]
  }
}
```

---

### POST `/api/v1/exams/{examId}/questions/import`
**Description:** Import exam questions from file (Admin only)

**Request:** Multipart form data
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/exams/990e8400-e29b-41d4-a716-446655440004/questions/import' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -F 'file=@questions.json'
```

**File Format (JSON):**
```json
[
  {
    "question": "What is the capital of India?",
    "option_a": "Mumbai",
    "option_b": "New Delhi",
    "option_c": "Kolkata",
    "option_d": "Chennai",
    "correct_option": "B",
    "explanation": "New Delhi is the capital of India.",
    "subject": "GK",
    "difficulty": "easy",
    "class": "7th Standard",
    "topic": "Indian Geography",
    "marks_per_question": 1
  }
]
```

**File Format (XLSX):**
| question | option_a | option_b | option_c | option_d | correct_option | explanation | subject | difficulty | class | topic | marks |
|----------|----------|----------|----------|----------|----------------|-------------|---------|------------|-------|-------|-------|
| What is the capital of India? | Mumbai | New Delhi | Kolkata | Chennai | B | New Delhi is the capital | GK | easy | 7th Standard | Indian Geography | 1 |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "imported": 50,
    "failed": 2,
    "errors": [
      {
        "row": 15,
        "error": "Missing required field: correct_option"
      }
    ]
  },
  "message": "50 questions imported successfully, 2 failed"
}
```

---

## Village Services APIs

### Database Tables

**Table: `village_services`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| village_id | uuid | Yes | None |
| category | text | No | None |
| name | text | No | None |
| owner | text | Yes | None |
| contact | text | Yes | None |
| address | text | Yes | None |
| hours | text | Yes | None |
| speciality | text | Yes | None |
| image_url | text | Yes | None |
| created_at | timestamp with time zone | Yes | now() |
| updated_at | timestamp with time zone | Yes | now() |

**Table: `service_ratings`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| service_id | text | No | None |
| village_id | uuid | Yes | None |
| session_id | text | No | None |
| rating | integer | No | None |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Table: `service_categories`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | text | No | None |
| display_order | integer | Yes | 0 |
| is_active | boolean | Yes | true |
| created_at | timestamp with time zone | Yes | now() |
| updated_at | timestamp with time zone | Yes | now() |

---

### GET `/api/v1/services`
**Description:** List village services

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 50 | Items per page |
| category | string | No | - | Filter by category |
| village_id | uuid | No | - | Filter by village |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/services?page=0&limit=50&category=Medical' \
  -H 'accept: application/json'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "cc0e8400-e29b-41d4-a716-446655440007",
        "village_id": "123e4567-e89b-12d3-a456-426614174000",
        "category": "Medical",
        "name": "Dr. Sharma Clinic",
        "owner": "Dr. Rajesh Sharma",
        "contact": "9876543210",
        "address": "Main Road, Near Temple, Shivankhed",
        "hours": "9 AM - 1 PM, 5 PM - 8 PM",
        "speciality": "General Physician",
        "image_url": "https://storage.example.com/services/clinic.jpg",
        "created_at": "2025-01-01T10:00:00Z",
        "updated_at": "2025-01-01T10:00:00Z",
        "average_rating": 4.5,
        "total_ratings": 25
      }
    ],
    "total": 15,
    "page": 0,
    "limit": 50
  }
}
```

---

### POST `/api/v1/services`
**Description:** Add a new service (Admin only)

**Request Body:**
```json
{
  "category": "string (required)",
  "name": "string (required)",
  "owner": "string (optional)",
  "contact": "string (optional)",
  "address": "string (optional)",
  "hours": "string (optional)",
  "speciality": "string (optional)",
  "image_url": "string (optional)",
  "village_id": "uuid (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/services' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "category": "Medical",
    "name": "Dr. Sharma Clinic",
    "owner": "Dr. Rajesh Sharma",
    "contact": "9876543210",
    "address": "Main Road, Near Temple, Shivankhed",
    "hours": "9 AM - 1 PM, 5 PM - 8 PM",
    "speciality": "General Physician"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "cc0e8400-e29b-41d4-a716-446655440007",
    "category": "Medical",
    "name": "Dr. Sharma Clinic",
    "owner": "Dr. Rajesh Sharma",
    "contact": "9876543210",
    "address": "Main Road, Near Temple, Shivankhed",
    "hours": "9 AM - 1 PM, 5 PM - 8 PM",
    "speciality": "General Physician",
    "created_at": "2025-01-15T10:00:00Z"
  }
}
```

---

### PUT `/api/v1/services/{serviceId}`
**Description:** Update a service (Admin only)

**Request:**
```bash
curl -X 'PUT' \
  'https://core-api-tlw6.onrender.com/api/v1/services/cc0e8400-e29b-41d4-a716-446655440007' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "hours": "9 AM - 2 PM, 5 PM - 9 PM",
    "contact": "9876543211"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cc0e8400-e29b-41d4-a716-446655440007",
    "hours": "9 AM - 2 PM, 5 PM - 9 PM",
    "contact": "9876543211",
    "updated_at": "2025-01-15T12:00:00Z"
  }
}
```

---

### DELETE `/api/v1/services/{serviceId}`
**Description:** Delete a service (Admin only)

**Request:**
```bash
curl -X 'DELETE' \
  'https://core-api-tlw6.onrender.com/api/v1/services/cc0e8400-e29b-41d4-a716-446655440007' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

### POST `/api/v1/services/{serviceId}/rating`
**Description:** Rate a service (no auth required, uses session)

**Request Body:**
```json
{
  "rating": "integer (required, 1-5)",
  "session_id": "string (required, unique per user session)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/services/cc0e8400-e29b-41d4-a716-446655440007/rating' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "rating": 5,
    "session_id": "user-session-abc123"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "dd0e8400-e29b-41d4-a716-446655440008",
    "service_id": "cc0e8400-e29b-41d4-a716-446655440007",
    "rating": 5,
    "session_id": "user-session-abc123",
    "created_at": "2025-01-15T14:00:00Z"
  }
}
```

---

## Feedback/Contact APIs

### Database Tables

**Table: `feedback_submissions`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| village_id | uuid | Yes | None |
| name | text | No | None |
| mobile | text | No | None |
| type | text | No | None |
| message | text | No | None |
| status | text | Yes | 'new' |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

**Table: `contact_form_submissions`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| village_id | uuid | Yes | None |
| name | text | No | None |
| mobile | text | No | None |
| email | text | Yes | None |
| subject | text | Yes | None |
| message | text | No | None |
| status | text | Yes | 'new' |
| created_at | timestamp with time zone | Yes | now() |
| updated_at | timestamp with time zone | Yes | now() |

---

### POST `/api/v1/feedback`
**Description:** Submit feedback (no auth required)

**Request Body:**
```json
{
  "name": "string (required)",
  "mobile": "string (required, valid phone)",
  "type": "string (required: 'complaint', 'suggestion', 'appreciation')",
  "message": "string (required)",
  "village_id": "uuid (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/feedback' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Suresh Kumar",
    "mobile": "9876543210",
    "type": "suggestion",
    "message": "Please add more street lights in the market area."
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ee0e8400-e29b-41d4-a716-446655440009",
    "name": "Suresh Kumar",
    "mobile": "9876543210",
    "type": "suggestion",
    "message": "Please add more street lights in the market area.",
    "status": "new",
    "created_at": "2025-01-15T15:00:00Z"
  },
  "message": "Feedback submitted successfully"
}
```

---

### GET `/api/v1/admin/feedback`
**Description:** List all feedback (Admin only)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 20 | Items per page |
| status | string | No | - | Filter by status |
| type | string | No | - | Filter by type |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/admin/feedback?page=0&limit=20&status=new' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ee0e8400-e29b-41d4-a716-446655440009",
        "name": "Suresh Kumar",
        "mobile": "9876543210",
        "type": "suggestion",
        "message": "Please add more street lights in the market area.",
        "status": "new",
        "created_at": "2025-01-15T15:00:00Z",
        "updated_at": "2025-01-15T15:00:00Z"
      }
    ],
    "total": 50,
    "page": 0,
    "limit": 20
  }
}
```

---

### POST `/api/v1/contact`
**Description:** Submit contact form (no auth required)

**Request Body:**
```json
{
  "name": "string (required)",
  "mobile": "string (required)",
  "email": "string (optional, valid email)",
  "subject": "string (optional)",
  "message": "string (required)",
  "village_id": "uuid (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/contact' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Priya Devi",
    "mobile": "9876543211",
    "email": "priya@example.com",
    "subject": "Inquiry about water supply",
    "message": "I would like to know about the new water supply scheme."
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "ff0e8400-e29b-41d4-a716-446655440010",
    "name": "Priya Devi",
    "mobile": "9876543211",
    "email": "priya@example.com",
    "subject": "Inquiry about water supply",
    "message": "I would like to know about the new water supply scheme.",
    "status": "new",
    "created_at": "2025-01-15T16:00:00Z"
  },
  "message": "Contact form submitted successfully"
}
```

---

### GET `/api/v1/admin/contact`
**Description:** List contact messages (Admin only)

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 20 | Items per page |
| status | string | No | - | Filter by status |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/admin/contact?page=0&limit=20' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "ff0e8400-e29b-41d4-a716-446655440010",
        "name": "Priya Devi",
        "mobile": "9876543211",
        "email": "priya@example.com",
        "subject": "Inquiry about water supply",
        "message": "I would like to know about the new water supply scheme.",
        "status": "new",
        "created_at": "2025-01-15T16:00:00Z",
        "updated_at": "2025-01-15T16:00:00Z"
      }
    ],
    "total": 30,
    "page": 0,
    "limit": 20
  }
}
```

---

## Push Notifications APIs

### Database Tables

**Table: `push_subscriptions`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | Yes | None |
| endpoint | text | No | None |
| p256dh | text | No | None |
| auth | text | No | None |
| is_admin | boolean | Yes | false |
| created_at | timestamp with time zone | Yes | now() |
| updated_at | timestamp with time zone | Yes | now() |

**Table: `notification_logs`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| event_type | text | No | None |
| event_id | uuid | Yes | None |
| title | text | No | None |
| body | text | No | None |
| url | text | Yes | None |
| target_audience | text | No | 'all' |
| sent_count | integer | Yes | 0 |
| created_at | timestamp with time zone | Yes | now() |

---

### POST `/api/v1/push/subscribe`
**Description:** Register push subscription

**Request Body:**
```json
{
  "endpoint": "string (required, push service URL)",
  "keys": {
    "p256dh": "string (required)",
    "auth": "string (required)"
  },
  "is_admin": "boolean (optional, default: false)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/push/subscribe' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BNcRd...",
      "auth": "tBH..."
    },
    "is_admin": false
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "gg0e8400-e29b-41d4-a716-446655440011",
    "user_id": "789e0123-e45b-67c8-d901-234567890abc",
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "is_admin": false,
    "created_at": "2025-01-15T17:00:00Z"
  },
  "message": "Push subscription registered"
}
```

---

### DELETE `/api/v1/push/unsubscribe`
**Description:** Remove push subscription

**Request Body:**
```json
{
  "endpoint": "string (required)"
}
```

**Request:**
```bash
curl -X 'DELETE' \
  'https://core-api-tlw6.onrender.com/api/v1/push/unsubscribe' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "endpoint": "https://fcm.googleapis.com/fcm/send/..."
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Push subscription removed"
}
```

---

### POST `/api/v1/admin/push/send`
**Description:** Send push notification (Admin only)

**Request Body:**
```json
{
  "title": "string (required)",
  "body": "string (required)",
  "url": "string (optional, click action URL)",
  "target_audience": "string (optional: 'all', 'admins', default: 'all')",
  "event_type": "string (optional)",
  "event_id": "uuid (optional)"
}
```

**Request:**
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/admin/push/send' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Important Announcement",
    "body": "Village meeting scheduled for tomorrow at 5 PM",
    "url": "/announcements",
    "target_audience": "all",
    "event_type": "announcement"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "hh0e8400-e29b-41d4-a716-446655440012",
    "title": "Important Announcement",
    "body": "Village meeting scheduled for tomorrow at 5 PM",
    "url": "/announcements",
    "target_audience": "all",
    "event_type": "announcement",
    "sent_count": 150,
    "created_at": "2025-01-15T18:00:00Z"
  },
  "message": "Notification sent to 150 subscribers"
}
```

---

## Villages/Multi-tenant APIs

### Database Tables

**Table: `villages`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| name | text | No | None |
| state | text | No | None |
| district | text | No | None |
| pincode | text | No | None |
| established | text | Yes | None |
| area | text | Yes | None |
| latitude | text | Yes | None |
| longitude | text | Yes | None |
| altitude | text | Yes | None |
| description | text | Yes | None |
| vision | text | Yes | None |
| is_active | boolean | Yes | true |
| created_at | timestamp with time zone | Yes | now() |
| updated_at | timestamp with time zone | Yes | now() |

**Table: `village_config`**
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| village_id | uuid | No | None |
| config_data | jsonb | No | None |
| language | text | No | 'en' |
| updated_by | uuid | Yes | None |
| created_at | timestamp with time zone | No | now() |
| updated_at | timestamp with time zone | No | now() |

---

### GET `/api/v1/villages`
**Description:** List all villages

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number |
| limit | integer | No | 50 | Items per page |
| is_active | boolean | No | true | Filter by active status |
| state | string | No | - | Filter by state |
| district | string | No | - | Filter by district |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/villages?page=0&limit=50&is_active=true' \
  -H 'accept: application/json'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "Shivankhed Khurd",
        "state": "Maharashtra",
        "district": "Jalna",
        "pincode": "431203",
        "established": "1850",
        "area": "15 sq km",
        "latitude": "19.8347",
        "longitude": "75.8816",
        "altitude": "500m",
        "description": "A beautiful village in Maharashtra...",
        "vision": "To become a model digital village...",
        "is_active": true,
        "created_at": "2025-01-01T00:00:00Z",
        "updated_at": "2025-01-01T00:00:00Z"
      }
    ],
    "total": 5,
    "page": 0,
    "limit": 50
  }
}
```

---

### GET `/api/v1/villages/{villageId}/config`
**Description:** Get village configuration

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| language | string | No | 'en' | Language code |

**Request:**
```bash
curl -X 'GET' \
  'https://core-api-tlw6.onrender.com/api/v1/villages/123e4567-e89b-12d3-a456-426614174000/config?language=en' \
  -H 'accept: application/json'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ii0e8400-e29b-41d4-a716-446655440013",
    "village_id": "123e4567-e89b-12d3-a456-426614174000",
    "language": "en",
    "config_data": {
      "hero": {
        "title": "Welcome to Shivankhed Khurd",
        "subtitle": "A Digital Village Initiative",
        "backgroundImage": "/images/village-hero.jpg"
      },
      "features": {
        "marketplace": true,
        "forum": true,
        "exams": true,
        "taxPayment": true
      },
      "contact": {
        "phone": "1234567890",
        "email": "contact@village.gov.in",
        "address": "Gram Panchayat Office, Shivankhed"
      },
      "socialMedia": {
        "facebook": "https://facebook.com/shivankhed",
        "twitter": "https://twitter.com/shivankhed"
      }
    },
    "updated_by": "admin-uuid",
    "created_at": "2025-01-01T00:00:00Z",
    "updated_at": "2025-01-10T12:00:00Z"
  }
}
```

---

### PUT `/api/v1/villages/{villageId}`
**Description:** Update village details (Admin only)

**Request Body:**
```json
{
  "name": "string (optional)",
  "state": "string (optional)",
  "district": "string (optional)",
  "pincode": "string (optional)",
  "established": "string (optional)",
  "area": "string (optional)",
  "latitude": "string (optional)",
  "longitude": "string (optional)",
  "altitude": "string (optional)",
  "description": "string (optional)",
  "vision": "string (optional)",
  "is_active": "boolean (optional)"
}
```

**Request:**
```bash
curl -X 'PUT' \
  'https://core-api-tlw6.onrender.com/api/v1/villages/123e4567-e89b-12d3-a456-426614174000' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "description": "Updated village description with new development projects",
    "vision": "To become the most digitally advanced village by 2030"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Shivankhed Khurd",
    "description": "Updated village description with new development projects",
    "vision": "To become the most digitally advanced village by 2030",
    "updated_at": "2025-01-15T19:00:00Z"
  }
}
```

---

### PUT `/api/v1/villages/{villageId}/config`
**Description:** Update village configuration (Admin only)

**Request Body:**
```json
{
  "language": "string (optional, default: 'en')",
  "config_data": {
    "hero": {},
    "features": {},
    "contact": {},
    "socialMedia": {}
  }
}
```

**Request:**
```bash
curl -X 'PUT' \
  'https://core-api-tlw6.onrender.com/api/v1/villages/123e4567-e89b-12d3-a456-426614174000/config' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {admin_access_token}' \
  -H 'Content-Type: application/json' \
  -d '{
    "language": "en",
    "config_data": {
      "hero": {
        "title": "Welcome to Shivankhed Khurd",
        "subtitle": "A Smart Digital Village"
      },
      "features": {
        "marketplace": true,
        "forum": true,
        "exams": true,
        "taxPayment": true
      }
    }
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ii0e8400-e29b-41d4-a716-446655440013",
    "village_id": "123e4567-e89b-12d3-a456-426614174000",
    "language": "en",
    "config_data": {
      "hero": {
        "title": "Welcome to Shivankhed Khurd",
        "subtitle": "A Smart Digital Village"
      },
      "features": {
        "marketplace": true,
        "forum": true,
        "exams": true,
        "taxPayment": true
      }
    },
    "updated_by": "admin-uuid",
    "updated_at": "2025-01-15T20:00:00Z"
  }
}
```

---

## File Storage APIs (Future)

### POST `/api/v1/upload`
**Description:** Upload a file

**Request:** Multipart form data
```bash
curl -X 'POST' \
  'https://core-api-tlw6.onrender.com/api/v1/upload' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer {access_token}' \
  -F 'file=@image.jpg' \
  -F 'bucket=items' \
  -F 'folder=products'
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "file_id": "jj0e8400-e29b-41d4-a716-446655440014",
    "file_name": "image.jpg",
    "file_url": "https://storage.example.com/items/products/image.jpg",
    "file_size": 102400,
    "mime_type": "image/jpeg",
    "created_at": "2025-01-15T21:00:00Z"
  }
}
```

---

### GET `/api/v1/files/{fileId}`
**Description:** Get file URL

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "file_id": "jj0e8400-e29b-41d4-a716-446655440014",
    "file_url": "https://storage.example.com/items/products/image.jpg",
    "signed_url": "https://storage.example.com/items/products/image.jpg?token=...",
    "expires_at": "2025-01-15T22:00:00Z"
  }
}
```

---

### DELETE `/api/v1/files/{fileId}`
**Description:** Delete a file

**Response (200 OK):**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

---

## Analytics APIs (Future)

### GET `/api/v1/admin/analytics/exams`
**Description:** Get exam analytics

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| start_date | date | No | Start date filter |
| end_date | date | No | End date filter |
| exam_id | uuid | No | Filter by specific exam |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_exams": 25,
    "total_attempts": 500,
    "average_score": 65.5,
    "pass_rate": 72.3,
    "by_subject": [
      { "subject": "GK", "attempts": 200, "avg_score": 70 },
      { "subject": "Math", "attempts": 150, "avg_score": 60 }
    ],
    "by_month": [
      { "month": "2025-01", "attempts": 100, "avg_score": 68 }
    ]
  }
}
```

---

### GET `/api/v1/admin/analytics/users`
**Description:** Get user analytics

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_users": 1500,
    "approved_users": 1200,
    "pending_users": 250,
    "rejected_users": 50,
    "new_users_this_month": 75,
    "by_role": [
      { "role": "user", "count": 1180 },
      { "role": "admin", "count": 10 },
      { "role": "gramsevak", "count": 10 }
    ]
  }
}
```

---

## Error Response Format

All APIs return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {}
  }
}
```

**Common Error Codes:**
| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | Missing or invalid auth token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid request data |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |
