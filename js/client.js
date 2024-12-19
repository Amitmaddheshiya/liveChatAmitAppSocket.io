const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
let audio = new Audio('ting.wav');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message); // Send message to the server
    messageInput.value = '';
});

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);

    // Parse message and sender
    const [name, ...msgParts] = message.split(':');
    const senderName = name.trim();
    const msgContent = msgParts.join(':').trim();

    // Create bold name and message
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

const username = prompt("Please enter your name");
socket.emit('new-user-joined', username); // Notify server about new user

// Listen for events
socket.on('user-joined', (name) => append(`${name} joined the chat`, 'right'));
socket.on('receive', (data) => append(`${data.name}: ${data.message}`, 'left'));
socket.on('user-left', (name) => append(`${name} left the chat`, 'right'));
