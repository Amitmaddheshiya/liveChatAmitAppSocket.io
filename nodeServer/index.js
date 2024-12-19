// Import and initialize Socket.IO server
const io = require("socket.io")(8000, {
    cors: {
        origin: "*", // Allows connections from any origin for testing purposes
        methods: ["GET", "POST"], // HTTP methods allowed
    },
});

const users = {}; // Object to store users by their socket IDs

io.on("connection", (socket) => {
    console.log("New connection established");

   // Handle new user joining
   socket.on("new-user-joined", (name) => {
    if (name) {
      
        users[socket.id] = name; // Map socket ID to user name
        socket.broadcast.emit("user-joined", name); // Notify all other users
    }
});

// Handle sending messages
socket.on("send", (message) => {
    const senderName = users[socket.id]; // Get the sender's name
    if (senderName) {
        socket.broadcast.emit("receive", { message: message, name: senderName });
    }
});

// Handle user disconnecting
socket.on("disconnect", () => {
    const name = users[socket.id];
    if (name) {
        socket.broadcast.emit("user-left", name); // Notify others that the user left
        delete users[socket.id]; // Remove the user from the users object
    }
});

});
