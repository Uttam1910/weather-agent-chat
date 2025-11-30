# Troubleshooting Guide

## API Key Error

### Error Message:
```
An error occurred while processing your request. Incorrect API key provided: sk-proj-...
```

### What This Means:
The backend API is working correctly, but it's configured with an **invalid or expired OpenAI API key**.

### Solution:

This is a **backend configuration issue**. You need to:

1. **Get a valid OpenAI API key:**
   - Go to https://platform.openai.com/account/api-keys
   - Create a new API key or use an existing valid one

2. **Configure the backend:**
   - The backend (Mastra API) needs to be configured with the correct OpenAI API key
   - This is typically done in the backend's environment variables or configuration file
   - Look for environment variables like:
     - `OPENAI_API_KEY`
     - `API_KEY`
     - Or check your backend's configuration documentation

3. **Restart the backend server** after updating the API key

### Frontend Status:
✅ The frontend is now correctly:
- Receiving the error message from the API
- Displaying it in the chat interface
- Showing it in the error banner
- Logging it to the console for debugging

### Testing:
After fixing the backend API key:
1. Restart your backend server
2. Try sending a message again
3. The error should be resolved and you should get weather responses

---

## Other Common Issues

### Missing Environment Variables
**Error:** `Missing environment variables: VITE_API_ENDPOINT, VITE_THREAD_ID`

**Solution:** Create a `.env` file in the root directory:
```env
VITE_API_ENDPOINT=https://your-api-endpoint.com/api/chat
VITE_THREAD_ID=your-thread-id-here
```

### CORS Errors
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:** The backend needs to allow requests from your frontend origin. Configure CORS on the backend.

### Network Errors
**Error:** `Failed to fetch` or `NetworkError`

**Solution:** 
- Check if the backend server is running
- Verify the API endpoint URL is correct
- Check your internet connection
- Verify firewall/network settings

