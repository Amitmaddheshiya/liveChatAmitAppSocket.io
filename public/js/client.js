const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const usernameContainer = document.getElementById('username-container');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');
let audio = new Audio('ting.wav');

// Append message to container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);

    const [name, ...msgParts] = message.split(':');
    const senderName = name.trim();
    const msgContent = msgParts.join(':').trim();

    const boldNameElement = document.createElement('strong');
    boldNameElement.textContent = `${senderName}: `;
    const messageTextNode = document.createTextNode(msgContent);

    messageElement.appendChild(boldNameElement);
    messageElement.appendChild(messageTextNode);
    messageContainer.appendChild(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Handle message submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message); // Send to server
    messageInput.value = '';
});

// Handle username form submission
const handleUsernameSubmit = (e) => {
    e.preventDefault(); // Prevent default form action

    // Debugging Log
    console.log("Submit button clicked");

    const username = usernameInput.value.trim(); // Fixed: Correct trim() usage
    if (username) {
        console.log("Username:", username);

        // Hide the username container
        usernameContainer.style.display = 'none';

        // Force reflow to ensure DOM updates
        usernameContainer.offsetHeight; // Trigger reflow

        // Notify server about new user
        socket.emit('new-user-joined', username);
    } else {
        alert("Please enter a valid name");
    }
};

// Bind both click and touchstart events
usernameSubmit.addEventListener('click', handleUsernameSubmit);
usernameSubmit.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent duplicate triggers
    handleUsernameSubmit(e);
});

// Listen for server events
socket.on('user-joined', (name) => append(`${name} joined the chat`, 'right'));
socket.on('receive', (data) => append(`${data.name}: ${data.message}`, 'left'));
socket.on('user-left', (name) => append(`${name} left the chat`, 'right'));
