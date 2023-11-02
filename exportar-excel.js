$("#btn_exportar").click(async function () {
    $("#btn_exportar").removeAttr("id");
    $(".btn_exportar").text("Cargando ...");

    try {
        const usuarios = await obtenerUsuariosCompletos();

        if (usuarios.length === 0) {
            $(".btn_exportar").text("No hay usuarios para exportar");
            return;
        }

        $(".btn_exportar").text("Exportando ...");
        const data = usuarios.map(usuario => ({
            "Rol": usuario.Rol,
            "Nombre": usuario.Nombre,
            "CC": usuario.CC,
            "Participaciones": usuario.Participaciones,
            "Telefono": usuario.Telefono,
            "Email": usuario.Email,
            "Estado": usuario.Estado,
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');

        const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = URL.createObjectURL(blob);
        enlaceDescarga.download = 'UsuariosRegistrados.xlsx';
        enlaceDescarga.click();

        $(".btn_exportar").attr("id", "btn_exportar");
        $("#btn_exportar").text("Exportado correctamente");
    } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        $(".btn_exportar").text("Error al obtener los usuarios");
    }
});

async function obtenerUsuariosCompletos() {
    const todosUsuarios = db.collection("users");
    const usuarios = [];
    try {
        const querySnapshot = await todosUsuarios.get();

        querySnapshot.forEach((doc) => {
            const userData = doc.data();

            const Rol = userData.Rol;
            if (Rol !== "Admin" && Rol !== undefined) {
                const Nombre = userData.Nombre + " " + userData.Apellido,
                    Email = userData.Email,
                    CC = userData.Documento,
                    Telefono = userData.Telefono,
                    Estado = userData.habilitado === "false" ? "Inhabilitado" : "Habilitado";

                let Participaciones;
                switch (Rol) {
                    case "Director":
                        Participaciones = parseInt(userData.Participaciones) > 0 ? parseInt(userData.Participaciones) : 1;
                        break;
                    case "Asesor":
                        Participaciones = parseInt(userData.Participaciones) > 0 ? parseInt(userData.Participaciones) : 0;
                        break;
                    case "Inversionista":
                        Participaciones = parseInt(userData.Participaciones) > 0 ? parseInt(userData.Participaciones) : 1;
                }

                usuarios.push({ Rol, Nombre, CC, Email, Telefono, Participaciones, Estado });
            }
        });

        return usuarios;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
    }
}