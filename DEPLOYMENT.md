# Deployment Guide: Vercel (Frontend) + Render (Backend)

This guide will help you deploy the Chat Playroom application with:
- **Frontend**: Vercel (static React app)
- **Backend**: Render (Node.js WebSocket server)

---

## 🎯 Prerequisites

- GitHub account (code should be pushed to a GitHub repository)
- Vercel account (free tier available at [vercel.com](https://vercel.com))
- Render account (free tier available at [render.com](https://render.com))

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Create a Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

**Service Settings:**
```
Name: chat-playroom-backend (or your preferred name)
Region: Choose closest to your users
Branch: main (or your default branch)
Root Directory: (leave empty - use repo root)
Runtime: Node
Build Command: npm ci && npm run build:server
Start Command: npm run start:server
```

**Instance Type:**
- Free tier is fine for testing
- Upgrade to paid tier for production (better performance & no sleep)

### Step 2: Add Environment Variables on Render

In your Render service settings, add these environment variables:

```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

**Important:** You'll update `FRONTEND_URL` after deploying the frontend in Part 2.

### Step 3: Deploy Backend

- Click **"Create Web Service"**
- Wait for the build and deployment to complete (5-10 minutes)
- Copy your backend URL (e.g., `https://chat-playroom-backend.onrender.com`)

### Step 4: Test Backend Health

Visit: `https://your-backend-url.onrender.com/health`

You should see a JSON response like:
```json
{"status":"ok","totalRooms":0,"totalUsers":0}
```

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Import Project on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure the project:

**Build & Development Settings:**
```
Framework Preset: Vite
Build Command: npm run build (default)
Output Directory: dist (default)
Install Command: npm ci (default)
Root Directory: ./ (default)
```

### Step 2: Add Environment Variables on Vercel

In the **Environment Variables** section, add:

```
Name: VITE_API_URL
Value: https://your-backend-url.onrender.com
Environment: Production, Preview, Development (select all)
```

**Replace** `https://your-backend-url.onrender.com` with the actual URL from Part 1, Step 3.

### Step 3: Deploy Frontend

- Click **"Deploy"**
- Wait for the build to complete (2-5 minutes)
- Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 4: Update Backend CORS

1. Go back to your **Render Dashboard**
2. Open your backend web service
3. Go to **Environment** tab
4. Update the `FRONTEND_URL` variable with your Vercel URL:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Click **"Save Changes"**
6. Render will automatically redeploy your backend

---

## ✅ Part 3: Verify Deployment

### Test the Application

1. Open your Vercel frontend URL in a browser
2. Try creating a room
3. Check the browser console for any connection errors
4. Test basic features:
   - Creating/joining rooms
   - Sending messages
   - Starting games

### Common Issues & Solutions

**Issue: "Connection failed" or Socket.IO errors**
- **Solution**: Check that `VITE_API_URL` on Vercel matches your Render backend URL
- **Solution**: Verify `FRONTEND_URL` on Render includes your Vercel URL
- **Solution**: Check Render logs for CORS errors

**Issue: "404 Not Found" on API calls**
- **Solution**: Ensure backend is running (check Render service status)
- **Solution**: Verify `VITE_API_URL` has no trailing slash

**Issue: Backend "sleeps" after inactivity (free tier)**
- **Solution**: Free Render services sleep after 15 mins of inactivity
- **Solution**: Upgrade to a paid plan ($7/month) for always-on service
- **Solution**: Use a service like UptimeRobot to ping `/health` every 5 minutes

**Issue: File uploads not working**
- **Solution**: File uploads require persistent storage. On Render free tier, filesystem is ephemeral
- **Solution**: For production, integrate with S3/Cloudinary for file storage
- **Solution**: Uploads work on paid Render plans with persistent disks

---

## 🔧 Part 4: Custom Domain (Optional)

### For Frontend (Vercel)
1. Go to your project settings on Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Update DNS records as instructed by Vercel

### For Backend (Render)
1. Go to your service settings on Render
2. Click **"Custom Domain"** tab
3. Add your custom domain
4. Update DNS records as instructed by Render
5. **Don't forget** to update `VITE_API_URL` on Vercel with your new backend domain
6. **Don't forget** to update `FRONTEND_URL` on Render with your new frontend domain

---

## 📊 Monitoring & Logs

### View Backend Logs (Render)
- Go to your service on Render
- Click **"Logs"** tab
- View real-time server logs

### View Frontend Logs (Vercel)
- Go to your project on Vercel
- Click **"Deployments"**
- Click on any deployment → **"View Function Logs"** (for build logs)

---

## 💰 Cost Estimates

### Free Tier (Testing/Personal Use)
- **Vercel**: Free (generous limits)
- **Render**: Free (service sleeps after 15 mins inactivity)
- **Total**: $0/month

### Production (Always-On)
- **Vercel**: Free (or $20/month for Pro features)
- **Render**: $7/month (Starter plan, always-on)
- **Total**: $7-27/month

---

## 🚀 Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. ✅ Environment variables configured
4. ✅ CORS configured
5. ✅ Application tested and working

### Recommended Improvements:
- Set up a custom domain
- Enable HTTPS (automatic on both platforms)
- Add monitoring/alerting (UptimeRobot, etc.)
- Configure CDN caching (Vercel handles this automatically)
- Add analytics (Vercel Analytics, Google Analytics, etc.)
- Set up CI/CD automation (GitHub Actions)

---

## 📝 Environment Variables Summary

### Frontend (Vercel)
```bash
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (Render)
```bash
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🆘 Need Help?

- Check Render logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly
- Test backend `/health` endpoint directly
- Ensure GitHub repo is up to date

---

## 🔄 Updating Your Deployment

### To update the frontend:
1. Push changes to GitHub
2. Vercel auto-deploys from your main branch

### To update the backend:
1. Push changes to GitHub
2. Render auto-deploys from your main branch

Both platforms support automatic deployments on git push!
