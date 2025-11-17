# Bug Solutions

**IMPORTANT: READ THIS FIRST BEFORE FIXING ANY BUG!**

Always check docs/BUG_SOLUTIONS.md for existing fixes and patterns before fixing any bug.

**CRITICAL RULES:**
- When fixing a bug, identify the root cause, implement the fix, and verify with linting
- ALWAYS end with a simple one-sentence summary using exactly 3 alarm emojis (🚨🚨🚨). This is mandatory and must be the very last sentence in your response
- Always provide Mac-specific keyboard shortcuts and terminal commands (use Cmd instead of Ctrl, etc.). The user is on macOS
- When we add UI elements that repeat between pages, either reuse an existing shared component or refactor the repeated markup into a shared component before finishing the task
- Delete any test files I create after confirming they are no longer needed

---

This document tracks common bugs and their solutions for the SEO Keyword Research Tool.

## Database Issues (Supabase)

### Database Connection Failed

**Problem:** Backend shows "Unable to connect to database" error

**Solution:**
1. Check DATABASE_URL in `backend/.env`:
   - Make sure you replaced `[YOUR-PASSWORD]` with your actual Supabase password
   - Remove the square brackets `[]`
   - Verify no spaces or line breaks in the connection string
2. Verify your Supabase project is not paused:
   - Free tier projects pause after 1 week of inactivity
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Click "Restore" if project shows as paused
3. Get a fresh connection string:
   - Go to Project Settings > Database in Supabase
   - Copy the URI connection string
   - Replace the password portion

**Root Cause:** Incorrect DATABASE_URL format, wrong password, or paused Supabase project

---

### SSL Connection Error

**Problem:** Error message about SSL/TLS connection

**Solution:**
- The application is already configured for Supabase SSL
- If error persists, verify `backend/src/config/database.js` contains:
  ```javascript
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
  ```

**Root Cause:** Supabase requires SSL connections; configuration handles this automatically

---

### Tables Not Creating

**Problem:** Database connects but tables (users, projects, keywords) don't exist

**Solution:**
1. Stop the backend server (Cmd+C on macOS)
2. Restart: `npm run dev`
3. Check console for "Database synced successfully" message
4. Verify in Supabase Dashboard > Table Editor

**Root Cause:** Sequelize sync didn't run on first startup

---

### Password Authentication Failed

**Problem:** Error: "password authentication failed for user postgres"

**Solution:**
1. Reset your Supabase database password:
   - Go to Project Settings > Database
   - Click "Reset database password"
   - Create a new strong password
2. Update DATABASE_URL in `backend/.env` with new password
3. Restart backend server

**Root Cause:** Incorrect password in DATABASE_URL

---

## Common Issues

### API Configuration

**Problem:** API credentials not saving or modal keeps appearing

**Solution:**
- Ensure localStorage is enabled in your browser
- Check browser console for any errors
- Clear localStorage and re-enter credentials: `localStorage.clear()`

**Root Cause:** Browser privacy settings or localStorage being disabled

---

### Authentication Errors

**Problem:** "Not authorized to access this route" or token errors

**Solution:**
- Clear localStorage: `localStorage.clear()`
- Log out and log in again
- Check JWT_SECRET is set in `backend/.env`
- Verify frontend is pointing to correct backend URL

**Root Cause:** Invalid or expired JWT token

---

### CORS Errors

**Problem:** API calls failing with CORS errors in browser console

**Solution:**
- Verify FRONTEND_URL in `backend/.env` matches your frontend URL
- For local development: `FRONTEND_URL=http://localhost:3000`
- Check backend server is running
- Verify CORS configuration in `backend/src/server.js`

**Root Cause:** CORS configuration mismatch between frontend and backend

---

### No Keywords Found

**Problem:** Search returns "No keyword ideas found" error

**Solution:**
- Verify DataForSEO API credentials in `backend/.env`
- Check that the keyword is in English (or adjust language parameter)
- Try a more common/popular keyword
- Check DataForSEO API quota/credits at [DataForSEO Dashboard](https://app.dataforseo.com/)

**Root Cause:** Invalid API credentials, keyword too obscure, or API quota exceeded

---

### Table Sorting Not Working

**Problem:** Clicking table headers doesn't sort data

**Solution:**
- Ensure JavaScript is enabled
- Check browser console for errors (Cmd+Option+I on macOS)
- Refresh the page (Cmd+R)
- Try a different browser

**Root Cause:** JavaScript error or state management issue

---

### People Also Ask Not Displaying

**Problem:** PAA section not showing even when keyword returns results

**Solution:**
- PAA results depend on Google SERP data availability
- Not all keywords have PAA results
- Check browser console for API errors
- This feature uses DataForSEO SERP API credits

**Root Cause:** Google doesn't show PAA for all keywords, or API returned no PAA data

---

### AI Overview Not Displaying

**Problem:** AI Overview section not showing

**Solution:**
- AI Overview is a newer Google feature and isn't available for all queries
- Only certain search queries trigger AI Overviews
- Check browser console for API errors
- This feature requires SERP API access

**Root Cause:** Google doesn't show AI Overview for all keywords, or API returned no AI overview data

---

## Performance Issues

### Slow API Responses

**Problem:** Search takes a long time to complete

**Solution:**
- API calls are made in parallel where possible
- Reduce the `limit` parameter in API calls to fetch fewer results
- Check your internet connection speed
- DataForSEO API latency varies by endpoint

**Root Cause:** API latency, network speed, or fetching too much data at once

---

### Browser Memory Issues

**Problem:** Browser becomes slow with large datasets

**Solution:**
- Clear old search results before new search
- Limit number of keywords saved per project
- Use browser developer tools to check memory usage
- Close unused tabs

**Root Cause:** Rendering too many DOM elements at once

---

## Development Tips

### Testing Without API Calls

For development/testing without using API credits, you can mock the API responses in `backend/src/services/dataforseo.js`:

```javascript
// Add this at the top of any function
if (process.env.NODE_ENV === 'test') {
  return [
    { 
      keyword: 'test keyword 1', 
      keyword_info: { search_volume: 1000, cpc: 1.50 }, 
      keyword_properties: { keyword_difficulty: 45 } 
    },
    { 
      keyword: 'test keyword 2', 
      keyword_info: { search_volume: 500, cpc: 0.75 }, 
      keyword_properties: { keyword_difficulty: 30 } 
    }
  ];
}
```

### Debugging API Calls

Add console logging to track API responses:

```javascript
// In backend/src/services/dataforseo.js
const data = await response.json();
console.log('DataForSEO Response:', JSON.stringify(data, null, 2));
```

### Check Database Content

**Using Supabase Dashboard:**
1. Go to Table Editor
2. Select table (users, projects, keywords)
3. View all data

**Using SQL Editor:**
```sql
-- View all data
SELECT * FROM users;
SELECT * FROM projects;
SELECT * FROM keywords;

-- Check relationships
SELECT p.name as project, COUNT(k.id) as keywords
FROM projects p
LEFT JOIN keywords k ON p.id = k."projectId"
GROUP BY p.id, p.name;
```

---

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Known Issues:**
- localStorage may not work in private/incognito mode
- Some older browsers may not support ES6+ features

**Recommended:**
- Use latest version of Chrome or Firefox for best experience
- Enable JavaScript
- Allow cookies and localStorage

---

## Security Considerations

**API Credentials:**
- Never commit `.env` file to version control (already in `.gitignore`)
- Use different credentials for dev and production
- Rotate DataForSEO API credentials periodically
- Use strong JWT_SECRET (32+ random characters)

**Password Security:**
- Minimum 6 characters with uppercase, lowercase, and number
- Passwords are hashed with bcrypt before storing
- Never share your database password

**Database Security:**
- DATABASE_URL contains sensitive credentials
- Never expose in client-side code
- Use environment variables on hosting platforms
- Enable Supabase Row Level Security for production (advanced)

---

## Getting Help

**Supabase Issues:**
- Check [README_SUPABASE.md](../README_SUPABASE.md) for detailed setup guide
- Visit [Supabase Dashboard](https://app.supabase.com/) to check project status
- View Database logs in Supabase: Database > Logs
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com/)

**Application Issues:**
- Check backend console for errors
- Check frontend browser console (Cmd+Option+I on macOS)
- Verify all environment variables in `backend/.env`
- Check [main README](../README.md) for setup instructions

**DataForSEO Issues:**
- [DataForSEO Documentation](https://docs.dataforseo.com/)
- [API Dashboard](https://app.dataforseo.com/)
- Check API quota and usage
- Verify API credentials are correct

**Report Bugs:**
- Open an issue on [GitHub](https://github.com/yourusername/seokwtool4/issues)
- Include error messages and console logs
- Describe steps to reproduce

---

## Quick Troubleshooting Checklist

When something doesn't work, check these in order:

- [ ] Backend server is running (`npm run dev` in backend folder)
- [ ] Frontend server is running (`npm run dev` in frontend folder)
- [ ] DATABASE_URL is correct in `backend/.env`
- [ ] Supabase project is not paused
- [ ] DataForSEO credentials are correct
- [ ] JWT_SECRET is set in `.env`
- [ ] Browser console has no errors (Cmd+Option+I)
- [ ] Internet connection is working
- [ ] Using supported browser (Chrome/Firefox latest)

---

*Last Updated: 2025-11-17*
*Now with Supabase support! 🚀*
