// Pedir el nombre del usuario
var nombre = prompt("Introduzca su nombre:");
document.getElementById("titulo").innerHTML = nombre;

// Crear conexión WS con el servidor
var conexion = new WebSocket("ws://localhost:4444", "saludos");

// Evento de conexión abierta
conexion.addEventListener("open", function () {
    console.log("Cliente conectado!!!");
    conexion.send(JSON.stringify({
        operacion: "identificarse",
        nombre: nombre
    }));
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
        case "identificarse":
            document.getElementById("clientes").innerHTML += "<li>" + msg.nombre + " <button onclick='saludoIndividual(\""+msg.nombre+"\")'>Saludar</button></li>";
            break;
        case "saludar":
            document.getElementById("saludos").innerHTML += "<li>Saludos GENERALES de parte de " + msg.origen + "</li>";
            break;

        case "saludoIndividual":
            document.getElementById("saludos").innerHTML += "<li>Saludos SOLO a ti de parte de " + msg.origen + "</li>";
            break;

        case "limpiar":
            document.getElementById("saludos").innerHTML = "";
            break;
    }
});

function saludar() {
    conexion.send(JSON.stringify({
        operacion: "saludar",
        origen: nombre
    }));
}

function limpiar() {
    conexion.send(JSON.stringify({
        operacion: "limpiar"
    }));
}

function saludoIndividual(destinatario) {
    conexion.send(JSON.stringify({
        operacion: "saludoIndividual",
        origen: nombre,
        destinatario: destinatario
    }));
}