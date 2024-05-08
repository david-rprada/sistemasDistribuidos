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

var conexiones = []; // array con todas las conextiones (son objetos conexion + nombre del que conectó)

wsServer.on("request", function (request) { // este callback se ejecuta cuando llega una nueva conexión de un cliente
	var connection = request.accept("saludos", request.origin); // aceptar conexión / connection es la conexion actual
	var cliente = { // asocio a la conexión un nombre
		conexion: connection,
		nombre: null // aun no se quien es
	};
	conexiones.push(cliente); // almacenando las conexiones
	console.log("Cliente conectado. Ahora son:", conexiones.length);
	connection.on("message", function (message) { // mensaje recibido del cliente
		if (message.type === "utf8") {
			console.log("Mensaje recibido de cliente: " + message.utf8Data);
		}
		var msg = JSON.parse(message.utf8Data); // paso el mensaje de texto al objeto original
		switch (msg.operacion) {
			case "identificarse": // mensaje de identificación (es el primer mensaje siempre).
				console.log("Se ha identificado", msg.nombre);
				cliente.nombre = msg.nombre; // guardar el nombre en el cliente
				// Avisar a los que están conectados de que hay uno nuevo
				// Informar al nuevo (este cliente) de los nombre de los otros clientes que ya había
				for (var i = 0; i < conexiones.length; i++) {
					if (conexiones[i] !== cliente) { // todos menos yo del array de conexiones a todos menos a mi que soy el que esta ejecutando
						conexiones[i].conexion.sendUTF(message.utf8Data); // aviso a otro de mi (mando el mismo msg)
						connection.sendUTF(JSON.stringify({ // aviso a mi de otro
							operacion: "identificarse",
							nombre: conexiones[i].nombre
						}));
					}
				}
				break;

			case "saludar": // mensaje de saludo
				for (var i = 0; i < conexiones.length; i++) {
					if (conexiones[i] !== cliente) {
						conexiones[i].conexion.sendUTF(message.utf8Data);
					}
				}
				break;

			case "saludoIndividual": // mensaje individual
				console.log
				for (var i = 0; i < conexiones.length; i++) {
					if (conexiones[i].nombre == msg.destinatario) {
						conexiones[i].conexion.sendUTF(message.utf8Data);
					}
				}
				break;

			case "limpiar": // mensaje para limpiar las conextiones
				for (var i = 0; i < conexiones.length; i++) {
					conexiones[i].sendUTF(message.utf8Data);
				}
				break;

			default:
				console.error("Operacion no soportada");
		}
	});

	connection.on("close", function () { // conexión cerrada
		conexiones.splice(conexiones.indexOf(cliente), 1); // elimino la conexión del array de conexiones
		console.log("Cliente desconectado. Ahora son", conexiones.length);
	});
});
