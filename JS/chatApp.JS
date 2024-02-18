function initChat(){
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
    input.style.bottom = '0';
    document.body.appendChild(input);


    input.addEventListener('keypress',function(e){
        if (e.key == 'Enter'){
            send(input.value);
            input.value =''
    }
    });
}

function send(mensaje) {
    console.log("Enviar: ", mensaje);
}

document.addEventListener('DOMContentLoaded',initChat);