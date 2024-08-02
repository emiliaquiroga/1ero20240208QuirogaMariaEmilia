
const CONEXION_API = "https://examenesutn.vercel.app/api/VehiculoAutoCamion";
let listaObjetos = [];

let formularioABM = document.getElementById("ABM");
formularioABM.style.display = "none";
let formularioListado = document.getElementById("formularioLista");
formularioListado.style.display = "block";

//#region EVENTOS
document.addEventListener('DOMContentLoaded', function(){
    traerData();
    mostrarFormulario(formularioListado, true);
    mostrarFormulario(formularioABM, false);
    mostrarCamposPorVehiculo();
});

document.getElementById("tipos").addEventListener('change', function() {
    mostrarCamposPorVehiculo();
});

document.getElementById("btnAgregar").addEventListener('click', function(){
    mostrarAlta();
});

document.getElementById("btnCancelar").addEventListener('click', function(){
    crearTabla(listaObjetos);
    mostrarFormulario(formularioListado, true);
    mostrarFormulario(formularioABM, false);
});

document.getElementById("btnAceptar").addEventListener('click', function() {
    const tituloABM = document.getElementById("tituloABM").innerHTML;
    if (tituloABM === 'Alta' && validarFormularioABM()) {
        aceptarAgregar();
    } else if (tituloABM === 'Modificar') {
        aceptarModificar();
    } else if (tituloABM === 'Eliminar') {
        aceptarEliminar();
    }
});



//#endregion


//#region FUNCIONES DE MOSTRAR Y OCULTAR.
function mostrarFormulario(formulario, mostrar){
    if(mostrar){
        formulario.style.display = "block";
        
    }else {
        formulario.style.display = "none";
    }
}

function mostrarSpinner(){
    document.getElementById('spinner').style.display = 'block';
}
function ocultarSpinner(){
    document.getElementById('spinner').style.display = 'none';
}

function mostrarCamposPorVehiculo(){
    const tipo = document.getElementById("tipos").value;

    if (tipo === "Auto") {
        document.getElementById("divCantPuertas").style.display = "block";
        document.getElementById("divAsientos").style.display = "block";
        document.getElementById("divCarga").style.display = "none";
        document.getElementById("divAutonomia").style.display = "none";
        document.getElementById("numCantPuertas").disabled = false;
        document.getElementById("numAsientos").disabled = false;
        document.getElementById("divCarga").disabled= true;
        document.getElementById("divAutonomia").disabled = true;
    } else if (tipo === "Camion") {
        document.getElementById("divCantPuertas").style.display = "none";
        document.getElementById("divAsientos").style.display = "none";
        document.getElementById("divCarga").style.display = "block";
        document.getElementById("divAutonomia").style.display = "block";
        document.getElementById("numCantPuertas").disabled = true;
        document.getElementById("numAsientos").disabled = true;
        document.getElementById("numCarga").disabled= false;
        document.getElementById("numAutonomia").disabled = false;
    } else {
        document.getElementById("divCantPuertas").style.display = "block";
        document.getElementById("divAsientos").style.display = "block";
        document.getElementById("divCarga").style.display = "none";
        document.getElementById("divAutonomia").style.display = "none";
        document.getElementById("numCantPuertas").disabled = false;
        document.getElementById("numAsientos").disabled = false;
        document.getElementById("divCarga").disabled= true;
        document.getElementById("divAutonomia").disabled = true;
    }
}

function mostrarAlta(){
    LimpiarCeldas();
    document.getElementById("tituloABM").innerHTML = "Alta";
    mostrarFormulario(formularioABM, true);
    mostrarFormulario(formularioListado, false);
    mostrarCamposPorVehiculo();
}
function mostrarModificar(id){
    document.getElementById("tituloABM").innerHTML = "Modificar";
    mostrarFormulario(formularioABM, true);
    mostrarFormulario(formularioListado, false);
    modificarElemento(id);
    mostrarCamposPorVehiculo();
    document.getElementById("tipos").disabled = true;
}

function mostrarEliminar(id){
    document.getElementById("tituloABM").innerHTML = "Eliminar";
    mostrarFormulario(formularioABM, true);
    mostrarFormulario(formularioListado, false);
    LimpiarCeldas();
    document.getElementById("tipos").disabled = true;
    document.getElementById("txtModelo").disabled = true;
    document.getElementById("numAnoFabricacion").disabled = true;
    document.getElementById("numVelMax").disabled = true;

    let objeto = listaObjetos.find(obj => obj.id === id);

    document.getElementById("ID").value = objeto.id;
    document.getElementById("txtModelo").value = objeto.modelo;
    document.getElementById("numAnoFabricacion").value = objeto.anoFabricacion;
    document.getElementById("numVelMax").value = objeto.velMax;
    document.getElementById("tipos").value = objeto instanceof Auto ? "Auto" : "Camion";

    mostrarCamposPorVehiculo();
    if (objeto instanceof Auto) {
        document.getElementById('numCantPuertas').value = objeto.cantidadPuertas;
        document.getElementById('numCantPuertas').disabled = true;
        document.getElementById('numAsientos').value = objeto.asientos;
        document.getElementById('numAsientos').disabled = true;

    } else if (objeto instanceof Camion) {
        document.getElementById('numCarga').value = objeto.carga;
        document.getElementById('numCarga').disabled = true;
        document.getElementById('numAutonomia').value = objeto.autonomia;
        document.getElementById('numAutonomia').disabled = true;
    }

    //mostrarCamposPorVehiculo();
    crearTabla(listaObjetos);
}

//#endregion


//#region VALIDACIONES DE DATOS
function validarNoVacio(valor, campo) {
    if (!valor.trim()) {
        alert(`El campo ${campo} no puede estar vacío.`);
        return false;
    }
    return true;
}
function validarMayorA(valor, minimo, campo) {
    if (isNaN(valor) || valor <= minimo) {
        alert(`El campo ${campo} debe ser mayor a ${minimo}.`);
        return false;
    }
    return true;
}

function validarFormularioABM() {
    let modelo = document.getElementById("txtModelo").value;
    let anoFabricacion = parseInt(document.getElementById("numAnoFabricacion").value);
    let velMax = parseInt(document.getElementById("numVelMax").value);
    let tipo = document.getElementById("tipos").value;

    // Validar campos comunes
    if (!validarNoVacio(modelo, "Modelo") ||
        !validarMayorA(anoFabricacion, 1985, "Año de Fabricación") ||
        !validarMayorA(velMax, 0, "Velocidad Máxima")) {
        return false;
    }

    // Validar campos específicos por tipo de vehículo
    if (tipo === 'Auto') {
        let cantidadPuertas = parseInt(document.getElementById("numCantPuertas").value);
        let asientos = parseInt(document.getElementById("numAsientos").value);

        if (!validarMayorA(cantidadPuertas, 2, "Cantidad de Puertas") ||
            !validarMayorA(asientos, 2, "Cantidad de Asientos")) {
            return false;
        }
    } else if (tipo === 'Camion') {
        let carga = parseInt(document.getElementById("numCarga").value);
        let autonomia = parseInt(document.getElementById("numAutonomia").value);

        if (!validarMayorA(carga, 0, "Carga") ||
            !validarMayorA(autonomia, 0, "Autonomía")) {
            return false;
        }
    }

    return true;
}




//#endregion
//#region FUNCIONES ESTRUCTURALES DE FORMS

function $(id) { return document.getElementById(id); }

function crearTabla(lista){
    const tableBody = document.getElementById("body-tabla");
    tableBody.innerHTML = "";

    lista.forEach(elemento => {
        const fila = document.createElement("tr");
        fila.innerHTML =`
        <td>${elemento.id}</td>
        <td>${elemento.modelo}</td>
        <td>${elemento.anoFabricacion}</td>
        <td>${elemento.velMax}</td>
        <td>${elemento.cantidadPuertas || 'N/A'}</td>
        <td>${elemento.asientos || 'N/A'}</td>
        <td>${elemento.carga || 'N/A'}</td>
        <td>${elemento.autonomia || 'N/A'}</td>
        <td> <button id = "btnModificar" onclick="mostrarModificar(${elemento.id})">Modificar</button></td>
        <td> <button id = "btnEliminar" onclick="mostrarEliminar(${elemento.id})">Eliminar</button></td>
        `;
        tableBody.appendChild(fila);
    });
}

function LimpiarCeldas(){
    document.getElementById("tipos").disabled = false;
    document.getElementById("txtModelo").disabled = false;
    document.getElementById("numAnoFabricacion").disabled = false;
    document.getElementById("numVelMax").disabled = false;
    document.getElementById("tipos").disabled = false;
    document.getElementById("numCantPuertas").disabled = false;
    document.getElementById("numAsientos").disabled = false;
    document.getElementById("numCarga").disabled = false;
    document.getElementById("numAutonomia").disabled = false;

    document.getElementById("ID").value = '';
    document.getElementById("txtModelo").value = '';
    document.getElementById("numAnoFabricacion").value = '';
    document.getElementById("numVelMax").value = '';
    document.getElementById("numCantPuertas").value = '';
    document.getElementById("numAsientos").value = '';
    document.getElementById("numCarga").value = '';
    document.getElementById("numAutonomia").value = '';

    document.getElementById("divCantPuertas").style.display = "block";
    document.getElementById("divAsientos").style.display = "block";
    document.getElementById("divCarga").style.display = "none";
    document.getElementById("divAutonomia").style.display = "none";


    mostrarCamposPorVehiculo();
}



function filtrarPorVehiculo(lista){
    return lista.map(item => {
        if(item.cantidadPuertas){
            return new Auto(item.id, item.modelo, item.anoFabricacion, item.velMax, item.cantidadPuertas, item.asientos);
        }else{
            return new Camion(item.id, item.modelo, item.anoFabricacion, item.velMax, item.carga, item.autonomia);
        }
    });
}


function traerData() {
    var xhttp = new XMLHttpRequest();
    mostrarSpinner();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4) {
            ocultarSpinner();
            
            if (xhttp.status == 200) {
                listaObjetos = JSON.parse(xhttp.responseText);
                listaObjetos = filtrarPorVehiculo(listaObjetos);
                crearTabla(listaObjetos);
                console.log(listaObjetos);
            } else {
                alert('Error al obtener datos de la API. Código de estado: ' + xhttp.status);
            }
        }
    };
    
    xhttp.open("GET", CONEXION_API, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send();
}

function agregarElemento(){
    let tipo = document.getElementById("tipos").value;
    let modelo = document.getElementById("txtModelo").value;
    let anoFabricacion = document.getElementById("numAnoFabricacion").value;
    let velMax = parseInt(document.getElementById("numVelMax").value);

    if(tipo === 'Auto'){
        let cantPuertas = document.getElementById("numCantPuertas").value;
        let asientos = document.getElementById("numAsientos").value;
        return new Auto(null, modelo, anoFabricacion, velMax, cantPuertas, asientos);
    }else if(tipo === 'Camion'){
        let carga = document.getElementById("numCarga").value;
        let autonomia= document.getElementById("numAutonomia").value;
        return new Camion(null, modelo, anoFabricacion, velMax, carga, autonomia);
    }else{
        alert("Ha ocurrido un error al momento de instanciar el nuevo Vehiculo!");
        console.log("error en la función agregarElemento");
        return null;
    }
}

async function aceptarAgregar(){ 
    let nuevoElemento = agregarElemento(); 
    mostrarSpinner();

    try {
        await new Promise(resolve => setTimeout(resolve, 2000)); 

        const respuesta = await fetch(CONEXION_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoElemento)
        });

        if (!respuesta.ok) {
            throw new Error('No se pudo agregar el nuevo elemento.');
        }

        const res = await respuesta.json();
        console.log(res);
        nuevoElemento.id = res.id;

        listaObjetos.push(nuevoElemento);
        crearTabla(listaObjetos);

        ocultarSpinner();
        mostrarFormulario(formularioABM, false);
        LimpiarCeldas();
        mostrarFormulario(formularioListado, true);

    } catch (error) {
        console.error('Error al agregar nuevo elemento:', error);
        alert('Error al agregar el nuevo elemento. Por favor, intenta nuevamente.');

    } finally {
        ocultarSpinner(); 
    }
}

function modificarElemento(id) {
    let objeto = listaObjetos.find(obj => obj.id === id);
    document.getElementById("ID").value = objeto.id;
    document.getElementById("txtModelo").value = objeto.modelo;
    document.getElementById("numAnoFabricacion").value = objeto.anoFabricacion;
    document.getElementById("numVelMax").value = objeto.velMax;

    if (objeto instanceof Auto) {
        document.getElementById("tipos").value = "Auto";
        document.getElementById("numCantPuertas").value = objeto.cantidadPuertas;
        document.getElementById("numAsientos").value = objeto.asientos;
    } else if (objeto instanceof Camion) {
        document.getElementById("tipos").value = "Camion";
        document.getElementById("numCarga").value = objeto.carga;
        document.getElementById("numAutonomia").value = objeto.autonomia;
    }

    mostrarCamposPorVehiculo(); 
}

function aceptarModificar(){
    let id = parseInt(document.getElementById("ID").value);
    let modelo = document.getElementById("txtModelo").value;
    let anoFabricacion = document.getElementById("numAnoFabricacion").value;
    let velMax = parseInt(document.getElementById("numVelMax").value);

    let objetoModificado;
    if(document.getElementById("tipos").value === "Auto"){
        let cantidadPuertas = document.getElementById("numCantPuertas").value;
        let asientos = document.getElementById("numAsientos").value;

        objetoModificado = new Auto(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos);
    }else if(document.getElementById("tipos").value === "Camion"){
        let carga = document.getElementById("numCarga").value;
        let autonomia = document.getElementById("numAutonomia").value;
        objetoModificado = new Camion(id, modelo, anoFabricacion, velMax, carga, autonomia);
    }
    mostrarSpinner();
    
    return new Promise((resolve, reject)=>{
        fetch(CONEXION_API,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objetoModificado)
        })
        .then(response =>{
            ocultarSpinner();
            if(response.status === 200){
                return response.text();
            }else{
                throw new Error('No se pudo modificar el Vehiculo. Estado: ' + response.status);
            }
        })
        .then(respuesta =>{
            let respuestaParseada;
            try{
                respuestaParseada = JSON.parse(respuesta);
            }catch(error){
                respuestaParseada = respuesta;
            }

            const index = listaObjetos.findIndex(obj => obj.id === id);
            
            listaObjetos[index] = objetoModificado;
            LimpiarCeldas();
            crearTabla(listaObjetos);
            mostrarFormulario(formularioABM, false);
            mostrarFormulario(formularioListado, true);
            resolve();
        })
        .catch(error =>{
            console.error('Error al modificar Vehiculo: ', error);
            alert('Error al modificar el Vehiculo. Por favor, intenta nuevamente.');

            ocultarSpinner();
            crearTabla(listaObjetos);
            mostrarFormulario(formularioABM, false);
            LimpiarCeldas();
            mostrarFormulario(formularioListado, true);
        });
    });
}

function aceptarEliminar(){
    const id = parseInt(document.getElementById("ID").value);
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", CONEXION_API, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');

    mostrarSpinner();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4) {
            ocultarSpinner();
            console.log(xhttp.status);
            if (xhttp.status === 200) {                
                const index = listaObjetos.findIndex(e => e.id === parseInt(id));
                if (index !== -1) {
                    listaObjetos.splice(index, 1); 
                } else {
                    console.error('Elemento no encontrado en listaElementos.');
                
                } 
                LimpiarCeldas();
                crearTabla(listaObjetos);
                mostrarFormulario(formularioABM,false);
                mostrarFormulario(formularioListado,true);
            }else {
                alert('Error al obtener datos de la API. Código de estado: ' + xhttp.status);
            }
        }
    };
    xhttp.send(JSON.stringify({id: parseInt(id)}));
}



//#endregion