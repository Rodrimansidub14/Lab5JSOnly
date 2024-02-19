function initChat() {
    const chatContainer = document.createElement("div");
    chatContainer.id = 'container';
    chatContainer.style.width = '100%';
    chatContainer.style.height = '100%';
    chatContainer.style.overflowY = 'auto';
    document.body.appendChild(chatContainer);



    const input = document.createElement("input");
    input.type = 'text';
    input.id = 'input';
    input.style.position = 'fixed';
    input.style.width = '100%';
    input.maxLength = 140;
    input.style.bottom = '0';
    document.body.appendChild(input);


    input.addEventListener('keypress', function (e) {
        if (e.key == 'Enter') {
            send(input.value);
            input.value = ''
        }
    });
}

function send(mensaje) {
    const username ='User';
    console.log("Enviar: ", mensaje);
    enviarMensaje(username, mensaje);
}

document.addEventListener('DOMContentLoaded', initChat);

function recibirMensaje() {
    fetch('https://chat.arpanetos.lol/messages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(messages => {
          // Assuming 'messages' is an array of message objects
          const chatContainer = document.getElementById('container');
          chatContainer.innerHTML = ''; // Clear previous messages

          messages.forEach((msg) => {
              const messageDiv = document.createElement('div');
              messageDiv.textContent = `${msg.username}: ${msg.message}`;
              chatContainer.appendChild(messageDiv);
          });

          // Scroll to the bottom of the chat container to show the latest messages
          chatContainer.scrollTop = chatContainer.scrollHeight;
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
}


recibirMensaje();

setInterval(recibirMensaje, 5000);

function enviarMensaje(username, mensaje) {
    fetch('https://chat.arpanetos.lol/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, mensaje })
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Network response was not ok: ' + respuesta.statusText);
        }
        return respuesta.json();
    })
    .then(data => {
        console.log('Mensaje enviado:', data);
        mostrarMensaje(username, mensaje); // Mostrar mensaje en la interfaz de usuario
    })
    .catch(error => {
        console.error('Error al enviar el mensaje:', error);
    });
}

function mostrarMensaje(username, mensaje) {
    const chatContainer = document.getElementById('container');
    const messageSDiv = document.createElement('div');
    messageSDiv.textContent = `${username}: ${mensaje}`;
    chatContainer.appendChild(messageSDiv);

    // Desplazar el contenedor de chat para mostrar el último mensaje
    chatContainer.scrollTop = chatContainer.scrollHeight;
}