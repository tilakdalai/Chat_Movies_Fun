import { v4 as uuidv4 } from 'uuid';
class RoomManager {
    constructor() {
        this.rooms = new Map();
        this.userToRoom = new Map();
        this.ROOM_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
        // Check for expired rooms every minute
        setInterval(() => this.cleanupExpiredRooms(), 60000);
    }
    generateRoomCode() {
        let code;
        do {
            code = Math.floor(1000 + Math.random() * 9000).toString();
        } while (this.rooms.has(code));
        return code;
    }
    createRoom(visibility = 'private') {
        const code = this.generateRoomCode();
        const room = {
            code,
            visibility,
            users: new Map(),
            messages: [],
            youtubeQueue: [],
            currentTrackIndex: 0,
            uploadedMovies: [],
            movieUrl: '',
            movieState: {
                isPlaying: false,
                currentTime: 0,
                lastUpdated: Date.now()
            },
            currentGame: null,
            gameState: null,
            createdAt: Date.now(),
            lastActivity: Date.now()
        };
        this.rooms.set(code, room);
        return code;
    }
    ensureAdmin(room) {
        const hasAdmin = Array.from(room.users.values()).some(u => u.isAdmin);
        if (!hasAdmin) {
            const first = room.users.values().next().value;
            if (first) {
                first.isAdmin = true;
                room.users.set(first.id, first);
            }
        }
    }
    joinRoom(code, userId, displayName, socketId) {
        const room = this.rooms.get(code);
        if (!room)
            return null;
        const isFirstUser = room.users.size === 0;
        const user = { id: userId, displayName, socketId, isAdmin: isFirstUser };
        room.users.set(userId, user);
        room.lastActivity = Date.now();
        this.userToRoom.set(userId, code);
        return room;
    }
    leaveRoom(userId) {
        const roomCode = this.userToRoom.get(userId);
        if (!roomCode)
            return null;
        const room = this.rooms.get(roomCode);
        if (!room)
            return null;
        room.users.delete(userId);
        this.userToRoom.delete(userId);
        room.lastActivity = Date.now();
        this.ensureAdmin(room);
        // Delete room if empty
        if (room.users.size === 0) {
            this.rooms.delete(roomCode);
            return null;
        }
        return { room, roomCode };
    }
    getRoom(code) {
        return this.rooms.get(code);
    }
    getRoomByUserId(userId) {
        const code = this.userToRoom.get(userId);
        if (!code)
            return null;
        const room = this.rooms.get(code);
        if (!room)
            return null;
        return { room, code };
    }
    updateUserSocket(userId, socketId) {
        const roomData = this.getRoomByUserId(userId);
        if (!roomData)
            return;
        const user = roomData.room.users.get(userId);
        if (user) {
            user.socketId = socketId;
            roomData.room.lastActivity = Date.now();
        }
    }
    kickUser(adminId, targetUserId) {
        const roomData = this.getRoomByUserId(adminId);
        if (!roomData)
            return { success: false };
        const { room, code } = roomData;
        const admin = room.users.get(adminId);
        const target = room.users.get(targetUserId);
        if (!admin || !target)
            return { success: false };
        if (!admin.isAdmin)
            return { success: false };
        if (target.isAdmin)
            return { success: false };
        room.users.delete(targetUserId);
        this.userToRoom.delete(targetUserId);
        room.lastActivity = Date.now();
        this.ensureAdmin(room);
        return { success: true, room, roomCode: code, targetSocketId: target.socketId };
    }
    addUploadedMovie(roomCode, userId, url, name) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return null;
        const user = room.users.get(userId);
        if (!user)
            return null;
        const movie = {
            id: uuidv4(),
            url,
            name,
            uploadedBy: userId,
            uploadedByName: user.displayName,
            timestamp: Date.now()
        };
        room.uploadedMovies.push(movie);
        room.lastActivity = Date.now();
        return movie;
    }
    removeUploadedMovie(roomCode, movieId) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return { success: false };
        const movieIndex = room.uploadedMovies.findIndex(m => m.id === movieId);
        if (movieIndex === -1)
            return { success: false };
        const movie = room.uploadedMovies[movieIndex];
        room.uploadedMovies.splice(movieIndex, 1);
        room.lastActivity = Date.now();
        return { success: true, movieUrl: movie.url };
    }
    setCurrentTrackIndex(roomCode, index) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return false;
        if (index < 0 || index >= room.youtubeQueue.length) {
            return false;
        }
        room.currentTrackIndex = index;
        room.lastActivity = Date.now();
        return true;
    }
    addMessage(roomCode, userId, content) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return null;
        const user = room.users.get(userId);
        if (!user)
            return null;
        const message = {
            id: uuidv4(),
            userId,
            displayName: user.displayName,
            content,
            timestamp: Date.now()
        };
        room.messages.push(message);
        room.lastActivity = Date.now();
        return message;
    }
    addToYouTubeQueue(roomCode, userId, videoId, title, index) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return null;
        const user = room.users.get(userId);
        if (!user)
            return null;
        const item = {
            id: uuidv4(),
            videoId,
            title,
            addedBy: userId,
            addedByName: user.displayName
        };
        const wasEmpty = room.youtubeQueue.length === 0;
        const currentIndex = room.currentTrackIndex;
        const insertIndex = typeof index === 'number' && index >= 0 && index <= room.youtubeQueue.length
            ? index
            : room.youtubeQueue.length;
        room.youtubeQueue.splice(insertIndex, 0, item);
        if (wasEmpty) {
            room.currentTrackIndex = 0;
        }
        else if (insertIndex <= currentIndex) {
            room.currentTrackIndex = currentIndex + 1;
        }
        room.lastActivity = Date.now();
        return item;
    }
    setRoomVisibility(roomCode, visibility) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return false;
        room.visibility = visibility;
        room.lastActivity = Date.now();
        return true;
    }
    getPublicRoomsSummary() {
        return Array.from(this.rooms.values())
            .filter(room => room.visibility === 'public' && room.users.size > 0)
            .map(room => {
            const admin = Array.from(room.users.values()).find(user => user.isAdmin);
            return {
                code: room.code,
                occupants: room.users.size,
                host: admin?.displayName || null,
                createdAt: room.createdAt,
                lastActivity: room.lastActivity
            };
        })
            .sort((a, b) => {
            if (b.occupants !== a.occupants) {
                return b.occupants - a.occupants;
            }
            return b.lastActivity - a.lastActivity;
        });
    }
    removeFromYouTubeQueue(roomCode, itemId) {
        const room = this.rooms.get(roomCode);
        if (!room)
            return false;
        const index = room.youtubeQueue.findIndex(item => item.id === itemId);
        if (index === -1)
            return false;
        room.youtubeQueue.splice(index, 1);
        const newLength = room.youtubeQueue.length;
        if (newLength === 0) {
            room.currentTrackIndex = 0;
        }
        else if (index < room.currentTrackIndex) {
            room.currentTrackIndex -= 1;
        }
        else if (index === room.currentTrackIndex) {
            room.currentTrackIndex = Math.min(room.currentTrackIndex, newLength - 1);
        }
        else if (room.currentTrackIndex >= newLength) {
            room.currentTrackIndex = newLength - 1;
        }
        room.lastActivity = Date.now();
        return true;
    }
    cleanupExpiredRooms() {
        const now = Date.now();
        for (const [code, room] of this.rooms.entries()) {
            if (now - room.lastActivity > this.ROOM_EXPIRY_TIME) {
                // Remove all users from userToRoom map
                for (const userId of room.users.keys()) {
                    this.userToRoom.delete(userId);
                }
                this.rooms.delete(code);
                console.log(`Room ${code} expired and removed`);
            }
        }
    }
    getRoomStats() {
        return {
            totalRooms: this.rooms.size,
            totalUsers: this.userToRoom.size
        };
    }
}
export const roomManager = new RoomManager();
