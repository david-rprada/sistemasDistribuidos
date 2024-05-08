// Pedir el nombre del usuario
var nombre = prompt("Introduzca su nombre:");
document.getElementById("titulo").innerHTML = nombre;

// Crear conexión WS con el servidor
var conexion = new WebSocket("ws://localhost:4444", "saludos"); //decide conectarse con un servidor websocket y el servidor que escucja la acepta porque viene con un id "saludar"

// Evento de conexión abierta
conexion.addEventListener("open", function () { 
    console.log("Cliente conectado!!!");
});

// Evento de conexión cerrada
conexion.addEventListener("close", function () {
    console.log("Desconectado del servidor!!!");
});

// Evento de error
conexion.addEventListener("error", function () {
    console.log("Error con la conexión!!!");
});

// Evento de recepción de mesnsaje
conexion.addEventListener("message", function (event) {
    console.log("Mensaje del servidor:", event.data);
    var msg = JSON.parse(event.data);
    switch (msg.operacion) {
        case "saludar":
            document.getElementById("saludos").innerHTML += "<li>Saludos de parte de " + msg.origen + "</li>";
            break;

        case "limpiar":
            document.getElementById("saludos").innerHTML = "";
            break;
    }
});

function saludar() {
    conexion.send(JSON.stringify({
        operacion: "saludar",
        origen: nombre,
        texto: "Saludos de parte de ",
        fecha: new Date().getTime(),
        idME: document.getElementById


    }));
}

function limpiar() {
    conexion.send(JSON.stringify({
        operacion: "limpiar"
    }));
}