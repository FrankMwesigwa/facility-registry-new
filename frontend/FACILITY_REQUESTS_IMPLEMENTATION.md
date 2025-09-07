# Facility Requests Implementation

This document describes the implementation of functionality to consume and post data to the facility requests API endpoint with React Select for admin units.

## Overview

The implementation includes:
- A comprehensive facility request form with multi-step tabs
- React Select components for admin units (regions, districts, sub-counties)
- API integration for CRUD operations
- File upload functionality
- Form validation and error handling
- Loading states and user feedback

## Components Created

### 1. FacilityAddition Component
**Location:** `src/components/FacilityAddition/index.jsx`

**Features:**
- Multi-tab form interface (Basic, Location, Contact, Services, Documents)
- React Select for cascading admin units selection
- File upload for supporting documents
- Form validation
- API integration for form submission
- Loading states and success/error feedback

**Usage:**
```jsx
import FacilityAddition from './components/FacilityAddition'

function App() {
    return <FacilityAddition />
}
```

### 2. FacilityRequestsList Component
**Location:** `src/components/FacilityRequestsList/index.jsx`

**Features:**
- Display facility requests in a table format
- Multiple view modes (My Requests, District, Approved, Planning, Admin)
- Pagination support
- Status badges and formatting
- Action buttons for view/edit

**Usage:**
```jsx
import FacilityRequestsList from './components/FacilityRequestsList'

function App() {
    return <FacilityRequestsList />
}
```

### 3. FacilityRequestsDemo Component
**Location:** `src/components/FacilityRequestsDemo/index.jsx`

**Features:**
- Navigation between form and list views
- Toast notifications integration
- Complete demo implementation

**Usage:**
```jsx
import FacilityRequestsDemo from './components/FacilityRequestsDemo'

function App() {
    return <FacilityRequestsDemo />
}
```

## Services Created

### 1. FacilityRequestsService
**Location:** `src/services/facilityRequestsService.js`

**Methods:**
- `createFacilityRequest(formData)` - Create new facility request
- `getPlanningRequests(params)` - Get requests for planning approval
- `getAdminRequests(params)` - Get requests for admin approval
- `getMyRequests(params)` - Get current user's requests
- `getDistrictRequests(params)` - Get district requests
- `getApprovedRequests(params)` - Get approved requests
- `getRejectedRequests(params)` - Get rejected requests
- `getFacilityRequest(id)` - Get specific request by ID
- `updateFacilityRequest(id, data)` - Update facility request
- `deleteFacilityRequest(id)` - Delete facility request
- `prepareFormData(formData, files)` - Prepare FormData for submission

**Usage:**
```javascript
import FacilityRequestsService from '../services/facilityRequestsService'

// Create facility request
const formData = new FormData()
// ... populate formData
const result = await FacilityRequestsService.createFacilityRequest(formData)

// Get user's requests
const requests = await FacilityRequestsService.getMyRequests({ page: 1, limit: 10 })
```

### 2. AdminUnitsService
**Location:** `src/services/adminUnitsService.js`

**Methods:**
- `getRegions()` - Get all regions
- `getDistrictsByRegion(regionId)` - Get districts by region
- `getSubCountiesByDistrict(districtId)` - Get sub-counties by district
- `getFacilitiesBySubCounty(subCountyId)` - Get facilities by sub-county
- `getCompleteHierarchy()` - Get complete admin hierarchy
- `createAdminUnit(data)` - Create new admin unit
- `updateAdminUnit(id, data)` - Update admin unit
- `deleteAdminUnit(id, type)` - Delete admin unit

**Usage:**
```javascript
import AdminUnitsService from '../services/adminUnitsService'

// Get regions for React Select
const regions = await AdminUnitsService.getRegions()

// Get districts when region is selected
const districts = await AdminUnitsService.getDistrictsByRegion(regionId)
```

## API Endpoints Used

### Facility Requests Endpoints
- `POST /facilityRequests` - Create new facility request
- `GET /facilityRequests/my` - Get user's requests (authenticated)
- `GET /facilityRequests/district` - Get district requests (authenticated)
- `GET /facilityRequests/approved` - Get approved requests (authenticated)
- `GET /facilityRequests/rejected` - Get rejected requests (authenticated)
- `GET /facilityRequests/planning` - Get planning requests
- `GET /facilityRequests/admin` - Get admin requests
- `GET /facilityRequests/:id` - Get specific request
- `PUT /facilityRequests/:id` - Update facility request
- `DELETE /facilityRequests/:id` - Delete facility request

### Admin Units Endpoints
- `GET /adminareas/regions` - Get all regions
- `GET /adminareas/district?region_id=:id` - Get districts by region
- `GET /adminareas/subcounty?district_id=:id` - Get sub-counties by district
- `GET /adminareas/facility?sub_county_id=:id` - Get facilities by sub-county

## Form Data Structure

The facility request form collects the following data:

```javascript
{
    name: string,                    // Facility name (required)
    level: string,                   // Facility level (required)
    ownership: string,               // Ownership type (required)
    authority: string,               // Authority (required)
    licensed: string,                // License status
    address: string,                 // Physical address
    latitude: number,                // GPS latitude
    longitude: number,               // GPS longitude
    contact_personemail: string,     // Contact person email
    contact_personmobile: string,    // Contact person mobile
    contact_personname: string,      // Contact person name
    contact_persontitle: string,     // Contact person title
    date_opened: date,               // Date facility opened
    bed_capacity: number,            // Number of beds
    services: array,                 // Array of services offered
    region_id: object,               // Selected region (React Select format)
    district_id: object,             // Selected district (React Select format)
    subcounty_id: object,            // Selected sub-county (React Select format)
    request_type: string,            // Type of request
    
    // File uploads
    support_document: file,          // Supporting document
    operating_license: file,         // Operating license
    council_minutes: file,           // Council minutes
    district_letter: file            // District letter
}
```

## React Select Integration

The implementation uses React Select for admin units with the following features:

- **Cascading Selection:** Region → District → Sub-County
- **Search Functionality:** Built-in search in dropdown options
- **Clear Options:** Users can clear selections
- **Disabled States:** Lower level selects are disabled until parent is selected
- **Loading States:** Shows loading while fetching data
- **Error Handling:** Graceful error handling with toast notifications

### Example React Select Usage:

```jsx
<Select
    options={regions}
    value={formData.region_id}
    onChange={(selectedOption) => handleSelectChange(selectedOption, { name: 'region_id' })}
    placeholder="Select Region"
    isClearable
    classNamePrefix="react-select"
/>
```

## File Upload Implementation

The form supports multiple file uploads with:

- **File Validation:** Accepts PDF, DOC, DOCX, JPG, PNG formats
- **Size Limits:** Maximum 5MB per file
- **Multiple Files:** Support for different document types
- **FormData Integration:** Proper multipart form data submission

## Authentication

All authenticated endpoints require a Bearer token:

```javascript
const token = localStorage.getItem('token')
const headers = {
    'Authorization': `Bearer ${token}`
}
```

## Error Handling

The implementation includes comprehensive error handling:

- **Form Validation:** Client-side validation with user feedback
- **API Errors:** Server error handling with toast notifications
- **Network Errors:** Graceful handling of network issues
- **Loading States:** Visual feedback during API calls

## Styling

The components use Bootstrap classes for consistent styling:

- **Responsive Design:** Mobile-friendly layout
- **Form Controls:** Bootstrap form components
- **Status Badges:** Color-coded status indicators
- **Loading Spinners:** Bootstrap spinner components
- **Toast Notifications:** React Toastify for user feedback

## Dependencies Required

Make sure these packages are installed:

```json
{
    "react-select": "^5.10.0",
    "react-toastify": "^9.1.1",
    "axios": "0.26.1"
}
```

## Usage Instructions

1. **Import the components:**
   ```jsx
   import FacilityRequestsDemo from './components/FacilityRequestsDemo'
   ```

2. **Use in your application:**
   ```jsx
   function App() {
       return (
           <div className="App">
               <FacilityRequestsDemo />
           </div>
       )
   }
   ```

3. **Ensure authentication:**
   Make sure the user is authenticated and the token is stored in localStorage.

4. **API Configuration:**
   Verify that the API base URL is correctly configured in `src/helpers/api.js`.

## Features Implemented

✅ **Form Creation:** Multi-step facility request form
✅ **React Select Integration:** Cascading admin units selection  
✅ **API Integration:** Full CRUD operations for facility requests
✅ **File Upload:** Support for multiple document types
✅ **Form Validation:** Client-side validation with feedback
✅ **Error Handling:** Comprehensive error handling
✅ **Loading States:** Visual feedback during operations
✅ **Responsive Design:** Mobile-friendly interface
✅ **Authentication:** Token-based authentication
✅ **Toast Notifications:** User feedback system
✅ **List View:** Display and manage facility requests
✅ **Service Classes:** Reusable API service classes

## Next Steps

To extend this implementation, consider:

1. **Add Edit Functionality:** Implement edit form for existing requests
2. **Add Approval Workflow:** Implement approval/rejection functionality
3. **Add Search/Filter:** Enhanced filtering options for the list view
4. **Add Export:** Export functionality for request lists
5. **Add Bulk Operations:** Bulk approve/reject functionality
6. **Add Real-time Updates:** WebSocket integration for real-time updates
7. **Add Offline Support:** PWA features for offline functionality

This implementation provides a solid foundation for managing facility requests with a modern, user-friendly interface and robust API integration.
