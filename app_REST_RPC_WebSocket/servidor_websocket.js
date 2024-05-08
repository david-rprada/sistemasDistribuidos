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


var conexiones = []; // conexiones de clientes

{
"type": utf-8,
"operacion": 1,
 "fecha": "


}


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
			case "enviarAll":
				for (var i = 0; i < conexiones.length; i++) {
					if (conexiones[i] !== connection) {
						conexiones[i].sendUTF(message.utf8Data);
					}
				}
				break;
			
			case "enviarAME":
				// buscar al ME en el array de expedientes a través de las propiedades del message (JSON)) ej: message.idExpediente o message.idME
				let conexionME = GetConexionME(message);
				conexionME.sendUTF(message.utf8Data);


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

function GetConexionME(message)
{
	// Buscar en el array de expedientes

	// Buscar la conexion a traves del array de conexiones con id

	// Una vez encontrada la conexion, devolverla. Por jemplo la conexion que ocupa la posición 7. 
	// return conexiones[7];

}


wsServer.on("request", function (request){ // este callback se ejecuta cuando llega una nueva conexión de un cliente
	var connection = request.accept("cliente", request.origin); // aceptar conexión
	var cliente = {};


        
});