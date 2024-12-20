// Import necessary modules
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Create an Express app
const app = express();

// Serve static files from the "public" folder
app.use(express.static("public"));

// Create an HTTP server using Express
const server = http.createServer(app);

// Initialize Socket.IO with the HTTP server
const io = socketIo(server, {
    cors: {
        origin: "*", // Allows connections from any origin for testing purposes
        methods: ["GET", "POST"], // Allowed HTTP methods
    },
});

const users = {}; // Object to store users by their socket IDs

// Handle new client connections
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

// Set the port dynamically for Render (or fallback to 8000 if not in production)
const port = process.env.PORT || 8000;

// Start the server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
