"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
const auth_1 = require("./auth");
let io;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
                    callback(null, true);
                }
                else {
                    callback(null, origin);
                }
            },
            credentials: true,
        },
    });
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.request.headers.cookie;
            if (!cookieHeader) {
                return next(new Error('Authentication error'));
            }
            const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
            const token = cookies['ev_auth']; // Use your AUTH_COOKIE constant value
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = await (0, auth_1.verifyJwt)(token);
            socket.data.user = decoded;
            next();
        }
        catch (err) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.user.id;
        console.log(`User connected to socket: ${userId}`);
        // Join a room specific to this user for private notifications
        socket.join(userId);
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${userId}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map