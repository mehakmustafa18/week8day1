# CVCraft — Professional Resume Builder

Full-stack resume builder with AI-powered features, MongoDB backend, and 6 professional templates.

## Features

✅ **Landing Page** — Hero, features, template gallery  
✅ **Authentication** — Signup/Login with JWT + bcrypt  
✅ **Dashboard** — Manage resumes, browse templates, tips  
✅ **Resume Builder** — 6 templates, 12 colors, real-time preview  
✅ **AI Features** — Generate summaries & improve bullet points  
✅ **MongoDB Storage** — Persistent user data & resumes  
✅ **PDF Export** — One-click print/save  

---

## Tech Stack

**Frontend:** HTML, CSS, Vanilla JavaScript  
**Backend:** Node.js, Express, MongoDB, Mongoose  
**AI:** OpenAI GPT-4o-mini (with fallback templates)  
**Auth:** JWT tokens, bcrypt password hashing  

---

## Setup Instructions

### 1. Install MongoDB

**Windows:**
```bash
# Download from: https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
```

**Mac/Linux:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/cvcraft
JWT_SECRET=your_super_secret_jwt_key_here
OPENAI_API_KEY=sk-your-openai-api-key-here
```

**Get OpenAI API Key:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Paste in `.env`

**Note:** AI features work without API key (uses fallback templates), but for best results add your key.

### 4. Start the Server

```bash
cd backend
npm start
```

Server runs on: **http://localhost:5000**

---

## Usage

1. Open **http://localhost:5000** in browser
2. Click **"Get Started"** → Sign up
3. Go to Dashboard → **"New Resume"**
4. Fill in your info
5. Click **"✨ Generate with AI"** in Summary tab
6. Click **"✨ AI Improve Description"** in Experience tab
7. Export PDF when done

---

## Deployment

### Deploy to Render / Railway / Heroku

1. Push code to GitHub
2. Connect repo to hosting platform
3. Set environment variables:
   - `MONGO_URI` → MongoDB Atlas connection string
   - `JWT_SECRET` → random secure string
   - `OPENAI_API_KEY` → your OpenAI key
4. Deploy!

### MongoDB Atlas Setup (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Replace `MONGO_URI` in `.env`

---

## API Endpoints

### Auth
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Login

### Resumes
- `GET /api/resumes` — Get all user resumes
- `POST /api/resumes` — Save/update resume
- `DELETE /api/resumes/:id` — Delete resume

### AI
- `POST /api/ai/summary` — Generate professional summary
- `POST /api/ai/improve-bullet` — Improve experience bullet

---

## Project Structure

```
CVCraft/
├── backend/
│   ├── models/
│   │   └── User.js          # MongoDB user schema
│   ├── routes/
│   │   ├── auth.js          # Signup/login
│   │   ├── resumes.js       # CRUD operations
│   │   └── ai.js            # AI features
│   ├── server.js            # Express app
│   ├── .env                 # Config (not in git)
│   └── package.json
├── css/
│   └── app.css              # All styles
├── js/
│   ├── data.js              # Default data & constants
│   ├── templates.js         # 6 resume templates
│   ├── api.js               # API client
│   └── app.js               # Main app logic
├── index.html               # Single-page app
└── README.md
```

---

## License

MIT — Free to use and modify

---

## Credits

Built with ❤️ by DevSquad_26
