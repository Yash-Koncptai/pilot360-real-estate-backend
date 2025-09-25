# 🌾 Chookhi Jameen APIs

## 📘 Admin API Endpoints

---

### `Middleware`

**Error Responses:**

* **401 Unauthorized** – authorization token missing or malformed.
* **403 Forbidden** - invalid or expired token.

---
---

### `POST /api/admin/login`

Admin login.

**Method:** `POST`
**Request Body:**

```json
{
  "username": "admin00",
  "password": "admin00",
}
```

**Success Response:**

* **Code:** `200 OK`

```json
{
  "success": true,
  "token": "JWT TOKEN",
  "message": "admin logged in successfully."
}
```

**Error Responses:**

* **400 Bad Request** – invalid credentials.
* **400 Bad Request** – missing required fields.

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

* **Code:** `200 OK`

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
            "createdAt": "2025-09-23T11:24:25.527Z",
            "updatedAt": "2025-09-23T11:26:29.755Z"
        }
    ],
}
```
---
---

### `POST /api/admin/property/add`

Property adding.

**Method:** `POST`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```
**Request Body:**

```json
{
  "title": "Farm Land in Rajasthan",
  "price": 500000,
  "type": "Agricultural",
  "size": "10 acres",
  "location": "Jaipur, Rajasthan",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "description": "Fertile land with canal access.",
  "privacy": true,
  "features": ["Well", "Canal", "Fenced"]
}
```

**Success Response:**

* **Code:** `201 OK`

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
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

* **400 Bad Request** – missing required fields.

---
---

### `POST /api/admin/property/update?id=<property id>`

Property updating.

**Method:** `PUT`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```
**Request Body:**

```json
{
  "title": "Farm Land in Rajasthan",
  "price": 500000,
  "type": "Agricultural",
  "size": "10 acres",
  "location": "Jaipur, Rajasthan",
  "latitude": 26.9124,
  "longitude": 75.7873,
  "description": "Fertile land with canal access.",
  "privacy": true,
  "features": ["Well", "Canal", "Fenced"]
}
```

**Success Response:**

* **Code:** `200 OK`

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
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

* **400 Bad Request** – missing required fields.
* **404 Not Found** – property not found.

---
---

### `DELETE /api/admin/property/delete?id=<property id>`

Property deleting.

**Method:** `DELETE`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```
**Success Response:**

* **Code:** `200 OK`

```json
{
  "success": true,
  "message": "property deleted successfully."
}
```

**Error Responses:**

* **404 Not Found** – property not found.

---

## 📘 User API Endpoints

---

### `Middleware`

**Error Responses:**

* **401 Unauthorized** – authorization token missing or malformed.
* **403 Forbidden** - invalid or expired token.

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
  "password": "mypassword",
}
```

**Success Response:**

* **Code:** `201 OK`

```json
{
    "success": true,
    "otp": "OTP",
    "message": "user created successfully."
}
```

**Error Responses:**

* **400 Bad Request** – missing required fields.

---
---

### `POST /api/user/otp/verify`

User otp verification.

**Method:** `POST`
**Request Body:**

```json
{
  "email": "myemail@gmail.com",
  "otp": "OTP", 
}
```

**Success Response:**

* **Code:** `200 OK`

```json
{
    "success": true,
    "message": "email and mobile verified successfully."
}
```

**Error Responses:**

* **400 Bad Request** – OTP expired or not found.
* **400 Bad Request** – invalid OTP.

---
---

### `POST /api/user/login`

User login.

**Method:** `POST`
**Request Body:**

```json
{
  "identifier": "9876543210", // email or mobile number
  "password": "mypassword",
}
```

**Success Response:**

* **Code:** `200 OK`

```json
{
  "success": true,
  "token": "JWT TOKEN",
  "message": "user logged in successfully."
}
```

**Error Responses:**

* **400 Bad Request** – missing required fields.
* **400 Bad Request** – invalid credentials.
* **403 Bad Request** – email and mobile number not verified.

---