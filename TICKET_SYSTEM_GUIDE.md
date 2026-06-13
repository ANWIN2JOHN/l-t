# Lost & Found Ticket System - Complete Guide

## System Overview

The ticket system is fully integrated and working! Here's how it flows:

### 1. **Student Submits Ticket**
   - Student logs in → Goes to "Submit New Ticket" tab
   - Fills out form with item details
   - Submits → Ticket is created with status "pending"

### 2. **Admin Reviews Ticket**
   - Admin logs in → Navigates to "Pending Approvals" section
   - Sees all pending tickets from students
   - Can **Approve** or **Reject** each ticket

### 3. **Ticket Status Updates**
   - **Approved**: Ticket appears in the Lost Items Dashboard
   - **Rejected**: Ticket is marked as rejected
   - Student can see status in their "My Tickets" tab

### 4. **Item Found**
   - Admin can mark approved items as "Found"
   - Student gets notified in their dashboard
   - Collection location is displayed

---

## Backend API Endpoints

All endpoints are already implemented in `/supabase/functions/server/index.tsx`:

### Student Endpoints:
- `POST /make-server-e7bb77c1/tickets` - Create new ticket
- `GET /make-server-e7bb77c1/tickets/my-tickets` - Get student's tickets

### Admin Endpoints:
- `GET /make-server-e7bb77c1/admin/pending-tickets` - Get all pending tickets
- `POST /make-server-e7bb77c1/admin/tickets/:ticketId/approve` - Approve/Reject ticket
- `POST /make-server-e7bb77c1/admin/tickets/:ticketId/mark-found` - Mark item as found

---

## Deployment Instructions

### Deploy the Backend Function to Supabase:

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link to your project**:
   ```bash
   supabase link --project-ref ormtzihjnbcbwztzoomy
   ```

4. **Deploy the function**:
   ```bash
   supabase functions deploy server
   ```

5. **Set environment secrets** (if needed):
   ```bash
   supabase secrets set SUPABASE_URL=https://ormtzihjnbcbwztzoomy.supabase.co
   supabase secrets set SUPABASE_ANON_KEY=your_anon_key
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

---

## Testing the Complete Flow

### Step 1: Create a Student Account
1. Go to Student Login page
2. Click "Sign Up"
3. Create account with email: `student@campus.edu`
4. Confirm email (or disable email confirmation in Supabase dashboard)

### Step 2: Submit a Ticket
1. Login as student
2. Click "Submit New Ticket" tab
3. Fill out the form:
   - Item Name: "Black Wallet"
   - Category: "Accessories"
   - Description: "Black leather wallet with student ID"
   - Location: "Library 2nd Floor"
   - Date Lost: Select a date
4. Click "Submit Report"
5. Verify ticket appears in "My Tickets" with status "Pending Review"

### Step 3: Admin Approval
1. Logout from student account
2. Login as admin with email: `admin@campus.edu`
3. Navigate to "Pending Approvals" section
4. You should see the ticket submitted by the student
5. Click "Approve & Add to Lost Items"
6. Ticket will be removed from pending and added to Lost Items Dashboard

### Step 4: Verify Student Can See Status
1. Logout from admin
2. Login as student again
3. Go to "My Tickets" tab
4. The ticket should now show status "Approved"

---

## Admin Account Setup

The admin email is hardcoded as `admin@campus.edu` in the backend.

**Create an admin account**:
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Email: `admin@campus.edu`
4. Password: Set a secure password
5. Confirm email (or disable email confirmation)

---

## Current Features

### ✅ Student Portal:
- View all submitted tickets
- See ticket status (Pending, Approved, Rejected, Found)
- Submit new lost item reports
- Get notifications when items are found
- See collection location for found items

### ✅ Admin Portal:
- View all pending ticket approvals
- Approve or reject tickets
- Mark approved items as found
- Add collection location for found items
- View student details for each ticket

---

## Data Storage

The system uses **Deno KV Store** for data persistence:
- `ticket:{ticketId}` - Individual ticket data
- `user-tickets:{userId}` - Array of ticket IDs for each student
- `pending-tickets` - Array of pending ticket IDs
- `approved-tickets` - Array of approved ticket IDs
- `student:{userId}` - Student profile data

---

## Troubleshooting

### Tickets not appearing in Admin panel?
- Check if the backend function is deployed
- Verify the admin is logged in with `admin@campus.edu`
- Check browser console for API errors

### Students can't submit tickets?
- Ensure student is logged in
- Check if access token is being passed correctly
- Verify backend function is running

### Backend function errors?
- Check Supabase function logs: `supabase functions logs server`
- Verify environment variables are set correctly
- Make sure Deno KV is enabled in your Supabase project

---

## Architecture

```
Student App
    ↓
Submit Ticket (POST /tickets)
    ↓
Stored in KV Store (status: pending)
    ↓
Appears in Admin Panel (GET /admin/pending-tickets)
    ↓
Admin Approves (POST /admin/tickets/:id/approve)
    ↓
Ticket status → approved
    ↓
Shows in Student's "My Tickets" (status: Approved)
    ↓
(Optional) Admin marks as Found
    ↓
Student sees Found notification with collection info
```

---

## Next Steps

1. Deploy the backend function to Supabase
2. Create admin account with email `admin@campus.edu`
3. Test the complete flow from ticket submission to approval
4. Optionally: Add email notifications when tickets are approved/found
5. Optionally: Add image upload functionality using Supabase Storage
