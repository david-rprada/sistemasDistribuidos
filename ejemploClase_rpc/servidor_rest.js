var express = require("express");
var app = express();
app.use("/apiCliente", express.static("cliente_rest")); 
app.use(express.json()); 

var datos = require('./datos.js');
//console.log(datos, 'the json obj');

var hospitales = datos.hospi;


var siguienteHospital = 3;

app.get("/api/hospitales", function (req, res) {
    res.status(200).json(hospitales);
});

//get con parámetros url

app.get("/api/hospitales/:idHospital", function (req, res) {
    var id = req.params.idHospital;
    console.log(id)
    var hospital=hospitales.find(elem => elem.id==id);
    console.log(hospital);
    res.status(200).json(hospital);
    
});

app.post("/api/hospitales", function (req, res) {
    console.log(req.body)
    var hosp = {
        id: siguienteHospital,
        nombre: req.body.nombre,
        provincia: req.body.provincia
    };
    hospitales.push(hosp);
    siguienteHospital++;
    res.status(201).json("Hospital creado");
});

app.delete("/api/hospital/:idHospital", function (req, res) {
    var id = req.params.idHospital;
    for (var i = 0 ; i<hospitales.length ; i++) {
        if (hospitales[i].id == id) {
            hospitales.splice(i, 1);
            res.status(200).json("Hospital borrado");
            return;
        }
    }
    res.status(404).json("No se ha encontrado el hospital a borrar");
});

app.put("/hospital/:idHospital", function (req, res){ 
    var id = req.params.idHospital;
        console.log("Solicita actualizar el hospital con id: ", id) 
    var indice = hospitales.findIndex(elem => elem.id==id);
        console.log("Encontramos coincidencia para el índice", indice)
        if(indice>=0){
            hospitales[indice] = req.body; 
            res.status(200);
            res.json("Hospital actualizado"); 
        }
        else{
            res.status(404); 
            res.json("Hospital no encontrado"); 
        }
    });


app.listen(3000);