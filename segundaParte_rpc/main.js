var app = rpc("localhost", "gestion_me");
/*
Obtener referencias a los procedimientos remotos registrados
por el servidor
*/

const login = app.procedure("login");
const obtenerCentros = app.procedure("obtenerCentros");
const obtenerEspecialidades = app.procedure("obtenerEspecialidades");
const obtenerDatosMedico = app.procedure("obtenerDatosMedico");
const crearME = app.procedure("crearME");

var seccionActual = "login_me";
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
        console.log(medico)
        if(medico != null){
            console.log("Login correcto");
            datos_ME(medico);
            id_ME = medico.id;
            cambiarSeccion("menu_principal");
        }
        else{
            console.log("Login incorrecto, pruebe otra vez");
        }    
    });
}

function datos_ME(datos_me){
    id_ME = datos_me.id;

    var bienvenida = document.getElementById("bienvenida");
    bienvenida.innerHTML = "";
    bienvenida.innerHTML +="<h1>Bienvenido/a, "+datos_me.nombre + " " +datos_me.apellidos+ "</h1>";
}



































































//FUNCIÓN PARA CAMBIAR LAS PANTALLAS
function cambiarSeccion(seccion){
    document.getElementById(seccionActual).classList.remove("activa");
    document.getElementById(seccion).classList.add("activa");
    seccionActual=seccion;
}










