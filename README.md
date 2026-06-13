# 🎓 Campus Lost & Found System

A comprehensive lost and found management system for educational institutions, built with React, TypeScript, and Supabase.

## ✨ Features

### For Students:
- 🔐 Secure authentication with email confirmation
- 📝 Submit lost item tickets
- 📊 Track ticket status (Pending → Approved → Found)
- 🔔 Get notifications when items are found
- 📍 View collection locations for found items

### For Admin:
- 👥 Review and approve/reject student tickets
- ✅ Mark items as found
- 📋 Manage lost and found inventory
- 🗃️ Access to comprehensive dashboard
- 📊 View student information for each ticket

### Public Features:
- 🔍 Browse found items
- 📂 Filter by category, location, date
- 📱 Responsive design for mobile and desktop

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Supabase

Create your Supabase project at [supabase.com](https://supabase.com) and update:
- `/utils/supabase/info.tsx` - Add your project ID and anon key

### 3. Deploy Backend Function
```bash
./deploy-backend.sh
```

Or manually:
```bash
supabase functions deploy server
```

### 4. Set Up Admin Account

Create an admin user in your Supabase Dashboard:
- Email: `admin@campus.edu`
- Set a secure password

### 5. Configure Email Settings (Optional)

For production:
- Go to Supabase Dashboard → Authentication → Email
- Either configure SMTP settings or disable email confirmation for testing

---

## 📖 Complete Documentation

- **[TICKET_SYSTEM_GUIDE.md](./TICKET_SYSTEM_GUIDE.md)** - Complete guide for the ticket system
- **[SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md)** - Email configuration guide

---

## 🧪 Testing the System

### Create a Student Account:
1. Navigate to Student Login
2. Click "Sign Up"
3. Use email: `student@campus.edu`

### Submit a Ticket:
1. Login as student
2. Go to "Submit New Ticket"
3. Fill out the form and submit

### Approve as Admin:
1. Logout and login as `admin@campus.edu`
2. Navigate to "Pending Approvals"
3. Approve the ticket

### Verify Status:
1. Logout and login as student
2. Check "My Tickets" to see approved status

---

## 🏗️ Tech Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Deno KV Store
- **Build Tool**: Vite
- **Icons**: Lucide React

---

## 📂 Project Structure

```
/src
  /app
    /components
      - StudentDashboard.tsx      # Student portal
      - PendingApprovalsPage.tsx  # Admin approval page
      - ReportLostItemForm.tsx    # Ticket submission form
      - LoginPage.tsx             # Login components
      - ...
    - App.tsx                     # Main app component
  /utils
    /supabase
      - client.ts                 # Supabase client setup
      - info.tsx                  # Project configuration
/supabase
  /functions
    /server
      - index.tsx                 # Backend API routes
      - kv_store.tsx             # KV store utilities
```

---

## 🔒 Security

- Email-based authentication with Supabase
- JWT token-based API authorization
- Admin role verification
- Protected admin routes
- Secure password handling

---

## 🌟 Key Components

### Student Portal
- **Dashboard**: View all submitted tickets
- **Submit Ticket**: Report lost items
- **Track Status**: Real-time status updates

### Admin Portal
- **Pending Approvals**: Review new tickets
- **Lost Items**: Manage approved items
- **Found Items**: Track recovered items
- **Disposal Management**: Handle expired items

---

## 📊 API Endpoints

### Student Routes:
- `POST /tickets` - Create new ticket
- `GET /tickets/my-tickets` - Get user's tickets

### Admin Routes:
- `GET /admin/pending-tickets` - Get pending approvals
- `POST /admin/tickets/:id/approve` - Approve/reject ticket
- `POST /admin/tickets/:id/mark-found` - Mark item as found

---

## 🐛 Troubleshooting

### "Email not confirmed" error:
See [SUPABASE_EMAIL_SETUP.md](./SUPABASE_EMAIL_SETUP.md)

### Tickets not appearing:
- Check if backend function is deployed
- Verify admin is using `admin@campus.edu`
- Check browser console for errors

### Backend errors:
```bash
supabase functions logs server
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 📧 Support

For issues or questions:
1. Check the documentation in `/TICKET_SYSTEM_GUIDE.md`
2. Review Supabase function logs
3. Check browser console for errors

---

## 🎯 Roadmap

- [ ] Email notifications for status updates
- [ ] Image upload with Supabase Storage
- [ ] SMS notifications
- [ ] Advanced search and filters
- [ ] Mobile app (React Native)
- [ ] QR code for quick item lookup
- [ ] Analytics dashboard

---

**Built with ❤️ for campus communities**
