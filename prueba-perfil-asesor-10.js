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
            const documento = datos.Documento,
                documentoReferencia = datos.documentoreferencia;
            $("#documento").text(datos.T_documento + ": " + documento);
            $("#telefono").text(datos.Telefono);
            $("#email").text(datos.Email);
            const rol = datos.Rol;
            if (rol != "Asesor") {
                window.location.href = "../";
            }

            const usersCollectionRef = db.collection("users");
            usersCollectionRef
                .where("Documento", "==", documentoReferencia)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.size > 0) {
                        const doc = querySnapshot.docs[0];
                        const data = doc.data();
                        $("#nombre_director").text(data.Nombre + " " + data.Apellido);
                    }
                });
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
                        $("#nombre_inversionista").html(nombreCompletoHTML);

                    }
                });
        });
        barra();
    } else { window.location.href = "../"; }
});

function barra() {
    const userDocumentRef = db.collection("users").doc(userId);
    userDocumentRef.get().then((doc) => {
        const datos = doc.data();
        const colores = {
            "En espera de archivo": "#00b6ff",
            "En revisión": "#ffa109",
            "Aprobado": "#38b43c",
            "Denegado": "red"
        };

        const elementos = [
            { id: "#estado-compra-venta", estado: datos.EstadoArchivoCompraVenta || "En espera de archivo" },
            { id: "#estado-cuentas-participacion", estado: datos.EstadoCuentasParticipacion || "En espera de archivo" },
            { id: "#estado-autorizacion-mejoras", estado: datos.EstadoAutorizacionMejoras || "En espera de archivo" },
            { id: "#estado-comprobante-pago", estado: datos.EstadoComprobantePago || "En espera de archivo" },
            { id: "#estado-documento", estado: datos.EstadoDocumento || "En espera de archivo" }
        ];

        elementos.forEach(elemento => {
            const { id, estado } = elemento;
            const color = colores[estado] || "red";
            $(id).css("color", color);
        });
       
        $("#estado-compra-venta").text(datos.EstadoArchivoCompraVenta ? datos.EstadoArchivoCompraVenta : "En espera de archivo");
        $("#estado-cuentas-participacion").text(datos.EstadoCuentasParticipacion ? datos.EstadoCuentasParticipacion : "En espera de archivo");
        $("#estado-autorizacion-mejoras").text(datos.EstadoAutorizacionMejoras ? datos.EstadoAutorizacionMejoras : "En espera de archivo");
        $("#estado-comprobante-pago").text(datos.EstadoComprobantePago ? datos.EstadoComprobantePago : "En espera de archivo");
        $("#estado-documento").text(datos.EstadoDocumento ? datos.EstadoDocumento : "En espera de archivo");

        const estados = [datos.EstadoArchivoCompraVenta, datos.EstadoCuentasParticipacion, datos.EstadoAutorizacionMejoras, datos.EstadoComprobantePago, datos.EstadoDocumento], totalEstados = estados.length, estadosDefinidos = estados.filter(o => null != o), cantidadEstadosDefinidos = estadosDefinidos.length, porcentajeEstadosDefinidos = cantidadEstadosDefinidos / totalEstados * 100; cantidadEstadosDefinidos > 0 && ($("#barra-informacion").css("width", porcentajeEstadosDefinidos + "%"), $("#porcentaje_informacion").text(Math.round(porcentajeEstadosDefinidos) + "%"));
    });
}

const logOutButton = $("#log-out-button"); logOutButton.click(() => { auth.signOut().then(() => { window.location.href = "../" }).catch(t => { console.log(t.code) }) });

const CargarPerfil = document.getElementById("cargar-perfil"), CargarPerfilInput = document.createElement("input"); CargarPerfilInput.setAttribute("type", "file"), CargarPerfilInput.setAttribute("id", "cargar-fotos"), CargarPerfilInput.setAttribute("accept", "image/*"), CargarPerfilInput.style.display = "none", CargarPerfil.parentNode.insertBefore(CargarPerfilInput, CargarPerfil.nextSibling), CargarPerfil.addEventListener("click", () => { CargarPerfilInput.click() }), document.addEventListener("DOMContentLoaded", function () { let r = document.getElementById("cargar-fotos"); r.addEventListener("change", r => { CargarPerfil.text("Cargando imagen..."); let e = r.target.files[0], t = firebase.storage().ref(`users/${userId}/perfil`); t.put(e).then(() => { t.getDownloadURL().then(r => { db.collection("users").doc(userId).update({ fotoUrl: r }).then(() => { $(".foto").attr("src", r).attr("srcset", r), CargarPerfil.text("SUBIR IMAGEN") }).catch(r => { CargarPerfil.text("Error al cargar imagen"), console.error(r) }) }) }) }) });

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
                    $("#texto-compra-venta").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});

const cargarAutorizacionMejoras = document.getElementById("cargar-autorizacion-mejoras");
const cargarAutorizacionMejorasInput = document.createElement("input");
cargarAutorizacionMejorasInput.setAttribute("type", "file");
cargarAutorizacionMejorasInput.setAttribute("id", "cargar-archivo-autorizacion-mejoras");
cargarAutorizacionMejorasInput.setAttribute("accept", ".pdf");
cargarAutorizacionMejorasInput.style.display = "none";

cargarAutorizacionMejoras.parentNode.insertBefore(cargarAutorizacionMejorasInput, cargarAutorizacionMejoras.nextSibling);

cargarAutorizacionMejoras.addEventListener("click", () => {
    cargarAutorizacionMejorasInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputAutorizacionMejoras = document.getElementById("cargar-archivo-autorizacion-mejoras");

    inputAutorizacionMejoras.addEventListener("change", e => {
        $("#texto-autorizacion-mejoras").text("Cargando archivo...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/autorizacion-mejoras`);

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoAutorizacionMejoras: url, EstadoAutorizacionMejoras: "En revisión" }).then(() => {
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

const cargarComprobantePago = document.getElementById("cargar-comprobante-pago");
const cargarComprobantePagoInput = document.createElement("input");
cargarComprobantePagoInput.setAttribute("type", "file");
cargarComprobantePagoInput.setAttribute("id", "cargar-archivo-comprobante-pago");
cargarComprobantePagoInput.setAttribute("accept", ".pdf");
cargarComprobantePagoInput.style.display = "none";

cargarComprobantePago.parentNode.insertBefore(cargarComprobantePagoInput, cargarComprobantePago.nextSibling);

cargarComprobantePago.addEventListener("click", () => {
    cargarComprobantePagoInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputContratoDirector = document.getElementById("cargar-archivo-comprobante-pago");

    inputContratoDirector.addEventListener("change", e => {
        $("#texto-comprobante-pago").text("Cargando archivo...");
        let file = e.target.files[0];
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const fileName = `comprobante-pago_${year}_${month}.pdf`;
        let storageRef = firebase.storage().ref(`users/${userId}/comprobantes-pago/${fileName}`);

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoComprobantePago: url, EstadoComprobantePago: "En revisión", MesPago: month }).then(() => {
                    $("#estado-comprobante-pago").text("En revisión");
                    $("#texto-comprobante-pago").text("Cargar");
                    barra();
                }).catch(error => {
                    $("#texto-comprobante-pago").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});

const cargarDocumento = document.getElementById("cargar-documento");
const cargarDocumentoInput = document.createElement("input");
cargarDocumentoInput.setAttribute("type", "file");
cargarDocumentoInput.setAttribute("id", "cargar-archivo-documento");
cargarDocumentoInput.setAttribute("accept", ".pdf");
cargarDocumentoInput.style.display = "none";

cargarDocumento.parentNode.insertBefore(cargarDocumentoInput, cargarDocumento.nextSibling);

cargarDocumento.addEventListener("click", () => {
    cargarDocumentoInput.click();
});

document.addEventListener("DOMContentLoaded", function () {
    const inputAutorizacionMejoras = document.getElementById("cargar-archivo-documento");

    inputAutorizacionMejoras.addEventListener("change", e => {
        $("#texto-documento").text("Cargando archivo...");
        let file = e.target.files[0];
        let storageRef = firebase.storage().ref(`users/${userId}/documento-identificacion`);

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                let userRef = db.collection("users").doc(userId);
                userRef.update({ ArchivoDocumento: url, EstadoDocumento: "En revisión" }).then(() => {
                    $("#estado-documento").text("En revisión");
                    $("#texto-documento").text("Cargar");
                    barra();
                }).catch(error => {
                    $("#texto-documento").text("Error al cargar archivo");
                    console.error(error);
                });
            });
        });
    });
});