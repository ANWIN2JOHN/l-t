import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e7bb77c1/health", (c) => {
  return c.json({ status: "ok" });
});

// ────────────────────────────────────────────────────────────────────────────────
// STUDENT AUTH ROUTES
// ────────────────────────────────────────────────────────────────────────────────

// Student signup
app.post("/make-server-e7bb77c1/student/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { name, rollNumber, email, mobile, password } = body;

    if (!email || !password || !name || !rollNumber) {
      return c.json({ error: "Name, roll number, email, and password are required" }, 400);
    }

    // Check for duplicate email
    const existingStudent = await kv.getByPrefix(`student:email:${email}`);
    if (existingStudent && existingStudent.length > 0) {
      return c.json({ error: "Email already registered" }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        name,
        rollNumber,
        mobile: mobile || '',
        role: 'student'
      },
      email_confirm: true
    });

    if (error) {
      console.log(`Student signup error for ${email}: ${error.message}`);
      return c.json({ error: `Failed to create account: ${error.message}` }, 400);
    }

    // Store student data in KV
    const studentId = `student:${data.user.id}`;
    await kv.set(studentId, {
      id: data.user.id,
      name,
      rollNumber,
      email,
      mobile: mobile || '',
      role: 'student',
      createdAt: new Date().toISOString()
    });

    // Store email mapping for duplicate check
    await kv.set(`student:email:${email}`, data.user.id);

    console.log(`Student created successfully: ${email}`);
    return c.json({
      success: true,
      user: data.user,
      message: "Account created successfully"
    });
  } catch (err) {
    console.log(`Student signup error: ${err.message}`);
    return c.json({ error: `Signup failed: ${err.message}` }, 500);
  }
});

// ────────────────────────────────────────────────────────────────────────────────
// TICKET ROUTES
// ────────────────────────────────────────────────────────────────────────────────

// Create a new lost item ticket
app.post("/make-server-e7bb77c1/tickets", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      console.log(`Ticket creation error - unauthorized access attempt`);
      return c.json({ error: 'Unauthorized - please sign in' }, 401);
    }

    const body = await c.req.json();
    const { itemName, category, description, location, dateLost, imageUrl } = body;

    if (!itemName || !description || !location || !dateLost) {
      return c.json({ error: "Item name, description, location, and date are required" }, 400);
    }

    // Get student data
    const studentData = await kv.get(`student:${user.id}`);

    // Create ticket ID
    const ticketId = `TICKET-${Date.now()}`;
    const ticket = {
      id: ticketId,
      ticketId: ticketId,
      userId: user.id,
      studentName: studentData?.name || user.email,
      studentEmail: user.email,
      rollNumber: studentData?.rollNumber || '',
      mobile: studentData?.mobile || '',
      itemName,
      category: category || 'Others',
      description,
      location,
      dateLost,
      imageUrl: imageUrl || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store ticket
    await kv.set(`ticket:${ticketId}`, ticket);

    // Add to user's tickets list
    const userTickets = await kv.get(`user-tickets:${user.id}`) || [];
    userTickets.push(ticketId);
    await kv.set(`user-tickets:${user.id}`, userTickets);

    // Add to pending tickets list for admin
    const pendingTickets = await kv.get('pending-tickets') || [];
    pendingTickets.push(ticketId);
    await kv.set('pending-tickets', pendingTickets);

    console.log(`Ticket created successfully: ${ticketId} by student ${user.email}`);
    return c.json({ success: true, ticket });
  } catch (err) {
    console.log(`Ticket creation error: ${err.message}`);
    return c.json({ error: `Failed to create ticket: ${err.message}` }, 500);
  }
});

// Get user's tickets
app.get("/make-server-e7bb77c1/tickets/my-tickets", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const ticketIds = await kv.get(`user-tickets:${user.id}`) || [];
    const tickets = await kv.mget(ticketIds.map((id: string) => `ticket:${id}`));

    return c.json({ tickets: tickets.filter(Boolean) });
  } catch (err) {
    console.log(`Error fetching user tickets: ${err.message}`);
    return c.json({ error: `Failed to fetch tickets: ${err.message}` }, 500);
  }
});

// Get all pending tickets (admin only)
app.get("/make-server-e7bb77c1/admin/pending-tickets", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // For now, admin check is based on email
    if (user.email !== 'admin@campus.edu') {
      console.log(`Non-admin user ${user.email} attempted to access pending tickets`);
      return c.json({ error: 'Admin access required' }, 403);
    }

    const pendingTicketIds = await kv.get('pending-tickets') || [];
    const tickets = await kv.mget(pendingTicketIds.map((id: string) => `ticket:${id}`));

    return c.json({ tickets: tickets.filter(Boolean) });
  } catch (err) {
    console.log(`Error fetching pending tickets: ${err.message}`);
    return c.json({ error: `Failed to fetch pending tickets: ${err.message}` }, 500);
  }
});

// Approve or reject ticket (admin only)
app.post("/make-server-e7bb77c1/admin/tickets/:ticketId/approve", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Admin check
    if (user.email !== 'admin@campus.edu') {
      console.log(`Non-admin user ${user.email} attempted to approve ticket`);
      return c.json({ error: 'Admin access required' }, 403);
    }

    const ticketId = c.req.param('ticketId');
    const body = await c.req.json();
    const { approved } = body;

    const ticket = await kv.get(`ticket:${ticketId}`);
    if (!ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    // Update ticket status
    ticket.status = approved ? 'approved' : 'rejected';
    ticket.updatedAt = new Date().toISOString();
    ticket.reviewedBy = user.email;

    await kv.set(`ticket:${ticketId}`, ticket);

    // Remove from pending list
    const pendingTickets = (await kv.get('pending-tickets') || []).filter((id: string) => id !== ticketId);
    await kv.set('pending-tickets', pendingTickets);

    // Add to approved list if approved
    if (approved) {
      const approvedTickets = await kv.get('approved-tickets') || [];
      approvedTickets.push(ticketId);
      await kv.set('approved-tickets', approvedTickets);
    }

    console.log(`Ticket ${ticketId} ${approved ? 'approved' : 'rejected'} by admin ${user.email}`);
    return c.json({ success: true, ticket });
  } catch (err) {
    console.log(`Error approving/rejecting ticket: ${err.message}`);
    return c.json({ error: `Failed to update ticket: ${err.message}` }, 500);
  }
});

// Mark item as found (admin only)
app.post("/make-server-e7bb77c1/admin/tickets/:ticketId/mark-found", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Admin check
    if (user.email !== 'admin@campus.edu') {
      console.log(`Non-admin user ${user.email} attempted to mark item as found`);
      return c.json({ error: 'Admin access required' }, 403);
    }

    const ticketId = c.req.param('ticketId');
    const body = await c.req.json();
    const { collectionLocation, notes } = body;

    if (!collectionLocation) {
      return c.json({ error: 'Collection location is required' }, 400);
    }

    const ticket = await kv.get(`ticket:${ticketId}`);
    if (!ticket) {
      return c.json({ error: 'Ticket not found' }, 404);
    }

    // Update ticket with found status
    ticket.status = 'found';
    ticket.collectionLocation = collectionLocation;
    ticket.foundNotes = notes || '';
    ticket.foundDate = new Date().toISOString();
    ticket.foundBy = user.email;
    ticket.updatedAt = new Date().toISOString();

    await kv.set(`ticket:${ticketId}`, ticket);

    console.log(`Ticket ${ticketId} marked as found by admin ${user.email} - Collection: ${collectionLocation}`);
    return c.json({ success: true, ticket });
  } catch (err) {
    console.log(`Error marking item as found: ${err.message}`);
    return c.json({ error: `Failed to mark item as found: ${err.message}` }, 500);
  }
});

Deno.serve(app.fetch);