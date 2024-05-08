//CUANDO SE LE MANDA ALGO AL SERVIDOR, HAY QUE ESPECIFICAR EN EL MENSAJE QUÉ ES (MÉDICO O PACIENTE)

// Crear un servidor HTTP
var http = require("http");
var httpServer = http.createServer();

// Crear servidores WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
	httpServer: httpServer
});

// Iniciar el servidor HTTP en un puerto
var puerto = 4444;
httpServer.listen(puerto, function () {
	console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});

//Se requieren los datos del archivo datos.js
var datos = require("./datos.js")


var clientes = []; // conexiones de clientes

wsServer.on("request", function (request){ // este callback se ejecuta cuando llega una nueva conexión de un cliente
	var connection = request.accept("cliente", request.origin); // aceptar conexión
	var cliente = {};


        
});