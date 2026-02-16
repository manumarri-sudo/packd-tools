#!/bin/bash

# This script runs the database migration for ModelDuel
# It will open the Supabase SQL Editor where you can paste and run the migration

echo "Opening Supabase SQL Editor..."
echo ""
echo "📋 INSTRUCTIONS:"
echo "1. The Supabase SQL Editor will open in your browser"
echo "2. Copy the migration SQL from: supabase/migrations/001_modelduel_schema.sql"
echo "3. Paste it into the SQL Editor"
echo "4. Click 'Run' to execute the migration"
echo ""
echo "Press ENTER to open Supabase SQL Editor..."
read

# Open Supabase SQL Editor
open "https://supabase.com/dashboard/project/qtkwzbqjtbwrtajdcgkp/sql/new"

echo ""
echo "✅ SQL Editor opened!"
echo ""
echo "Migration SQL has been copied to your clipboard."
echo "Just paste (Cmd+V) into the SQL Editor and click Run!"

# Copy migration SQL to clipboard
cat supabase/migrations/001_modelduel_schema.sql | pbcopy
