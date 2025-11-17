# Windows 10 Setup Guide

## Quick Start (5 minutes)

### Step 1: Pull the Latest Code

Open Command Prompt (Win+R, type `cmd`, press Enter):

```cmd
cd C:\Claude\seokwtool4
git pull origin claude/seo-keyword-tool-01YZhRUdBHJvmVd1q9DGsTNH
```

### Step 2: Create the .env File

**IMPORTANT**: Copy this EXACT content to create your `.env` file:

1. Open Command Prompt
2. Navigate to backend folder:
   ```cmd
   cd C:\Claude\seokwtool4\backend
   ```

3. Create .env file with notepad:
   ```cmd
   notepad .env
   ```

4. If it asks "Do you want to create a new file?" - Click **YES**

5. Copy and paste this ENTIRE block into Notepad:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database Configuration (Supabase)
# Password special characters are URL-encoded: ! = %21
DATABASE_URL=postgresql://postgres:%21%21%21TauTau24%21%21%21@db.lrnfbzuccsgaukvdgjgam.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your_random_secret_key_here_change_this_in_production_abc123xyz789
JWT_EXPIRE=7d

# DataForSEO API
DATAFORSEO_LOGIN=your_dataforseo_login
DATAFORSEO_PASSWORD=your_dataforseo_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

6. Save and close Notepad (Ctrl+S, then Alt+F4)

### Step 3: Install Dependencies

In Command Prompt (make sure you're in `C:\Claude\seokwtool4`):

```cmd
cd backend
npm install

cd ..\frontend
npm install
```

### Step 4: Start the Backend

In Command Prompt #1:
```cmd
cd C:\Claude\seokwtool4\backend
npm run dev
```

You should see:
```
✓ Database connection established successfully
✓ Database synced successfully
Server running on port 5000
```

### Step 5: Start the Frontend

Open a NEW Command Prompt (Win+R, type `cmd`, press Enter):

```cmd
cd C:\Claude\seokwtool4\frontend
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:3000
```

### Step 6: Open the Application

Open your browser and go to: **http://localhost:3000**

---

## Troubleshooting

### Error: "client password must be a string"

**Solution**: The special characters in your password need to be URL-encoded.

Your password is: `!!!TauTau24!!!`

Each `!` must be encoded as `%21`, so the DATABASE_URL becomes:
```
DATABASE_URL=postgresql://postgres:%21%21%21TauTau24%21%21%21@db.lrnfbzuccsgaukvdgjgam.supabase.co:5432/postgres
```

**Make sure there are NO spaces, NO line breaks in the DATABASE_URL!**

### Error: "Cannot find module 'sequelize'"

**Solution**: You didn't install dependencies.

```cmd
cd C:\Claude\seokwtool4\backend
npm install
```

### Error: "ENOENT: no such file or directory, open '.env'"

**Solution**: The .env file doesn't exist. Follow Step 2 above carefully.

### Error: "Project is paused"

**Solution**:
1. Go to https://app.supabase.com/
2. Find your project
3. Click "Restore" button

---

## Port Already in Use?

If you get "Port 5000 is already in use":

1. Find what's using port 5000:
   ```cmd
   netstat -ano | findstr :5000
   ```

2. Kill that process (replace XXXX with PID from above):
   ```cmd
   taskkill /PID XXXX /F
   ```

3. Try starting backend again

---

## Quick Commands

### Stop servers:
Press `Ctrl+C` in each Command Prompt window

### Restart backend:
```cmd
cd C:\Claude\seokwtool4\backend
npm run dev
```

### Restart frontend:
```cmd
cd C:\Claude\seokwtool4\frontend
npm run dev
```

### View logs:
They appear in the Command Prompt window where you ran `npm run dev`

---

## Need Help?

1. Check `docs/BUG_SOLUTIONS.md` for common issues
2. Check backend Command Prompt for error messages
3. Check browser console (F12) for frontend errors
4. Make sure both servers are running

---

**You're all set! The database connection should work now.** 🚀
