# 🔥 Supabase Setup Guide

This guide will help you set up the SEO Keyword Research Tool with Supabase as your database.

## Why Supabase?

- ✅ **Free Tier**: 500MB database, perfect for getting started
- ✅ **No Credit Card**: Sign up without payment info
- ✅ **Automatic Backups**: Your data is safe
- ✅ **Easy Dashboard**: Manage data visually
- ✅ **PostgreSQL**: Full-featured database
- ✅ **SSL by Default**: Secure connections
- ✅ **Global CDN**: Fast from anywhere

---

## Step-by-Step Setup

### 1. Create Supabase Account

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Sign up with GitHub, GitLab, or email

### 2. Create New Project

1. In Supabase Dashboard, click **"New Project"**
2. Select your organization (or create one)
3. Fill in project details:
   - **Name**: `seo-keyword-tool` (or any name you like)
   - **Database Password**: Create a **strong password**
     - ⚠️ **IMPORTANT**: Save this password! You'll need it for DATABASE_URL
     - Example: `MySecureP@ssw0rd2024!`
   - **Region**: Choose closest to your location
     - US: `us-east-1` or `us-west-1`
     - Europe: `eu-west-1`
     - Asia: `ap-southeast-1`
   - **Pricing Plan**: Free tier is perfect

4. Click **"Create new project"**
5. Wait ~2 minutes for provisioning ☕

### 3. Get Database Connection String

1. Once project is ready, go to **Project Settings** (gear icon in sidebar)
2. Click **Database** in left menu
3. Scroll down to **Connection String** section
4. Select **URI** tab (not "Transaction" or "Session")
5. You'll see something like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres
   ```
6. **Copy this entire string**
7. Replace `[YOUR-PASSWORD]` with the password you created in step 2
   - Remove the brackets `[]`
   - Example result:
     ```
     postgresql://postgres:MySecureP@ssw0rd2024!@db.abcdefghijk.supabase.co:5432/postgres
     ```

### 4. Configure Your Application

**Edit `backend/.env` file:**

```env
# Supabase Database Connection
DATABASE_URL=postgresql://postgres:MySecureP@ssw0rd2024!@db.abcdefghijk.supabase.co:5432/postgres

# Generate a random JWT secret (use: openssl rand -base64 32)
JWT_SECRET=your_random_jwt_secret_here

# DataForSEO API Credentials
DATAFORSEO_LOGIN=your_dataforseo_email
DATAFORSEO_PASSWORD=your_dataforseo_api_password

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 5. Start Your Application

```bash
# Terminal 1 - Start backend
cd backend
npm run dev

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

### 6. Verify Database Connection

When you start the backend, you should see:
```
✓ Database connection established successfully
✓ Database synced successfully (updated schema)
```

If you see this, congratulations! Your Supabase database is connected! 🎉

---

## Managing Your Database

### Using Supabase Dashboard

**View Tables:**
1. Go to **Table Editor** in Supabase Dashboard
2. You'll see three tables created automatically:
   - `users` - User accounts
   - `projects` - Keyword projects
   - `keywords` - Saved keywords

**Browse Data:**
- Click any table to view its data
- Add, edit, or delete rows directly
- Use filters to search data

**Run SQL Queries:**
1. Click **SQL Editor** in sidebar
2. Write and run custom queries:
   ```sql
   -- View all users
   SELECT * FROM users;

   -- Count keywords per project
   SELECT p.name, COUNT(k.id) as keyword_count
   FROM projects p
   LEFT JOIN keywords k ON p.id = k."projectId"
   GROUP BY p.id, p.name;
   ```

**View Logs:**
- Go to **Database** > **Logs** to see connection activity
- Monitor for errors or suspicious activity

---

## Troubleshooting

### ❌ "Unable to connect to database"

**Check 1: Verify PASSWORD**
- Make sure you replaced `[YOUR-PASSWORD]` in DATABASE_URL
- Remove the square brackets `[]`
- Password is case-sensitive

**Check 2: Verify CONNECTION STRING**
- Go to Supabase: Project Settings > Database
- Copy the URI connection string again
- Make sure it starts with `postgresql://`

**Check 3: Project Paused**
- Free tier projects pause after 1 week of inactivity
- Go to Supabase Dashboard
- Click "Restore" if project is paused

**Check 4: Check Syntax**
- No spaces in DATABASE_URL
- No line breaks
- Must be all on one line

### ❌ "SSL connection error"

The code automatically handles SSL for Supabase. If you still see SSL errors:

```javascript
// In backend/src/config/database.js - already configured!
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

### ❌ Tables not creating

**Solution:**
```bash
# Stop your backend server (Cmd+C)
# Restart it
cd backend && npm run dev
```

The application uses `sequelize.sync()` which automatically creates tables.

### ❌ "Password authentication failed"

- Double-check your database password
- Try resetting database password in Supabase:
  1. Project Settings > Database
  2. Click "Reset database password"
  3. Enter new password
  4. Update DATABASE_URL in `.env`

---

## Production Deployment

### Environment Variables

When deploying to production (Vercel, Railway, Render, etc.):

1. Add `DATABASE_URL` as environment variable
2. Set `NODE_ENV=production`
3. Use a strong `JWT_SECRET`
4. **DO NOT** commit `.env` to Git!

### Example: Railway Deployment

1. Connect your GitHub repo to Railway
2. Add environment variables:
   ```
   DATABASE_URL=your_supabase_connection_string
   JWT_SECRET=your_production_jwt_secret
   DATAFORSEO_LOGIN=your_dataforseo_login
   DATAFORSEO_PASSWORD=your_dataforseo_password
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
3. Railway will automatically deploy

### Example: Render Deployment

1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables (same as above)

---

## Database Limits (Free Tier)

| Resource | Limit | Notes |
|----------|-------|-------|
| Database Size | 500 MB | Enough for ~100K keywords |
| Bandwidth | 5 GB | Resets monthly |
| API Requests | Unlimited | Subject to fair use |
| Projects | 2 | Can create 2 free projects |
| Paused After | 1 week inactivity | Easy to restore |

**Upgrading:**
- Pro plan: $25/month
- Removes pause
- 8GB database
- 100GB bandwidth

---

## Security Best Practices

✅ **DO:**
- Use strong database passwords (16+ characters, mixed case, numbers, symbols)
- Keep `.env` file out of Git (already in `.gitignore`)
- Use different passwords for dev and production
- Enable Row Level Security in Supabase (optional, advanced)

❌ **DON'T:**
- Share DATABASE_URL publicly
- Commit `.env` to Git
- Use weak passwords like "password123"
- Expose connection string in client-side code

---

## Backup Your Data

### Manual Backup

1. Go to Supabase Dashboard
2. Click **Database** > **Backups**
3. Click "Create backup"
4. Download SQL dump if needed

### Automatic Backups

Free tier includes:
- Daily backups (kept for 7 days)
- Point-in-time recovery (for Pro plan)

### Export Data

```sql
-- Export users to CSV
COPY (SELECT * FROM users) TO STDOUT WITH CSV HEADER;

-- Export keywords
COPY (SELECT * FROM keywords) TO STDOUT WITH CSV HEADER;
```

---

## Monitoring

### Check Database Health

In Supabase Dashboard:
1. Go to **Reports**
2. View:
   - Database size usage
   - API requests
   - Active connections
   - Slow queries

### Set Up Alerts

1. Project Settings > **Alerts**
2. Add email alerts for:
   - Database size > 80%
   - High CPU usage
   - Connection errors

---

## Need Help?

- 📖 [Supabase Docs](https://supabase.com/docs)
- 💬 [Supabase Discord](https://discord.supabase.com/)
- 📧 Email: support@supabase.io
- 🐛 [Report Issues](https://github.com/yourusername/seokwtool4/issues)

---

**Ready to go? Start the app and create your first account!** 🚀

Run: `cd backend && npm run dev` then `cd frontend && npm run dev`
