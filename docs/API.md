# API Documentation

This document describes the API endpoints available in the Esophageal Abnormality Detection System.

## 🌐 Base URL

```
http://localhost:5000
```

## 📚 Authentication

The system uses session-based authentication. Users must register and login to access protected endpoints.

### Session Management

- Sessions are stored server-side
- Session timeout: 24 hours (configurable)
- CSRF protection enabled for forms

## 🔗 Endpoints

### 1. Authentication Endpoints

#### Register User

```http
POST /register
Content-Type: multipart/form-data
```

**Parameters:**
- `username` (string, required): Unique username
- `email` (string, required): User email address
- `password` (string, required): User password
- `confirm_password` (string, required): Password confirmation

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "redirect": "/login"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Username already exists"
}
```

#### Login User

```http
POST /login
Content-Type: multipart/form-data
```

**Parameters:**
- `username` (string, required): Username
- `password` (string, required): Password

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "redirect": "/dashboard"
}
```

#### Logout User

```http
GET /logout
```

**Response:**
Redirects to login page

### 2. Main Application Endpoints

#### Home Page

```http
GET /
```

Returns the main analysis page.

#### Upload and Analyze Image

```http
POST /upload_file
Content-Type: multipart/form-data
```

**Parameters:**
- `file` (file, required): Image file (PNG, JPG, JPEG, GIF)

**Supported Formats:**
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF (.gif)

**File Size Limit:** 16MB

**Response:**
```json
{
  "status": "success",
  "prediction": {
    "class": "esophageal",
    "confidence": 0.87,
    "percentage": "87%"
  },
  "image_path": "/static/img/temp123abc.jpg",
  "analysis_id": "uuid-here"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Invalid file format"
}
```

#### Get Analysis Results

```http
GET /results/<analysis_id>
```

**Response:**
```json
{
  "analysis_id": "uuid-here",
  "timestamp": "2024-01-15T10:30:00Z",
  "prediction": {
    "class": "esophageal",
    "confidence": 0.87,
    "probability": {
      "esophageal": 0.87,
      "normal": 0.13
    }
  },
  "image_info": {
    "filename": "temp123abc.jpg",
    "size": "224x224",
    "format": "JPEG"
  }
}
```

### 3. User Dashboard Endpoints

#### Dashboard

```http
GET /dashboard
Authorization: Session required
```

Returns user dashboard with analysis history.

#### User Analysis History

```http
GET /api/user/analyses
Authorization: Session required
```

**Query Parameters:**
- `limit` (integer, optional): Number of results (default: 10)
- `offset` (integer, optional): Pagination offset (default: 0)

**Response:**
```json
{
  "analyses": [
    {
      "id": "uuid-here",
      "timestamp": "2024-01-15T10:30:00Z",
      "prediction": "esophageal",
      "confidence": 0.87,
      "image_path": "/static/img/temp123abc.jpg"
    }
  ],
  "total_count": 25,
  "page_info": {
    "has_next": true,
    "has_prev": false
  }
}
```

#### User Statistics

```http
GET /api/user/stats
Authorization: Session required
```

**Response:**
```json
{
  "total_analyses": 25,
  "esophageal_detected": 8,
  "normal_detected": 17,
  "average_confidence": 0.84,
  "last_analysis": "2024-01-15T10:30:00Z"
}
```

### 4. Administrative Endpoints

#### Admin Statistics

```http
GET /api/admin/stats
Authorization: Admin session required
```

**Response:**
```json
{
  "total_users": 150,
  "total_analyses": 1250,
  "analyses_today": 45,
  "accuracy_metrics": {
    "precision": 0.92,
    "recall": 0.88,
    "f1_score": 0.90
  }
}
```

## 📊 Data Models

### User Model

```json
{
  "id": "integer",
  "username": "string",
  "email": "string",
  "created_at": "datetime",
  "is_active": "boolean",
  "role": "string"
}
```

### Analysis Model

```json
{
  "id": "string (UUID)",
  "user_id": "integer",
  "image_path": "string",
  "prediction": "string",
  "confidence": "float",
  "timestamp": "datetime",
  "image_metadata": {
    "original_filename": "string",
    "file_size": "integer",
    "dimensions": "string"
  }
}
```

### Prediction Model

```json
{
  "class": "string",
  "confidence": "float",
  "probabilities": {
    "esophageal": "float",
    "normal": "float"
  },
  "processing_time": "float"
}
```

## 🔒 Security

### Authentication

- Password hashing using Werkzeug security
- Session-based authentication
- CSRF protection on forms
- Secure session cookies

### File Upload Security

- File type validation
- File size limits
- Secure filename generation
- Path traversal protection

### Rate Limiting

- Upload rate limiting: 10 requests per minute
- Analysis rate limiting: 5 requests per minute
- Login attempt limiting: 5 attempts per 15 minutes

## ⚡ Response Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 413  | Payload Too Large |
| 429  | Too Many Requests |
| 500  | Internal Server Error |

## 🔧 Error Handling

### Standard Error Response

```json
{
  "status": "error",
  "error_code": "INVALID_FILE_FORMAT",
  "message": "Only PNG, JPG, JPEG, and GIF files are allowed",
  "details": {
    "allowed_formats": ["png", "jpg", "jpeg", "gif"],
    "received_format": "bmp"
  }
}
```

### Common Error Codes

- `INVALID_FILE_FORMAT`: Unsupported file type
- `FILE_TOO_LARGE`: File exceeds size limit
- `AUTHENTICATION_REQUIRED`: User not logged in
- `INVALID_CREDENTIALS`: Wrong username/password
- `MODEL_ERROR`: ML model processing error
- `RATE_LIMIT_EXCEEDED`: Too many requests

## 📝 Examples

### Python Client Example

```python
import requests
import json

# Login
session = requests.Session()
login_data = {
    'username': 'your_username',
    'password': 'your_password'
}
session.post('http://localhost:5000/login', data=login_data)

# Upload and analyze image
with open('medical_image.jpg', 'rb') as f:
    files = {'file': f}
    response = session.post('http://localhost:5000/upload_file', files=files)

result = response.json()
print(f"Prediction: {result['prediction']['class']}")
print(f"Confidence: {result['prediction']['confidence']}")
```

### JavaScript Example

```javascript
// Upload and analyze image
const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload_file', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        console.log('Prediction:', result.prediction.class);
        console.log('Confidence:', result.prediction.confidence);
    } catch (error) {
        console.error('Error:', error);
    }
};
```

### cURL Examples

```bash
# Register user
curl -X POST http://localhost:5000/register \
  -F "username=testuser" \
  -F "email=test@example.com" \
  -F "password=testpass123" \
  -F "confirm_password=testpass123"

# Upload image for analysis
curl -X POST http://localhost:5000/upload_file \
  -F "file=@medical_image.jpg" \
  -b cookies.txt
```

## 🚀 SDK and Libraries

### Python SDK (Planned)

```python
from esophageal_detector import EsophagealClient

client = EsophagealClient('http://localhost:5000')
client.login('username', 'password')

result = client.analyze_image('path/to/image.jpg')
print(result.prediction, result.confidence)
```

## 📊 Webhooks (Future Feature)

Configure webhooks to receive notifications about analysis results:

```json
{
  "url": "https://your-server.com/webhook",
  "events": ["analysis_complete", "batch_complete"],
  "secret": "webhook_secret"
}
```

## 🔄 Versioning

API Version: v1.0

Future versions will maintain backward compatibility.

---

**Need help?** Check our [GitHub Issues](https://github.com/shivuhunji-cmd/Esophageal-Abnormality-Detection-System/issues) or create a new issue.