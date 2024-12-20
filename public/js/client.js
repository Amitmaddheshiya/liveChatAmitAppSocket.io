const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
let audio = new Audio('ting.wav');

// Modal elements
const modal = document.getElementById('modal');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');

// Show modal for name input
modal.style.display = "block"; // Ensure modal is shown when page loads

// Hide modal and emit username to server
usernameSubmit.addEventListener('click', (event) => {
    event.preventDefault();  // Prevent default form submit action

    const username = usernameInput.value.trim();
    if (username) {
        // Emit the username to the server
        socket.emit('new-user-joined', username);
        modal.style.display = "none"; // Hide modal after submitting
    } else {
        alert("Please enter your name!");
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page
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

// Listen for events
socket.on('user-joined', (name) => append(`${name} joined the chat`, 'right'));
socket.on('receive', (data) => append(`${data.name}: ${data.message}`, 'left'));
socket.on('user-left', (name) => append(`${name} left the chat`, 'right'));
