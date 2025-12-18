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
