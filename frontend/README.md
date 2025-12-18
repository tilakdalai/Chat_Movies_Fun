# Playroom Frontend

React + TypeScript + Vite frontend for real-time gaming and chat platform.

## Features
- Real-time chat
- Multiplayer games (Chess, Uno, Ludo)
- YouTube music queue
- Movie synchronization
- WebRTC video/audio chat
- Screen sharing
- Torrent streaming

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your backend URL
```

## Development

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Build

```bash
npm run build
```

Output in `dist/` folder.

## Deploy to Vercel

### Via Vercel Dashboard:
1. Create new project
2. Import your repository
3. Set **Root Directory** to `frontend`
4. Framework Preset: **Vite**
5. Add environment variable:
   - `VITE_API_URL` - Your backend URL (e.g., https://your-backend.vercel.app)
6. Deploy

### Via Vercel CLI:
```bash
cd frontend
vercel
```

Set environment variables in Vercel dashboard after deployment.

## Environment Variables

- `VITE_API_URL` - Backend API URL

## Tech Stack

- React 18
- TypeScript
- Vite
- Socket.IO Client
- Tailwind CSS
- WebRTC
- HLS.js (video streaming)
- WebTorrent (torrent streaming)
