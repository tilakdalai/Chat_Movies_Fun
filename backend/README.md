# Playroom Backend

Node.js + Express + Socket.IO backend for real-time gaming and chat.

## Features
- Real-time communication with Socket.IO
- Room management
- Game servers (Chess, Uno, Ludo)
- YouTube queue & music streaming
- Movie synchronization
- WebRTC signaling for video/audio
- Torrent streaming support

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:3001`

## Build & Deploy

### Local Production
```bash
npm run build
npm start
```

### Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard:
   - `FRONTEND_URL` - Your frontend URL (e.g., https://your-app.vercel.app)

Or use Vercel dashboard:
1. Import the `backend/` folder
2. Configure environment variables
3. Deploy

## Environment Variables

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (comma-separated for multiple)

## API Endpoints

- `GET /health` - Health check
- `GET /api/streams?id=<movieId>` - Get streaming sources
- `GET /api/torrent-play?magnet=<magnetUrl>` - Stream torrent
- `POST /upload` - Upload movie files

## Socket.IO Events

See server documentation for complete event list.
