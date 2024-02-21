function initChat() {
    const chatContainer = document.createElement("div");
    chatContainer.id = 'chatContainer';
    chatContainer.style.width = '150vh';
    chatContainer.style.height = '80vh';
    chatContainer.style.boxShadow = '0 10px 8px rgba(0, 0, 0, 0.1)';
    chatContainer.style.margin = '5px';
    chatContainer.style.marginLeft = '25vh';
    chatContainer.style.overflowY = 'auto';
    chatContainer.style.borderRadius = '5px';
    chatContainer.style.border = '1px solid #e0e0e0';
    chatContainer.style.fontFamily = ' Arial, sans-serif';
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
        this.style.backgroundColor = '#66bb6a'; 
    });
    sendButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#4CAF50'; 
    });

    
    const flexContainer = document.createElement("div");
    flexContainer.style.display = 'flex';
    flexContainer.style.position = 'fixed';
    flexContainer.style.bottom = '0';
    flexContainer.style.left = '5%';
    flexContainer.style.right = '5%';
    flexContainer.style.padding = '20px';
    flexContainer.style.boxSizing = 'border-box';
    flexContainer.style.padding = '20px';
    flexContainer.style.boxSizing = 'border-box'; 

    
    flexContainer.appendChild(input);
    flexContainer.appendChild(sendButton);

    
    document.body.appendChild(flexContainer);

    const errorContainer = document.createElement("div");
    errorContainer.id = 'errorContainer';
    errorContainer.style.color = 'red';
    errorContainer.style.position = 'fixed';
    errorContainer.style.fontFamily = 'Arial';
    errorContainer.style.bottom = '70px'; 
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
        this.style.backgroundColor = '#357a38'; 
    });
    sendButton.addEventListener('mouseup', function() {
        this.style.backgroundColor = '#4CAF50';
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
        }, 10000); 
    }
    startMessageRefresh();

    const themeToggle = document.createElement("label");
    themeToggle.innerHTML = `
        <input type="checkbox" id="theme-toggle">
        <span>Modo oscuro</span>
    `;
    document.body.insertBefore(themeToggle, chatContainer);

    
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
    mostrarMensajeEnPantalla({ username: 'You', message: mensaje }); 
}

document.addEventListener('DOMContentLoaded', initChat);

let lastMessageId = 0; 

async function recibirMensaje() {
    try {
        const response = await fetch('https://chat.arpanetos.lol/messages');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const messages = await response.json();
        const chatContainer = document.getElementById('chatContainer');
        
        

        let isAtBottom = chatContainer.scrollTop + chatContainer.clientHeight === chatContainer.scrollHeight;

        messages.forEach((msg) => {
           
            if (msg.id > lastMessageId) {
                mostrarMensajeEnPantalla(msg);
                lastMessageId = msg.id; 
            }
        });

        
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
            body: JSON.stringify({ username, message: mensaje }) 
        });

        if (!response.ok) {
            console.log('Response not OK:', response);
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        
        const messageData = await response.json();
        console.log('Mensaje enviado y recibido del servidor:', messageData);
        

        if (messageData && messageData.id) {
            mostrarMensajeEnPantalla({
                username: username, 
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

    
     
     messageDiv.style.padding = '10px 10px';
     messageDiv.style.borderRadius = '15px';
     messageDiv.style.margin = '15px';
     messageDiv.style.display = 'flex';
     messageDiv.style.flexDirection = 'column';
     messageDiv.style.maxWidth = '15%';
 
    
     if (username === 'You') {
         messageDiv.className = 'message-you';
         messageDiv.style.backgroundColor = '#4CAF50'; 
         messageDiv.style.color = 'white'; 
         messageDiv.style.alignSelf = 'flex-end';
         messageDiv.style.marginLeft = 'auto'; 
     } 
     
     else {
         messageDiv.className = 'message-other';
         messageDiv.style.backgroundColor = '#f0f0f0'; 
         messageDiv.style.color = 'black'; 
         messageDiv.style.alignSelf = 'flex-start'; 
     }
     
     const textContent = document.createElement('span');
     textContent.textContent = message;
     messageDiv.appendChild(textContent);



    messageDiv.textContent = `${username}: `; 
    
    
    const urlRegex = /(https?:\/\/\S*\.(jpg|jpeg|png|gif))/g;
    let displayText = message; 

    
    const urls = message.match(urlRegex);
    if (urls && urls.length > 0) {
        
        displayText = displayText.replace(urlRegex, '');
        
 
        urls.forEach(url => {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100px';
            img.onload = () => {
                chatContainer.scrollTop = chatContainer.scrollHeight;
            };
            messageDiv.appendChild(img); 
        });
    }
    
   
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

   
    body.style.backgroundColor = isDark ? '#121212' : '#FFF';
    body.style.color = isDark ? '#E0E0E0' : '#333';

 
    chatContainer.style.backgroundColor = isDark ? '#1E1E1E' : '#FFF';
    chatContainer.style.color = isDark ? '#E0E0E0' : '#333';

   
    input.style.backgroundColor = isDark ? '#333' : '#FFF';
    input.style.color = isDark ? '#E0E0E0' : '#333';
    input.style.borderColor = isDark ? '#666' : '#CCC';

    
    sendButton.style.backgroundColor = isDark ? '#4CAF50' : '#F0F0F0';
    sendButton.style.color = isDark ? '#E0E0E0' : '#333';
    sendButton.style.borderColor = isDark ? '#4CAF50' : '#CCC';

    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}
