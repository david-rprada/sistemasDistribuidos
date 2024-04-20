// rest.get(url, callback)
// rest.post(url, body, callback)
// rest.put(url, body, callback)
// rest.delete(url, callback)
// function callback(estado, respuesta) {...}

function actualizarHospitales() { // actualiza la lista de hospitales
    rest.get("/api/hospitales", function (estado, hospitales) {
        console.log("Estado:", estado, "Hospitales:", hospitales);
        if (estado != 200) {
            alert("Error cargando la lista de hospitales");
            return;
        }
        var lista = document.getElementById("hospitales");
        lista.innerHTML = "";
        for (var i = 0; i < hospitales.length; i++) {
            lista.innerHTML += "<li>" + hospitales[i].id + " - " + hospitales[i].nombre + " - " + hospitales[i].provincia + " <button onclick='eliminarHospital(" + hospitales[i].id + ")'>Borrar</button></li>";
        }
    });
}

function actualizarHospitalesParam() { // actualiza la lista de hospitales
    var idHosp=1;
    rest.get("/api/hospitales/"+idHosp, function (estado, hospital) {
        console.log("Estado:", estado, "Hospitales:", hospital);
        if (estado != 200) {
            alert("Error cargando la lista de hospitales");
            return;
        }
      
        var lista = document.getElementById("hospitales");
        lista.innerHTML = "";
        lista.innerHTML += "<li>" + hospital.id + " - " + hospital.nombre + " - " + hospital.provincia + " <button onclick='eliminarHospital(" + hospital.id + ")'>Borrar</button></li>";
        
    });
}



function nuevoHospital() {
    var hospital = {
        nombre: document.getElementById("nombre").value,
        provincia: document.getElementById("provincia").value
    };
    console.log(hospital);
    rest.post("/api/hospitales", hospital, function (estado, respuesta) {
        if (estado == 201) {
            actualizarHospitales();
        } else {
            alert("Error introduciendo nuevo hospital");
        }
    });
}

function eliminarHospital(idHospital) {
    rest.delete("/api/hospital/" + idHospital, function (estado, respuesta) {
        if (estado == 200) {
           actualizarHospitales();
        } else {
            alert("No se ha podido borrar el hospital");
        }
    });
}

actualizarHospitales();