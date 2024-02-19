function initChat() {
    const chatContainer = document.createElement("div");
    chatContainer.id = 'containerChat';
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

    const errorContainer = document.createElement("div");
    errorContainer.id = 'errorContainer';
    errorContainer.style.color = 'red';
    errorContainer.style.position = 'fixed';
    errorContainer.style.bottom = '30px'; // Ajusta esto según necesites
    errorContainer.style.left = '0';
    errorContainer.style.right = '0';
    errorContainer.style.textAlign = 'center';
    document.body.appendChild(errorContainer);

    input.addEventListener('keypress', function (e) {
        if (e.key == 'Enter') {
            send(input.value);
            input.value = ''
        }
    });
}
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = mensaje; 
    
    setTimeout(() => errorContainer.textContent = '', 10000); 
}
function send(mensaje) {
    const username ='User';
    console.log("Enviar: ", mensaje);
    enviarMensaje(username, mensaje);
}

document.addEventListener('DOMContentLoaded', initChat);

async function recibirMensaje() {
    try {
        const response = await fetch('https://chat.arpanetos.lol/messages');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const messages = await response.json();

        const chatContainer = document.getElementById('containerChat');
        chatContainer.innerHTML = ''; // Clear previous messages

        messages.forEach((msg) => {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${msg.username}: ${msg.message}`;
            chatContainer.appendChild(messageDiv);
        });

        chatContainer.scrollTop = chat
    } catch (error) {
        console.error('Error fetching messages:', error);
        mostrarError('Error fetching messages: ' + error.message);
    }
}

recibirMensaje();

async function enviarMensaje(username, mensaje) {
    try {
        const response = await fetch('https://chat.arpanetos.lol/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, message: mensaje }) // Asegúrate de que las claves coincidan con lo que espera el servidor
        });

        if (!response.ok) {
            console.log('Response not OK:', response);
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        
        const messageData = await response.json();
        console.log('Mensaje enviado y recibido del servidor:', messageData);
        
        // Si el servidor responde con el mensaje en el formato esperado, actualiza la UI
        if (messageData && messageData.id) {
            mostrarMensajeEnPantalla(messageData);
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        mostrarError('Error al enviar el mensaje: ' + error.message);
    }
}

function mostrarMensajeEnPantalla(mensaje) {
    const chatContainer = document.getElementById('containerChat');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${mensaje.username}: ${mensaje.message}`;
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}
