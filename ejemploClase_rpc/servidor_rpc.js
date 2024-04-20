//Es necesario instalar en la carpeta del servidor los modulos cors y express

var rpc = require("./rpc.js"); //incorporamos la libreria

var datos=require("./datos.js")
var pacientes = datos.pac

var siguienteId = 2; 

//Función para obtener los pacientes
function obtenerPacientes() {
    return pacientes;
}

//Función para crear un nuevo paciente. Retorna su id o 0 si ha fallado
function anyadirPaciente(nom, ape, ed) { 
    if (!nom || !ape || !ed) return 0; 

    var id = siguienteId; 
    siguienteId++; 
    console.log("Añadir paciente", nom, ape, ed);
    pacientes.push({ id: id, nombre: nom, apellidos: ape, edad: ed }); 
    return id;
}

//Función para eliminar un paciente. Retorna true o false 
function eliminarPaciente(id) {
    for (var i = 0; i<pacientes.length ; i ++) {
        if (pacientes[i].id == id) {
            pacientes.splice(i, 1);
            return true; // paciente borrado
        }
    }
    return false; // paciente no borrado (no encontrado)
}

var servidor = rpc.server(); // crear el servidor RPC
var app = servidor.createApp("gestion_pacientes"); // crear aplicación de RPC

//Registramos los procedimientos
app.register(obtenerPacientes);
app.register(anyadirPaciente);
app.register(eliminarPaciente);


