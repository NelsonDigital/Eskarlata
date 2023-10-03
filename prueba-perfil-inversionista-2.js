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
                
                $("#estado-compra-venta").text(datos.EstadoArchivoCompraVenta ? datos.EstadoArchivoCompraVenta : "En espera de archivo");
                $("#estado-cuentas-participacion").text(datos.EstadoCuentasParticipacion ? datos.EstadoCuentasParticipacion : "En espera de archivo");
                $("#estado-autorizacion-mejoras").text(datos.EstadoArchivoAutorizacionMejoras ? datos.EstadoArchivoAutorizacionMejoras : "En espera de archivo");
                
                
                const usersCollectionRef = db.collection("users");
                usersCollectionRef
                    .where("Documento", "==", documentoReferencia)
                    .get()
                    .then((querySnapshot) => {
                        if (querySnapshot.size > 0) {
                            const doc = querySnapshot.docs[0];
                            const data = doc.data();
                            $("#nombre_asesor").text("Asesor comercial: "+ data.Nombre + " " + data.Apellido);
                        }
                    });
            });
        } else {
            window.location.href = "../";
        }
    });

    function barra() {
        const userDocumentRef = db.collection("users").doc(userId);
        userDocumentRef.get().then((doc) => {
            const datos = doc.data();
            const estados = [datos.EstadoArchivoCompraVenta, datos.EstadoCuentasParticipacion, datos.EstadoArchivoAutorizacionMejoras], totalEstados = estados.length, estadosDefinidos = estados.filter(o => null != o), cantidadEstadosDefinidos = estadosDefinidos.length, porcentajeEstadosDefinidos = cantidadEstadosDefinidos / totalEstados * 100; cantidadEstadosDefinidos > 0 && ($("#barra-informacion").css("width", porcentajeEstadosDefinidos + "%"), $("#porcentaje_informacion").text(porcentajeEstadosDefinidos + "%"));
        });
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

    const logOutButton=$("#log-out-button");logOutButton.click(()=>{auth.signOut().then(()=>{window.location.href="../"}).catch(t=>{console.log(t.code)})});

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
                    userRef.update({ ArchivoCompraVenta: url, EstadoAutorizacionMejoras: "En revisión" }).then(() => {
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