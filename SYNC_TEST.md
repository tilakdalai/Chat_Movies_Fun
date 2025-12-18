# Movie Synchronization - Testing Guide

## What Was Fixed

✅ **Movies now play at the same time and same point across all members!**

### Key Improvements:
1. **Backend broadcasts to ALL members** - Everyone gets state updates immediately
2. **New joiners sync automatically** - Request current state when joining ongoing playback
3. **Better time sync** - Reduced threshold from 0.5s to 0.3s for tighter synchronization
4. **Immediate play/pause** - No delay when someone plays or pauses
5. **Accurate seeking** - Forward/backward jumps sync instantly across all members
6. **Console logging** - See exactly what's happening (▶️ PLAY, ⏸️ PAUSE, ⏩ SEEK)

## How to Test

### Quick Test (2 Browser Tabs):

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open two browser tabs:**
   - Tab 1: `http://192.168.1.47:5173` (or localhost:5173)
   - Tab 2: `http://192.168.1.47:5173` (or localhost:5173)

3. **Create a room in Tab 1:**
   - Enter a username
   - Click "Create Room"
   - Copy the room code

4. **Join from Tab 2:**
   - Enter a different username
   - Paste the room code
   - Click "Join Room"

5. **Set a video URL (in either tab):**
   - Use a direct video file URL ending in `.mp4`, `.webm`, or `.ogg`
   - Example test URLs:
     - `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`
     - `https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4`
   - Paste URL and click "Set Movie URL"

6. **Test Synchronization:**
   - ▶️ **Play in Tab 1** → Should immediately play in Tab 2
   - ⏸️ **Pause in Tab 2** → Should immediately pause in Tab 1
   - ⏩ **Seek forward in Tab 1** → Tab 2 jumps to same position
   - ⏪ **Seek backward in Tab 2** → Tab 1 jumps to same position
   - Open console (F12) to see sync logs

### Advanced Test (Mid-Playback Join):

1. **Start playback in Tab 1:**
   - Set a video URL
   - Play the video
   - Let it play for 10-20 seconds

2. **Open Tab 3 and join:**
   - Join the same room from a new tab
   - Video should automatically seek to the current position
   - Should be playing (if Tab 1 is playing)

3. **Verify sync:**
   - Check that all 3 tabs are at approximately the same time position
   - All should be in same state (playing/paused)

## Console Logs to Watch For

Open browser console (F12) to see these logs:

```
▶️ Local PLAY - broadcasting to room
Received movie state: { isPlaying: true, currentTime: 5.23, ... }
▶️ Remote PLAY detected - starting playback

⏸️ Local PAUSE - broadcasting to room  
Received movie state: { isPlaying: false, currentTime: 10.45, ... }
⏸️ Remote PAUSE detected - pausing playback

⏩ Local SEEK to 15.67 - broadcasting to room
Received movie state: { currentTime: 15.67, ... }
⏩ Syncing time: local=10.45s → remote=15.67s (diff: 5.22s)
```

## Important Notes

### ✅ Works With:
- Direct video files (`.mp4`, `.webm`, `.ogg`)
- Videos with CORS enabled
- All modern browsers (Chrome, Firefox, Edge, Safari)

### ⚠️ Limitations:
- **YouTube videos**: Cannot sync (iframe API limitations)
- **Google Drive videos**: Cannot sync (iframe restrictions)
- **DRM-protected videos**: May not work
- **Auto-play**: May be blocked by browser - user must click play first

## Troubleshooting

### Videos not syncing?

1. **Check console for errors** - Open F12 Developer Tools
2. **Verify it's a direct video file** - Not YouTube/Drive embed
3. **Check network connection** - Both devices on same network
4. **Restart dev server** - Ctrl+C then `npm run dev`
5. **Clear browser cache** - Hard refresh with Ctrl+Shift+R

### Time drift after a while?

- Auto-correction kicks in when difference > 0.3 seconds
- Look for "Syncing time" logs in console
- This is normal for network latency

### Play button not working in one tab?

- Browser auto-play policy - user must interact first
- Click the video once to allow playback
- Then sync will work automatically

## Testing on Mobile

1. **Find your network IP:**
   ```bash
   ip addr show | grep "inet " | grep -v "127.0.0.1"
   ```

2. **Access from mobile browser:**
   - Use IP from above (e.g., `http://192.168.1.47:5173`)
   - Join same room as desktop
   - Test play/pause/seek

3. **Expected behavior:**
   - Mobile and desktop stay in perfect sync
   - Seeking on mobile syncs to desktop and vice versa

## Success Criteria

✅ Play in one tab → All tabs play simultaneously  
✅ Pause in one tab → All tabs pause simultaneously  
✅ Seek in one tab → All tabs jump to same position  
✅ New member joins → Syncs to current playback state  
✅ Console shows sync logs with ▶️ ⏸️ ⏩ indicators  
✅ Time drift < 0.3 seconds across all members

---

**Built:** December 18, 2025  
**Status:** ✅ Ready for testing
