# 🌾 Chookhi Jameen API

## 📘 Admin API Endpoints

---

### `POST /api/login`

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
  "token": "`JWT TOKEN`",
  "message": "admin logged in successfully"
}
```

**Error Responses:**

* **400 Bad Request** – Invalid Credentials

---
