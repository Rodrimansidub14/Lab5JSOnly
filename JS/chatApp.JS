function initChat() {
    const chatContainer = document.createElement("div");
    chatContainer.id = 'chatContainer';
    chatContainer.style.width = '95%%';
    chatContainer.style.height = '80vh';
    chatContainer.style.margin = '15px';
    chatContainer.style.overflowY = 'auto';
    chatContainer.style.borderRadius = '5px';
    chatContainer.style.border = '1px solid #DAD6D6';
    chatContainer.style.fontFamily = 'Arial';
    chatContainer.style.padding = '10px';
    chatContainer.style.backgroundColor = '#f9f9f9';
    document.body.appendChild(chatContainer);

   

    const input = document.createElement("input");
    input.type = 'text';
    input.id = 'messageInput';
    input.style.flexGrow = '1'; 
    input.maxLength = 140;
    input.style.border = '2px solid #DAD6D6';
    input.style.borderRadius = '15px';
    input.style.fontFamily = 'Arial';
    input.style.padding = '15px';
    input.style.marginRight = '10px'; 

    // Send Button
    const sendButton = document.createElement("button");
    sendButton.textContent = 'Send';
    sendButton.id = 'sendButton';
    sendButton.style.padding = '15px 20px';
    sendButton.style.fontFamily = 'Arial';
    sendButton.style.cursor = 'pointer';
    sendButton.style.borderRadius = '15px';
    sendButton.style.border = 'none';
    sendButton.style.backgroundColor = '#4CAF50';
    sendButton.style.color = 'white';

    // Flex Container for Input and Button
    const flexContainer = document.createElement("div");
    flexContainer.style.display = 'flex';
    flexContainer.style.justifyContent = 'space-around';
    flexContainer.style.alignItems = 'center';
    flexContainer.style.position = 'fixed';
    flexContainer.style.bottom = '0';
    flexContainer.style.left = '140px';
    flexContainer.style.width = '80%';
    flexContainer.style.padding = '15px';
    flexContainer.style.boxSizing = 'border-box';

    // Append Input and Button to Flex Container
    flexContainer.appendChild(input);
    flexContainer.appendChild(sendButton);

    // Append Flex Container to Body
    document.body.appendChild(flexContainer);

    const errorContainer = document.createElement("div");
    errorContainer.id = 'errorContainer';
    errorContainer.style.color = 'red';
    errorContainer.style.position = 'fixed';
    errorContainer.style.fontFamily = 'Arial';
    errorContainer.style.bottom = '70px'; // Ajusta esto según necesites
    errorContainer.style.left = '0';
    errorContainer.style.right = '0';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.fontStyle=
    document.body.appendChild(errorContainer);

    
    input.addEventListener('keypress', function (e) {
        if (e.key == 'Enter') {
            send(input.value);
            input.value = ''
        }
    });
    sendButton.addEventListener('click', function() {
        enviarMensaje(input.value); // Use the correct function name here
        input.value = '';
    });
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && messageInput.value.trim() !== '') {
            sendMessage(messageInput.value);
            messageInput.value = ''; 
        }
    });


    document.addEventListener('DOMContentLoaded', initChat);

}
function applyResponsiveStyles() {
    const chatContainer = document.getElementById('chatContainer');
    const flexContainer = document.getElementById('flexContainer');
    const sendButton = document.getElementById('sendButton');

    // Obtener el ancho del viewport
    const viewportWidth = window.innerWidth;

    // Aplicar estilos dependiendo del ancho del viewport
    if (viewportWidth <= 600) {
        // Estilos para dispositivos móviles
        chatContainer.style.height = '75vh';
        sendButton.style.padding = '10px';
        // ... otros estilos para móviles ...
    } else {
        // Estilos para tabletas y escritorios
        flexContainer.style.width = '80%';
        flexContainer.style.marginLeft = 'auto';
        flexContainer.style.marginRight = 'auto';
        // ... otros estilos para tabletas y escritorio ...
    }
}
window.addEventListener('DOMContentLoaded', applyResponsiveStyles);
window.addEventListener('resize', applyResponsiveStyles);
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = mensaje; 
    
    setTimeout(() => errorContainer.textContent = '', 10000); 
}
function send(mensaje) {
    const username ='Rodri';
    console.log("Enviar: ", mensaje);
    enviarMensaje(username, mensaje);
    mostrarMensajeEnPantalla({ username: 'You', message: message });
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

function mostrarMensajeEnPantalla({username, message}) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${username}: ${message}`;
    messageDiv.style.padding = '5px';
    messageDiv.style.borderBottom = '1px solid #ddd';
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

document.addEventListener('DOMContentLoaded', initChat);