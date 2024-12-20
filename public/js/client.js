const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const usernameForm = document.getElementById('username-container'); // Use the entire form for submission
const usernameInput = document.getElementById('username-input');
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
usernameForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form action

    const username = usernameInput.value.trim();
    if (username) {
        // Hide the username container
        usernameForm.style.display = 'none';

        // Notify server about new user
        socket.emit('new-user-joined', username);
    } else {
        alert("Please enter a valid name");
    }
});

// Listen for server events
socket.on('user-joined', (name) => append(`${name} joined the chat`, 'right'));
socket.on('receive', (data) => append(`${data.name}: ${data.message}`, 'left'));
socket.on('user-left', (name) => append(`${name} left the chat`, 'right'));
