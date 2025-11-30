# 🌤️ Weather Assistant – Chat UI Interface

A sleek, modern, and responsive chat interface built with **React**, **Tailwind CSS**, and **OpenWeatherMap API** to interactively fetch real-time weather updates for any location worldwide.

![Weather Assistant Screenshot](./preview.png)

---

## ✨ Features

- ⚡ Real-time weather data from OpenWeatherMap API
- 💬 Conversational chat UI with user & agent messages
- ✨ Typing indicators & smooth animations
- 🧠 Smart suggestions & default prompts
- 🧹 Clear chat history
- 🎨 Polished UI with Tailwind CSS and fully responsive design

---

## 🚀 Live Preview

> **Coming Soon**  
> You can preview the app locally by following the steps below.

---

## 🔧 Tech Stack

| Tech                  | Usage                                  |
|----------------------|----------------------------------------|
| **React.js**          | Frontend UI                            |
| **Tailwind CSS**      | Utility-first styling                  |
| **OpenWeatherMap API**| Free weather data API                  |
| **Vite**              | Fast dev server & build tool           |

---

## 📦 Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/weather-assistant-ui.git
cd weather-assistant-ui

# 2. Install dependencies
npm install

# 3. Start the local dev server
npm run dev

# 4. Visit the app
http://localhost:5173
```

## ⚙️ Configuration

### OpenWeatherMap API

This app uses **OpenWeatherMap.org** free API for weather data.

#### Getting Your API Key (Free)

1. **Sign up** for a free account at: https://home.openweathermap.org/users/sign_up
2. **Verify your email** (check spam folder if needed)
3. **Get your API key** from: https://home.openweathermap.org/api_keys
4. **Wait for activation** - New API keys may take 1-2 hours to activate

#### Setting Up the API Key

**Option 1: Environment Variable (Recommended)**
Create a `.env` file in the root directory:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

**Option 2: Default Key**
The app includes a default API key, but it may not work. Using your own key is recommended.

### How It Works

- Simply type a city name in your message (e.g., "Weather in Mumbai", "Temperature in Delhi")
- The app automatically extracts the city name and fetches real-time weather data
- Weather information is displayed in a beautiful card format

### Supported Queries

- "Weather in [city]"
- "Temperature in [city]"
- "Humidity in [city]"
- "[City] weather"
- Any message containing a city name
