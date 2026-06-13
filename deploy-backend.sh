#!/bin/bash

# Deploy the Lost & Found Backend to Supabase
# Make sure you have Supabase CLI installed and are logged in

echo "🚀 Deploying Lost & Found Backend Function to Supabase..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Deploy the server function
echo "📦 Deploying 'server' function..."
supabase functions deploy server

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Backend function deployed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Make sure your environment secrets are set:"
    echo "   supabase secrets set SUPABASE_URL=https://ormtzihjnbcbwztzoomy.supabase.co"
    echo "   supabase secrets set SUPABASE_ANON_KEY=your_anon_key"
    echo "   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key"
    echo ""
    echo "2. Create admin account with email: admin@campus.edu"
    echo ""
    echo "3. Test the ticket flow:"
    echo "   - Create a student account"
    echo "   - Submit a lost item ticket"
    echo "   - Login as admin and approve it"
    echo ""
    echo "📖 See TICKET_SYSTEM_GUIDE.md for complete instructions"
else
    echo ""
    echo "❌ Deployment failed. Please check the errors above."
    echo ""
    echo "Make sure you're logged in:"
    echo "   supabase login"
    echo ""
    echo "And linked to your project:"
    echo "   supabase link --project-ref ormtzihjnbcbwztzoomy"
fi
