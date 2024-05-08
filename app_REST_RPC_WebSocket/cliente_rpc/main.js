var app = rpc("localhost", "gestion_me");
/*
Obtener referencias a los procedimientos remotos registrados
por el servidor
*/

var seccionActual = "login_me";
const login = app.procedure("login");
const obtenerCentros = app.procedure("obtenerCentros");
const obtenerEspecialidades = app.procedure("obtenerEspecialidades");
const obtenerDatosMedico = app.procedure("obtenerDatosMedico");
const crearME = app.procedure("crearME");
const actualizarme = app.procedure("actualizarme");
const obtenerExpDisponibles = app.procedure("obtenerExpDisponibles");
const asignarExp = app.procedure("asignarExp");
const obtenerExpAsignados = app.procedure("obtenerExpAsignados");
const resolverExp = app.procedure("resolverExp");

var id_medico = null;
var expedientesAsignados=[];


//las funciones se hacen de la siguiente manera: 
/*Tenemos que tener en cuenta los botones como en la parte del REST
pero en vez de tener una URL haremos las llamadas a las funciones
o procedimientos remotos registrados. 
*/

/*
Tienen esta forma
function nombreBoton()/nombreFuncion("argumentos si es necesario"){
    codigo que sea...
    llamada al procedimiento: 
    login(login, password, function(lo que te devuelva el servidor(medicos)))
}
*/

function entrar(){
    var loginME = document.getElementById("loginME").value;
    var passwordME = document.getElementById("passwordME").value;

    login(loginME,passwordME, function (medico) {
        console.log("Este es el medico que pasa el servidor:", medico)
        if(medico != null){
            console.log("Login correcto");
            datos_especialista(medico);
            id_ME = medico.id;
        }
        else{
            console.log("Login incorrecto, pruebe otra vez");
        }    
    });
    borrar_campos_login();
}

function datos_especialista(datos_ME){
    medico = datos_ME;
    obtenerDatosMedico(medico, function(medico_ME){
        console.log("el medico que me pasa el servidor 2:", medico_ME)
        if(medico != null){
            var bienvenida = document.getElementById("nombre_doctor_ME");
            bienvenida.innerHTML = "";
            bienvenida.innerHTML = medico_ME.nombre + " "+ medico_ME.apellidos;
            cambiarSeccion("menu_principal");
        }
        else{
            console.log("Sin medico");
        } 
    })  
}
// Esta función carga los centros en el select
function cargarCentros() {
    obtenerCentros(function(centros) {
        var selectCentros = document.getElementById("centros");
        // Limpiamos cualquier opción previa
        selectCentros.innerHTML = "";
        // Iteramos sobre los centros y los agregamos como opciones al select
        centros.forEach(function(centro) {
            var option = document.createElement("option");
            option.value = centro.id; // Puedes cambiar esto según la estructura de tu objeto centro
            option.text = centro.nombre; // Puedes cambiar esto según la estructura de tu objeto centro
            selectCentros.appendChild(option);
        });
    });
}

// Esta función carga las especialidades en el select
function cargarEspecialidades() {
    obtenerEspecialidades(function(especialidades) {
        var selectEspecialidades = document.getElementById("especialidad");
        // Limpiamos cualquier opción previa
        selectEspecialidades.innerHTML = "";
        // Iteramos sobre las especialidades y las agregamos como opciones al select
        especialidades.forEach(function(especialidad) {
            var option = document.createElement("option");
            option.value = especialidad.id; // Puedes cambiar esto según la estructura de tu objeto especialidad
            option.text = especialidad.nombre; // Puedes cambiar esto según la estructura de tu objeto especialidad
            selectEspecialidades.appendChild(option);
        });
    });
}

function registrarse(){
    cargarCentros();
    cargarEspecialidades();
    cambiarSeccion("registro_nuevo_ME");
}

function guardar_nuevo_me(){
    var centro_seleccionado = document.getElementById("centros");
    if(centro_seleccionado){
        var centro_seleccionado_valor = parseInt(centro_seleccionado.value);
    };
    var especialidad_seleccionada = document.getElementById("especialidad");
    if(especialidad_seleccionada){
        var especialidad_seleccionada_valor = parseInt(especialidad_seleccionada.value);
    }

    var nuevo_me = {
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        login: document.getElementById("loginME1").value,
        password : document.getElementById("passwordME1").value,
        centro: centro_seleccionado_valor,
        especialidad: especialidad_seleccionada_valor,
    }

    crearME(nuevo_me, function(id_nuevoME){
        cambiarSeccion("login_me");
        console.log("Este es el id del nuevo ME:", id_nuevoME);
        borrar_campos_registro();
    });
}

function boton_volver_login(){
    cambiarSeccion("login_me");
}

function modificar_datos_me(){
    cargarCentros1();
    cargarEspecialidades1();
    cambiarSeccion("cambiar_datos_me");

    obtenerDatosMedico(medico, function(medico_pasado2){
        document.getElementById("nombre1").value = medico_pasado2.nombre;
        document.getElementById("apellidos1").value = medico_pasado2.apellidos;
        document.getElementById("loginME2").value = medico_pasado2.login;
        document.getElementById("centros1").value = medico_pasado2.centro;
        document.getElementById("especialidad1").value = medico_pasado2.especialidad;
    })
}

// Esta función carga los centros en el select
function cargarCentros1() {
    obtenerCentros(function(centros) {
        var selectCentros = document.getElementById("centros1");
        // Limpiamos cualquier opción previa
        selectCentros.innerHTML = "";
        // Iteramos sobre los centros y los agregamos como opciones al select
        centros.forEach(function(centro) {
            var option = document.createElement("option");
            option.value = centro.id; // Puedes cambiar esto según la estructura de tu objeto centro
            option.text = centro.nombre; // Puedes cambiar esto según la estructura de tu objeto centro
            selectCentros.appendChild(option);
        });
    });
}

// Esta función carga las especialidades en el select
function cargarEspecialidades1() {
    obtenerEspecialidades(function(especialidades) {
        var selectEspecialidades = document.getElementById("especialidad1");
        // Limpiamos cualquier opción previa
        selectEspecialidades.innerHTML = "";
        // Iteramos sobre las especialidades y las agregamos como opciones al select
        especialidades.forEach(function(especialidad) {
            var option = document.createElement("option");
            option.value = especialidad.id; // Puedes cambiar esto según la estructura de tu objeto especialidad
            option.text = especialidad.nombre; // Puedes cambiar esto según la estructura de tu objeto especialidad
            selectEspecialidades.appendChild(option);
        });
    });
}

function guardar_datos_modificados(){
    var centro_seleccionado = document.getElementById("centros1");
    if(centro_seleccionado){
        var centro_seleccionado_valor = parseInt(centro_seleccionado.value);
    };
    var especialidad_seleccionada = document.getElementById("especialidad1");
    if(especialidad_seleccionada){
        var especialidad_seleccionada_valor = parseInt(especialidad_seleccionada.value);
    }

    var cambios_me = {
        nombre: document.getElementById("nombre1").value,
        apellidos: document.getElementById("apellidos1").value,
        login: document.getElementById("loginME2").value,
        password : document.getElementById("passwordME2").value,
        centro: centro_seleccionado_valor,
        especialidad: especialidad_seleccionada_valor,
    }

    actualizarme(medico, cambios_me, function(medico){
        if (!medico){
            alert("El medico que se quiere actualizar no existe");
            return;
        }
        cambiarSeccion("menu_principal");
        console.log("datos del medico actualizados", medico)
    });

    
}

function boton_volver_inicio(){
    cambiarSeccion("menu_principal");
}

//boton para volver al login.
function volver_login(){
    cambiarSeccion("login_me");
}

//Array de expedientes sin ME y de esa especialidad (solo id, map, fecha_creacion)
//Para asignar un expediente
function asignar_expediente(){
    var lista_expedientes_disponibles = document.getElementById("lista_expedientes");
    lista_expedientes_disponibles.innerHTML = "";

    var tabla = document.createElement("table");
    lista_expedientes_disponibles.appendChild(tabla);

    var encabezados = ["ID", "F.Cre.", "MAP", ""];
    var filaEncabezado = tabla.insertRow();

    for(var i = 0; i < encabezados.length; i++){
        var encabezado = document.createElement("th");
        encabezado.innerHTML = encabezados[i];
        filaEncabezado.appendChild(encabezado);
    }

    //medico = solo el id
    obtenerDatosMedico(medico, function(medico_ME){
        // Verificar si se pudo obtener el médico
        if (medico_ME === null) {
            console.log("Error: No se pudo obtener el médico.");
            return;
        }
        // Obtener el ID de la especialidad del médico
        var id_especialidad = medico_ME.especialidad;
        console.log("ID de la especialidad:", id_especialidad);


        obtenerExpDisponibles(id_especialidad, function(listado){
            if(listado == null){
                console.log("Error");
            }
            for(var i = 0; i < listado.length; i++){
                var fila = tabla.insertRow();
                var datos = [
                    listado[i].id,
                    transformar_fecha_hora(listado[i].fecha_creacion),
                    listado[i].nombre_map
                ];
    
                for(var j = 0; j < datos.length; j++){
                    var celda = fila.insertCell(j);
                    celda.innerHTML = datos[j];
                }
    
                var celdaBoton = fila.insertCell(datos.length);
                celdaBoton.innerHTML = "<button onclick='asignado(" + listado[i].id + ")'>Asignar</button>";
            }
        });

    });
    
    cambiarSeccion("asignar_expediente");
}

function boton_volver_menuP(){
    cambiarSeccion("menu_principal");
}


function cargarEspecialidades2() {
    obtenerEspecialidades(function(especialidades) {
        var selectEspecialidades = document.getElementById("especialidades2");
        // Limpiamos cualquier opción previa
        selectEspecialidades.innerHTML = "";
        // Iteramos sobre las especialidades y las agregamos como opciones al select
        especialidades.forEach(function(especialidad) {
            var option = document.createElement("option");
            option.value = especialidad.id; // Puedes cambiar esto según la estructura de tu objeto especialidad
            option.text = especialidad.nombre; // Puedes cambiar esto según la estructura de tu objeto especialidad
            selectEspecialidades.appendChild(option);
        });
    });
}


const WebSocket = require('ws');

// Conectar al servidor WebSocket en el puerto 8080
const ws = new WebSocket('ws://localhost:8080');

// Manejar conexión exitosa
ws.on('open', function open() {
  console.log('Conectado al servidor');
  
  // Escuchar entrada de usuario y enviar mensajes al servidor
  process.stdin.on('data', function (data) {
    ws.send(data.toString().trim());
  });
});

// Manejar mensajes del servidor
ws.on('message', function incoming(message) {
  console.log('Mensaje recibido del servidor: %s', message);
});

// Manejar cierre de conexión
ws.on('close', function close() {
  console.log('Desconectado del servidor');
});





function asignado(id){
    cargarEspecialidades2();
    obtenerDatosMedico(medico, function(medico_pasado){
        // Verificar si se pudo obtener el médico
        if (medico_pasado === null) {
            console.log("Error: No se pudo obtener el médico.");
            return;
        }
        // Obtener el ID de la especialidad del médico
        var id_me = medico_pasado.id;
        console.log("ID del medico:", id_me);

        asignarExp(id, id_me, function(exito){
            if(exito){
               cambiarSeccion("expediente_asignado"); 
               
               var fechaActual = new Date().toISOString();
               document.getElementById("fasignacion").value = fechaActual;

            }
        
        obtenerExpAsignados(id_me, function(expedientes){
            expedientesAsignados = expedientes;
            for (var i = 0; i < expedientesAsignados.length; i++) {
            // Comparar el ID del expediente con el ID recibido como parámetro
                if (expedientesAsignados[i].id === id) {
                // Aquí encontraste el expediente que deseas mostrar
                var expediente = expedientesAsignados[i];
                console.log("Expediente encontrado:", expediente);
                console.log(expediente);
                document.getElementById("id1").value = expediente.id;
                document.getElementById("medEsp").value = expediente.me;
                document.getElementById("especialidades2").value = expediente.especialidad;
                document.getElementById("sip").value = expediente.sip;
                document.getElementById("nombrenuevoexp").value = expediente.nombre;
                document.getElementById("apellidosnuevoexp").value = expediente.apellidos;
                document.getElementById("fnacimientonuevoexp").value = expediente.fecha_nacimiento;
                document.getElementById("genero").value = expediente.genero;
                document.getElementById("observaciones").value = expediente.observaciones;
                document.getElementById("solicitud").value = expediente.solicitud;
                document.getElementById("respuesta").value = expediente.respuesta;
                document.getElementById("fsolicitud").value = expediente.fecha_creacion;
                document.getElementById("fasignacion").value = expediente.fecha_asignacion;
                document.getElementById("fresolucion").value = expediente.fecha_resolucion;

                }
            }
            
        });

        });
    });
}

function boton_volver_listado(){
    cambiarSeccion("asignar_expediente");
}

function mostrar_expedientes_asignados(){
    var lista_expedientes = document.getElementById("lista_expedientes_asignados");
    lista_expedientes.innerHTML = "";

    // Crear tabla
    var tabla = document.createElement("table");
    lista_expedientes.appendChild(tabla);

    // Encabezados de la tabla
    var encabezados = ["ID", "F.Cre.", "F.Asg.", "F.Res.", "SIP", ""];
    var filaEncabezado = tabla.insertRow();

    for (var i = 0; i < encabezados.length; i++) {
        var encabezado = document.createElement("th");
        encabezado.innerHTML = encabezados[i];
        filaEncabezado.appendChild(encabezado);
    }

    if(expedientesAsignados == null){
        console.log("Error");
    }
    for(var i = 0; i < expedientesAsignados.length; i++){
        var fila = tabla.insertRow();
        var datos = [
            expedientesAsignados[i].id,
            transformar_fecha_hora(expedientesAsignados[i].fecha_creacion),
            transformar_fecha_hora(expedientesAsignados[i].fecha_asignacion),
            transformar_fecha_hora(expedientesAsignados[i].fecha_resolucion),
            expedientesAsignados[i].sip
        ];
            
        for(var j = 0; j < datos.length; j++){
            var celda = fila.insertCell(j);
            celda.innerHTML = datos[j];
        }
            
        var celdaBoton = fila.insertCell(datos.length);
        celdaBoton.innerHTML = "<button onclick='mostrar(" + expedientesAsignados[i].id + ")'>Mostrar</button>";
        }

    cambiarSeccion("expedientes_asignados");
}

function cargarEspecialidades3() {
    obtenerEspecialidades(function(especialidades) {
        var selectEspecialidades = document.getElementById("especialidades3");
        // Limpiamos cualquier opción previa
        selectEspecialidades.innerHTML = "";
        // Iteramos sobre las especialidades y las agregamos como opciones al select
        especialidades.forEach(function(especialidad) {
            var option = document.createElement("option");
            option.value = especialidad.id; // Puedes cambiar esto según la estructura de tu objeto especialidad
            option.text = especialidad.nombre; // Puedes cambiar esto según la estructura de tu objeto especialidad
            selectEspecialidades.appendChild(option);
        });
    });
}
var idExpResolver=null
//aqui tambien tengo que cargar todos los datos del expediente y la especialidad...
function mostrar(id_expediente){
    cambiarSeccion("ver_expediente_asignado");
    cargarEspecialidades3();
    idExpResolver = id_expediente;
    console.log("este es el id del expediente a resolver:", idExpResolver);
    // Iterar sobre el array de expedientes
    for (var i = 0; i < expedientesAsignados.length; i++) {
        // Comparar el ID del expediente con el ID recibido como parámetro
        if (expedientesAsignados[i].id === id_expediente) {
        // Aquí encontraste el expediente que deseas mostrar
        var expediente = expedientesAsignados[i];
        console.log("Expediente encontrado:", expediente);

        document.getElementById("id2").value = expediente.id;
        document.getElementById("medEsp1").value = expediente.me;
        document.getElementById("especialidades3").value = expediente.especialidad;
        document.getElementById("sip1").value = expediente.sip;
        document.getElementById("nombre2").value = expediente.nombre;
        document.getElementById("apellidos2").value = expediente.apellidos;
        document.getElementById("fnacimiento2").value = expediente.fecha_nacimiento;
        document.getElementById("genero2").value = expediente.genero;
        document.getElementById("observaciones2").value = expediente.observaciones;
        document.getElementById("solicitud2").value = expediente.solicitud;
        document.getElementById("respuesta2").value = expediente.respuesta;
        document.getElementById("fsolicitud2").value = expediente.fecha_creacion;
        document.getElementById("fasignacion2").value = expediente.fecha_asignacion;
        document.getElementById("fresolucion2").value = expediente.fecha_resolucion;

        // Una vez que encuentras el expediente que deseas mostrar, puedes salir del bucle
        break;
        }
    }
}


//Resuelve un expediente poniendo la respuesta y asignado la fecha_resolucion.
function resolverExpediente(){
    respuesta = document.getElementById("respuesta2").value;
// Resolver el expediente seleccionado
    resolverExp(idExpResolver, respuesta, function(respuestaServer){
        if(respuestaServer){  
            var fechaActual = new Date().toISOString();
            document.getElementById("fresolucion2").value = fechaActual;
            console.log(fechaActual);
            console.log("Expediente resuelto con exito"); 

            asignado(idExpResolver);
        }
        else{
            console.log("expediente no encontrado");
        }

        cambiarSeccion("expedientes_asignados");
    });
}


function boton_volver_listado2(){
    cambiarSeccion("expedientes_asignados");
}





























function borrar_campos_login(){
    document.getElementById("loginME").value = '';
    document.getElementById("passwordME").value = '';
}

function borrar_campos_registro(){
    document.getElementById("nombre").value = '';
    document.getElementById("apellidos").value = '';
    document.getElementById("loginME1").value = '';
    document.getElementById("passwordME1").value = '';
    document.getElementById("centros").value = '';
    document.getElementById("especialidad").value = '';
}







































































//FUNCIÓN PARA CAMBIAR LAS PANTALLAS
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}

//FUNCION PARA CAMBIAR FECHA A UNA MAS LEGIBLE
function transformar_fecha(fecha){
    var año = String(fecha).substring(0,4);
    var mes = String(fecha).substring(5,7);
    var dia = String(fecha).substring(8,10);
    return año+"-"+mes+"-"+dia;
}

//Para las horas
function transformar_fecha_hora(fecha){
    var horas = String(fecha).substring(11,13);
    var minutos = String(fecha).substring(14,16);
    var segundos = String(fecha).substring(17,19);

    return transformar_fecha(fecha)+ " "+horas+":"+minutos+":"+segundos;

}










