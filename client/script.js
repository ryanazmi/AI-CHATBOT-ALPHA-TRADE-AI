const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');



form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  appendMessage('bot', 'Typing...');

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        conversation: [
          { role: 'user', text: userMessage }
        ]
      })
    });

    const data = await response.json();

    removeLastBotMessage();
    if (data.reply) {
      appendMessage('bot', data.reply);
    } else if (data.error) {
      appendMessage('bot', 'Error: ' + data.error);
    } else {
      appendMessage('bot', 'Tidak ada respon dari server');
    }

  } catch (error) {
    removeLastBotMessage();
    appendMessage('bot', 'Terjadi error saat menghubungi server.');
    console.error(error);
  }
});



function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeLastBotMessage() {
  const messages = document.querySelectorAll('.message.bot');
  if (messages.length > 0) {
    messages[messages.length - 1].remove();
  }
}