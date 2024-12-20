const socket = io("http://localhost:8000");

// DOM Elements
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");
const usernameForm = document.getElementById("username-form");
const usernameContainer = document.getElementById('username-container');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');

let audio = new Audio("ting.wav");

// Append message to container
const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", position);

    const [name, ...msgParts] = message.split(":");
    const senderName = name.trim();
    const msgContent = msgParts.join(":").trim();

    const boldNameElement = document.createElement("strong");
    boldNameElement.textContent = `${senderName}: `;
    const messageTextNode = document.createTextNode(msgContent);

    messageElement.appendChild(boldNameElement);
    messageElement.appendChild(messageTextNode);
    messageContainer.appendChild(messageElement);

    if (position === "left") {
        audio.play();
    }

    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to the latest message
};

// Handle message submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) {
        append(`You: ${message}`, "right");
        socket.emit("send", message);
        messageInput.value = "";
    }
});

// Ensure the script runs after the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {
    const usernameContainer = document.getElementById('username-container');
    const usernameInput = document.getElementById('username-input');
    const usernameSubmit = document.getElementById('username-submit');

    // Add click event listener to the Submit button
    usernameSubmit.addEventListener('click', () => {
        console.log('Submit button clicked'); // Debug log
        const username = usernameInput.value.trim();
        console.log('Entered username:', username); // Debug log

        if (username) {
            // Emit the username to the server
            console.log('Emitting username to the server...');
            socket.emit('new-user-joined', username);

            // Hide the username container
            usernameContainer.classList.add('hidden');
            console.log('Container hidden successfully'); // Debug log
        } else {
            alert('Please enter a valid name');
        }
    });
});


// Listen for server events
socket.on("user-joined", (name) => append(`${name} joined the chat`, "right"));
socket.on("receive", (data) => append(`${data.name}: ${data.message}`, "left"));
socket.on("user-left", (name) => append(`${name} left the chat`, "right"));
