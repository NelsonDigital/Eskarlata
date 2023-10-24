const googleiniciarsesion = $("#iniciar-sesiongoogle");
const mensajeerroriniciar = $("#mensaje-error");

googleiniciarsesion.click(() => {
    auth.signInWithPopup(provedorgoogle).then((result) => {
        const user = result.user;
        const userRef = db.collection("users").doc(user.uid);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const rol = userData.Rol;
                var formulario_realizado = userData && userData.formulario_realizado ? userData.formulario_realizado : false;
                var habilitado = userData && userData.habilitado ? userData.habilitado : true;
                console.log(habilitado);
                if (habilitado) {
                    if (formulario_realizado) {
                        userRef.update({
                            UpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                        }).then(() => {
                            var url;
                            switch (rol) { case "Admin": url = "/perfil-admin"; break; case "Director": url = "/perfil-director"; break; case "Asesor": url = "/perfil-lider"; break; case "Inversionista": url = "/perfil-inversionista" }
                            window.location.href = url;
                        }
                        ).catch((error) => {
                            mensajeerroriniciar.text("Existe un error desconocido. Comunicate al administrador si el error persiste.");
                        });
                    } else { window.location.href = "/registro"; }
                } else {
                    auth
                        .signOut()
                    .then(() => {
                        mensajeerroriniciar.text("Su cuenta se encuentra inhabilitada, Comunícate con el administrador para habilitar nuevamente la cuenta.");
                    })
                }
            } else { window.location.href = "/registro"; }
        });
    }).catch((error) => {
        switch (error.code) {
            case "auth/invalid-credential":
                mensajeerroriniciar.text("La respuesta mal formada no se puede analizar desde hotmail.com.");
                break;
            case "auth/cancelled-popup-request":
                mensajeerroriniciar.text("Esta operación ha sido cancelada debido a que se abrió otra ventana emergente conflictiva.");
                break;
            case "auth/invalid-email":
                mensajeerroriniciar.text("Email no es valido.");
                break;
            default:
                mensajeerroriniciar.text("Existe un error desconocido. Comunicate al administrador si el error persiste.");
                break;
        }
    });
});