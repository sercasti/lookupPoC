gastosUrl = 'https://nij0bdszf8.execute-api.us-east-1.amazonaws.com/default/buscarGastos';

personaUrl = 'https://nij0bdszf8.execute-api.us-east-1.amazonaws.com/default/buscarPersonas';

function submitDNI(){
  cleanDNIContainer();
  loadPersona();
  loadGastos();
  document.getElementById("dataContainer").style.visibility = 'visible';
}

function loadPersona(){
    var queryParam = '?dni=' + document.getElementById("dni").value;
    fetch(personaUrl + queryParam)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        buildPersona(data);
      });
}

function buildPersona(results){
    var personaBrief = document.getElementById("personaBrief");
    personaBrief.innerHTML = results.personData.dni;
    if('name' in results.personData){
      personaBrief.innerHTML = personaBrief.innerHTML + ' - ' + results.personData.name;
    }
    var personaTable = document.getElementById("persona");
    personaTable.innerHTML = "";
    Object.entries(results.personData).forEach(([key, value]) => {
        var row = personaTable.insertRow();
        var keyCell = row.insertCell(0);
        var valueCell = row.insertCell(1);
        keyCell.innerHTML = "<b>" + key + "</b>";
        valueCell.innerHTML = value;
    });  
    
    var filesTable = document.getElementById("files");
    filesTable.innerHTML = "";

    if(results.files.length == 0){
      document.getElementById("personaFiles").style.visibility = 'hidden';
    } else {
      document.getElementById("personaFiles").style.visibility = 'visible';
      results.files.forEach(element => {
          var row = filesTable.insertRow();
          var nombreCell = row.insertCell(0);
          var tamanoCell = row.insertCell(1);
          var modifiedCell = row.insertCell(2);
          nombreCell.innerHTML = '<a href=' + element.URL + ' download>' + element.Name + '</a>';
          tamanoCell.innerHTML = element.Size;
          modifiedCell.innerHTML = element.LastModified;
          if('Metadata' in element && element.Metadata['tipo'] === 'dni'){
              showDNI(element.URL);
          }
      });    
      var header = filesTable.createTHead();
      var row = header.insertRow(0);
      var headerNombre = row.insertCell(0);
      var headerTamano = row.insertCell(1);
      var headerModificado = row.insertCell(2);
      headerNombre.innerHTML = "<b>Nombre Archivo</b>";
      headerTamano.innerHTML = "<b>Tamaño</b>";
      headerModificado.innerHTML = "<b>Ultima mod.</b>";
    }
}

function cleanDNIContainer(){
  var container = document.getElementById("dniImage");
  if(container.childNodes.length > 0){
    container.removeChild(container.childNodes[0]);
    container.style.visibility = 'hidden';
  }
}

function showDNI(dniURL){
    var dniImgURL = document.createElement("img"); 
    dniImgURL.src = dniURL;
    dniImgURL.setAttribute("height", "200");
    dniImgURL.setAttribute("width", "400");
    document.getElementById("dniImage").appendChild(dniImgURL);
    document.getElementById("dniImage").style.visibility = 'visible';
}

function loadGastos(){
    var queryParam = '?dni=' + document.getElementById("dni").value;
    fetch(gastosUrl + queryParam)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        buildGastos(data);
      });
}

function buildGastos(results){
    var gastosTable = document.getElementById("gastos");
    gastosTable.innerHTML = "";
    for(i = 0; i < results.length; i++){
        var result = results[i];
        var row = gastosTable.insertRow(i);
        var fechaCell = row.insertCell(0);
        var entidadCell = row.insertCell(1);
        var importeCell = row.insertCell(2);
        fechaCell.innerHTML = result.fecha;
        entidadCell.innerHTML = result.entidad;
        importeCell.innerHTML = result.importe;
    }
    var header = gastosTable.createTHead();
    var row = header.insertRow(0);
    var headerFecha = row.insertCell(0);
    var headerEntidad = row.insertCell(1);
    var headerImporte = row.insertCell(2);
    headerFecha.innerHTML = "<b>Fecha</b>";
    headerEntidad.innerHTML = "<b>Entidad</b>";
    headerImporte.innerHTML = "<b>Importe</b>";
}

function searchFiles() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("files");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
}