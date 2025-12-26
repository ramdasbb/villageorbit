# Required Backend APIs for Full Supabase Migration

## Configuration
- **API Base URL**: `https://core-api-tlw6.onrender.com` (configurable via `VITE_API_BASE_URL` or admin config)
- **Health Check**: `GET /api/v1/health`

---

## ✅ IMPLEMENTED (Frontend Ready)

### Authentication APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | User registration |
| POST | `/api/v1/auth/login` | User login (returns access_token, refresh_token) |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| GET | `/api/v1/auth/me` | Get current user profile with roles/permissions |

### Admin User Management APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/users` | List users (paginated, filterable) |
| GET | `/api/v1/admin/users/{userId}` | Get user details |
| POST | `/api/v1/admin/users/{userId}/approve` | Approve user |
| POST | `/api/v1/admin/users/{userId}/reject` | Reject user (with reason) |
| DELETE | `/api/v1/admin/users/{userId}` | Soft delete user |

### RBAC APIs (Super Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/rbac/permissions` | List all permissions |
| POST | `/api/v1/rbac/permissions` | Create permission |
| DELETE | `/api/v1/rbac/permissions/{permissionId}` | Delete permission |
| GET | `/api/v1/rbac/roles` | List all roles |
| POST | `/api/v1/rbac/roles` | Create role |
| DELETE | `/api/v1/rbac/roles/{roleId}` | Delete role |
| POST | `/api/v1/rbac/roles/{roleId}/permissions` | Add permission to role |
| DELETE | `/api/v1/rbac/roles/{roleId}/permissions/{permissionId}` | Remove permission |
| POST | `/api/v1/rbac/users/{userId}/roles` | Assign role to user |
| DELETE | `/api/v1/rbac/users/{userId}/roles/{roleId}` | Remove role from user |

---

## 🔴 REQUIRED APIs (To Replace Supabase)

### User Profile Management
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| PUT | `/api/v1/users/profile` | HIGH | Update user profile |

### Forum/Posts
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| GET | `/api/v1/posts` | HIGH | List posts (paginated) |
| POST | `/api/v1/posts` | HIGH | Create post |
| PUT | `/api/v1/posts/{postId}` | MEDIUM | Update post |
| DELETE | `/api/v1/posts/{postId}` | MEDIUM | Delete post |
| POST | `/api/v1/posts/{postId}/like` | MEDIUM | Like post |
| DELETE | `/api/v1/posts/{postId}/like` | MEDIUM | Unlike post |
| GET | `/api/v1/posts/{postId}/comments` | MEDIUM | Get comments |
| POST | `/api/v1/posts/{postId}/comments` | MEDIUM | Add comment |
| DELETE | `/api/v1/comments/{commentId}` | MEDIUM | Delete comment |

### Marketplace/Buy-Sell
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| GET | `/api/v1/items` | HIGH | List marketplace items |
| POST | `/api/v1/items` | HIGH | Create item listing |
| PUT | `/api/v1/items/{itemId}` | MEDIUM | Update item |
| DELETE | `/api/v1/items/{itemId}` | MEDIUM | Delete item |
| POST | `/api/v1/items/{itemId}/approve` | HIGH | Admin approve item |
| POST | `/api/v1/items/{itemId}/reject` | HIGH | Admin reject item |

### Exams
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| GET | `/api/v1/exams` | HIGH | List exams |
| GET | `/api/v1/exams/{examId}` | HIGH | Get exam details |
| GET | `/api/v1/exams/{examId}/questions` | HIGH | Get exam questions |
| POST | `/api/v1/exams/{examId}/attempts` | HIGH | Start exam attempt |
| PUT | `/api/v1/attempts/{attemptId}` | HIGH | Submit answers |
| GET | `/api/v1/attempts/{attemptId}/results` | HIGH | Get results |

### Village Services
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| GET | `/api/v1/services` | MEDIUM | List village services |
| POST | `/api/v1/services` | MEDIUM | Add service (admin) |
| PUT | `/api/v1/services/{serviceId}` | LOW | Update service |
| DELETE | `/api/v1/services/{serviceId}` | LOW | Delete service |
| POST | `/api/v1/services/{serviceId}/rating` | LOW | Rate service |

### Feedback/Contact
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| POST | `/api/v1/feedback` | MEDIUM | Submit feedback |
| GET | `/api/v1/admin/feedback` | MEDIUM | List feedback (admin) |
| POST | `/api/v1/contact` | MEDIUM | Submit contact form |
| GET | `/api/v1/admin/contact` | MEDIUM | List contact messages |

### Push Notifications
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| POST | `/api/v1/push/subscribe` | MEDIUM | Register push subscription |
| DELETE | `/api/v1/push/unsubscribe` | LOW | Remove subscription |
| POST | `/api/v1/admin/push/send` | MEDIUM | Send notification (admin) |

---

## 🟡 OPTIONAL APIs (Future Enhancement)

### File Storage
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| POST | `/api/v1/upload` | FUTURE | Upload file |
| GET | `/api/v1/files/{fileId}` | FUTURE | Get file URL |
| DELETE | `/api/v1/files/{fileId}` | FUTURE | Delete file |

### Analytics
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| GET | `/api/v1/admin/analytics/exams` | FUTURE | Exam analytics |
| GET | `/api/v1/admin/analytics/users` | FUTURE | User analytics |

### Villages/Multi-tenant
| Method | Endpoint | Priority | Description |
|--------|----------|----------|-------------|
| GET | `/api/v1/villages` | FUTURE | List villages |
| GET | `/api/v1/villages/{villageId}/config` | FUTURE | Village config |

---

## Files Created

### Configuration
- `src/config/apiConfig.ts` - Centralized API configuration

### Services
- `src/services/apiClient.ts` - HTTP client with token refresh
- `src/services/tokenService.ts` - Token storage management
- `src/services/authService.ts` - Authentication methods
- `src/services/adminService.ts` - Admin user management
- `src/services/rbacService.ts` - RBAC management
- `src/services/healthService.ts` - Backend health check
- `src/services/index.ts` - Service exports

### Hooks & Components
- `src/hooks/useApiAuth.tsx` - API-based auth hook
- `src/components/guards/PermissionGuard.tsx` - RBAC UI guards
- `src/components/BackendHealth.tsx` - Health status display

### Pages (API versions)
- `src/pages/AuthApi.tsx` - API-based login/signup
- `src/pages/UserDashboardApi.tsx` - API-based user dashboard
- `src/pages/UserManagementDashboardApi.tsx` - API-based admin dashboard

---

## Next Steps

1. **Backend Team**: Implement the REQUIRED APIs listed above
2. **Frontend**: Update App.tsx routes to use new API-based pages
3. **Testing**: Test auth flow with backend
4. **Migration**: Gradually replace Supabase calls in remaining components
