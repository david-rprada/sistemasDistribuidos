//Es necesario instalar en la carpeta del servidor los modulos cors y express

var rpc = require("./rpc.js"); //incorporamos la libreria

//VARIABLES GLOBALES
const datos = require("./datos.json")
const especialidades = datos.especialidades;
const centros = datos.centros;
const medicos = datos.medicos;
const expedientes = datos.expedientes;


//ID del ME si las credenciales son correctas o null si no
function login(login, password){
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].login == login && medicos[i].password == password){
            return medicos[i].id; //ID del ME si son correctas
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
    console.log("estos son los datos que me pasa el cliente", datos);
    var nuevo_id = 0;
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].id > nuevo_id){
            nuevo_id = medicos[i].id;
        }
        
    }
    console.log("este es el nuevo id:", nuevo_id);

    var nuevo_ME = {
        id: nuevo_id + 1,
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        login: datos.login,
        password: datos.password,
        especialidad: datos.especialidad,
        centro: datos.centro
    }
    console.log("nuevo me", nuevo_ME);

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
        return nuevo_ME.id;
    }
}

//Actualiza los datos del médico con identificador id_med
function actualizarme(id_medico, datos){
    var idME = id_medico;
    console.log("este es el id del medico a actualizar:", idME)
    console.log("estos son los datos que me pasan para actualizar:", datos);

    var medico = medicos.find((med) => med.id == idME);
    if(!medico){
        return null;
    }

    var medicoExiste = medicos.find((med) => med.login == datos.login && med.id != idME);
    if(medicoExiste){
        return null;
    }

    medico.nombre = datos.nombre || medico.nombre;
    medico.apellidos = datos.apellidos || medico.apellidos;
    medico.login = datos.login || medico.login;
    medico.password = datos.password || medico.password;
    medico.centro = datos.centro || medico.centro;
    medico.especialidad = datos.especialidad || medico.especialidad;

    return medico;
}

//Array de expedientes sin ME y de esa especialidad (solo id, map, fecha_creacion)
//Para asignar un expediente
function obtenerExpDisponibles(id_especialidad) {
    const expedientesDisponibles = expedientes.filter(expediente => !expediente.me && expediente.especialidad === id_especialidad);
  
    if (expedientesDisponibles.length === 0) {
      return null; // Devolver null si no se encuentran expedientes disponibles
    }

    const expedientesFormateados = expedientesDisponibles.map(expediente => {
        const medico = medicos.find(m => m.id === expediente.map);
        return {
          id: expediente.id,
          map: expediente.map,
          fecha_creacion: expediente.fecha_creacion,
          nombre_map: medico ? `${medico.nombre} ${medico.apellidos}` : 'Médico no encontrado'
        };
      });
  
    return expedientesFormateados;
  }
  

// Array de expedientes asignados a ese ME (todos los datos)
// se pasa como body el id_me
function obtenerExpAsignados(id_me) {
    // Buscar el médico
    const medicoExistente = medicos.find(medico => medico.id === id_me);
    
    // Si el médico no existe, devolver null
    if (!medicoExistente) {
      return null;
    }
  
    // Filtrar expedientes asignados al médico
    const expedientesAsignados = expedientes.filter(expediente => expediente.medico === id_me);
    
    // Si el médico no tiene expedientes asignados, devolver null
    if (expedientesAsignados.length === 0) {
      return null
    }
  
    // Devolver los expedientes asignados al médico
    return expedientesAsignados
}

//Se asignará a un ME el expediente y se rellenará la fecha_asignacion. 
//Retorna un boleano de si ha ido bien.
function asignarExp(id_exp, id_me){
    console.log("este es el id_me", id_me);
    console.log("este es el id_exp:", id_exp);
    const expediente = expedientes.find(expediente => expediente.id === id_exp);
    if (expediente && !expediente.me) {
      expediente.me = id_me;
      expediente.fecha_asignacion = new Date().toISOString();
      return true;
    } else {
      return false; // No se pudo asignar el expediente
    } 
} 

//Array de expedientes asignados a ese ME (todos los datos)
function obtenerExpAsignados(id_me) {
    const expedientesAsignados = expedientes.filter(expediente => expediente.me === id_me);
    return expedientesAsignados;
}

// Resuelve un expediente poniendo la respuesta y asignado la 
//fecha_resolucion

function resolverExp(id_exp, respuesta){
    console.log("este es el id que se me pasa", id_exp);
    const expediente = expedientes.find(expediente => expediente.id === id_exp);
    if (expediente) {
      expediente.respuesta = respuesta;
      expediente.fecha_resolucion = new Date().toISOString();
      return true;
    } else {
      return false; // No se pudo resolver el expediente
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
app.register(actualizarme);
app.register(obtenerExpDisponibles);
app.register(obtenerExpAsignados);
app.register(asignarExp);
app.register(resolverExp);

