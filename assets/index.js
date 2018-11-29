var user;
var snap = [];

var currentUrl = window.location.pathname

function back() {
  window.location.href = ''+currentUrl+''
}

function llenarTableAdmin() {
  var firebaseTable = firebase.database().ref().child("Registros");
  firebaseTable.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      var economico = child.child("Economico").val()
      var id = child.child("ID").val()
      snap.push({Economico: economico, ID: id})
     });
  });
}

function addTable() {

    var countries = [
        { Name: "", Id: 0 },
        { Name: "United States", Id: 1 },
        { Name: "Canada", Id: 2 },
        { Name: "United Kingdom", Id: 3 }
    ];

    $("#jsGrid").jsGrid({

      width: "100%",
      height: "400px",

      autoload: false,
      // controller: {
      //   loadData: $.noop,
      //   insertItem: $.noop,
      //   deleteItem: $.noop
      // },

      inserting: true,
      editing: false,
      sorting: true,
      paging: true,

      invalidMessage: "¡Informacion Invalida!",
      deleteConfirm: "¿Esta seguro?",
      noDataContent: "No hay informacion",

      data: snap,

      onItemInserted: function(args) {
        var registrosFir = firebase.database().ref().child("Registros")
        registrosFir.push(args.item)
      },

      onItemDeleted: function(args) {
        // cancel deletion of the item with 'protected' field
        var registrosFir = firebase.database().ref().child("Registros").orderByChild("Economico").equalTo(args.itemIndex)
        registrosFir.update(null)
      }, 

      fields: [
          { name: "Economico", type: "text", width: 40, validate: "required" },
          { name: "ID", type: "text", width: 40, validate: "required" },
          { type: "control" }
      ]

    });
}

function crearUsuario() {
  var email = $("#loginEmailCrear").val();
  var password = $("#loginPasswordCrear").val();

  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {

    if (error == null) {
      alert("Usuario Registrado!")
    }

  // Handle Errors here.
    var errorMessage = error.message;

    alert(errorMessage)

  // ...
  });
}

function salirSesion() {
  firebase.auth().signOut().then(function() {
  // Sign-out successful.
}, function(error) {
  alert("Hubo un error al salir de la sesion.");
});
}

function tablaGeneral() {

  $("#tableFilter").hide();
  $(".regresarBtn").hide()
  $(".selectEco").show()
  $(".filterBtn").show()

  var rootRef = firebase.database().ref().child("ScannerCamion");

        var estatusEntrada = "Entrada"

        var REF = firebase.database().ref()

        var filterRefEntrada = rootRef.orderByChild('Estatus').equalTo("\"Entrada\"");

        var ids = ""

        var firebaseFilterRef = firebase.database().ref()

  rootRef.child("ID's").on("child_added", snap => {

          var economico = snap.child("Economico").val();
          var estatus = snap.child("Estatus").val();
          var horaEntrada = snap.child("Hora Entrada").val();
          var horaSalida = snap.child("Hora Salida").val();
          var fecha = snap.child("Fecha").val();

          var estatusNew = estatus.replace("\"", "");
          var estatusNew2 = estatusNew.replace("\"", "");
          var horaEntradaNew = horaEntrada.replace("\"", "");
          var horaEntradaNew2 = horaEntradaNew.replace("\"", "");
          if (horaSalida != null) {
            var horaSalidaNew = horaSalida.replace("\"", "");
            var horaSalidaNew2 = horaSalidaNew.replace("\"", "");
          }
          var fechaNew = fecha.replace("\"", "");
          var fechaNew2 = fechaNew.replace("\"", "");




          // alert(estatusHeading);

          $("#table_body_firebase").append("<tr><td class='eco'><strong class='eco'>" + economico + "</strong></td><td>" + estatusNew2 +
                      "</td><td>" + horaEntradaNew2 + "</td><td>" + horaSalidaNew2 + "</td><td class='fecha'>" + fechaNew2 + "</td></tr>");

          $("#selectEco").append("<option>" + economico + "</option>");

        });
}

function loginFirebase() {

    var email = $("#loginEmail").val();
    var password = $("#loginPassword").val();

    if(email == "admin" && password == "pass") {
      window.location.href = ''+currentUrl+'#/charts/chartist'
    }

    if(email != "" && password != ""){

      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        $("#error").show()
        $("#error").text(errorMessage)
    });
  }
}

function filtrar(){
  
  $(".selectEco").hide()
  $(".filterBtn").hide()
  $(".regresarBtn").show()

  var text = $( "#selectEco option:selected" ).text();

  var rootRef = firebase.database().ref().child("ScannerCamion");

  var refFilter = firebase.database().ref().child("Control")

  var keyFilter = ""

  rootRef.child("ID's").orderByChild("Economico").equalTo(text).once("value", function (snapshot) { 
    // var parent = snapshot.key;
    // alert(parent)

    var key;

    snapshot.forEach(function (childSnapshot) {
      key = childSnapshot.key;
      return true; // Cancel further enumeration.
    });

    if (key) {
      console.log("Found user: " + key);
      keyFilter = key

    } else {
      console.log("User not found.");
    }

  });



  if (text != "Seleccionar Economico") {
    $("#tableHead").hide();
    $("#tableFilter").show();
    $("#table_body_firebase").hide();
    $("#text").text("Filtro de Economico " + text)

  }

  $("#article").show();


    var refFilter = firebase.database().ref().child("Control")

    refFilter.child(keyFilter).on("child_added", snap => {

    var estatus = snap.child("Estatus").val();
    var hora = snap.child("Hora").val();
    var fecha = snap.child("Fecha").val();
    var lugar = snap.child("Lugar").val();

    var estatusNew = estatus.replace("\"", "");
    var estatusNew2 = estatusNew.replace("\"", "");
    var horaNew = hora.replace("\"", "");
    var horaNew2 = horaNew.replace("\"", "");
    var fechaNew = fecha.replace("\"", "");
    var fechaNew2 = fechaNew.replace("\"", "");
    var lugarNew = lugar.replace("\"", "");
    var lugarNew2 = lugarNew.replace("\"", "");


    // alert(estatusHeading);



    $("#table_body_firebase_filter").append("<tr><td>" + estatusNew2 + "</td><td>" + fechaNew2 + "</td><td class='fecha'>" + horaNew2 + "</td><td>" + lugarNew2 + "</td></tr>");

    

    });


};

function firebaseUser() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      window.location.href = ''+currentUrl+'#/dashboard'

    } else {
      window.location.href = ''+currentUrl+'#/'
    }
  })
}


  // var idHeading = document.getElementById("idHeading");
  // var economicoHeading = document.getElementById("economicoHeading");
  // var estatusHeading = document.getElementById("estatusHeading");
  // var horaEntradaHeading = document.getElementById("horaEntradaHeading");
  // var horaSalidaHeading = document.getElementById("horaSalidaHeading");
  //your code here




      window.onload = function() {

        $("#tableFilter").hide();

        var rootRef = firebase.database().ref().child("ScannerCamion");

        var estatusEntrada = "Entrada"

        var REF = firebase.database().ref()

        var filterRefEntrada = rootRef.orderByChild('Estatus').equalTo("\"Entrada\"");

        var ids = ""

        var firebaseFilterRef = firebase.database().ref()

        firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            // User is signed in.
            window.location.href = ''+currentUrl+'#/dashboard'

          } else {
            window.location.href = ''+currentUrl+'#/'
          }
        })


        $('#eco').click(function(){

          // alert($("#table_body_firebase").closest('td').text());
      
        }); 

        function ver(){
          // alert($("#table_body_firebase").closest('td').text());
        }

        function borrar(eco){
          
        }

        rootRef.on("value", snap => {

          // alert($("#table_body_firebase").closest('td').text());

        })

          // code to read selected table row cell data (values)

        

      };

      
      // window.onload = function() {
      //   if(!window.location.hash) {
      //   window.location = window.location + '#loaded';
      //   window.location.reload();
      //   }
      // }


// href='#/components/social-buttons'
// <td><button onclick='borrar();' class='button is-danger'>Borrar</button></td>
  // <a id='detalle' onclick='detalleClick();'' href='#/components/social-buttons'>Ver</a>