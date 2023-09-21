// script.js
const openChatButton = document.getElementById('open-chat');
const chatPopup = document.getElementById('chat-popup');
const closeChatButton = document.getElementById('close-chat');

openChatButton.addEventListener('click', () => {
    chatPopup.style.display = 'block';
});

closeChatButton.addEventListener('click', () => {
    chatPopup.style.display = 'none';
});
