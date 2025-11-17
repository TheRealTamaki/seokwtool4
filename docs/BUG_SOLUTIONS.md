# Bug Solutions

This document tracks common bugs and their solutions for the SEO Keyword Research Tool.

## Common Issues

### API Configuration

**Problem:** API credentials not saving or modal keeps appearing

**Solution:**
- Ensure localStorage is enabled in your browser
- Check browser console for any errors
- Clear localStorage and re-enter credentials: `localStorage.clear()`

**Root Cause:** Browser privacy settings or localStorage being disabled

---

### CORS Errors

**Problem:** API calls failing with CORS errors in browser console

**Solution:**
- DataForSEO API requires server-side calls due to CORS restrictions
- For production, implement a backend proxy server (Node.js/Express, Python/Flask, etc.)
- Example proxy endpoint:
  ```javascript
  // Backend (Node.js/Express)
  app.post('/api/proxy', async (req, res) => {
    const response = await fetch('https://api.dataforseo.com/v3/...', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  });
  ```

**Root Cause:** Browser security restrictions prevent direct API calls to DataForSEO from client-side JavaScript

---

### No Keywords Found

**Problem:** Search returns "No keyword ideas found" error

**Solution:**
- Verify API credentials are correct
- Check that the keyword is in English (or adjust language_code parameter)
- Try a more common/popular keyword
- Check DataForSEO API quota/credits

**Root Cause:** Invalid API credentials, keyword too obscure, or API quota exceeded

---

### Table Sorting Not Working

**Problem:** Clicking table headers doesn't sort data

**Solution:**
- Ensure JavaScript is enabled
- Check browser console for errors
- Verify `currentKeywords` array is populated
- Check that sort icons are updating correctly

**Root Cause:** JavaScript error or data not properly loaded into state

---

### People Also Ask Not Displaying

**Problem:** PAA section not showing even when keyword returns results

**Solution:**
- PAA results depend on Google SERP data availability
- Not all keywords have PAA results
- Check browser console for API errors
- This feature requires additional API credits

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
- API calls are made in sequence and parallel where possible
- Reduce the `limit` parameter in API calls to fetch fewer results
- Consider implementing pagination for large result sets
- Check your internet connection speed

**Root Cause:** API latency, network speed, or fetching too much data at once

---

### Browser Memory Issues

**Problem:** Browser becomes slow with large datasets

**Solution:**
- Implement virtual scrolling for large tables
- Add pagination to limit displayed results
- Clear previous results before new search

**Root Cause:** Rendering too many DOM elements at once

---

## Development Tips

### Testing Without API Calls

For development/testing without using API credits, you can mock the API responses:

```javascript
// In app.js, replace API calls with mock data
async function getRelatedKeywords(keyword, location) {
    // Mock data for testing
    return [
        { keyword: 'test keyword 1', keyword_info: { search_volume: 1000, cpc: 1.50 }, keyword_properties: { keyword_difficulty: 45 } },
        { keyword: 'test keyword 2', keyword_info: { search_volume: 500, cpc: 0.75 }, keyword_properties: { keyword_difficulty: 30 } }
    ];
}
```

### Debugging API Calls

Add console logging to track API responses:

```javascript
const data = await response.json();
console.log('API Response:', data); // Debug line
```

---

## Browser Compatibility

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Known Issues:**
- localStorage may not work in private/incognito mode
- Some older browsers may not support ES6+ features (use Babel to transpile if needed)

---

## Security Considerations

**API Credentials:**
- Never commit API credentials to version control
- For production, implement server-side authentication
- Use environment variables for sensitive data

**XSS Prevention:**
- User input is not directly injected into HTML
- All dynamic content uses textContent or controlled innerHTML

---

*Last Updated: 2025-11-17*
