# Postman Guide: Consuming Paginated MFL List Endpoint

## Endpoint
```
GET /api/mfl
```

## Base URL
Depending on your server configuration:
- Local: `http://localhost:PORT/api/mfl`
- Production: `https://your-domain.com/api/mfl`

---

## Query Parameters

### Pagination Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number (starts at 1) |
| `limit` | integer | 50 | Number of items per page |

### Filter Parameters (Optional)

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search in facility name, shortname, nhfrid, or uid (case-insensitive) |
| `level` | string | Filter by facility level |
| `ownership` | string | Filter by ownership (e.g., "GOV", "PNFP", "PFP") |
| `authority` | string | Filter by authority |
| `region_id` | integer | Filter by region ID |
| `district_id` | integer | Filter by district ID |
| `sub_county_id` | integer | Filter by sub-county ID |
| `status` | string | Filter by facility status |

### Export Parameter

| Parameter | Type | Description |
|-----------|------|-------------|
| `export` | string | Set to "all" to get all facilities without pagination |

---

## Postman Setup Instructions

### 1. Basic Paginated Request

**Request:**
- Method: `GET`
- URL: `http://localhost:3000/api/mfl?page=1&limit=10`

**Query Parameters:**
```
page: 1
limit: 10
```

**Response Example:**
```json
{
  "facilities": [
    {
      "id": 1,
      "name": "Facility Name",
      "nhfrid": "NHFR123",
      "level": "Level 3",
      "ownership": "GOV",
      // ... other facility fields
    }
    // ... more facilities
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 10,
    "totalPages": 100,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

### 2. Navigate Through Pages

**Page 1:**
```
GET /api/mfl?page=1&limit=20
```

**Page 2:**
```
GET /api/mfl?page=2&limit=20
```

**Last Page:**
```
GET /api/mfl?page=10&limit=20
```

---

### 3. Search with Pagination

**Request:**
```
GET /api/mfl?search=hospital&page=1&limit=25
```

**Query Parameters:**
```
search: hospital
page: 1
limit: 25
```

This will search for facilities containing "hospital" in their name, shortname, nhfrid, or uid, and return the first 25 results.

---

### 4. Filter by Ownership and Level

**Request:**
```
GET /api/mfl?ownership=GOV&level=Level 3&page=1&limit=50
```

**Query Parameters:**
```
ownership: GOV
level: Level 3
page: 1
limit: 50
```

---

### 5. Filter by Region and District

**Request:**
```
GET /api/mfl?region_id=1&district_id=5&page=1&limit=30
```

**Query Parameters:**
```
region_id: 1
district_id: 5
page: 1
limit: 30
```

---

### 6. Combined Filters with Pagination

**Request:**
```
GET /api/mfl?search=clinic&ownership=PNFP&region_id=2&page=2&limit=15
```

**Query Parameters:**
```
search: clinic
ownership: PNFP
region_id: 2
page: 2
limit: 15
```

---

### 7. Export All (No Pagination)

**Request:**
```
GET /api/mfl?export=all&ownership=GOV
```

**Query Parameters:**
```
export: all
ownership: GOV
```

**Response:**
```json
{
  "results": 500,
  "facilities": [
    // ... all facilities matching the filter
  ]
}
```

---

## Postman Collection Setup

### Step-by-Step:

1. **Create a New Request**
   - Click "New" → "HTTP Request"
   - Name it: "Get MFL List (Paginated)"

2. **Set Request Method**
   - Select `GET` from the dropdown

3. **Enter URL**
   - Base URL: `http://localhost:3000/api/mfl`
   - (Adjust port based on your server)

4. **Add Query Parameters**
   - Click on "Params" tab
   - Add parameters:
     - Key: `page`, Value: `1`
     - Key: `limit`, Value: `50`
     - (Add more filters as needed)

5. **Send Request**
   - Click "Send"
   - View the response with pagination metadata

---

## Using Postman Environment Variables

Create an environment to make testing easier:

### Variables:
```
base_url: http://localhost:3000
api_path: /api/mfl
page: 1
limit: 50
```

### Request URL:
```
{{base_url}}{{api_path}}?page={{page}}&limit={{limit}}
```

---

## Testing Pagination Flow

### Test Case 1: First Page
```
GET /api/mfl?page=1&limit=10
```
**Expected:**
- `pagination.page` = 1
- `pagination.hasPreviousPage` = false
- `pagination.hasNextPage` = true (if total > 10)
- `facilities.length` = 10 (or less if total < 10)

### Test Case 2: Middle Page
```
GET /api/mfl?page=5&limit=10
```
**Expected:**
- `pagination.page` = 5
- `pagination.hasPreviousPage` = true
- `pagination.hasNextPage` = true (if total > 50)
- `facilities.length` = 10 (or less if on last page)

### Test Case 3: Last Page
```
GET /api/mfl?page=100&limit=10
```
**Expected:**
- `pagination.page` = 100
- `pagination.hasPreviousPage` = true
- `pagination.hasNextPage` = false
- `pagination.totalPages` should match the calculated value

### Test Case 4: Page Beyond Total
```
GET /api/mfl?page=999&limit=10
```
**Expected:**
- `facilities` = empty array []
- `pagination.page` = 999
- `pagination.hasNextPage` = false

---

## Response Structure

### Success Response (200 OK)
```json
{
  "facilities": [
    {
      "id": 1,
      "name": "Facility Name",
      "nhfrid": "NHFR001",
      "uid": "UID001",
      "level": "Level 3",
      "ownership": "GOV",
      "authority": "MOH",
      "status": "Functional",
      "region_id": 1,
      "district_id": 5,
      "subcounty_id": 10,
      "latitude": -1.2921,
      "longitude": 36.8219,
      "Region": { "id": 1, "name": "Nairobi" },
      "District": { "id": 5, "name": "Nairobi County" },
      "SubCounty": { "id": 10, "name": "Westlands" },
      "OwnerId": {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com"
      }
      // ... other fields
    }
  ],
  "pagination": {
    "total": 1000,
    "page": 1,
    "limit": 50,
    "totalPages": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Error Response (500 Internal Server Error)
```json
{
  "error": "Error message here"
}
```

---

## Tips for Testing

1. **Start with Default Pagination**
   - Test `?page=1&limit=50` first to see the structure

2. **Test Boundary Conditions**
   - Page 1 (first page)
   - Last page
   - Page beyond total pages
   - Limit = 1 (smallest page size)
   - Large limit values

3. **Test with Filters**
   - Apply filters and verify pagination still works
   - Check that `total` reflects filtered results

4. **Verify Pagination Metadata**
   - Ensure `totalPages` = `Math.ceil(total / limit)`
   - Verify `hasNextPage` and `hasPreviousPage` are correct
   - Check that `page` and `limit` match your query parameters

5. **Test Performance**
   - Try different `limit` values (10, 50, 100, 500)
   - Monitor response times

---

## Example Postman Pre-request Script

To automatically calculate next page:

```javascript
// Get current page from environment or query param
const currentPage = pm.environment.get("currentPage") || 1;
const limit = pm.environment.get("limit") || 50;

// Set next page
pm.environment.set("nextPage", parseInt(currentPage) + 1);
```

---

## Example Postman Test Script

To validate pagination response:

```javascript
// Parse response
const jsonData = pm.response.json();

// Validate structure
pm.test("Response has facilities array", function () {
    pm.expect(jsonData).to.have.property('facilities');
    pm.expect(jsonData.facilities).to.be.an('array');
});

pm.test("Response has pagination object", function () {
    pm.expect(jsonData).to.have.property('pagination');
    pm.expect(jsonData.pagination).to.be.an('object');
});

// Validate pagination metadata
pm.test("Pagination has required fields", function () {
    pm.expect(jsonData.pagination).to.have.property('total');
    pm.expect(jsonData.pagination).to.have.property('page');
    pm.expect(jsonData.pagination).to.have.property('limit');
    pm.expect(jsonData.pagination).to.have.property('totalPages');
    pm.expect(jsonData.pagination).to.have.property('hasNextPage');
    pm.expect(jsonData.pagination).to.have.property('hasPreviousPage');
});

// Validate pagination logic
pm.test("Total pages calculation is correct", function () {
    const expected = Math.ceil(jsonData.pagination.total / jsonData.pagination.limit);
    pm.expect(jsonData.pagination.totalPages).to.equal(expected);
});

pm.test("Facilities count matches limit or less", function () {
    pm.expect(jsonData.facilities.length).to.be.at.most(jsonData.pagination.limit);
});
```

---

## Quick Reference

### Common Requests:

1. **Get first 10 facilities:**
   ```
   GET /api/mfl?page=1&limit=10
   ```

2. **Search for facilities:**
   ```
   GET /api/mfl?search=hospital&page=1&limit=25
   ```

3. **Filter by ownership:**
   ```
   GET /api/mfl?ownership=GOV&page=1&limit=50
   ```

4. **Filter by region:**
   ```
   GET /api/mfl?region_id=1&page=1&limit=30
   ```

5. **Combined search and filters:**
   ```
   GET /api/mfl?search=clinic&ownership=PNFP&region_id=2&page=1&limit=20
   ```

6. **Export all (no pagination):**
   ```
   GET /api/mfl?export=all
   ```

