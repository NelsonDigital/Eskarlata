var userId;
auth.onAuthStateChanged((user) => {
    if (user) {
        userId = user.uid;
        var userDocumentRef = db.collection("users").doc(userId);
        userDocumentRef.get().then((doc) => {
            const datos = doc.data();
            const formulario = (datos.formulario_realizado);
            if (typeof formulario === 'undefined') {
                window.location.href = "../registro";
            }
            $(".foto").attr("src", datos.fotoUrl).attr("srcset", datos.fotoUrl);
            $("#nombre").text(datos.Nombre + " " + datos.Apellido);
            const documento = datos.Documento;
            $("#documento").text(datos.T_documento + ": " + documento);
            $("#telefono").text(datos.Telefono);
            $("#email").text(datos.Email);

            $("#estado-contrato-ojo").text(datos.EstadoContratoOjo ? datos.EstadoContratoOjo : "En espera de archivo");
            $("#estado-cuentas-participacion").text(datos.EstadoCuentasParticipacion ? datos.EstadoCuentasParticipacion : "En espera de archivo");
            $("#estado-compra-venta").text(datos.EstadoArchivoCompraVenta ? datos.EstadoArchivoCompraVenta : "En espera de archivo");
            $("#estado-autorizacion-mejoras").text(datos.EstadoArchivoAutorizacionMejoras ? datos.EstadoArchivoAutorizacionMejoras : "En espera de archivo");

            const usersCollectionRef = db.collection("users");
            usersCollectionRef
                .where("documentoreferencia", "==", documento)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        $("#n-referidos").text(querySnapshot.size + " REFERIDOS");
                        let nombreCompletoHTML = '';
                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            const nombreCompleto = data.Nombre + " " + data.Apellido;
                            nombreCompletoHTML += nombreCompleto + "<br>";
                        });
                        $("#nombre_asesores").html(nombreCompletoHTML);
                    }
                });
        });
        barra();
    } else {
        window.location.href = "../";
    }
});

function barra() {
    const estados = [EstadoContratoOjo, EstadoArchivoCompraVenta, EstadoCuentasParticipacion, EstadoArchivoAutorizacionMejoras], totalEstados = estados.length, estadosDefinidos = estados.filter(o => null != o), cantidadEstadosDefinidos = estadosDefinidos.length, porcentajeEstadosDefinidos = cantidadEstadosDefinidos / totalEstados * 100; cantidadEstadosDefinidos > 0 && ($("#barra-informacion").css("width", porcentajeEstadosDefinidos + "%"), $("#porcentaje_informacion").text(porcentajeEstadosDefinidos + "%"));
}

const cargarPerfil = document.getElementById("cargar-perfil");
const cargarPerfilInput = document.createElement("input");
cargarPerfilInput.setAttribute("type", "file");
cargarPerfilInput.setAttribute("id", "cargar-fotos");
cargarPerfilInput.setAttribute("accept", "image/*");
cargarPerfilInput.style.display = "none";

cargarPerfil.parentNode.insertBefore(cargarPerfilInput, cargarPerfil.nextSibling);

cargarPerfil.addEventListener("click", () => {
    cargarPerfilInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputFoto = document.getElementById("cargar-fotos");
    const mensaje = $("#cargar-perfil");

    inputFoto.addEventListener("change", e => {
        mensaje.text("Cargando imagen...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/perfil`);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ fotoUrl: url }).then(() => {
                    $(".foto").attr("src", url).attr("srcset", url);
                    mensaje.text("Subir imagen");
                }).catch(error => {
                    mensaje.text("Error al cargar imagen");
                    console.error(error);
                });
            });
        });
    });
});

const logOutButton = $("#log-out-button"); logOutButton.click(() => { auth.signOut().then(() => { window.location.href = "../" }).catch(t => { console.log(t.code) }) });

const cargarContratoOjo = document.getElementById("cargar-contrato-ojo-de-oso");
const cargarContratoOjoInput = document.createElement("input");
cargarContratoOjoInput.setAttribute("type", "file");
cargarContratoOjoInput.setAttribute("id", "cargar-archivo-contrato-ojo");
cargarContratoOjoInput.setAttribute("accept", ".pdf");
cargarContratoOjoInput.style.display = "none";

cargarContratoOjo.parentNode.insertBefore(cargarContratoOjoInput, cargarContratoOjo.nextSibling);

cargarContratoOjo.addEventListener("click", () => {
    cargarContratoOjoInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputContratoDirector = document.getElementById("cargar-archivo-contrato-ojo");

    inputContratoDirector.addEventListener("change", e => {
        $("#texto-contrato-ojo").text("Cargando archivo...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/contrato-ojo`);

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoContratoOjo: url, EstadoContratoOjo: "En revisión" }).then(() => {
                    EstadoContratoOjo = "En revisión";
                    $("#estado-contrato-ojo").text("En revisión");
                    $("#texto-contrato-ojo").text("Cargar");
                    barra();
                }).catch(error => {
                    $("#texto-contrato-ojo").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});

const cargarCuentasParticipacion = document.getElementById("cargar-cuentas-participacion");
const cargarCuentasParticipacionInput = document.createElement("input");
cargarCuentasParticipacionInput.setAttribute("type", "file");
cargarCuentasParticipacionInput.setAttribute("id", "cargar-archivo-cuentas-participacion");
cargarCuentasParticipacionInput.setAttribute("accept", ".pdf");
cargarCuentasParticipacionInput.style.display = "none";

cargarCuentasParticipacion.parentNode.insertBefore(cargarCuentasParticipacionInput, cargarCuentasParticipacion.nextSibling);

cargarCuentasParticipacion.addEventListener("click", () => {
    cargarCuentasParticipacionInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputCuentasParticipacion = document.getElementById("cargar-archivo-cuentas-participacion");

    inputCuentasParticipacion.addEventListener("change", e => {
        $("#texto-cuentas-participacion").text("Cargando archivo...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/cuentas-participacion`);

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoCuentasParticipacion: url, EstadoCuentasParticipacion: "En revisión" }).then(() => {
                    $("#estado-cuentas-participacion").text("En revisión");
                    $("#texto-cuentas-participacion").text("Cargar");
                    barra();
                }).catch(error => {
                    $("#texto-cuentas-participacion").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});

const cargarArchivoCompraVenta = document.getElementById("cargar-compra-venta");
const cargarArchivoCompraVentaInput = document.createElement("input");
cargarArchivoCompraVentaInput.setAttribute("type", "file");
cargarArchivoCompraVentaInput.setAttribute("id", "cargar-archivo-compra-venta");
cargarArchivoCompraVentaInput.setAttribute("accept", ".pdf");
cargarArchivoCompraVentaInput.style.display = "none";

cargarArchivoCompraVenta.parentNode.insertBefore(cargarArchivoCompraVentaInput, cargarArchivoCompraVenta.nextSibling);

cargarArchivoCompraVenta.addEventListener("click", () => {
    cargarArchivoCompraVentaInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputCompraVenta = document.getElementById("cargar-archivo-compra-venta");

    inputCompraVenta.addEventListener("change", e => {
        $("#texto-compra-venta").text("Cargando archivo...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/compra-venta`); // Nombre de archivo "perfil"

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoCompraVenta: url, EstadoArchivoCompraVenta: "En revisión" }).then(() => {
                    $("#estado-compra-venta").text("En revisión");
                    $("#texto-compra-venta").text("Cargar");
                    barra();
                }).catch(error => {
                    $("#texto-compra-venta").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});

const cargarArchivoAutorizacionMejoras = document.getElementById("cargar-autorizacion-mejoras");
const cargarArchivoAutorizacionMejorasInput = document.createElement("input");
cargarArchivoAutorizacionMejorasInput.setAttribute("type", "file");
cargarArchivoAutorizacionMejorasInput.setAttribute("id", "cargar-archivo-autorizacion-mejoras");
cargarArchivoAutorizacionMejorasInput.setAttribute("accept", ".pdf");
cargarArchivoAutorizacionMejorasInput.style.display = "none";

cargarArchivoAutorizacionMejoras.parentNode.insertBefore(cargarArchivoAutorizacionMejorasInput, cargarArchivoAutorizacionMejoras.nextSibling);

cargarArchivoAutorizacionMejoras.addEventListener("click", () => {
    cargarArchivoAutorizacionMejorasInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputAutorizacionMejoras = document.getElementById("cargar-archivo-autorizacion-mejoras");

    inputAutorizacionMejoras.addEventListener("change", e => {
        $("#texto-autorizacion-mejoras").text("Cargando archivo...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/autorizacion-mejoras`); // Nombre de archivo "perfil"

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoAutorizacionMejoras: url, EstadoArchivoAutorizacionMejoras: "En revisión" }).then(() => {
                    $("#estado-autorizacion-mejoras").text("En revisión");
                    $("#texto-autorizacion-mejoras").text("Cargar");
                    barra();
                }).catch(error => {
                    $("#texto-autorizacion-mejoras").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});