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

//var seccionActual = "login_me";
var id_ME = null;

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


function registrarse(){
    cargarCentros();
    cargarEspecialidades();
    cambiarSeccion("registro_nuevo_ME");
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
    });
}

function modificar_datos_me(){
    cargarCentros();
    cargarEspecialidades();
    cambiarSeccion("cambiar_datos_me");
}

// Esta función carga los centros en el select
function cargarCentros() {
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
function cargarEspecialidades() {
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
        cambiarSeccion("menu_principal");
        console.log("datos del medico actualizados", medico)
    })

    
}


function volver_login(){
    cambiarSeccion("login_me");
}








































































//FUNCIÓN PARA CAMBIAR LAS PANTALLAS
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}










