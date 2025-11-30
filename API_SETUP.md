# OpenWeatherMap API Setup Guide

## 🔑 Getting Your Free API Key

The current API key may be invalid or not activated. Follow these steps to get your own free API key:

### Step 1: Sign Up
1. Go to: https://home.openweathermap.org/users/sign_up
2. Fill in your details and create an account
3. **Verify your email** (check spam folder if needed)

### Step 2: Get Your API Key
1. After logging in, go to: https://home.openweathermap.org/api_keys
2. You'll see your API key (or create a new one)
3. **Copy the API key**

### Step 3: Activate Your Key
- ⏰ **Important**: New API keys may take **1-2 hours** to activate
- You'll receive an email when it's ready
- Until then, you may get 401 errors

### Step 4: Configure in Your Project

Create a `.env` file in the root directory (`weather-agent-chat/.env`):

```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

Replace `your_api_key_here` with your actual API key.

### Step 5: Restart the Dev Server

After adding the API key:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Testing Your API Key

Once configured, try:
- "Weather in Mumbai"
- "Temperature in Delhi"

If you still get errors:
1. Wait a bit longer (keys can take time to activate)
2. Double-check the API key is correct
3. Make sure there are no extra spaces in the `.env` file
4. Verify you've restarted the dev server

## 📝 Notes

- Free tier allows **60 calls/minute**
- Free tier allows **1,000,000 calls/month**
- No credit card required for free tier
- API key is free forever

## 🆘 Troubleshooting

**Error: "Invalid API key"**
- Wait 1-2 hours after signup
- Check the key is copied correctly
- Make sure `.env` file is in the root directory
- Restart the dev server after adding the key

**Error: "City not found"**
- Check the city name spelling
- Try using the full city name (e.g., "New York" instead of "NYC")

