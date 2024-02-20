function initChat() {
    const chatContainer = document.createElement("div");
    chatContainer.id = 'chatContainer';
    chatContainer.style.width = '95%';
    chatContainer.style.height = '80vh';
    chatContainer.style.boxShadow = '0 10px 8px rgba(0, 0, 0, 0.1)';
    chatContainer.style.margin = '5px';
    chatContainer.style.overflowY = 'auto';
    chatContainer.style.borderRadius = '5px';
    chatContainer.style.border = '1px solid #e0e0e0';
    chatContainer.style.fontFamily = 'Roboto, Arial, sans-serif';
    chatContainer.style.padding = '10px';
    chatContainer.style.backgroundColor = '#fff';
    document.body.appendChild(chatContainer);

    
    const input = document.createElement("input");
    input.type = 'text';
    input.id = 'messageInput';
    input.style.flexGrow = '1'; 
    input.maxLength = 140;
    input.style.border = '1px solid #ECE9E9';
    input.style.borderRadius = '15px';
    input.style.fontFamily = 'Arial';
    input.style.padding = '15px';
    input.style.marginRight = '10px'; 

    // Send Button
    const sendButton = document.createElement("button");
    sendButton.textContent = 'Send';
    sendButton.id = 'sendButton';
    sendButton.style.padding = '10px 20px';
    sendButton.style.fontFamily = 'Arial';
    sendButton.style.cursor = 'pointer';
    sendButton.style.borderRadius = '5px';
    sendButton.style.border = 'none';
    sendButton.style.backgroundColor = '#4CAF50';
    sendButton.style.color = 'white';
    sendButton.style.transition = 'background-color 0.3s';
    sendButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#66bb6a'; // Color más claro al pasar el cursor
    });
    sendButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4CAF50'; // Color original al retirar el cursor
    });

    // Flex Container for Input and Button
    const flexContainer = document.createElement("div");
    flexContainer.style.display = 'flex';
    flexContainer.style.position = 'fixed';
    flexContainer.style.bottom = '0';
    flexContainer.style.left = '5%';
    flexContainer.style.right = '5%';
    flexContainer.style.padding = '20px';
    flexContainer.style.boxSizing = 'border-box';
    flexContainer.style.padding = '20px';
    flexContainer.style.boxSizing = 'border-box'; // Include padding in width calculation

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
    errorContainer.style.fontStyle = 'normal';
    errorContainer.style.right = '0';
    errorContainer.style.textAlign = 'center';
    document.body.appendChild(errorContainer);

    
   
    sendButton.addEventListener('click', function() {
        send(input.value);
        input.value = '';
    });
    sendButton.addEventListener('mousedown', function() {
        this.style.backgroundColor = '#357a38'; // Color más oscuro al hacer clic
    });
    sendButton.addEventListener('mouseup', function() {
        this.style.backgroundColor = '#4CAF50'; // Vuelve al color original al soltar el clic
    });
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && messageInput.value.trim() !== '') {
            send(messageInput.value);
            messageInput.value = ''; 
        }
    });

    function startMessageRefresh() {
        setInterval(() => {
            recibirMensaje();
        }, 10000); // refresh every 5 seconds
    }
    startMessageRefresh();

    const themeToggle = document.createElement("label");
    themeToggle.innerHTML = `
        <input type="checkbox" id="theme-toggle">
        <span>Modo oscuro</span>
    `;
    document.body.insertBefore(themeToggle, chatContainer);

    // Evento para cambiar el tema al hacer clic en el interruptor
    const themeToggleInput = document.getElementById('theme-toggle');
    themeToggle.style.fontFamily = "Arial, sans-serif";
    themeToggleInput.addEventListener('change', function() {
        if (this.checked) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    });
     
    document.addEventListener('DOMContentLoaded', () => {
        // ... código previo
        const savedTheme = localStorage.getItem('theme') || 'light';
        const themeToggleInput = document.getElementById('theme-toggle');
        themeToggleInput.checked = savedTheme === 'dark';
        applyTheme(savedTheme);
    });
    
    

}
document.addEventListener('DOMContentLoaded', initChat);


function mostrarError(mensaje) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = mensaje; 
    
    setTimeout(() => errorContainer.textContent = '', 10000); 
}
function send(mensaje) {
    const username ='Rodri';
    console.log("Enviar: ", mensaje);
    enviarMensaje(username, mensaje);
    mostrarMensajeEnPantalla({ username: 'You', message: mensaje }); // Asegúrate de que esta es la manera correcta de llamar a mostrarMensajeEnPantalla
}

document.addEventListener('DOMContentLoaded', initChat);

let lastMessageId = 0; // Asume que los mensajes tienen un ID y están ordenados

async function recibirMensaje() {
    try {
        const response = await fetch('https://chat.arpanetos.lol/messages');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const messages = await response.json();
        const chatContainer = document.getElementById('chatContainer');
        
        // No borres los mensajes existentes: chatContainer.innerHTML = '';

        let isAtBottom = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;

        messages.forEach((msg) => {
            // Solo añade mensajes si son más nuevos que el último mensaje recibido
            if (msg.id > lastMessageId) {
                mostrarMensajeEnPantalla(msg);
                lastMessageId = msg.id; // Actualiza el ID del último mensaje
            }
        });

        // Si el usuario estaba al fondo del chat, mantiene el scroll al fondo
        if (isAtBottom) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        mostrarError('Error fetching messages: ' + error.message);
    }
}
recibirMensaje()

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
            mostrarMensajeEnPantalla({
                username: username, // o 'You' si quieres que muestre "Tú" en el chat
                message: mensaje
            });
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        mostrarError('Error al enviar el mensaje: ' + error.message);
    }
}

function mostrarMensajeEnPantalla({ username, message }) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    if (username === 'You') {
        messageDiv.className = 'message-you';
        messageDiv.style.textAlign = 'right'; // Alinea el texto a la izquierda
        messageDiv.style.backgroundColor = '#e0e0e0'; // Un color de fondo diferente para resaltar
    } else {
        messageDiv.className = 'message-other';
        messageDiv.style.textAlign = 'left'; // Alinea el texto a la derecha para otros usuarios
    }



    messageDiv.textContent = `${username}: `; // Set the username text content
    
    // Define the regex pattern to match image URLs
    const urlRegex = /(https?:\/\/\S*\.(jpg|jpeg|png|gif))/g;
    let displayText = message; // We'll use this to keep track of text to display

    // Use regex to find image URLs in the message
    const urls = message.match(urlRegex);
    if (urls && urls.length > 0) {
        // Replace the URLs with an empty string in the display text
        displayText = displayText.replace(urlRegex, '');
        
        // Create an image element for each URL found
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100px';
            img.onload = () => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            };
            messageDiv.appendChild(img); // Append the image to the message div
        });
    }
    
    // If there's any text left after removing URLs, add it to the message div
    if (displayText.trim()) {
        messageDiv.appendChild(document.createTextNode(displayText));
    }
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function applyTheme(theme) {
    const body = document.body;
    const chatContainer = document.getElementById('chatContainer');
    const input = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const isDark = theme === 'dark';

    // Establecer estilos para el cuerpo del documento
    body.style.backgroundColor = isDark ? '#121212' : '#FFF';
    body.style.color = isDark ? '#E0E0E0' : '#333';

    // Establecer estilos para el contenedor del chat
    chatContainer.style.backgroundColor = isDark ? '#1E1E1E' : '#FFF';
    chatContainer.style.color = isDark ? '#E0E0E0' : '#333';

    // Establecer estilos para la caja de texto
    input.style.backgroundColor = isDark ? '#333' : '#FFF';
    input.style.color = isDark ? '#E0E0E0' : '#333';
    input.style.borderColor = isDark ? '#666' : '#CCC';

    // Establecer estilos para el botón de enviar
    sendButton.style.backgroundColor = isDark ? '#4CAF50' : '#F0F0F0';
    sendButton.style.color = isDark ? '#E0E0E0' : '#333';
    sendButton.style.borderColor = isDark ? '#4CAF50' : '#CCC';

    // Guardar la selección del tema en localStorage
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}
