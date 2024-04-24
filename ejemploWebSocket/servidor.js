// Crear un servidor HTTP
var http = require("http");
var httpServer = http.createServer();

// Crear servidor WS
var WebSocketServer = require("websocket").server; // instalar previamente: npm install websocket
var wsServer = new WebSocketServer({
	httpServer: httpServer
});

// Iniciar el servidor HTTP en un puerto
var puerto = 4444;
httpServer.listen(puerto, function () {
	console.log("Servidor de WebSocket iniciado en puerto:", puerto);
});

var conexiones = []; // array con todas las conexiones

wsServer.on("request", function (request) { // este callback se ejecuta cuando llega una nueva conexión de un cliente
	var connection = request.accept("saludos", request.origin); // aceptar conexión
	conexiones.push(connection); // almacenando las conexiones
	console.log("Cliente conectado. Ahora son:", conexiones.length);
	connection.on("message", function (message) { // mensaje recibido del cliente
		if (message.type === "utf8") {
			console.log("Mensaje recibido de cliente: " + message.utf8Data);
		}
		var msg = JSON.parse(message.utf8Data);
		switch (msg.operacion) {
			case "saludar":
				for (var i = 0; i < conexiones.length; i++) {
					if (conexiones[i] !== connection) {
						conexiones[i].sendUTF(message.utf8Data);
					}
				}
				break;
			case "limpiar":
				for (var i = 0; i < conexiones.length; i++) {
					conexiones[i].sendUTF(message.utf8Data);
				}
				break;

			default:
				console.error("Operacion no soportada");
		}
	});

	connection.on("close", function () { // conexión cerrada
		conexiones.splice(conexiones.indexOf(connection), 1); // elimino la conexión del array de conexiones
		console.log("Cliente desconectado. Ahora son", conexiones.length);
	});
});
