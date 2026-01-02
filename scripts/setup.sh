#!/bin/bash

# ==========================================
# KYTHIA DASHBOARD - AUTOMATED SETUP SCRIPT
# ==========================================

echo -e "\033[0;34m[INFO] Starting Automated Setup...\033[0m"

# 1. Install Dependencies
echo -e "\033[0;33m[STEP 1/6] Installing dependencies...\033[0m"
if [ -f "bun.lockb" ]; then
    echo "Detected bun.lockb, using bun..."
    bun install
else
    npm install
fi

# 2. Environment File Check
echo -e "\033[0;33m[STEP 2/6] Checking configuration...\033[0m"
if [ ! -f ".env" ]; then
    echo -e "\033[0;31m[WARNING] .env file not found!\033[0m"
    echo "Creating .env from example.env..."
    cp example.env .env
    echo -e "\033[0;32m[SUCCESS] Created .env file.\033[0m"
    echo -e "\033[1;31m[IMPORTANT] YOU MUST EDIT THE .env FILE WITH YOUR DATABASE AND DISCORD DETAILS BEFORE STARTING!\033[0m"
    # We don't exit here because Pterodactyl might want the process to continue building, 
    # but the app will likely fail to start if not configured.
else
    echo -e "\033[0;32m[SUCCESS] .env file found.\033[0m"
fi

# 3. Remove i18n (Optional but requested in some contexts, keeping safe)
# echo -e "\033[0;33m[STEP 3/6] Cleaning up...\033[0m"
# npm run removeI18n

# 4. Build Icons
echo -e "\033[0;33m[STEP 4/6] Building icons...\033[0m"
npm run build:icons

# 5. Database Generation
echo -e "\033[0;33m[STEP 5/6] Generating Database Client...\033[0m"
npx prisma generate
# We attempt to push schema only if .env looks modified (naive check) or just try it.
# If it fails, we show a warning but don't break the build (so they can fix env and restart).
echo "Attempting database migration..."
npx prisma migrate deploy || echo -e "\033[0;31m[ERROR] Database migration failed. Check your DATABASE_URL in .env!\033[0m"

# 6. Build Project
echo -e "\033[0;33m[STEP 6/6] Building project...\033[0m"
npm run build

echo -e "\033[0;32m---------------------------------------------------\033[0m"
echo -e "\033[1;32m SETUP COMPLETE! \033[0m"
echo -e "\033[0;32m---------------------------------------------------\033[0m"
echo "If this is your first time, make sure you edited .env!"
echo "To start the server, run: npm start"
