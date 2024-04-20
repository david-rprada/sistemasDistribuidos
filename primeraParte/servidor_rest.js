var express = require("express");
var app = express();

let datos = require('./datos.json'); //llamamos a datos.json.
console.log(datos, 'the json obj');

const especialidades = datos.especialidades
const centros = datos.centros
const medicos = datos.medicos
const expedientes = datos.expedientes


app.use("/apiCliente", express.static("cliente_rest")); //para verlo localhost:3000/apiCliente devuelve contenido estatico del cliente en el google
app.use(express.json()); 
/*
// conjunto de especialidades a las que pertenecen los ME
var especialidades = [
    {id: 1, nombre: "Cardiologia"},
    {id: 2, nombre: "Dermatologia"},
    {id: 3, nombre: "Neurologia"}
];

// conjunto de centros donde trabajan los médicos

var centros = [
    {id: 1, nombre: "Hospital Alicante"},
    {id: 2, nombre: "Hospital La Fe"},
    {id: 3, nombre: "Hospital San Juan"}
];

// conjunto de medicos dados de alta en el sistema. Por cada medico se tiene lo siguiente.

var medicos = [
    {id: 1, nombre: "Marina", apellidos: "Garcia", login: "marina", password: "marina123", especialidad: 0, centro:1},
    {id: 2, nombre: "Maria", apellidos: "Sanchez", login: "maria", password: "maria123", especialidad: 0, centro:2},
    {id: 3, nombre: "Isa", apellidos: "Vicente", login: "isa", password: "isa123", especialidad: 1, centro:3}
];

// conjunto de expedientes de interconsulta entre MAP y ME

var expedientes = [
    {
        id: 1,
        map: 1,
        me: 0,
        especialidad: 1,
        sip: "123456789",
        nombre: "Daniela",
        apellidos: "Garcia Gonzalez ",
        fecha_nacimiento: new Date("2005-03-28"),
        genero: "M",
        observaciones: "Progesa adecuadamente",
        solicitud: "Necesidad consulta",
        respuesta: "",
        fecha_creacion: new Date ("2024-03-20T08:16:03Z"),
        fecha_asignacion: new Date("2024-03-30T11:16:03Z"),
        fecha_resolucion: new Date("2024-04-20T17:16:03Z")
      },

      {
        id: 2,
        map: 1,
        me: 0,
        especialidad: 2,
        sip: "123456789",
        nombre: "Maria",
        apellidos: "Garcia Gonzalez ",
        fecha_nacimiento: new Date("2001-03-04"),
        genero: "M",
        observaciones: "Progesa adecuadamente",
        solicitud: "Necesidad consulta",
        respuesta: "",
        fecha_creacion: new Date ("2023-03-20T09:17:20Z"),
        fecha_asignacion: new Date("2023-03-15T10:16:57Z"),
        fecha_resolucion: new Date("2023-05-18T11:20:00Z")
      },
      
      {
        id: 3,
        map: 2,
        me: 0,
        especialidad: 3,
        sip: "123456789",
        nombre: "Juana",
        apellidos: "Garcia Gonzalez ",
        fecha_nacimiento: new Date("2002-02-23"),
        genero: "M",
        observaciones: "Progesa adecuadamente",
        solicitud: "Necesidad consulta",
        respuesta: "",
        fecha_creacion: new Date ("2023-11-02T12:30:03Z"),
        fecha_asignacion: new Date("2023-12-01T15:00:02Z"),
        fecha_resolucion: new Date("2024-01-17T16:16:00Z")
      }


];
*/


// primera funcion del map cuando accede al sitio web y se tiene 
// que ver si las credenciales son correctas
app.post("/api/medico/login", function(req, res){
    var map = {
        login: req.body.login,
        password: req.body.password, 
    };
    console.log(map.login, map.password);
    //buscamos si existe
    var pos = -1;
    var i = 0;

    while(i < medicos.length && pos == -1){
        if(map.login == medicos[i].login && map.password == medicos[i].password){
            console.log(medicos[i])
            pos = i;
        }
        else{
            i++;
        }
    }
    if(pos == -1){//no se ha encontrado
        res.status(403).json("No existe ese usuario");
    }
    else{
        res.status(201).json(medicos[pos]); // mandamos el valor del ID al cliente.
        
    }
});

//obtiene los datos del medico menos la contraseña
//se especifica el id del medico del que se quiere obtener la info
app.get("/api/medico/:id", function(req, res){
    var id = req.params.id;
    for(var i = 0; i<medicos.length; i++){
        //recorre el array de medicos y busca cual es el que tiene ese id
        if(medicos[i].id == id){
            var datos_med = JSON.parse(JSON.stringify(medicos[i]));

            delete datos_med["password"];

            res.status(200).json(datos_med);
            return;
        }
    }
    res.status(404).json("El elemento que se pide no existe");
});

//Se obtienen los expedientes especificos de un map y se
//pasan en un array.
app.get("/api/map/:id/expedientes", function(req, res){
    var id = req.params.id;
    var expedientes_array = [];

    for(var i = 0; i<expedientes.length; i++){
        if(id == expedientes[i].map){
            expedientes_array.push(expedientes[i]);
        }
    }
    if(expedientes_array.length == 0){
        res.status(404).json("El medico no tiene pacientes");
        return;

    }
    else{
        res.status(200).json(expedientes_array);
        return;
    }
});

//creamos el GET que obtiene un array con todas las especialidades
app.get("/api/especialidades", function(req,res){
    res.status(200).json(especialidades);
    console.log("todo ok");
});

//creamos GET que obtiene un array con todos los centros
app.get("/api/centros", function(req,res){
    res.status(200).json(centros);
});

//creacion de un nuevo medico
app.post("/api/medico", function(req,res){
    var nuevo_id = 0;
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].id > nuevo_id){
            nuevo_id = medicos[i].id;
        }
    }
    //el nuevo map tiene que tener los mismos campos que los maps ya creados 
    //por eso se llaman igual los campos y lo rellenamos con los campos diferentes log y pass
    var nuevo_map = {
        id: nuevo_id + 1,
        nombre: req.body.nombre,
        apellidos : req.body.apellidos,
        login : req.body.log,
        password : req.body.pass,
        centro : req.body.centro
    };
    //Comprobacion de que se habia añadido bien
    //console.log(nuevo_map);

    //una vez hemos rellenado los campos lo tenemos que añadir al array de medicos y
    //comprobar que no existe el mismo login

    var existe = false;
    for(var i = 0; i < medicos.length; i++){
        if(medicos[i].login == nuevo_map.login){
            existe = true;
            break;
        }
    }
    if(existe){
        res.status(400).json("Ya existe ese login");
    }
    else{
        medicos.push(nuevo_map);
        res.status(201).json(nuevo_map);
    }
});

//Actualizar los datos de un expediente
app.put("/api/expediente/:id", function (req, res) {
	var id = req.params.id;

	// Encuentra el expediente que deseas actualizar
	var expediente = expedientes.find((exp) => exp.id == id);
	if (!expediente) {
		res.status(404).json("No se encontró ningún expediente con este ID");
		return;
	}

	// Actualiza los campos del expediente según lo que esté en req.body
	expediente.especialidad = req.body.especialidad || expediente.especialidad;
	expediente.sip = req.body.sip || expediente.sip;
	expediente.nombre = req.body.nombre || expediente.nombre;
	expediente.apellidos = req.body.apellidos || expediente.apellidos;
	expediente.fecha_nacimiento = req.body.fecha_nacimiento || expediente.fecha_nacimiento;
	expediente.genero = req.body.genero || expediente.genero;
	expediente.observaciones = req.body.observaciones || expediente.observaciones;
	expediente.solicitud = req.body.solicitud || expediente.solicitud;
    expediente.respuesta = req.body.respuesta || expediente.respuesta;
	//expediente.fecha_resolucion = req.body.fecha_resolucion || expediente.fecha_resolucion;

	res.status(200).json(expediente);
});



// Objeto para mantener un seguimiento de los últimos IDs de expedientes asociados a cada MAP
var ultimoIdExpedientePorMap = {};
// Endpoint para crear un nuevo expediente asociado a un MAP
app.post("/api/map/:id/expedientes", function(req, res) {
    var idMap = req.params.id;
    var nuevoExpediente = req.body;
    console.log(nuevoExpediente);

    // Validación para evitar datos prohibidos previamente
    var datosProhibidos = ["id", /*"fecha_creacion"*/, "fecha_asignacion", "fecha_resolucion"];
    for (var i = 0; i < datosProhibidos.length; i++) {
        if (nuevoExpediente.hasOwnProperty(datosProhibidos[i])) {
            return res.status(400).json({ error: "No se permiten datos prohibidos: " + datosProhibidos[i] });
        }
    }

    // Obtener el último ID de expediente asociado a este MAP utilizando un bucle for
    var ultimoIdExpediente = 0;
    for (var i = 0; i < expedientes.length; i++) {
        if (expedientes[i].map == idMap && expedientes[i].id > ultimoIdExpediente) {
            ultimoIdExpediente = expedientes[i].id;
        }
    }

    // Asignar el nuevo ID de expediente basado en el último ID encontrado
    var idExpediente = ultimoIdExpediente + 1;

    // Agregar el ID del MAP al nuevo expediente antes de guardarlo
    nuevoExpediente.idMap = idMap;

    nuevoExpediente.idMap = parseInt(nuevoExpediente.idMap);
    // Crear el nuevo expediente completo
    var nuevoExpedienteCompleto = {
        id: idExpediente,
        map: nuevoExpediente.idMap,
        me: 0,
        especialidad: parseInt(nuevoExpediente.especialidad),
        sip: nuevoExpediente.sip,
        nombre: nuevoExpediente.nombre,
        apellidos: nuevoExpediente.apellidos,
        fecha_nacimiento: nuevoExpediente.fechaNacimiento,
        genero: nuevoExpediente.genero,
        observaciones: nuevoExpediente.observaciones,
        solicitud: nuevoExpediente.solicitud,
        fecha_creacion: nuevoExpediente.fecha_creacion
    };

    // Agregar el nuevo expediente a la base de datos
    expedientes.push(nuevoExpedienteCompleto);

    // Devolver el ID del nuevo expediente
    res.status(201).json(expedientes);
});

/*VERSION MEJORADA PUT NUEVO EXPEDIENTE
app.post("/api/map/:id/expedientes", function (req, res) {
	const idMap = req.params.id;
	const nuevoExpediente = req.body;

	// Validación para evitar datos prohibidos previamente
	const datosProhibidos = ["id", "fecha_creacion", "fecha_asignacion", "fecha_resolucion"];
	const contieneDatosProhibidos = datosProhibidos.some((dato) => nuevoExpediente.hasOwnProperty(dato));
	if (contieneDatosProhibidos) {
		return res.status(400).json({ error: "No se permiten datos prohibidos" });
	}

	// Obtener el último ID de expediente asociado a este MAP
	const expedientesPorMap = expedientes.filter((expediente) => expediente.map == idMap);
	const ultimoIdExpediente = expedientesPorMap.length > 0 ? Math.max(...expedientesPorMap.map((expediente) => expediente.id)) : 0;

	// Asignar el nuevo ID de expediente basado en el último ID encontrado
	const idExpediente = ultimoIdExpediente + 1;

	// Agregar el ID del MAP al nuevo expediente antes de guardarlo
	nuevoExpediente.map = idMap;

	// Crear el nuevo expediente completo
	const nuevoExpedienteCompleto = {
		id: idExpediente,
		map: nuevoExpediente.map,
		especialidad: nuevoExpediente.especialidad,
		sip: nuevoExpediente.sip,
		nombre: nuevoExpediente.nombre,
		apellidos: nuevoExpediente.apellidos,
		fecha_nacimiento: nuevoExpediente.fechaNacimiento,
		genero: nuevoExpediente.genero,
		observaciones: nuevoExpediente.observaciones,
		solicitud: nuevoExpediente.solicitud,
	};

	// Agregar el nuevo expediente a la base de datos
	expedientes.push(nuevoExpedienteCompleto);

	// Devolver el nuevo expediente creado
	res.status(201).json(nuevoExpedienteCompleto);
});
*/


//CAMBIAR INFO DEL MEDICO INDICADO EN EL ID. 
//evitar que se repita el login
app.put("/api/medico/:id", function (req, res) {
	var id = req.params.id;
    console.log("el id del map es: ", id)
	var medico = medicos.find((med) => med.id == id);
	if (!medico) {
		res.status(404).json("El médico no existe");
		return;
	}

	// Verifica si ya existe otro médico con el mismo login
	var medicoExistente = medicos.find((med) => med.login === req.body.login && med.id != id);
	if (medicoExistente) {
		res.status(400).json("Ya existe otro médico con este login");
		return;
	}

	// Actualiza los campos del médico según lo que esté en req.body
	medico.nombre = req.body.nombre || medico.nombre;
	medico.apellidos = req.body.apellidos || medico.apellidos;
	medico.login = req.body.login || medico.login;
	medico.password = req.body.password || medico.password;
	medico.centro = req.body.centro || medico.centro;

	res.status(200).json(medico);
});

//BORRAMOS UN EXPEDIENTE CONCRETO
app.delete("/api/expediente/:id", function(req, res) {
    var idExpediente = req.params.id;
    var expedienteEncontrado = false;

    for (var i = 0; i < expedientes.length; i++) {
        if (expedientes[i].id == idExpediente) {
            expedientes.splice(i, 1);
            expedienteEncontrado = true;
            break;
        }
    }

    if (!expedienteEncontrado) {
        return res.status(404).send("No se encontró el expediente");
    }

    res.status(200).send("Expediente eliminado con éxito");
});

/*VERSION MEJORADA BORRAR EXPEDIENTE
// Version mejorada
app.delete("/api/expediente/:id", function(req, res) {
    const idExpediente = req.params.id;
    const expedienteIndex = expedientes.findIndex(expediente => expediente.id === idExpediente);

    if (expedienteIndex === -1) {
        return res.status(404).send("No se encontró el expediente");
    }

    expedientes.splice(expedienteIndex, 1);
    res.status(200).send("Expediente eliminado con éxito");


});
*/

app.listen(3000);