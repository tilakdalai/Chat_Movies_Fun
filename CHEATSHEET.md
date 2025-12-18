# 🎯 Deployment Commands Cheat Sheet

## Local Development

```bash
# Install dependencies
npm ci

# Run both frontend + backend
npm run dev

# Run separately
npm run server    # Backend only (port 3001)
npm run client    # Frontend only (port 5173)

# Build for production
npm run build              # Frontend
npm run build:server       # Backend (optional, tsx runtime used)

# Start production server
npm run start:server       # Backend
```

## Environment Variables

### Local (.env file)
```bash
VITE_API_URL=http://localhost:3001
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Vercel (Frontend)
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Render (Backend)
```bash
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

## Render Configuration

```
Service Type: Web Service
Build Command: npm ci && npm run build:server
Start Command: npm run start:server
```

## Vercel Configuration

```
Framework: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm ci
```

## Deployment Order

1. **Deploy Backend First** → Get backend URL
2. **Deploy Frontend** → Use backend URL in `VITE_API_URL`
3. **Update Backend CORS** → Add frontend URL to `FRONTEND_URL`

## Testing URLs

### Local
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health: http://localhost:3001/health

### Production
- Frontend: https://your-app.vercel.app
- Backend: https://your-backend.onrender.com
- Health: https://your-backend.onrender.com/health

## Git Commands

```bash
# Stage all changes
git add .

# Commit changes
git commit -m "Deploy ready: Added Vercel + Render configuration"

# Push to GitHub
git push origin main

# Check status
git status
```

## Troubleshooting

### Connection Issues
```bash
# Check backend health
curl https://your-backend.onrender.com/health

# Check frontend env
echo $VITE_API_URL

# View Render logs
# Go to Render Dashboard → Your Service → Logs tab

# View Vercel logs
# Go to Vercel Dashboard → Your Project → Deployments → Click deployment → View logs
```

### CORS Errors
- Ensure `FRONTEND_URL` on Render includes your exact Vercel URL
- No trailing slashes in URLs
- Comma-separate multiple origins: `https://app1.vercel.app,https://app2.vercel.app`

### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules dist
npm ci
npm run build

# Check Node version (should be 18+)
node --version
```

## Quick Links

- **Render Dashboard**: https://dashboard.render.com
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Full Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Quick Start Guide**: [QUICKSTART.md](./QUICKSTART.md)

## Cost Breakdown

### Free Tier
- Vercel: Free ✅
- Render: Free (sleeps after 15 min) ⚠️
- **Total: $0/month**

### Production (Always-On)
- Vercel: Free or $20/mo Pro ✅
- Render: $7/mo Starter ⚠️
- **Total: $7-27/month**

## Support

- GitHub Issues: https://github.com/tilakdalai/Chat_play_room/issues
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions
