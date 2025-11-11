# 🌾 Chookhi Jameen APIs

## Environment Variables

Ensure the following variables are set in your `.env` file:

- `PORT`
- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
- `DB_PORT`
- `ADMINUSERNAME`
- `ADMINEMAIL`
- `ADMINPASS`

### EmailJS Configuration

Add these for EmailJS email delivery (OTP and credentials):

- `EMAILJS_SERVICE_ID` — your EmailJS service ID
- `EMAILJS_TEMPLATE_ID` — comma-separated template IDs in this exact order: `[OTP_TEMPLATE_ID, CREDENTIALS_TEMPLATE_ID]`
- `EMAILJS_PUBLIC_KEY` — EmailJS public key
- `EMAILJS_PRIVATE_KEY` — EmailJS private key

Templates must support the following variables:

- For OTP template: `to_email`, `to_name`, `from_name`, `otp`
- For Credentials template: `to_email`, `to_name`, `from_name`, `user_email`, `user_password`

**EmailJS Setup:**

1. Create account at emailjs.com
2. Create email service (Gmail, Outlook, etc.)
3. Create two templates as described above (OTP and Credentials)
4. Get your Service ID, both Template IDs, Public Key, and Private Key
5. Add them to your `.env` file

Emails are sent securely from the server using the EmailJS Node.js SDK for OTPs (signup/resend) and for newly created admin-invited users' credentials.

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
      "primary_purpose": "Personal Use",
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
      "water_connectivity": true,
      "electricity_connectivity": true,
      "gas_connectivity": false,
      "investment_gain": 15000,
      "investment_cost": 450000,
      "market_risk": true,
      "regulatory_risk": false,
      "financial_risk": false,
      "liquidity_risk": true,
      "physical_risk": false,
      "risk_percentage": 50,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
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

| Field                    | Type    | Description                                      |
| ------------------------ | ------- | ------------------------------------------------ |
| title                    | string  | Title of the property                            |
| price                    | number  | Price of the property                            |
| type                     | string  | Property type (e.g., Agricultural, etc.)         |
| size                     | string  | Size of the property (e.g., "10 acres")          |
| primary_purpose          | string  | Primary purpose (e.g., Personal Use, Investment) |
| location                 | string  | Location address                                 |
| latitude                 | number  | Latitude coordinate                              |
| longitude                | number  | Longitude coordinate                             |
| description              | string  | Description of the property                      |
| privacy                  | boolean | Privacy flag (true or false)                     |
| features                 | string  | Comma-separated list of features                 |
| images                   | file[]  | One or more image files of the property          |
| water_connectivity       | boolean | Water connectivity availability                  |
| electricity_connectivity | boolean | Electricity connectivity availability            |
| gas_connectivity         | boolean | Gas connectivity availability                    |
| investment_gain          | number  | Potential investment gain percentage             |
| market_risk              | boolean | Market risk indicator                            |
| regulatory_risk          | boolean | Regulatory risk indicator                        |
| financial_risk           | boolean | Financial risk indicator                         |
| liquidity_risk           | boolean | Liquidity risk indicator                         |
| physical_risk            | boolean | Physical risk indicator                          |

---

**Example (multipart/form-data body):**

- `title`: Farm Land in Rajasthan
- `price`: 500000
- `type`: Agricultural
- `size`: 10 acres
- `primary_purpose`: Personal Use
- `location`: Jaipur, Rajasthan
- `latitude`: 26.9124
- `longitude`: 75.7873
- `description`: Fertile land with canal access.
- `privacy`: true
- `features`: Well, Canal, Fenced
- `images`: [file1.png, file2.png, ...]
- `water_connectivity`: true
- `electricity_connectivity`: true
- `gas_connectivity`: false
- `investment_gain`: 15000
- `market_risk`: true
- `regulatory_risk`: false
- `financial_risk`: false
- `liquidity_risk`: true
- `physical_risk`: false

**Note:** `return_of_investment` is calculated automatically using the formula: `((investment_gain - price) / price) * 100`. The `investment_gain` represents the total amount you can gain (price + actual gain amount). It should not be provided in the request body.

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
    "primary_purpose": "Personal Use",
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
    "water_connectivity": true,
    "electricity_connectivity": true,
    "gas_connectivity": false,
    "investment_gain": 15000,
    "return_of_investment": 15,
    "market_risk": true,
    "regulatory_risk": false,
    "financial_risk": false,
    "liquidity_risk": true,
    "physical_risk": false,
    "risk_percentage": 50,
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** – Missing required fields or invalid file format.

---

### `PUT /api/admin/property/update?id=<PROPERTY ID>`

Property updating.

**Method:** `PUT`
**Request Headers:**

```http
Authorization: Bearer <JWT Token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**

| Field                    | Type    | Description                                |
| ------------------------ | ------- | ------------------------------------------ |
| title                    | string  | Title of the property                      |
| price                    | number  | Price of the property                      |
| type                     | string  | Property type (e.g., Agricultural, etc.)   |
| size                     | string  | Size of the property (e.g., "10 acres")    |
| primary_purpose          | string  | Primary purpose (e.g., Personal Use)       |
| location                 | string  | Location address                           |
| latitude                 | number  | Latitude coordinate                        |
| longitude                | number  | Longitude coordinate                       |
| description              | string  | Description of the property                |
| privacy                  | boolean | Privacy flag (true or false)               |
| features                 | string  | Comma-separated list of features           |
| existingimages           | string  | Comma-separated list of non-deleted images |
| deletedimages            | string  | Comma-separated list of deleted images     |
| images                   | file[]  | One or more image files of the property    |
| water_connectivity       | boolean | Water connectivity availability            |
| electricity_connectivity | boolean | Electricity connectivity availability      |
| gas_connectivity         | boolean | Gas connectivity availability              |
| investment_gain          | number  | Potential investment gain percentage       |
| market_risk              | boolean | Market risk indicator                      |
| regulatory_risk          | boolean | Regulatory risk indicator                  |
| financial_risk           | boolean | Financial risk indicator                   |
| liquidity_risk           | boolean | Liquidity risk indicator                   |
| physical_risk            | boolean | Physical risk indicator                    |

**Note:** `return_of_investment` is calculated automatically using the formula: `((investment_gain - price) / price) * 100`. The `investment_gain` represents the total amount you can gain (price + actual gain amount). It should not be provided in the request body.

---

**Example (multipart/form-data body):**

- `title`: Farm Land in Rajasthan
- `price`: 500000
- `type`: Agricultural
- `size`: 10 acres
- `primary_purpose`: Personal Use
- `location`: Jaipur, Rajasthan
- `latitude`: 26.9124
- `longitude`: 75.7873
- `description`: Fertile land with canal access.
- `privacy`: true
- `features`: Well, Canal, Fenced
- `images`: [file1.png, file2.png, ...]
- `existingimages`: uploads/properties/1759230299218-739692831.png, uploads/properties/1759230299249-703738047.png
- `deletedimages`: uploads/properties/1759230299218-739692831.png, uploads/properties/1759230299249-703738047.png
- `water_connectivity`: true
- `electricity_connectivity`: true
- `gas_connectivity`: false
- `investment_gain`: 15000
- `market_risk`: true
- `regulatory_risk`: false
- `financial_risk`: false
- `liquidity_risk`: true
- `physical_risk`: false

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
    "primary_purpose": "Personal Use",
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
    "water_connectivity": true,
    "electricity_connectivity": true,
    "gas_connectivity": false,
    "investment_gain": 15000,
    "return_of_investment": 15,
    "market_risk": true,
    "regulatory_risk": false,
    "financial_risk": false,
    "liquidity_risk": true,
    "physical_risk": false,
    "risk_percentage": 50,
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
  "message": "users fetch successfully.",
  "success": true,
  "users": [
    {
      "id": 7,
      "name": "test",
      "mobile": "9090909090",
      "email": "test@gmail.com",
      "password": "$2b$10$58jGQ1WczemFYacDrPoqduWzjI2Ps3zTNHKgcCPz.1uQN4nZMAArG",
      "role": "Regular User",
      "referralCode": "REFABC123",
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
      "primary_purpose": "Personal Use",
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
      "water_connectivity": true,
      "electricity_connectivity": true,
      "gas_connectivity": false,
      "investment_gain": 15000,
      "return_of_investment": 15,
      "market_risk": true,
      "regulatory_risk": false,
      "financial_risk": false,
      "liquidity_risk": true,
      "physical_risk": false,
      "risk_percentage": 50,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ]
}
```

---

---

### `POST /api/admin/users/add`

Create a user (by admin) and send credentials via email.

**Method:** `POST`
**Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "John AdminInvite",
  "email": "john.invited@example.com",
  "role": "Regular User"
}
```

On success, a random password is generated and emailed to the user along with their email as username.

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "user": {
    "id": 10,
    "name": "John AdminInvite",
    "email": "john.invited@example.com",
    "role": "Regular User",
    "referralCode": "REFABC123",
    "verification": true,
    "createdAt": "2025-10-29T12:00:00.000Z",
    "updatedAt": "2025-10-29T12:00:00.000Z"
  },
  "message": "user created successfully and credentials sent via email."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.

---

### `DELETE /api/admin/users/delete?id=<USER ID>`

User deleting.

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
  "message": "user deleted successfully."
}
```

**Error Responses:**

- **400 Bad Request** – user id is required.
- **404 Not Found** – user not found.

---

### `GET /api/admin/inquiries`

Inquiries fetching.

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
  "inquiries": [
    {
      "id": 3,
      "name": "test",
      "email": "test@gmail.com",
      "visit_date": "2025-10-02T00:00:00.000Z",
      "message": "testing",
      "property_id": 1,
      "user_id": 7,
      "createdAt": "2025-09-29T12:29:19.207Z",
      "updatedAt": "2025-09-29T12:29:19.207Z",
      "user": {
        "name": "test",
        "email": "test@gmail.com"
      },
      "property": {
        "id": 1,
        "title": "Farm Land in Rajasthan",
        "price": 500000,
        "type": "Agricultural",
        "size": "10 acres",
        "primary_purpose": "Personal Use",
        "location": "Jaipur, Rajasthan"
      }
    }
  ],
  "message": "inquiries fetched successfully."
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

---

### `GET /api/admin/property/pending`

Request pending Properties fetching.

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
  "message": "pending properties fetched successfully.",
  "properties": [
    {
      "id": 1,
      "title": "editing land",
      "price": 67,
      "type": "edit type",
      "size": "56 sqft",
      "primary_purpose": "Personal Use",
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
      "water_connectivity": true,
      "electricity_connectivity": true,
      "gas_connectivity": false,
      "investment_gain": 15000,
      "investment_cost": 450000,
      "market_risk": true,
      "regulatory_risk": false,
      "financial_risk": false,
      "liquidity_risk": true,
      "physical_risk": false,
      "risk_percentage": 50,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ]
}
```

---

---

### `PUT /api/admin/property/approve?id=<PROPERTY ID>`

Property request approval.

**Method:** `PUT`
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
  "message": "property approved successfully.",
  "property": {
    "id": 1,
    "title": "editing land",
    "price": 67,
    "type": "edit type",
    "size": "56 sqft",
    "primary_purpose": "Personal Use",
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
    "water_connectivity": true,
    "electricity_connectivity": true,
    "gas_connectivity": false,
    "investment_gain": 15000,
    "investment_cost": 450000,
    "market_risk": true,
    "regulatory_risk": false,
    "financial_risk": false,
    "liquidity_risk": true,
    "physical_risk": false,
    "risk_percentage": 50,
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

- **404 Not Found** – property not found.

---

---

### `DELETE /api/admin/property/reject?id=<PROPERTY ID>`

Property request approval.

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
  "message": "property rejected successfully."
}
```

**Error Responses:**

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

User signup (requires valid referral code).

**Method:** `POST`
**Request Body:**

```json
{
  "name": "myname",
  "email": "myemail@gmail.com",
  "mobile": "9876543210",
  "password": "mypassword",
  "referral": "<VALID REFERRAL CODE>"
}
```

Notes:

- `referral` is mandatory and must match an existing user's `referralCode`.
- An OTP is emailed and expires in 3 minutes.

**Success Response:**

- **Code:** `201 Created`

```json
{
  "success": true,
  "otp": "296068",
  "referralCode": "REFXYZ12",
  "message": "user created successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields or invalid referral code.
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
  "role": "Regular User",
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
  "role": "Regular User",
  "message": "user logged in successfully."
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.
- **400 Bad Request** – invalid credentials.
- **403 Forbidden** – email and mobile number not verified.

---

---

### `GET /api/user/properties?type=<TYPE>&primary_purpose=<PRIMARY_PURPOSE>&min=<MIN_PRICE>&max=<MAX_PRICE>&location=<LOCATION>`

Properties fetching with optional filtering (Remove all params to fetch all properties).

**Method:** `GET`

**Optional Request Header:**

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
      "title": "Farm Land in Rajasthan",
      "price": 500000,
      "type": "Agricultural",
      "size": "10 acres",
      "primary_purpose": "Personal Use",
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
      "matchPercentage": 100,
      "water_connectivity": true,
      "electricity_connectivity": true,
      "gas_connectivity": false,
      "investment_gain": 15000,
      "return_of_investment": 15,
      "market_risk": true,
      "regulatory_risk": false,
      "financial_risk": false,
      "liquidity_risk": true,
      "physical_risk": false,
      "risk_percentage": 50,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ]
}
```

**Note:** Match percentage is only included when user is authenticated and has set preferences.

---

---

### `GET /api/user/property?id=<PROPERTY ID>`

Property fetching.

**Method:** `GET`

**Optional Request Header:**

```http
Authorization: Bearer <JWT Token>
Content-Type: application/json
```

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
    "primary_purpose": "Personal Use",
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
    "matchPercentage": 100,
    "water_connectivity": true,
    "electricity_connectivity": true,
    "gas_connectivity": false,
    "investment_gain": 15000,
    "return_of_investment": 15,
    "market_risk": true,
    "regulatory_risk": false,
    "financial_risk": false,
    "liquidity_risk": true,
    "physical_risk": false,
    "risk_percentage": 50,
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  },
  "message": "property fetched successfully."
}
```

**Note:** Match percentage is only included when user is authenticated and has set preferences.

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

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "visit_date": "2025-10-02",
  "message": "I would like to schedule a visit."
}
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
      "matchPercentage": 100,
      "water_connectivity": true,
      "electricity_connectivity": true,
      "gas_connectivity": false,
      "investment_gain": 15000,
      "investment_cost": 450000,
      "market_risk": true,
      "regulatory_risk": false,
      "financial_risk": false,
      "liquidity_risk": true,
      "physical_risk": false,
      "risk_percentage": 50,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ],
  "message": "recommended properties fetched successfully."
}
```

**Error Responses:**

- **403 Forbidden** – please set your preferences first.

---

---

### `GET /api/user/suggestions`

Get properties suggested by admins for the authenticated user.

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
      "primary_purpose": "Personal Use",
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
      "matchPercentage": 100,
      "water_connectivity": true,
      "electricity_connectivity": true,
      "gas_connectivity": false,
      "investment_gain": 15000,
      "return_of_investment": 15,
      "market_risk": true,
      "regulatory_risk": false,
      "financial_risk": false,
      "liquidity_risk": true,
      "physical_risk": false,
      "risk_percentage": 50,
      "views": 15,
      "updatedAt": "2025-09-22T13:20:52.081Z",
      "createdAt": "2025-09-22T13:20:52.081Z"
    }
  ],
  "message": "suggested properties fetched successfully."
}
```

**Note:**

- Properties are returned in the order suggested by the admin.
- Match percentage is included when user has set preferences.
- If no properties have been suggested by admins, returns an empty array.

**Empty Response (No Suggestions):**

- **Code:** `200 OK`

```json
{
  "success": true,
  "properties": [],
  "message": "no properties suggested by admin yet."
}
```

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
- **400 Bad Request** – invalid budget range.

---

### `POST /api/user/property/add`

Property adding for Brokers.

**Method:** `POST`
**Request Headers:**

```http
Authorization: Bearer <JWT Token>
Content-Type: multipart/form-data
```

**Request Body (multipart/form-data):**

| Field                    | Type    | Description                                |
| ------------------------ | ------- | ------------------------------------------ |
| title                    | string  | Title of the property                      |
| price                    | number  | Price of the property                      |
| type                     | string  | Property type (e.g., Agricultural, etc.)   |
| size                     | string  | Size of the property (e.g., "10 acres")    |
| primary_purpose          | string  | Primary purpose (e.g., Personal Use)       |
| location                 | string  | Location address                           |
| latitude                 | number  | Latitude coordinate                        |
| longitude                | number  | Longitude coordinate                       |
| description              | string  | Description of the property                |
| privacy                  | boolean | Privacy flag (true or false)               |
| features                 | string  | Comma-separated list of features           |
| existingimages           | string  | Comma-separated list of non-deleted images |
| deletedimages            | string  | Comma-separated list of deleted images     |
| images                   | file[]  | One or more image files of the property    |
| water_connectivity       | boolean | Water connectivity availability            |
| electricity_connectivity | boolean | Electricity connectivity availability      |
| gas_connectivity         | boolean | Gas connectivity availability              |
| investment_gain          | number  | Potential investment gain percentage       |
| market_risk              | boolean | Market risk indicator                      |
| regulatory_risk          | boolean | Regulatory risk indicator                  |
| financial_risk           | boolean | Financial risk indicator                   |
| liquidity_risk           | boolean | Liquidity risk indicator                   |
| physical_risk            | boolean | Physical risk indicator                    |

**Note:** `return_of_investment` is calculated automatically using the formula: `((investment_gain - price) / price) * 100`. The `investment_gain` represents the total amount you can gain (price + actual gain amount). It should not be provided in the request body.

---

**Example (multipart/form-data body):**

- `title`: Farm Land in Rajasthan
- `price`: 500000
- `type`: Agricultural
- `size`: 10 acres
- `primary_purpose`: Personal Use
- `location`: Jaipur, Rajasthan
- `latitude`: 26.9124
- `longitude`: 75.7873
- `description`: Fertile land with canal access.
- `privacy`: true
- `features`: Well, Canal, Fenced
- `images`: [file1.png, file2.png, ...]
- `existingimages`: uploads/properties/1759230299218-739692831.png, uploads/properties/1759230299249-703738047.png
- `deletedimages`: uploads/properties/1759230299218-739692831.png, uploads/properties/1759230299249-703738047.png
- `water_connectivity`: true
- `electricity_connectivity`: true
- `gas_connectivity`: false
- `investment_gain`: 15000
- `market_risk`: true
- `regulatory_risk`: false
- `financial_risk`: false
- `liquidity_risk`: true
- `physical_risk`: false

---

**Success Response:**

- **Code:** `200 OK`

```json
{
  "success": true,
  "message": "property submitted for review. it will be visible after admin approval.",
  "property": {
    "id": 1,
    "title": "Farm Land in Rajasthan",
    "price": 500000,
    "type": "Agricultural",
    "size": "10 acres",
    "primary_purpose": "Personal Use",
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
    "water_connectivity": true,
    "electricity_connectivity": true,
    "gas_connectivity": false,
    "investment_gain": 15000,
    "return_of_investment": 15,
    "market_risk": true,
    "regulatory_risk": false,
    "financial_risk": false,
    "liquidity_risk": true,
    "physical_risk": false,
    "risk_percentage": 50,
    "updatedAt": "2025-09-22T13:20:52.081Z",
    "createdAt": "2025-09-22T13:20:52.081Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** – missing required fields.

---
