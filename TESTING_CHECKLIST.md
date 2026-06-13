# 🧪 Testing Checklist - Lost & Found System

## ✅ Pre-Deployment Checklist

### 1. Backend Deployment
- [ ] Install Supabase CLI: `npm install -g supabase`
- [ ] Login to Supabase: `supabase login`
- [ ] Link project: `supabase link --project-ref ormtzihjnbcbwztzoomy`
- [ ] Deploy function: `./deploy-backend.sh` or `supabase functions deploy server`
- [ ] Verify deployment: Check the green status indicator in bottom-right corner

### 2. Email Configuration
- [ ] Go to Supabase Dashboard → Authentication → Providers → Email
- [ ] For testing: Uncheck "Confirm email" option
- [ ] For production: Configure SMTP settings
- [ ] Save changes

### 3. Create Admin Account
- [ ] Go to Supabase Dashboard → Authentication → Users
- [ ] Click "Add User" or "Invite User"
- [ ] Email: `admin@campus.edu`
- [ ] Password: Set a secure password (save it!)
- [ ] Click "Create User"

---

## 🔄 Complete System Test Flow

### Test 1: Student Registration & Login

**Step 1: Create Student Account**
- [ ] Open the application
- [ ] Click "Student Login"
- [ ] Click "Sign Up"
- [ ] Fill in the form:
  - Name: Test Student
  - Roll Number: STU-2024-001
  - Email: `teststudent@campus.edu`
  - Mobile: 1234567890
  - Password: Test@123
  - Confirm Password: Test@123
- [ ] Click "Create Account"
- [ ] Expected: Success message and redirect to login

**Step 2: Login as Student**
- [ ] Enter email: `teststudent@campus.edu`
- [ ] Enter password: Test@123
- [ ] Click "Sign In"
- [ ] Expected: Redirect to Student Dashboard
- [ ] Verify: Green "Backend Online" indicator in bottom-right

---

### Test 2: Submit Lost Item Ticket

**Step 3: Submit Ticket**
- [ ] In Student Dashboard, click "Submit New Ticket" tab
- [ ] Fill in the form:
  - Item Name: Black Leather Wallet
  - Category: Accessories
  - Description: Black leather wallet with student ID and library card inside
  - Location: Library 2nd Floor
  - Date Lost: Select yesterday's date
  - Image URL: (optional) Leave blank or add a test URL
- [ ] Click "Submit Report"
- [ ] Expected: Success message, redirect to "My Tickets"

**Step 4: Verify Ticket in My Tickets**
- [ ] Check "My Tickets" tab
- [ ] Expected: See the submitted ticket with:
  - Status badge: "Pending Review" (amber/yellow)
  - Item name: Black Leather Wallet
  - Ticket ID: TICKET-xxxxxxxxx
  - All details filled correctly

---

### Test 3: Admin Approval Flow

**Step 5: Logout from Student**
- [ ] Click "Logout" button in top-right
- [ ] Expected: Return to landing page

**Step 6: Login as Admin**
- [ ] Click "Admin Login"
- [ ] Enter email: `admin@campus.edu`
- [ ] Enter password: (the password you set)
- [ ] Click "Sign In"
- [ ] Expected: Redirect to Admin Dashboard
- [ ] Verify: Green "Backend Online" indicator visible

**Step 7: View Pending Approval**
- [ ] In Admin sidebar, click "Pending Approvals"
- [ ] Expected: See the ticket submitted by Test Student
- [ ] Verify ticket shows:
  - Item Name: Black Leather Wallet
  - Student Name: Test Student
  - Student Email: teststudent@campus.edu
  - Roll Number: STU-2024-001
  - Status: "Pending Review"
  - All submitted details

**Step 8: Approve Ticket**
- [ ] Click "Approve & Add to Lost Items" button
- [ ] Expected: Success alert "Ticket approved and added to Lost Items Dashboard successfully"
- [ ] Expected: Ticket disappears from Pending Approvals list
- [ ] Verify: "No pending approvals" message appears

**Step 9: Verify in Lost Items Dashboard**
- [ ] In Admin sidebar, click "Lost Items"
- [ ] Expected: See the approved ticket in the list
- [ ] Verify: Status shows as "Approved" or "Not Returned"

---

### Test 4: Student Sees Approval

**Step 10: Logout from Admin**
- [ ] Click "Logout" button
- [ ] Expected: Return to landing page

**Step 11: Login as Student Again**
- [ ] Click "Student Login"
- [ ] Login with `teststudent@campus.edu` / Test@123
- [ ] Expected: Redirect to Student Dashboard

**Step 12: Check Ticket Status**
- [ ] Go to "My Tickets" tab
- [ ] Expected: See the ticket with:
  - Status badge: "Approved" (green)
  - Item name: Black Leather Wallet
  - Same ticket ID as before

---

### Test 5: Mark Item as Found (Optional)

**Step 13: Login as Admin**
- [ ] Logout from student
- [ ] Login as admin again

**Step 14: Mark Item as Found**
- [ ] Go to "Lost Items" section
- [ ] Find the Black Leather Wallet ticket
- [ ] Click on actions/menu for that item
- [ ] Look for "Mark as Found" option
- [ ] Add collection location: "Admin Reception"
- [ ] Add notes: "Student ID verified"
- [ ] Confirm

**Step 15: Student Sees Found Notification**
- [ ] Logout from admin
- [ ] Login as student
- [ ] Go to "My Tickets"
- [ ] Expected: See ticket with:
  - Status: "Found!" (green with celebration)
  - Collection location displayed
  - Instructions to collect

---

## 🧪 Additional Test Cases

### Test 6: Reject Ticket
- [ ] Create another test ticket as student
- [ ] Login as admin
- [ ] Go to Pending Approvals
- [ ] Click "Reject" instead of Approve
- [ ] Verify: Ticket shows as "Rejected" in student's dashboard

### Test 7: Multiple Tickets
- [ ] Submit 3-5 different tickets as student
- [ ] Verify all appear in Pending Approvals
- [ ] Approve some, reject others
- [ ] Verify correct status for each in student dashboard

### Test 8: Different Categories
Test with various categories:
- [ ] Electronics (Laptop, Phone)
- [ ] Books & Notebooks
- [ ] Water Bottles
- [ ] Keys & Keychains
- [ ] Eyewear

---

## 🔍 System Status Verification

### Visual Indicators to Check:

**✅ Backend Online (Green Dot)**
- Shows: "Backend Online" with green dot
- Means: Server function is deployed and running
- Action: Ready to test!

**⚠️ Backend Checking (Yellow Dot)**
- Shows: "Checking..." with yellow dot
- Means: Testing connection to backend
- Action: Wait a moment

**❌ Backend Offline (Red Dot)**
- Shows: "Backend Offline" with red dot
- Shows: Deployment instructions in tooltip
- Means: Backend function not deployed
- Action: Run `./deploy-backend.sh`

---

## 🐛 Common Issues & Solutions

### Issue: "Email not confirmed" error
**Solution**: 
1. Go to Supabase Dashboard → Authentication → Email
2. Uncheck "Confirm email"
3. Save changes

### Issue: Backend offline indicator
**Solution**:
1. Run: `supabase functions deploy server`
2. Check: `supabase functions logs server`
3. Verify environment variables are set

### Issue: Tickets not appearing in admin panel
**Solution**:
1. Verify logged in as `admin@campus.edu`
2. Check browser console for errors
3. Verify backend is online (green indicator)
4. Check function logs: `supabase functions logs server`

### Issue: Can't login as admin
**Solution**:
1. Verify admin user exists in Supabase Dashboard
2. Email must be exactly: `admin@campus.edu`
3. Try password reset if needed

---

## 📊 Test Results Template

Date: _______________  
Tester: _______________

| Test Case | Status | Notes |
|-----------|--------|-------|
| Student Registration | ☐ Pass ☐ Fail | |
| Student Login | ☐ Pass ☐ Fail | |
| Submit Ticket | ☐ Pass ☐ Fail | |
| Admin Login | ☐ Pass ☐ Fail | |
| View Pending Ticket | ☐ Pass ☐ Fail | |
| Approve Ticket | ☐ Pass ☐ Fail | |
| Student Sees Approval | ☐ Pass ☐ Fail | |
| Mark as Found | ☐ Pass ☐ Fail | |
| Backend Status Indicator | ☐ Pass ☐ Fail | |

---

## 🎯 Success Criteria

All tests should PASS with:
- ✅ Backend status indicator shows green
- ✅ Student can register and login
- ✅ Student can submit tickets
- ✅ Tickets appear in admin panel
- ✅ Admin can approve/reject tickets
- ✅ Status updates reflect in student dashboard
- ✅ No console errors
- ✅ Smooth navigation between views

---

## 📝 Next Steps After Testing

1. Document any bugs found
2. Test edge cases (long descriptions, special characters, etc.)
3. Test on different browsers (Chrome, Firefox, Safari)
4. Test on mobile devices
5. Set up production email provider
6. Configure proper admin role management
7. Add more test data
8. Perform security audit

---

**Happy Testing! 🚀**
