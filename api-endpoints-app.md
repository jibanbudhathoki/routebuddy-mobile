# Route Buddy App API Endpoints

> **Auth Header**: All endpoints marked with 🔒 require `Authorization: Bearer <Firebase-ID-Token>` header.

---

## GET /

### Responses

**200**: Server is running.

```json
{ "message": "Welcome to RouteBuddy API" }
```

---

## GET /health

### Responses

**200**: Health check OK.

```json
{ "status": "ok" }
```

---

## GET /stores

### Parameters

| Name        | In    | Required | Type   | Description                            |
| ----------- | ----- | -------- | ------ | -------------------------------------- |
| sortOrder   | query | No       | string | Sort order (e.g. `asc`, `desc`)        |
| sortBy      | query | No       | string | Field to sort by                       |
| type        | query | No       | string | Filter by store type                   |
| provinceUid | query | No       | string | Filter by province UID                 |
| cityUid     | query | No       | string | Filter by city UID                     |
| search      | query | No       | string | Search by name                         |
| page        | query | No       | number | Page number (default: 1)               |
| limit       | query | No       | number | Items per page (default: 20, max: 100) |

### Responses

**200**: Paginated list of stores.

```json
{
  "data": [
    {
      "uid": "string",
      "slug": "string",
      "name": "string",
      "type": "string",
      "image": "string",
      "isActive": true,
      "city": { "uid": "string", "name": "string" },
      "province": { "uid": "string", "name": "string" }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

---

## GET /stores/{uid}

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Store detail (full object without `deletedAt`).

```json
{
  "uid": "string",
  "slug": "string",
  "name": "string",
  "type": "string",
  "image": "string",
  "isActive": true,
  "location": {
    "city": { "uid": "string", "name": "string" },
    "province": { "uid": "string", "name": "string" }
  },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## GET /cities

### Parameters

| Name        | In    | Required | Type   | Description              |
| ----------- | ----- | -------- | ------ | ------------------------ |
| provinceUid | query | No       | string | Filter by province UID   |
| page        | query | No       | number | Page number (default: 1) |
| limit       | query | No       | number | Items per page           |

### Responses

**200**: Paginated list of cities.

```json
{
  "data": [
    {
      "uid": "string",
      "slug": "string",
      "name": "string",
      "province": { "uid": "string", "name": "string" }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 100 }
}
```

---

## GET /cities/{uid}

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: City detail (full object without `deletedAt`).

```json
{
  "uid": "string",
  "slug": "string",
  "name": "string",
  "province": { "uid": "string", "name": "string" },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## POST /auth/register

**Summary:** Register with email & password. Sends a 6-digit OTP to the email.

### Request Body

- Content-Type: `application/json`

| Field           | Type    | Required | Validation                                                   |
| --------------- | ------- | -------- | ------------------------------------------------------------ |
| fullName        | string  | ✅ Yes   | Min 2, max 100 characters                                    |
| email           | string  | ✅ Yes   | Valid email format                                           |
| password        | string  | ✅ Yes   | Min 8 chars, must include at least one number and one symbol |
| confirmPassword | string  | ✅ Yes   | Must match `password`                                        |
| termsAccepted   | boolean | ✅ Yes   | Must be `true`                                               |
| deviceToken     | string  | ❌ No    | FCM device token for push notifications                      |
| platform        | string  | ❌ No    | Device platform (e.g. `ios`, `android`)                      |

### Responses

**201**: User registered. OTP sent to email.

```json
{
  "user": {
    "uid": "string",
    "email": "string",
    "emailVerified": false,
    "displayName": "string",
    "photoUrl": null,
    "roles": ["user"]
  }
}
```

---

## POST /auth/sign-in

**Summary:** Sign in with email & password

### Request Body

- Content-Type: `application/json`

| Field       | Type   | Required | Validation                                                   |
| ----------- | ------ | -------- | ------------------------------------------------------------ |
| email       | string | ✅ Yes   | Valid email format                                           |
| password    | string | ✅ Yes   | Min 8 chars, must include at least one number and one symbol |
| deviceToken | string | ❌ No    | FCM device token                                             |
| platform    | string | ❌ No    | Device platform (e.g. `ios`, `android`)                      |

### Responses

**201**: Sign-in successful. Returns access token and user.

```json
{
  "accessToken": "string",
  "user": {
    "uid": "string",
    "email": "string",
    "emailVerified": true,
    "displayName": "string",
    "photoUrl": "string | null",
    "roles": ["user"]
  }
}
```

---

## POST /auth/verify-email

**Summary:** Verify email with the 6-digit OTP sent after registration

### Request Body

- Content-Type: `application/json`

| Field | Type   | Required | Validation                 |
| ----- | ------ | -------- | -------------------------- |
| email | string | ✅ Yes   | Valid email format         |
| code  | string | ✅ Yes   | Exactly 6 characters (OTP) |

### Responses

**200**: Email verified successfully.

```json
{ "message": "Email verified successfully" }
```

---

## POST /auth/resend-otp

**Summary:** Resend email verification OTP

### Request Body

- Content-Type: `application/json`

| Field | Type   | Required | Validation         |
| ----- | ------ | -------- | ------------------ |
| email | string | ✅ Yes   | Valid email format |

### Responses

**200**: OTP resent.

```json
{ "message": "Verification code sent" }
```

---

## POST /auth/forgot-password

**Summary:** Send a 6-digit password reset OTP to the email

### Request Body

- Content-Type: `application/json`

| Field | Type   | Required | Validation         |
| ----- | ------ | -------- | ------------------ |
| email | string | ✅ Yes   | Valid email format |

### Responses

**200**: Password reset OTP sent.

```json
{ "message": "Password reset code sent to your email" }
```

---

## POST /auth/reset-password

**Summary:** Reset password using the 6-digit OTP from forgot-password email

### Request Body

- Content-Type: `application/json`

| Field           | Type   | Required | Validation                                                   |
| --------------- | ------ | -------- | ------------------------------------------------------------ |
| email           | string | ✅ Yes   | Valid email format                                           |
| code            | string | ✅ Yes   | Exactly 6 characters (OTP)                                   |
| password        | string | ✅ Yes   | Min 8 chars, must include at least one number and one symbol |
| confirmPassword | string | ✅ Yes   | Must match `password`                                        |

### Responses

**200**: Password reset successful.

```json
{ "message": "Password reset successfully" }
```

---

## POST /auth/change-password 🔒

**Summary:** Change password using current Firebase ID token

### Request Body

- Content-Type: `application/json`

| Field           | Type   | Required | Validation                                                   |
| --------------- | ------ | -------- | ------------------------------------------------------------ |
| idToken         | string | ✅ Yes   | Current Firebase ID token                                    |
| email           | string | ✅ Yes   | Valid email (from the token schema extension)                |
| password        | string | ✅ Yes   | Min 8 chars, must include at least one number and one symbol |
| confirmPassword | string | ✅ Yes   | Must match `password`                                        |

### Responses

**201**: Password changed.

```json
{
  "user": {
    "uid": "string",
    "email": "string",
    "emailVerified": true,
    "displayName": "string",
    "photoUrl": "string | null",
    "roles": ["user"]
  }
}
```

---

## POST /auth/change-email 🔒

**Summary:** Change the authenticated user's email address and send OTP

### Request Body

- Content-Type: `application/json`

| Field | Type   | Required | Validation              |
| ----- | ------ | -------- | ----------------------- |
| email | string | ✅ Yes   | New email, valid format |

### Responses

**201**: OTP sent to new email for verification.

```json
{ "message": "Verification code sent to new email" }
```

---

## POST /auth/verify-change-email

**Summary:** Verify the new email with the 6-digit OTP sent after requesting email change

### Request Body

- Content-Type: `application/json`

| Field | Type   | Required | Validation                 |
| ----- | ------ | -------- | -------------------------- |
| email | string | ✅ Yes   | The new email address      |
| code  | string | ✅ Yes   | Exactly 6 characters (OTP) |

### Responses

**200**: Email changed successfully.

```json
{ "message": "Email changed successfully" }
```

---

## POST /auth/delete-account

**Summary:** Permanently delete authenticated user account

### Request Body

- Content-Type: `application/json`

| Field   | Type    | Required | Validation                         |
| ------- | ------- | -------- | ---------------------------------- |
| idToken | string  | ✅ Yes   | Current Firebase ID token          |
| confirm | boolean | ✅ Yes   | Must be `true` to confirm deletion |

### Responses

**201**: Account deleted.

```json
{ "message": "Account deleted successfully" }
```

---

## POST /auth/logout 🔒

**Summary:** Logout the current user and revoke their sessions

### Request Body

_None_ – Authenticated via Bearer token.

### Responses

**201**: Logged out.

```json
{ "message": "Logged out successfully" }
```

---

## POST /auth/session

**Summary:** Create a session from a Firebase ID token (client SDK flow)

### Request Body

- Content-Type: `application/json`

| Field       | Type   | Required | Validation                              |
| ----------- | ------ | -------- | --------------------------------------- |
| idToken     | string | ✅ Yes   | Firebase ID token from the client SDK   |
| deviceToken | string | ❌ No    | FCM device token                        |
| platform    | string | ❌ No    | Device platform (e.g. `ios`, `android`) |

### Responses

**201**: Session created.

```json
{
  "user": {
    "uid": "string",
    "email": "string",
    "emailVerified": true,
    "displayName": "string",
    "photoUrl": "string | null",
    "roles": ["user"]
  }
}
```

---

## GET /profile/addresses 🔒

**Summary:** List all addresses for the authenticated user

### Responses

**200**: Array of addresses.

```json
[
  {
    "uid": "string",
    "label": "Home",
    "recipientName": "John Doe",
    "line1": "123 Main St",
    "line2": "Apt 4B",
    "cityUid": "string",
    "provinceUid": "string",
    "postalCode": "M4B 1B3",
    "countryUid": "string",
    "phone": "555-1234",
    "notes": "Leave at front door",
    "isDefault": true,
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
]
```

---

## POST /profile/addresses 🔒

**Summary:** Add a new address

### Request Body

- Content-Type: `application/json`

| Field         | Type    | Required | Validation          |
| ------------- | ------- | -------- | ------------------- |
| label         | string  | ✅ Yes   | Min 1, max 50 chars |
| recipientName | string  | ✅ Yes   | Min 1, max 100      |
| line1         | string  | ✅ Yes   | Min 1, max 200      |
| line2         | string  | ❌ No    | Max 100, nullable   |
| cityUid       | string  | ✅ Yes   | Min 1, max 100      |
| provinceUid   | string  | ✅ Yes   | Min 1, max 100      |
| postalCode    | string  | ✅ Yes   | Min 3, max 20       |
| countryUid    | string  | ✅ Yes   | Min 2, max 100      |
| phone         | string  | ❌ No    | Max 20, nullable    |
| notes         | string  | ❌ No    | Max 150, nullable   |
| isDefault     | boolean | ❌ No    | Set as default addr |

### Responses

**201**: Address created.

```json
{
  "uid": "string",
  "label": "Home",
  "recipientName": "John Doe",
  "line1": "123 Main St",
  "line2": "Apt 4B",
  "cityUid": "string",
  "provinceUid": "string",
  "postalCode": "M4B 1B3",
  "countryUid": "string",
  "phone": "555-1234",
  "notes": "Leave at front door",
  "isDefault": true
}
```

---

## PATCH /profile/addresses/{uid} 🔒

**Summary:** Update an existing address

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`
- All fields are **optional** (partial update).

| Field         | Type    | Required | Validation          |
| ------------- | ------- | -------- | ------------------- |
| label         | string  | ❌ No    | Min 1, max 50       |
| recipientName | string  | ❌ No    | Min 1, max 100      |
| line1         | string  | ❌ No    | Min 1, max 200      |
| line2         | string  | ❌ No    | Max 100, nullable   |
| cityUid       | string  | ❌ No    | Min 1, max 100      |
| provinceUid   | string  | ❌ No    | Min 1, max 100      |
| postalCode    | string  | ❌ No    | Min 3, max 20       |
| countryUid    | string  | ❌ No    | Min 2, max 100      |
| phone         | string  | ❌ No    | Max 20, nullable    |
| notes         | string  | ❌ No    | Max 150, nullable   |
| isDefault     | boolean | ❌ No    | Set as default addr |

### Responses

**200**: Address updated.

```json
{
  "uid": "string",
  "label": "Home",
  "recipientName": "John Doe",
  "line1": "456 Updated St",
  "isDefault": true
}
```

---

## DELETE /profile/addresses/{uid} 🔒

**Summary:** Remove an address

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Address removed.

```json
{ "message": "Address removed successfully" }
```

---

## GET /profile 🔒

### Responses

**200**: Full user profile (all fields except `deletedAt`).

```json
{
  "uid": "string",
  "slug": "string",
  "email": "string",
  "displayName": "string",
  "photoUrl": "string | null",
  "photoKey": "string | null",
  "phone": "string | null",
  "city": "string | null",
  "homeTown": "string | null",
  "rating": 4.5,
  "defaultAddressUid": "string | null",
  "emailVerified": true,
  "roles": ["user"],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## PUT /profile 🔒

### Request Body

- Content-Type: `application/json`
- All fields are **optional**.

| Field             | Type         | Required | Validation              |
| ----------------- | ------------ | -------- | ----------------------- |
| displayName       | string       | ❌ No    | Min 1, max 100, trimmed |
| photoUrl          | string\|null | ❌ No    | Max 500, nullable       |
| photoKey          | string\|null | ❌ No    | Max 500, nullable       |
| phone             | string\|null | ❌ No    | Max 20, nullable        |
| city              | string\|null | ❌ No    | Max 100, nullable       |
| homeTown          | string\|null | ❌ No    | Max 100, nullable       |
| rating            | number\|null | ❌ No    | 0–5, nullable           |
| defaultAddressUid | string       | ❌ No    | UID of default address  |

### Responses

**200**: Profile updated. Returns full profile object (same shape as `GET /profile`).

---

## DELETE /profile 🔒

### Responses

**200**: Profile deleted.

```json
{ "message": "Profile deleted successfully" }
```

---

## GET /profile/summary 🔒

### Responses

**200**: Minimal public profile summary.

```json
{
  "uid": "string",
  "slug": "string",
  "displayName": "string",
  "photoUrl": "string | null",
  "rating": 4.5
}
```

---

## GET /profile/notification-preferences 🔒

### Responses

**200**: Current notification preferences.

```json
{
  "pushNewTripRequests": true,
  "pushNewMessages": true,
  "pushTripUpdates": true,
  "pushPaymentsEscrow": true,
  "pushCommunityAnnouncements": true,
  "emailNotifications": true,
  "notificationSound": true
}
```

---

## PATCH /profile/notification-preferences 🔒

### Request Body

- Content-Type: `application/json`
- All fields are **optional** (partial update).

| Field                      | Type    | Required | Description                      |
| -------------------------- | ------- | -------- | -------------------------------- |
| pushNewTripRequests        | boolean | ❌ No    | New trip request notifications   |
| pushNewMessages            | boolean | ❌ No    | New message notifications        |
| pushTripUpdates            | boolean | ❌ No    | Trip status update notifications |
| pushPaymentsEscrow         | boolean | ❌ No    | Payment/escrow notifications     |
| pushCommunityAnnouncements | boolean | ❌ No    | Community announcement notifs    |
| emailNotifications         | boolean | ❌ No    | Email notifications toggle       |
| notificationSound          | boolean | ❌ No    | Notification sound toggle        |

### Responses

**200**: Preferences updated. Returns the full preferences object.

---

## POST /trips 🔒

**Summary:** Driver: create a trip

**Description:** A driver creates an active trip so requesters can browse it and place orders.

### Request Body

- Content-Type: `application/json`

| Field              | Type     | Required | Validation                      |
| ------------------ | -------- | -------- | ------------------------------- |
| originCityUid      | string   | ✅ Yes   | Min 1 char                      |
| destinationCityUid | string   | ✅ Yes   | Min 1 char                      |
| stores             | string[] | ✅ Yes   | Array of store UIDs, at least 1 |
| departureAt        | string   | ✅ Yes   | ISO 8601 date-time              |
| orderCutoffAt      | string   | ✅ Yes   | ISO 8601 date-time              |
| deliveryLatestBy   | string   | ✅ Yes   | ISO 8601 date-time              |
| capacity           | number   | ✅ Yes   | Integer, minimum 1              |
| price              | number   | ❌ No    | Minimum 0                       |
| notes              | string   | ❌ No    | Max 500 chars, nullable         |

### Responses

**201**: Trip created.

```json
{
  "uid": "string",
  "originCityUid": "string",
  "destinationCityUid": "string",
  "stores": ["string"],
  "departureAt": "2026-08-01T10:00:00.000Z",
  "orderCutoffAt": "2026-07-31T20:00:00.000Z",
  "deliveryLatestBy": "2026-08-02T18:00:00.000Z",
  "capacity": 5,
  "price": 10.0,
  "status": "active",
  "createdAt": "2026-07-30T00:00:00.000Z"
}
```

---

## GET /trips 🔒

**Summary:** Requester: browse active trips

**Description:** Use this as a requester to find active driver trips before placing an order.

### Parameters

| Name               | In    | Required | Type   | Description                            |
| ------------------ | ----- | -------- | ------ | -------------------------------------- |
| originCityUid      | query | No       | string | Filter by origin city                  |
| destinationCityUid | query | No       | string | Filter by destination city             |
| store              | query | No       | string | Filter by store UID                    |
| communityUid       | query | No       | string | Filter by community UID                |
| departureAtStart   | query | No       | string | ISO 8601 date-time range start         |
| departureAtEnd     | query | No       | string | ISO 8601 date-time range end           |
| page               | query | No       | number | Page number (default: 1)               |
| limit              | query | No       | number | Items per page (default: 20, max: 100) |

### Responses

**200**: Paginated list of active trip summaries.

```json
{
  "data": [
    {
      "uid": "string",
      "departureAt": "2026-08-01T10:00:00.000Z",
      "availableSeats": 3,
      "capacity": 5,
      "price": 10.0,
      "status": "active",
      "origin": "Toronto",
      "destination": "Montreal",
      "driver": {
        "name": "John Doe",
        "photoUrl": "string | null"
      }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50 }
}
```

---

## GET /trips/me 🔒

**Summary:** Driver: list my trips

**Description:** Use this as a driver to view trips you created and manage.

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of your trip summaries (same shape as `GET /trips` response items).

---

## PATCH /trips/{uid} 🔒

**Summary:** Driver: update my active trip

**Description:** Only the driver who created an active trip can update its route, schedule, capacity, or details.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`
- All fields are **optional** (partial update, same fields as `POST /trips`).

| Field              | Type     | Required | Validation         |
| ------------------ | -------- | -------- | ------------------ |
| originCityUid      | string   | ❌ No    | Min 1 char         |
| destinationCityUid | string   | ❌ No    | Min 1 char         |
| stores             | string[] | ❌ No    | Array, at least 1  |
| departureAt        | string   | ❌ No    | ISO 8601 date-time |
| orderCutoffAt      | string   | ❌ No    | ISO 8601 date-time |
| deliveryLatestBy   | string   | ❌ No    | ISO 8601 date-time |
| capacity           | number   | ❌ No    | Integer, minimum 1 |
| price              | number   | ❌ No    | Minimum 0          |
| notes              | string   | ❌ No    | Max 500, nullable  |

### Responses

**200**: Trip updated. Returns updated trip object.

---

## DELETE /trips/{uid} 🔒

**Summary:** Driver: delete my trip

**Description:** Hides the trip and prevents new orders from being placed.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Trip deleted.

```json
{ "message": "Trip deleted successfully" }
```

---

## PATCH /trips/{uid}/status 🔒

**Summary:** Driver: cancel or complete my trip

**Description:** Only the driver who created an active trip can set its status to cancelled or completed.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field  | Type   | Required | Validation                                                            |
| ------ | ------ | -------- | --------------------------------------------------------------------- |
| status | string | ✅ Yes   | Enum: `shopping`, `delivering`, `delivered`, `completed`, `cancelled` |

### Responses

**200**: Trip status updated. Returns updated trip object.

---

## PATCH /trips/{uid}/orders 🔒

**Summary:** Driver: close or reopen new orders

**Description:** Closing stops new requests while leaving existing orders unaffected.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field  | Type    | Required | Validation                         |
| ------ | ------- | -------- | ---------------------------------- |
| closed | boolean | ✅ Yes   | `true` to close, `false` to reopen |

### Responses

**200**: Order acceptance toggled. Returns updated trip object.

---

## GET /trips/{uid}/orders 🔒

**Summary:** Driver: list orders for my trip

**Description:** Use this as a driver to see all orders (pending, accepted, cancelled) that users submitted on your trip.

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| uid   | path  | Yes      | string |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of request/order summaries.

```json
{
  "data": [
    {
      "uid": "string",
      "neededBy": "2026-08-01T10:00:00.000Z",
      "latestDeliveryBy": "2026-08-02T18:00:00.000Z",
      "status": "pending",
      "totalCost": 25.5,
      "deliveryCity": "Toronto",
      "origin": "Walmart Toronto",
      "destination": "Toronto",
      "stores": ["Walmart"],
      "requester": {
        "name": "Jane Smith",
        "photoUrl": "string | null"
      },
      "driver": null
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 10 }
}
```

---

## GET /trips/{uid} 🔒

**Summary:** Requester/Driver: view a trip

**Description:** Requesters use this to view a trip before placing an order; drivers can view their own trip details.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Full trip detail.

```json
{
  "uid": "string",
  "originCityUid": "string",
  "destinationCityUid": "string",
  "stores": ["string"],
  "departureAt": "2026-08-01T10:00:00.000Z",
  "orderCutoffAt": "2026-07-31T20:00:00.000Z",
  "deliveryLatestBy": "2026-08-02T18:00:00.000Z",
  "capacity": 5,
  "availableSeats": 3,
  "price": 10.0,
  "status": "active",
  "notes": "string | null",
  "origin": "Toronto",
  "destination": "Montreal",
  "driver": {
    "uid": "string",
    "name": "John Doe",
    "photoUrl": "string | null",
    "rating": 4.5
  },
  "createdAt": "2026-07-30T00:00:00.000Z",
  "updatedAt": "2026-07-30T00:00:00.000Z"
}
```

---

## GET /trips/shared/{uid}

**Summary:** Public: view a shared trip (no auth required)

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Same shape as `GET /trips/{uid}` response.

---

## POST /notifications/tokens 🔒

**Summary:** Register an FCM device token

### Request Body

- Content-Type: `application/json`

| Field    | Type   | Required | Validation            |
| -------- | ------ | -------- | --------------------- |
| token    | string | ✅ Yes   | FCM device token      |
| platform | string | ❌ No    | e.g. `ios`, `android` |

### Responses

**201**: Token registered.

```json
{ "success": true, "message": "Token registered successfully" }
```

---

## DELETE /notifications/tokens/{token} 🔒

**Summary:** Unregister an FCM device token

### Parameters

| Name  | In   | Required | Type   |
| ----- | ---- | -------- | ------ |
| token | path | Yes      | string |

### Responses

**204**: No content. Token unregistered.

---

## GET /notifications 🔒

**Summary:** Fetch user notifications

### Responses

**200**: Array of notifications (without `userUid` and `updatedAt`).

```json
[
  {
    "id": "string",
    "title": "New order received",
    "message": "Jane placed an order on your trip.",
    "type": "string",
    "isRead": false,
    "data": {},
    "createdAt": "2026-08-01T10:00:00.000Z"
  }
]
```

---

## POST /notifications/{id}/read 🔒

**Summary:** Mark a notification as read

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Responses

**201**: Notification marked as read.

---

## POST /notifications/read-all 🔒

**Summary:** Mark all notifications as read

### Responses

**201**: All notifications marked as read.

---

## POST /requests 🔒

**Summary:** Requester: create an open delivery request

**Description:** Use this as a requester to publish a request that drivers can offer to fulfil.

### Request Body

- Content-Type: `application/json`

| Field            | Type     | Required              | Validation                                     |
| ---------------- | -------- | --------------------- | ---------------------------------------------- |
| stores           | string[] | ✅ Yes                | Array of store UIDs, at least 1                |
| items            | object[] | ✅ Yes                | At least 1 item (see Item schema below)        |
| deliveryAddress  | string   | ✅ Yes                | Min 1 char                                     |
| deliveryCityUid  | string   | ✅ Yes (open request) | Required when no `tripUid`                     |
| neededBy         | string   | ✅ Yes (open request) | ISO 8601 date-time, required when no `tripUid` |
| latestDeliveryBy | string   | ✅ Yes (open request) | ISO 8601 date-time, required when no `tripUid` |
| notes            | string   | ❌ No                 | Max 500 chars, nullable                        |

**Item schema:**

| Field         | Type         | Required | Validation              |
| ------------- | ------------ | -------- | ----------------------- |
| item          | string       | ✅ Yes   | Item name, min 1 char   |
| description   | string\|null | ❌ No    | Max 500 chars, nullable |
| estimatePrice | number       | ✅ Yes   | Minimum 0               |

### Responses

**201**: Request created.

```json
{
  "message": "Request created successfully and is now open.",
  "postId": "string",
  "status": "open",
  "totalItems": 3,
  "totalCost": 45.5
}
```

---

## GET /requests 🔒

**Summary:** Driver: list open requests

**Description:** Use this as a driver to find open requests and submit an offer.

### Parameters

| Name                  | In    | Required | Type   | Description                            |
| --------------------- | ----- | -------- | ------ | -------------------------------------- |
| deliveryCityUid       | query | No       | string | Filter by delivery city                |
| store                 | query | No       | string | Filter by store UID                    |
| neededByStart         | query | No       | string | ISO 8601 date-time range start         |
| neededByEnd           | query | No       | string | ISO 8601 date-time range end           |
| latestDeliveryByStart | query | No       | string | ISO 8601 date-time range start         |
| latestDeliveryByEnd   | query | No       | string | ISO 8601 date-time range end           |
| communityUid          | query | No       | string | Filter by community UID                |
| page                  | query | No       | number | Page number (default: 1)               |
| limit                 | query | No       | number | Items per page (default: 20, max: 100) |

### Responses

**200**: Paginated list of open request summaries (same shape as trip orders).

---

## GET /requests/me 🔒

**Summary:** Requester: list my requests

**Description:** Use this as a requester to see your requests and all driver offers on them.

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of your request summaries.

---

## GET /requests/driver/me 🔒

**Summary:** Driver: list my assigned requests

**Description:** Use this as a driver to see requests or orders assigned to you.

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of assigned request summaries.

---

## POST /requests/{uid}/accept 🔒

**Summary:** Driver: accept an assigned trip order

**Description:** For a driver assigned to a trip-based order in pending status. Do not use this to accept an offer on an open request.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

_None._

### Responses

**201**: Order accepted. Returns updated request object.

---

## PATCH /requests/{uid}/status 🔒

**Summary:** Driver: update delivery status

**Description:** The assigned driver updates an accepted request through shopping, delivering, and delivered.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field  | Type   | Required | Validation                                  |
| ------ | ------ | -------- | ------------------------------------------- |
| status | string | ✅ Yes   | Enum: `shopping`, `delivering`, `delivered` |

### Responses

**200**: Status updated. Returns updated request object.

---

## POST /requests/{uid}/confirm-delivery 🔒

**Summary:** Requester: confirm delivery

**Description:** The requester confirms a request after the driver marks it delivered.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

_None._

### Responses

**201**: Delivery confirmed. Returns updated request object.

---

## PATCH /requests/{uid}/cancel 🔒

**Summary:** Requester: cancel a request

**Description:** The requester cancels the request before the driver accepts it.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

_None._

### Responses

**200**: Request cancelled. Returns updated request object.

---

## DELETE /requests/{uid} 🔒

**Summary:** Requester: delete my request

**Description:** Hides the request and cancels it before fulfilment begins.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Request deleted.

```json
{ "message": "Request deleted successfully" }
```

---

## GET /requests/{uid} 🔒

**Summary:** Requester/Driver: view a request

**Description:** Use this to view one request, including the offers submitted by drivers.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Full request detail with offers.

```json
{
  "uid": "string",
  "tripUid": "string | null",
  "stores": [
    {
      "uid": "string",
      "name": "string",
      "location": { "city": { "name": "string" } }
    }
  ],
  "items": [
    { "item": "Milk", "description": "2% milk", "estimatePrice": 5.79 }
  ],
  "deliveryAddress": "123 Main St",
  "deliveryCityUid": "string",
  "neededBy": "2026-08-01T10:00:00.000Z",
  "latestDeliveryBy": "2026-08-02T18:00:00.000Z",
  "status": "open",
  "total": 25.5,
  "notes": "string | null",
  "origin": "Toronto",
  "destination": "Toronto",
  "requester": {
    "uid": "string",
    "name": "Jane Smith",
    "photoUrl": "string | null",
    "rating": 4.8
  },
  "driver": null,
  "offers": [
    {
      "uid": "string",
      "message": "I can deliver by 5 PM",
      "proposedLatestBy": "2026-08-01T17:00:00.000Z",
      "status": "pending",
      "driver": {
        "uid": "string",
        "name": "John Doe",
        "photoUrl": "string | null",
        "rating": 4.5
      },
      "createdAt": "2026-07-31T00:00:00.000Z"
    }
  ],
  "createdAt": "2026-07-30T00:00:00.000Z",
  "updatedAt": "2026-07-30T00:00:00.000Z"
}
```

---

## POST /requests/{uid}/offers 🔒

**Summary:** Driver: submit an offer

**Description:** A driver proposes a delivery time for an open request.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field            | Type   | Required | Validation                                           |
| ---------------- | ------ | -------- | ---------------------------------------------------- |
| proposedLatestBy | string | ✅ Yes   | ISO 8601 date-time (e.g. `2026-08-07T17:00:00.000Z`) |
| message          | string | ❌ No    | Max 500 chars                                        |

### Responses

**201**: Offer submitted. Returns the created offer object.

```json
{
  "uid": "string",
  "message": "I can deliver this before 5 PM.",
  "proposedLatestBy": "2026-08-07T17:00:00.000Z",
  "status": "pending",
  "createdAt": "2026-08-06T00:00:00.000Z"
}
```

---

## POST /requests/{uid}/offers/{offerUid}/accept 🔒

**Summary:** Requester: accept a driver's offer

**Description:** The requester selects one pending driver offer. The request is assigned to that driver and the remaining offers are declined.

### Parameters

| Name     | In   | Required | Type   |
| -------- | ---- | -------- | ------ |
| uid      | path | Yes      | string |
| offerUid | path | Yes      | string |

### Request Body

_None._

### Responses

**201**: Offer accepted. Returns updated request object with assigned driver.

---

## POST /requests/{uid}/delivery-proof 🔒

**Summary:** Driver: add delivery proof

**Description:** The assigned driver attaches receipt, item photos, or a delivery note after delivery.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`
- At least one field should be provided.

| Field         | Type     | Required | Validation          |
| ------------- | -------- | -------- | ------------------- |
| receiptUrl    | string   | ❌ No    | Valid URL           |
| itemPhotoUrls | string[] | ❌ No    | Array of valid URLs |
| note          | string   | ❌ No    | Max 500 chars       |

### Responses

**201**: Delivery proof added. Returns updated request object.

---

## POST /requests/{uid}/issues 🔒

**Summary:** Requester: report an issue

**Description:** The requester reports a problem with one of their requests.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field   | Type   | Required | Validation            |
| ------- | ------ | -------- | --------------------- |
| message | string | ✅ Yes   | Min 1, max 1000 chars |

### Responses

**201**: Issue reported.

```json
{ "message": "Issue reported successfully" }
```

---

## POST /requests/{uid}/rating 🔒

**Summary:** Requester: rate driver

**Description:** The requester rates the driver after a request is completed.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field   | Type   | Required | Validation    |
| ------- | ------ | -------- | ------------- |
| score   | number | ✅ Yes   | Integer, 1–5  |
| comment | string | ❌ No    | Max 500 chars |

### Responses

**201**: Rating submitted.

```json
{ "message": "Rating submitted successfully" }
```

---

## POST /requests/order 🔒

**Summary:** Requester: create an order for a trip

**Description:** Use this as a requester to place an order on an active driver trip.

### Request Body

- Content-Type: `application/json`

| Field           | Type     | Required | Validation                              |
| --------------- | -------- | -------- | --------------------------------------- |
| tripUid         | string   | ✅ Yes   | The trip UID to place the order on      |
| stores          | string[] | ✅ Yes   | Array of store UIDs, at least 1         |
| items           | object[] | ✅ Yes   | At least 1 item (see Item schema above) |
| deliveryAddress | string   | ✅ Yes   | Min 1 char                              |
| notes           | string   | ❌ No    | Max 500 chars                           |

### Responses

**201**: Order created.

```json
{
  "message": "Request created successfully. Please proceed to payment.",
  "postId": "string",
  "status": "pending",
  "totalItems": 2,
  "totalCost": 15.5
}
```

---

## PATCH /requests/order/{uid}/cancel 🔒

**Summary:** Requester: cancel an order

**Description:** The requester cancels the order before the driver accepts it.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

_None._

### Responses

**200**: Order cancelled. Returns updated request object.

---

## GET /requests/shared/{uid}

**Summary:** Public: view a shared request (no auth required)

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Same shape as `GET /requests/{uid}` response.

---

## GET /messages/conversations 🔒

**Summary:** Get user conversations (Inbox)

### Responses

**200**: Array of conversations (without `updatedAt`).

```json
[
  {
    "uid": "string",
    "participants": ["userUid1", "userUid2"],
    "tripId": "string | null",
    "requestId": "string | null",
    "lastMessage": {
      "content": "Hello!",
      "senderUid": "string",
      "createdAt": "2026-08-01T10:00:00.000Z"
    },
    "unreadCount": 2,
    "createdAt": "2026-07-30T00:00:00.000Z"
  }
]
```

---

## POST /messages/conversations 🔒

**Summary:** Get or create a conversation for a request or trip

### Request Body

- Content-Type: `application/json`
- At least one of `tripId`, `requestId`, or `userId` is required.

| Field     | Type   | Required       | Description                               |
| --------- | ------ | -------------- | ----------------------------------------- |
| tripId    | string | ❌ Conditional | Trip UID to create conversation for       |
| requestId | string | ❌ Conditional | Request UID to create conversation for    |
| userId    | string | ❌ No          | Specific user UID for direct conversation |

> **Validation:** Must provide either `tripId` or `requestId`. If only `userId` is provided, a direct conversation is created.

### Responses

**201**: Conversation found or created.

```json
{
  "id": "string",
  "participants": ["userUid1", "userUid2"]
}
```

---

## GET /messages/conversations/{id}/messages 🔒

**Summary:** Get messages for a conversation

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Responses

**200**: Messages array (without `updatedAt`).

```json
{
  "data": [
    {
      "uid": "string",
      "conversationId": "string",
      "senderUid": "string",
      "content": "Hello!",
      "type": "text",
      "replyToUid": "string | null",
      "reactions": [],
      "createdAt": "2026-08-01T10:00:00.000Z"
    }
  ]
}
```

---

## POST /messages/conversations/{id}/messages 🔒

**Summary:** Send a message in a conversation

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field      | Type   | Required | Validation                                                   |
| ---------- | ------ | -------- | ------------------------------------------------------------ |
| content    | string | ✅ Yes   | Message text, or S3 media key for image/voice/video messages |
| type       | string | ❌ No    | Enum: `text`, `image`, `voice`, `video` (default: `text`)    |
| replyToUid | string | ❌ No    | UID of the message being replied to                          |

### Responses

**201**: Message sent. Returns the created message object.

---

## POST /messages/conversations/{id}/read 🔒

**Summary:** Mark conversation as read

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Request Body

_None._

### Responses

**201**: Conversation marked as read.

---

## DELETE /messages/conversations/{id} 🔒

**Summary:** Delete (hide) a conversation for the current user

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Responses

**200**: Conversation hidden.

```json
{ "message": "Conversation deleted" }
```

---

## DELETE /messages/messages 🔒

**Summary:** Delete specific messages

### Request Body

- Content-Type: `application/json`

| Field       | Type     | Required | Validation                      |
| ----------- | -------- | -------- | ------------------------------- |
| messageUids | string[] | ✅ Yes   | Array of message UIDs to delete |

### Responses

**200**: Messages deleted.

---

## POST /messages/messages/{id}/react 🔒

**Summary:** React to a specific message

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Request Body

- Content-Type: `application/json`

| Field | Type   | Required | Validation         |
| ----- | ------ | -------- | ------------------ |
| emoji | string | ✅ Yes   | Emoji character(s) |

### Responses

**201**: Reaction added.

---

## GET /communities 🔒

**Summary:** User: browse approved communities

**Description:** Any authenticated requester or driver can search approved communities.

### Parameters

| Name   | In    | Required | Type   | Description    |
| ------ | ----- | -------- | ------ | -------------- |
| search | query | No       | string | Search by name |
| page   | query | No       | number | Page number    |
| limit  | query | No       | number | Items per page |

### Responses

**200**: Paginated list of approved communities.

```json
{
  "data": [
    {
      "uid": "string",
      "slug": "string",
      "name": "Pokhara Lakeside",
      "type": "city",
      "status": "approved",
      "city": { "uid": "string", "name": "Pokhara" },
      "province": { "uid": "string", "name": "Gandaki" }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 50 }
}
```

---

## POST /communities 🔒

**Summary:** User: submit a new community

**Description:** Any authenticated requester or driver can submit a community. It remains pending until approved by an administrator.

### Request Body

- Content-Type: `application/json`

| Field       | Type   | Required | Validation                    |
| ----------- | ------ | -------- | ----------------------------- |
| name        | string | ✅ Yes   | Min 2, max 100 chars, trimmed |
| provinceUid | string | ✅ Yes   | Min 1 char, trimmed           |
| cityUid     | string | ✅ Yes   | Min 1 char, trimmed           |
| description | string | ❌ No    | Max 120 chars, trimmed        |
| type        | string | ❌ No    | Enum: `town`, `rural`, `city` |

### Responses

**201**: Community submitted (pending approval).

```json
{
  "uid": "string",
  "slug": "string",
  "name": "Pokhara Lakeside",
  "status": "pending",
  "type": "city"
}
```

---

## GET /communities/my-submissions 🔒

**Summary:** User: list my submitted communities

**Description:** Returns all communities submitted by the authenticated user, regardless of approval status.

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of your community submissions (same shape as `GET /communities` items).

---

## GET /communities/recent 🔒

**Summary:** User: list recent/joined communities

**Description:** Returns a list of communities the authenticated user has joined.

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of joined communities (same shape as `GET /communities` items).

---

## GET /communities/types 🔒

**Summary:** User: get available community types

**Description:** Returns the static list of allowed community types.

### Responses

**200**: Array of type strings.

```json
["town", "rural", "city"]
```

---

## POST /communities/{uid}/join 🔒

**Summary:** User: join an approved community

**Description:** Any authenticated requester or driver can set an approved community on their profile.

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Request Body

_None._

### Responses

**201**: Joined the community.

```json
{ "message": "Joined community successfully" }
```

---

## POST /app-reviews 🔒

**Summary:** User: Submit an app review

**Description:** Submit a rating and optional feedback about the RouteBuddy application itself.

### Request Body

- Content-Type: `application/json`

| Field      | Type   | Required | Validation                    |
| ---------- | ------ | -------- | ----------------------------- |
| rating     | number | ✅ Yes   | 1–5                           |
| comment    | string | ❌ No    | Max 1000 chars                |
| platform   | string | ❌ No    | Enum: `ios`, `android`, `web` |
| appVersion | string | ❌ No    | e.g. `1.0.4`                  |

### Responses

**201**: Review submitted.

```json
{
  "uid": "string",
  "rating": 5,
  "comment": "Great app!",
  "platform": "ios",
  "appVersion": "1.0.4",
  "createdAt": "2026-08-01T00:00:00.000Z"
}
```

---

## GET /countries

**Summary:** List all active countries

### Parameters

| Name  | In    | Required | Type   |
| ----- | ----- | -------- | ------ |
| page  | query | No       | number |
| limit | query | No       | number |

### Responses

**200**: Paginated list of countries.

```json
{
  "data": [
    {
      "uid": "string",
      "name": "Canada",
      "code": "CA",
      "isActive": true
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 10 }
}
```

---

## GET /countries/{uid}

**Summary:** Get a specific country

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Country detail (full object without `deletedAt`).

```json
{
  "uid": "string",
  "name": "Canada",
  "code": "CA",
  "isActive": true,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## GET /provinces

**Summary:** List active provinces (optionally filtered by countryUid)

### Parameters

| Name       | In    | Required | Type   | Description           |
| ---------- | ----- | -------- | ------ | --------------------- |
| countryUid | query | No       | string | Filter by country UID |
| page       | query | No       | number | Page number           |
| limit      | query | No       | number | Items per page        |

### Responses

**200**: Paginated list of provinces.

```json
{
  "data": [
    {
      "uid": "string",
      "name": "Ontario",
      "code": "ON",
      "isActive": true,
      "country": { "uid": "string", "name": "Canada" }
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 13 }
}
```

---

## GET /provinces/{uid}

**Summary:** Get a specific province

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| uid  | path | Yes      | string |

### Responses

**200**: Province detail (full object without `deletedAt`).

```json
{
  "uid": "string",
  "name": "Ontario",
  "code": "ON",
  "isActive": true,
  "country": { "uid": "string", "name": "Canada" },
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

---

## POST /payments/intent 🔒

**Summary:** Create a payment intent for a transaction

### Request Body

- Content-Type: `application/json`

| Field    | Type   | Required | Validation                                  |
| -------- | ------ | -------- | ------------------------------------------- |
| amount   | number | ✅ Yes   | Positive, minimum 1 unit                    |
| currency | string | ✅ Yes   | 3-character currency code (default: `usd`)  |
| metadata | object | ❌ No    | Key-value pairs (e.g. `{ routeId: "123" }`) |

### Responses

**201**: Payment intent created.

```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 100,
  "currency": "usd"
}
```

---

## GET /payments/history 🔒

**Summary:** Get payment history for the authenticated user

### Responses

**200**: Array of payment transactions.

```json
[
  {
    "id": "string",
    "amount": 25.5,
    "currency": "usd",
    "status": "succeeded",
    "type": "payment",
    "createdAt": "2026-08-01T00:00:00.000Z"
  }
]
```

---

## POST /payments/checkout 🔒

**Summary:** Checkout an accepted request and authorize payment (Phase 1)

### Request Body

- Content-Type: `application/json`

| Field       | Type   | Required | Validation                       |
| ----------- | ------ | -------- | -------------------------------- |
| requestSlug | string | ✅ Yes   | Slug/UID of the accepted request |

### Responses

**201**: Checkout successful, payment authorized.

```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 25.5,
  "currency": "usd"
}
```

---

## POST /payments/confirm-delivery 🔒

**Summary:** Confirm delivery, capture payment, and credit wallet (Phase 1)

### Request Body

- Content-Type: `application/json`

| Field       | Type   | Required | Validation                        |
| ----------- | ------ | -------- | --------------------------------- |
| requestSlug | string | ✅ Yes   | Slug/UID of the delivered request |

### Responses

**201**: Payment captured and wallet credited.

```json
{
  "message": "Delivery confirmed and payment captured",
  "capturedAmount": 25.5,
  "walletCredited": 22.95
}
```

---

## POST /payments/withdraw 🔒

**Summary:** Request a withdrawal from wallet (Phase 2)

### Request Body

- Content-Type: `application/json`

| Field            | Type   | Required | Validation                   |
| ---------------- | ------ | -------- | ---------------------------- |
| amount           | number | ✅ Yes   | Amount to withdraw           |
| destinationEmail | string | ✅ Yes   | Email for payout destination |

### Responses

**201**: Withdrawal request submitted.

```json
{
  "message": "Withdrawal request submitted",
  "withdrawalId": "string",
  "amount": 50.0,
  "status": "pending"
}
```

---

## GET /payments/withdraw 🔒

**Summary:** List driver's own withdrawal requests

### Responses

**200**: Array of withdrawal requests.

```json
[
  {
    "id": "string",
    "amount": 50.0,
    "status": "pending",
    "destinationEmail": "driver@example.com",
    "createdAt": "2026-08-01T00:00:00.000Z"
  }
]
```

---

## GET /payments/wallet/summary 🔒

**Summary:** Get wallet summary including balance and pending escrow

### Responses

**200**: Wallet summary.

```json
{
  "balance": 150.0,
  "pendingEscrow": 25.5,
  "totalEarned": 500.0,
  "totalWithdrawn": 325.0
}
```

---

## GET /payments/wallet/activity 🔒

**Summary:** Get recent wallet activity (transactions)

### Responses

**200**: Array of wallet transactions.

```json
[
  {
    "id": "string",
    "type": "credit",
    "amount": 22.95,
    "description": "Delivery payment for order #xyz",
    "createdAt": "2026-08-01T00:00:00.000Z"
  }
]
```

---

## POST /payments/methods/setup-intent 🔒

**Summary:** Create a SetupIntent to save a new payment method

### Request Body

_None._

### Responses

**201**: SetupIntent created.

```json
{
  "clientSecret": "seti_xxx_secret_xxx",
  "setupIntentId": "seti_xxx"
}
```

---

## GET /payments/methods 🔒

**Summary:** List saved payment methods for the user

### Responses

**200**: Array of saved payment methods.

```json
[
  {
    "id": "pm_xxx",
    "type": "card",
    "card": {
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2028
    },
    "isDefault": true
  }
]
```

---

## PUT /payments/methods/{id}/default 🔒

**Summary:** Set a payment method as default

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Responses

**200**: Default payment method updated.

```json
{ "message": "Default payment method updated" }
```

---

## DELETE /payments/methods/{id} 🔒

**Summary:** Delete a saved payment method

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Responses

**200**: Payment method deleted.

```json
{ "message": "Payment method deleted" }
```

---

## GET /payments/{id} 🔒

**Summary:** Get a specific payment transaction by ID

### Parameters

| Name | In   | Required | Type   |
| ---- | ---- | -------- | ------ |
| id   | path | Yes      | string |

### Responses

**200**: Payment transaction detail.

```json
{
  "id": "string",
  "amount": 25.5,
  "currency": "usd",
  "status": "succeeded",
  "type": "payment",
  "metadata": {},
  "createdAt": "2026-08-01T00:00:00.000Z"
}
```

---

## POST /webhooks/stripe

**Summary:** Handle Stripe webhooks

**Description:** This endpoint is called by Stripe, not by clients.

### Parameters

| Name             | In     | Required | Type   | Description              |
| ---------------- | ------ | -------- | ------ | ------------------------ |
| stripe-signature | header | Yes      | string | Stripe webhook signature |

### Request Body

Raw request body (Buffer) from Stripe.

### Responses

**200**: Webhook processed.

```json
{ "received": true }
```

---

## GET /media/{key}

**Summary:** Stream a media file from private S3 storage

### Parameters

| Name | In   | Required | Type   | Description                                         |
| ---- | ---- | -------- | ------ | --------------------------------------------------- |
| key  | path | Yes      | string | S3 object key (e.g. `profiles/user123/avatar.webp`) |

### Responses

**200**: Binary stream of the media file with appropriate `Content-Type` header.

Response Headers:

- `Content-Type`: MIME type of the file
- `Content-Length`: File size in bytes
- `ETag`: Entity tag for caching
- `Cache-Control`: `public, max-age=31536000, immutable`

**304**: Not modified (when `If-None-Match` matches ETag).

**404**: Media file not found.

---

## POST /media/upload 🔒

**Summary:** Upload a media file (images, audio, video) to S3

### Parameters

| Name   | In    | Required | Type   | Description                                                               |
| ------ | ----- | -------- | ------ | ------------------------------------------------------------------------- |
| folder | query | No       | string | Folder path in S3 (e.g. `profiles`, `stores`, `chat`). Default: `uploads` |

### Request Body

- Content-Type: `multipart/form-data`

| Field | Type   | Required | Validation                                               |
| ----- | ------ | -------- | -------------------------------------------------------- |
| file  | binary | ✅ Yes   | Image (max 20MB), audio (max 30MB), or video (max 200MB) |

### Responses

**201**: File uploaded.

```json
{
  "message": "File uploaded successfully",
  "mediaKey": "profiles/a1b2c3d4.webp",
  "mediaUrl": "https://routebuddy.net/media/profiles/a1b2c3d4.webp",
  "photoKey": "profiles/a1b2c3d4.webp",
  "photoUrl": "https://routebuddy.net/media/profiles/a1b2c3d4.webp",
  "mediaType": "image"
}
```

---

## POST /upload/presigned-url 🔒

**Summary:** Generate an S3 presigned PUT URL for direct client upload

### Request Body

- Content-Type: `application/json`

| Field       | Type   | Required | Validation                                                 |
| ----------- | ------ | -------- | ---------------------------------------------------------- |
| category    | string | ✅ Yes   | Enum: `profiles`, `stores`, `logos`, `favicons`            |
| fileName    | string | ✅ Yes   | Min 1, max 255, must include valid extension               |
| contentType | string | ✅ Yes   | Enum: `image/jpeg`, `image/png`, `image/webp`, `image/gif` |

> **Validation:** File extension must match the content type (e.g. `.jpg` for `image/jpeg`).

### Responses

**201**: Presigned URL generated successfully.

```json
{
  "uploadUrl": "https://s3.amazonaws.com/bucket/profiles/a1b2c3d4.jpg?X-Amz-...",
  "key": "profiles/a1b2c3d4.jpg",
  "mediaUrl": "https://routebuddy.net/media/profiles/a1b2c3d4.jpg"
}
```

---

# Schemas

## SendNotificationDto

| Property      | Type   | Required | Description                                     |
| ------------- | ------ | -------- | ----------------------------------------------- |
| targetUserUid | string | Yes      | The UID of the user to send the notification to |
| title         | string | Yes      | The title of the notification                   |
| message       | string | Yes      | The body/message of the notification            |
| data          | object | No       | Optional extra payload data                     |

## BroadcastNotificationDto

| Property | Type   | Required | Description                          |
| -------- | ------ | -------- | ------------------------------------ |
| title    | string | Yes      | The title of the notification        |
| message  | string | Yes      | The body/message of the notification |
| data     | object | No       | Optional extra payload data          |

## Common Error Responses

All endpoints may return the following error responses:

**400** Bad Request:

```json
{
  "statusCode": 400,
  "message": ["Validation error details"],
  "error": "Bad Request"
}
```

**401** Unauthorized:

```json
{
  "statusCode": 401,
  "message": "User not authenticated",
  "error": "Unauthorized"
}
```

**403** Forbidden:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

**404** Not Found:

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

**500** Internal Server Error:

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```
