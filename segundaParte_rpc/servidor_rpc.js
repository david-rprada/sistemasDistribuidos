//Es necesario instalar en la carpeta del servidor los modulos cors y express

var rpc = require("./rpc.js"); //incorporamos la libreria

//VARIABLES GLOBALES
const datos = require("./datos.json")
const especialidades = datos.especialidades;
const centros = datos.centros;
const medicos = datos.medicos;
const expedientes = datos.expedientes;

//ID del ME si las credenciales son correctas o null si no
function login(login,password){
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].login == login && medicos[i].password == password){
            return medicos[i]; //ID del ME si son correctas
        }
    }
    return null //null si no lo son
}

//Array con todas las especialidades
function obtenerEspecialidades(){
    return especialidades;
}

//Array con todos los centros
function obtenerCentros(){
    return centros;
}

/*Datos de un médico (excepto password) 
o null si el id no se corresponde a un médico*/
function obtenerDatosMedico(id_medico){
    var datos_ME = null;
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].id == id_medico){
        datos_ME = JSON.parse(JSON.stringify(medicos[i]));
        console.log(datos_ME);
        delete datos_ME['password'];
        return datos_ME;
        }
    }
    return null //si no se corresponde con ningun medico
}

function crearME(datos){
    var nuevo_id = 0;
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].id > nuevo_id){
            nuevo_id = medicos[i].id;
        }
    }

    var nuevo_ME = {
        id: nuevo_id + 1,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        login: datos.login,
        password: datos.password,
        especialidad: datos. especialidad,
        centro: datos.centro
    }

    //vemos si existe para que no haya repeticion en el login

    var existe = false;
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].login == nuevo_ME.login){
            existe = true
            break;
        }
    }
    if(existe){
        return null
    }
    else{
        medicos.push(nuevo_ME);
        return id;
    }
}

































var servidor = rpc.server(); //crear el servidor RPC
var app = servidor.createApp("gestion_me"); //crear app RPC

//AQUI ABAJO HACER LOS REGISTROS
//app.register("lo que sea...")
app.register(login);
app.register(obtenerCentros);
app.register(obtenerEspecialidades);
app.register(obtenerDatosMedico);
app.register(crearME);

