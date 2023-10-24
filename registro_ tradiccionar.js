const registrarseButton = $("#btnregistroemail"); const mensajeerrorregistro = $("#mensajerrorregistro");
registrarseButton.click(() => {
    const emailregistro = $("#registroemail").val(),
        passwordregistro = $("#registropassword").val(),
        passwordregistro2 = $("#registropassword2").val();
    console.log(emailregistro, passwordregistro, passwordregistro2);
    if (emailregistro) {
        if (passwordregistro.length < 6) {
            mensajeerrorregistro.text("La contraseña debe tener al menos 6 caracteres");
        } else {
            if (passwordregistro == passwordregistro2) {
                auth.createUserWithEmailAndPassword(emailregistro, passwordregistro)
                    .then((result) => {
                        const user = result.user;
                        const userRef = db.collection("users").doc(user.uid);
                        userRef
                            .set({
                                createdAt: firebase.firestore.FieldValue.serverTimestamp(), lastSignInAt: firebase.firestore.FieldValue.serverTimestamp(), email: emailregistro
                            })
                            .then(() => {
                                window.location.href = "/registro";
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }).catch((error) => {
                        switch (error.code) {
                            case "auth/wrong-password":
                                mensajeerrorregistro.text("La contraseña no es válida o el usuario no tiene contraseña.");
                                break;
                            case "auth/user-not-found":
                                mensajeerrorregistro.text("No hay registro de usuario correspondiente a este identificador.");
                                break;
                            case "auth/email-already-in-use":
                                mensajeerrorregistro.text("Este correo esta en uso");
                                break;
                            default:
                                mensajeerrorregistro.text("Ingrese correctamente lo datos.");
                                break;
                        }
                    });
            } else {
                mensajeerrorregistro.text("Las contraseñas deben coincidir");
            }
        }
    } else {
        $("#btnregistroemailreal").click();
        mensajeerrorregistro.text("faltan datos");
    }
});

const logInButton = $("#btnlogin"); const mensajeerrorlogin = $("#mensajeiniciarsesion");
logInButton.click((e) => {
    const emailiniciar = $("#iniciar-email").val(); const passwordiniciar = $("#iniciar-password").val();
    if (emailiniciar) {
        auth.signInWithEmailAndPassword(emailiniciar, passwordiniciar)
            .then((userCredential) => {
                const user = userCredential.user;
                const userRef = db.collection("users").doc(user.uid);
                userRef.get().then((doc) => {
                    const userData = doc.data();
                    const rol = userData.Rol;
                    var formulario_realizado = userData && userData.formulario_realizado ? userData.formulario_realizado : false;
                    var habilitado = userData && userData.habilitado === false ? false : true;
                    if (habilitado) {
                        if (formulario_realizado) {
                            userRef.update({
                                UpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                            }).then(() => {
                                var url;
                                switch (rol) { case "Admin": url = "/perfil-admin"; break; case "Director": url = "/perfil-director"; break; case "Asesor": url = "/perfil-lider"; break; case "Inversionista": url = "/perfil-inversionista" }
                                window.location.href = url;
                            }
                            ).catch((error) => { mensajeerrorlogin.text("Existe un error desconocido. Comunicate al administrador si el error persiste."); });
                        } else { window.location.href = "/registro"; }
                    } else {
                        auth
                            .signOut()
                            .then(() => {
                                mensajeerrorlogin.text("Su cuenta se encuentra inhabilitada, Comunícate con el administrador para habilitar nuevamente la cuenta.");
                            })
                    }
                }).catch((error) => { mensajeerrorlogin.text("Hay un error en la base de datos."); });
            }).catch((error) => {
                switch (error.code) {
                    case "auth/wrong-password":
                        mensajeerrorlogin.text("La contraseña no es válida o el usuario no tiene contraseña.");
                        break;
                    case "auth/user-not-found":
                        mensajeerrorlogin.text("No hay registro de usuario correspondiente a este identificador.");
                        break;
                    case "auth/account-exists-with-different-credential":
                        mensajeerrorlogin.text("Inicie sesión con un proveedor asociado con esta dirección de correo electrónico.");
                        break;
                    default:
                        mensajeerrorlogin.text("Ingrese correctamente lo datos.");
                        break;
                }
            })
    } else { $("#btnloginreal").click(); mensajeerrorlogin.text("faltan datos"); }
});
