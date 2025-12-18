# Quick Start for Vercel + Render Deployment

## 🚀 Deploy to Production

### 1. Backend (Render)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**Manual Setup:**
```bash
# On Render Dashboard
Service Type: Web Service
Build Command: npm ci && npm run build:server
Start Command: npm run start:server
Environment Variables:
  - PORT=3001
  - NODE_ENV=production
  - FRONTEND_URL=https://your-vercel-app.vercel.app
```

### 2. Frontend (Vercel)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/tilakdalai/Chat_play_room)

**Manual Setup:**
```bash
# On Vercel Dashboard
Framework: Vite
Build Command: npm run build
Output Directory: dist
Environment Variables:
  - VITE_API_URL=https://your-backend.onrender.com
```

### 3. Update CORS

After deploying both:
1. Copy your Vercel URL
2. Update `FRONTEND_URL` on Render with your Vercel URL
3. Render will auto-redeploy

---

## 🧪 Local Development

### Prerequisites
- Node.js 18+ (or 20+)
- npm 9+

### Setup

1. **Clone and install:**
```bash
git clone https://github.com/tilakdalai/Chat_play_room.git
cd Chat_play_room
npm install
```

2. **Create `.env` file:**
```bash
cp .env.example .env
```

Edit `.env`:
```env
# Frontend
VITE_API_URL=http://localhost:3001

# Backend
PORT=3001
FRONTEND_URL=http://localhost:5173,http://localhost:3000
NODE_ENV=development
```

3. **Run development servers:**
```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:5173 (Vite)
- Backend: http://localhost:3001 (Socket.IO server)

4. **Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

---

## 🏗️ Build for Production

### Build Frontend
```bash
npm run build
```
Output: `dist/` folder

### Build Backend (optional - tsx runtime used)
```bash
npm run build:server
```
Output: `dist/server/` folder

### Start Backend
```bash
npm run start:server
```

---

## 📝 Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001  # Backend API URL
```

### Backend (.env)
```bash
PORT=3001                            # Server port
NODE_ENV=development                 # development | production
FRONTEND_URL=http://localhost:5173   # Frontend URL(s) for CORS
```

**For production:**
- Set `VITE_API_URL` to your Render backend URL
- Set `FRONTEND_URL` to your Vercel frontend URL

---

## 🧪 Testing

```bash
npm test                # Run all tests
npm test -- --coverage  # With coverage
npm run lint            # Lint code
```

---

## 📖 Full Documentation

- [Complete Deployment Guide](./DEPLOYMENT.md)
- [API Documentation](./README.md#-api-endpoints)
- [Architecture Overview](./README.md)

---

## ⚠️ Important Notes

### For Vercel Frontend:
- ✅ Static site generation (SSG/SPA)
- ✅ Automatic HTTPS
- ✅ CDN distribution
- ❌ No server-side code
- ❌ No WebSocket server

### For Render Backend:
- ✅ Persistent WebSocket connections
- ✅ Socket.IO support
- ✅ File uploads
- ⚠️ Free tier sleeps after 15 mins inactivity
- ⚠️ Ephemeral filesystem on free tier (uploads lost on restart)

### Production Recommendations:
- Use Render **Starter plan** ($7/mo) for always-on backend
- Use S3/Cloudinary for persistent file storage
- Enable monitoring (UptimeRobot, etc.)
- Add rate limiting for API endpoints
- Configure database for persistent data (if needed)

---

## 🆘 Troubleshooting

### Connection Issues
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly
- Verify `FRONTEND_URL` includes your domain
- Check Render service status and logs

### Build Issues
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm ci`
- Clear build cache: `rm -rf dist && npm run build`
- Check Node.js version: `node --version` (should be 18+)

### CORS Errors
- Update `FRONTEND_URL` on Render with all domains (comma-separated)
- Ensure no trailing slashes in URLs
- Check Render logs for CORS errors

---

## 📞 Support

- Open an issue on [GitHub](https://github.com/tilakdalai/Chat_play_room/issues)
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
