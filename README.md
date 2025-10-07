# 🌾 Chookhi Jameen APIs

## 📘 Admin API Endpoints

---

### `Middleware`

**Error Responses:**

- **401 Unauthorized** – authorization token missing or malformed.
- **403 Forbidden** - invalid or expired token.
- **404 Not Found** - admin not found.

---

---

### `POST /api/admin/login`

Admin login.

**Method:** `POST`
**Request Body:**

```json
{
  "username": "admin00",
  "password": "admin00"
}
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "token": "JWT TOKEN",
  "message": "admin logged in successfully."
}
```

**Error Responses:**

- **400 Bad Request** – invalid credentials.
- **400 Bad Request** – missing required fields.

---

---

### `GET /api/admin/dashboard`

Admin dashboard.

**Method:** `GET`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "properties": "NUMBER OF PROPERTIES",
  "available": "NUMBER OF AVAILABLE PROPERTIES",
  "views": "TOTAL VIEWS OF PROPERTIES",
  "inquiries": "TOTAL NUMBER OF INQUIRIES",
  "message": "dashboard details fetched successfully."
}
```

---

---

### `GET /api/admin/analytics`

Analytics.

**Method:** `GET`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "property_performance": {
    "Agricultural": 5,
    "Residential": 3,
    "Commercial": 2
  },
  "monthly_trend": {
    "This Month": 10,
    "Last Month": 5,
    "Growth Rate": "+100%"
  },
  "message": "analytics details fetched successfully."
}
```

---

---

### `GET /api/admin/property`

Properties fetching.

**Method:** `GET`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "properties fetched successfully.",
  "properties": [
    {
      "id": 1,
      "title": "editing land",
      "price": 67,
      "type": "edit type",
      "size": "56 sqft",
      "location": "kolkata",
      "latitude": 8.3,
      "longitude": 6.34,
      "description": "editing description",
      "private": true,
      "features": null,
      "images": [
        "uploads/properties/1759230299218-739692831.png",
        "uploads/properties/1759230299249-703738047.png"
      ],
      "createdAt": "2025-09-23T11:24:25.527Z",
      "updatedAt": "2025-09-23T11:26:29.755Z"
    }
  ]
}
```

---

---

### `POST /api/admin/property/add`

Property adding.

**Method:** `POST`
**Request Headers:**

```http
Authorization: Bearer <JWT Token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**

| Field       | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| title       | string  | Title of the property                    |
| price       | number  | Price of the property                    |
| type        | string  | Property type (e.g., Agricultural, etc.) |
| size        | string  | Size of the property (e.g., "10 acres")  |
| location    | string  | Location address                         |
| latitude    | number  | Latitude coordinate                      |
| longitude   | number  | Longitude coordinate                     |
| description | string  | Description of the property              |
| privacy     | boolean | Privacy flag (true or false)             |
| features    | string  | Comma-separated list of features         |
| images      | file[]  | One or more image files of the property  |

---

**Example (multipart/form-data body):**

- `title`: Farm Land in Rajasthan
- `price`: 500000
- `type`: Agricultural
- `size`: 10 acres
- `location`: Jaipur, Rajasthan
- `latitude`: 26.9124
- `longitude`: 75.7873
- `description`: Fertile land with canal access.
- `privacy`: true
- `features`: Well, Canal, Fenced
- `images`: [file1.png, file2.png, ...]

---

**Success Response:**

- **Code:** `201 Created`

```json
{
  "success": true,
  "message": "property added successfully.",
  "property": {
    "id": 1,
    "title": "Farm Land in Rajasthan",
    "price": 500000,
    "type": "Agricultural",
    "size": "10 acres",
    "location": "Jaipur, Rajasthan",
    "latitude": 26.9124,
    "longitude": 75.7873,
    "description": "Fertile land with canal access.",
    "private": true,
    "features": ["Well", "Canal", "Fenced"],
    "images": [
      "uploads/properties/1759230299218-739692831.png",
      "uploads/properties/1759230299249-703738047.png"
    ],
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** – Missing required fields or invalid file format.

---

### `POST /api/admin/property/update?id=<PROPERTY ID>`

Property updating.

**Method:** `PUT`
**Request Headers:**

```http
Authorization: Bearer <JWT Token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**

| Field          | Type    | Description                                |
| -------------- | ------- | ------------------------------------------ |
| title          | string  | Title of the property                      |
| price          | number  | Price of the property                      |
| type           | string  | Property type (e.g., Agricultural, etc.)   |
| size           | string  | Size of the property (e.g., "10 acres")    |
| location       | string  | Location address                           |
| latitude       | number  | Latitude coordinate                        |
| longitude      | number  | Longitude coordinate                       |
| description    | string  | Description of the property                |
| privacy        | boolean | Privacy flag (true or false)               |
| features       | string  | Comma-separated list of features           |
| existingimages | string  | Comma-separated list of non-deleted images |
| deletedimages  | string  | Comma-separated list of deleted images     |
| images         | file[]  | One or more image files of the property    |

---

**Example (multipart/form-data body):**

- `title`: Farm Land in Rajasthan
- `price`: 500000
- `type`: Agricultural
- `size`: 10 acres
- `location`: Jaipur, Rajasthan
- `latitude`: 26.9124
- `longitude`: 75.7873
- `description`: Fertile land with canal access.
- `privacy`: true
- `features`: Well, Canal, Fenced
- `images`: [file1.png, file2.png, ...]
- `existingimages`: uploads/properties/1759230299218-739692831.png, uploads/properties/1759230299249-703738047.png
- `deletedimages`: uploads/properties/1759230299218-739692831.png, uploads/properties/1759230299249-703738047.png

---

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "property updated successfully.",
  "property": {
    "id": 1,
    "title": "Farm Land in Rajasthan",
    "price": 500000,
    "type": "Agricultural",
    "size": "10 acres",
    "location": "Jaipur, Rajasthan",
    "latitude": 26.9124,
    "longitude": 75.7873,
    "description": "Fertile land with canal access.",
    "private": true,
    "features": ["Well", "Canal", "Fenced"],
    "images": [
      "uploads/properties/1759230299218-739692831.png",
      "uploads/properties/1759230299249-703738047.png"
    ],
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.
- **404 Not Found** – property not found.

---

---

### `DELETE /api/admin/property/delete?id=<PROPERTY ID>`

Property deleting.

**Method:** `DELETE`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "property deleted successfully."
}
```

**Error Responses:**

- **404 Not Found** – property not found.

---

---

### `GET /api/admin/users`

Users fetching.

**Method:** `GET`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "users": [
    {
      "id": 7,
      "name": "test",
      "mobile": "9090909090",
      "email": "test@gmail.com",
      "password": "$2b$10$58jGQ1WczemFYacDrPoqduWzjI2Ps3zTNHKgcCPz.1uQN4nZMAArG",
      "verification": true,
      "createdAt": "2025-09-25T11:32:33.632Z",
      "updatedAt": "2025-09-25T11:32:58.997Z"
    }
  ],
  "properties": [
    {
      "id": 1,
      "title": "Farm Land in Rajasthan",
      "price": 500000,
      "type": "Agricultural",
      "size": "10 acres",
      "location": "Jaipur, Rajasthan",
      "latitude": 26.9124,
      "longitude": 75.7873,
      "description": "Fertile land with canal access.",
      "private": true,
      "features": ["Well", "Canal", "Fenced"],
      "images": [
        "uploads/properties/1759230299218-739692831.png",
        "uploads/properties/1759230299249-703738047.png"
      ],
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ]
  "message": "users fetch successfully."
}
```

---

---

### `POST /api/admin/suggestions`

Property suggestion.

**Method:** `POST`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "user_id": 7,
  "property_id": 1
}
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "property suggested successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.
- **404 Not Found** – user not found.
- **404 Not Found** – property not found.

---

## 📘 User API Endpoints

---

### `Middleware`

**Error Responses:**

- **401 Unauthorized** – authorization token missing or malformed.
- **403 Forbidden** - invalid or expired token.
- **404 Not Found** - user not found.

---

---

### `POST /api/user/signup`

User signup.

**Method:** `POST`
**Request Body:**

```json
{
  "name": "myname",
  "email": "myemail@gmail.com",
  "mobile": "9876543210",
  "password": "mypassword"
}
```

**Success Response:**

- **Code:** `201 Created`

```json
{
  "success": true,
  "otp": "OTP",
  "message": "user created successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.
- **409 Conflict** - user already exists.

---

---

### `POST /api/user/otp/verify`

User otp verification.

**Method:** `POST`
**Request Body:**

```json
{
  "email": "myemail@gmail.com",
  "otp": "OTP"
}
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "email and mobile verified successfully."
}
```

**Error Responses:**

- **400 Bad Request** – OTP expired or invalid.
- **404 Not Found** – user not found.

---

---

### `POST /api/user/otp`

Otp resend.

**Method:** `POST`
**Request Body:**

```json
{
  "email": "myemail@gmail.com"
}
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "otp": "296068",
  "message": "OTP send successfully."
}
```

**Error Responses:**

- **404 Not Found** – user not found.

---

---

### `POST /api/user/login`

User login.

**Method:** `POST`
**Request Body:**

```json
{
  "identifier": "9876543210",
  "password": "mypassword"
}
```

**Note:** `identifier` can be either email or mobile number.

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "token": "JWT TOKEN",
  "message": "user logged in successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.
- **400 Bad Request** – invalid credentials.
- **403 Forbidden** – email and mobile number not verified.

---

---

### `GET /api/user/properties?type=<TYPE>&min=<MIN_PRICE>&max=<MAX_PRICE>&location=<LOCATION>`

Properties fetching with optional filtering (Remove all params to fetch all properties).

**Method:** `GET`

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "properties fetched successfully.",
  "properties": [
    {
      "id": 1,
      "title": "Farm Land in Rajasthan",
      "price": 500000,
      "type": "Agricultural",
      "size": "10 acres",
      "location": "Jaipur, Rajasthan",
      "latitude": 26.9124,
      "longitude": 75.7873,
      "description": "Fertile land with canal access.",
      "private": true,
      "features": ["Well", "Canal", "Fenced"],
      "images": [
        "uploads/properties/1759230299218-739692831.png",
        "uploads/properties/1759230299249-703738047.png"
      ],
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ]
}
```

---

---

### `GET /api/user/property?id=<PROPERTY ID>`

Property fetching.

**Method:** `GET`

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "property": {
    "id": 1,
    "title": "Farm Land in Rajasthan",
    "price": 500000,
    "type": "Agricultural",
    "size": "10 acres",
    "location": "Jaipur, Rajasthan",
    "latitude": 26.9124,
    "longitude": 75.7873,
    "description": "Fertile land with canal access.",
    "private": true,
    "features": ["Well", "Canal", "Fenced"],
    "images": [
      "uploads/properties/1759230299218-739692831.png",
      "uploads/properties/1759230299249-703738047.png"
    ],
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  },
  "message": "property fetched successfully."
}
```

**Error Responses:**

- **404 Not Found** – property not found.

---

---

### `POST /api/user/inquiry?id=<PROPERTY ID>`

Property inquiry.

**Method:** `POST`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `201 Created`

```json
{
  "success": true,
  "inquiry": {
    "id": 3,
    "name": "test",
    "email": "test@gmail.com",
    "visit_date": "2025-10-02T00:00:00.000Z",
    "message": "testing",
    "property_id": 1,
    "user_id": 7,
    "updatedAt": "2025-09-29T12:29:19.207Z",
    "createdAt": "2025-09-29T12:29:19.207Z"
  },
  "message": "inquiry submitted successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.
- **404 Not Found** – property not found.

---

---

### `POST /api/user/contact`

Contact us.

**Method:** `POST`

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'd like to know more about your services."
}
```

**Success Response:**

- **Code:** `201 Created`

```json
{
  "success": true,
  "contact": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I'd like to know more about your services.",
    "updatedAt": "2025-10-01T12:00:00.000Z",
    "createdAt": "2025-10-01T12:00:00.000Z"
  },
  "message": "contact submitted successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.

---

---

### `GET /api/user/recommendations`

Get personalized property recommendations based on user preferences.

**Method:** `GET`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "properties": [
    {
      "id": 1,
      "title": "Farm Land in Rajasthan",
      "price": 500000,
      "type": "Agricultural",
      "size": "10 acres",
      "location": "Jaipur, Rajasthan",
      "latitude": 26.9124,
      "longitude": 75.7873,
      "description": "Fertile land with canal access.",
      "private": true,
      "features": ["Well", "Canal", "Fenced"],
      "images": [
        "uploads/properties/1759230299218-739692831.png",
        "uploads/properties/1759230299249-703738047.png"
      ],
      "views": 15,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ],
  "message": "recommended properties fetched successfully.",
  "locked": false
}
```

**Error Responses:**

- **403 Forbidden** – please set your preferences first.

---

---

### `POST /api/user/preferences`

User preferences save/update.

**Method:** `POST`

**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "primary_purpose": "Personal Use",
  "budget_min": 5000000,
  "budget_max": 10000000,
  "land_interests": "Agricultural, Residential",
  "preferred_location": "Udaipur"
}
```

**Success Response:**

- **Code:** `201 Created`

```json
{
  "success": true,
  "preference": {
    "id": 1,
    "user_id": 7,
    "primary_purpose": "Personal Use",
    "budget_min": 5000000,
    "budget_max": 10000000,
    "land_interests": ["Agricultural", "Residential"],
    "preferred_location": "Udaipur",
    "updatedAt": "2025-10-01T12:00:00.000Z",
    "createdAt": "2025-10-01T12:00:00.000Z"
  },
  "message": "preferences saved successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.

---
