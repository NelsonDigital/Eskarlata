var userId;
auth.onAuthStateChanged((user) => {
    if (user) {
        //lo que quieres que haga si inicia sesion
        $(".mostrable").css('display', 'Flex');
        userId = user.uid;
        var userDocumentRef = db.collection("users").doc(userId);
        userDocumentRef.get().then((doc) => {
            const datos = doc.data();
            const rol = datos.Rol;
            if (rol != "Director") {
                window.location.href = "../"
            }
            document.addEventListener("DOMContentLoaded", function () { cargarDatosFirestore(); var e = document.querySelector("#myGrid"); new agGrid.Grid(e, gridOptions) });
        });
    } else {
        //$("#navbar").hide();          
    }
});
const storage = firebase.storage();

function contains(target, lookingFor) { return target && target.indexOf(lookingFor) >= 0; }

const columnDefs = [
    { headerName: 'Nombre Asesor', field: 'NombreAsesor', filter: 'agTextColumnFilter' },
    { headerName: 'Archivo Compra Venta', field: 'CompraventaAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Documento', field: 'Archivo_DocumentoAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Pagos Realizados', field: 'pagosAsesor', cellRenderer: renderizarPagos, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Ultimo Pago', field: 'UltimoPagoAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Datos completos', field: 'completadoAsesor', cellRenderer: renderizarIcono, filter: 'agTextColumnFilter' },
    {
        headerName: 'Inversores',
        children: [
            { headerName: 'Nombre Inversor', field: 'NombreInversor', filter: 'agTextColumnFilter' },
            { headerName: 'Archivo Compra Venta', field: 'CompraventaInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Documento', field: 'Archivo_DocumentoInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Pagos Realizados', field: 'pagosInversor', cellRenderer: renderizarPagos, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Ultimo Pago', field: 'UltimoPagoInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Datos completos', field: 'completadoInversor', cellRenderer: renderizarIcono, filter: 'agTextColumnFilter' },
        ],
    }
];

function renderizarEnlace(params) {
    const enlaceData = params.value;
    if (enlaceData) {
        const { title, href, estado, id, nombre_estado } = enlaceData;
        if (title && href && estado && id && nombre_estado) {
            const selectHTML = crearSelect(estado, id, nombre_estado);
            const enlaceHTML = `<a href="${href}" target="_blank">${title}</a>`;
            return `${enlaceHTML} ${selectHTML}`;
        }
    }
    return '';
}
function renderizarPagos(params) {
    const enlaceData = params.value;
    if (enlaceData) {
        return enlaceData.map((archivo) => {
            const { nombre, url } = archivo;
            return `<a href="${url}" target="_blank">${nombre}</a>`;
        }).join('<br>'); // Esto unirá los enlaces con saltos de línea
    }
    return '';
}

function crearSelect(estadoSeleccionado, id, nombre_estado) {
    const opciones = ["En revisión", "Aprobado", "Denegado"];
    let selectHTML = '<select class="selects" onchange="cambioselect(this)" data-userId=' + id + ' data-estado=' + nombre_estado + '>';
    opciones.forEach((opcion) => {
        selectHTML += `<option value="${opcion}" ${opcion === estadoSeleccionado ? 'selected' : ''}>${opcion}</option>`;
    });
    selectHTML += '</select>';
    return selectHTML;
}

function renderizarIcono(params) {
    if (params.value === true) {
        return '<i class="bi bi-check2-circle"></i>'; // El valor es verdadero, muestra un ícono de marca de verificación
    } else {
        return '<i class="bi bi-exclamation-octagon"></i>'; // El valor es falso, muestra un ícono de equis
    }
}

const gridOptions = {
    defaultColDef: { flex: 1, sortable: true, filter: true, },
    columnDefs: columnDefs, rowData: null, theme: 'ag-theme-balham',
};

const collectionRef = db.collection("users");
async function cargarDatosFirestore() {
    const rowData = [];
    console.log(userId);
    const asesorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", userId).get();
    await Promise.all(asesorQuerySnapshot.docs.map(async (asesorDoc) => {
        const asesorData = asesorDoc.data();
        const idAsesor = asesorDoc.id;
        const carpetaPagoAsesor = storage.ref().child('users/' + idAsesor + '/comprobantes-pago/');
        let pagosAsesor = [];
        carpetaPagoAsesor.listAll()
            .then((result) => {
                result.items.forEach((itemRef) => {
                    // Obtiene el nombre del archivo
                    const nombreArchivo = itemRef.name;
                    // Obtiene la URL de descarga de cada archivo
                    itemRef.getDownloadURL()
                        .then((url) => {
                            // Imprime el nombre y el enlace de descarga en la consola
                            pagosAsesor.push({ nombre: nombreArchivo, url: url });
                            // También puedes utilizar estos datos en tu aplicación, por ejemplo, para crear enlaces o mostrarlos en una lista.
                        });
                });
            })

        const DocumentoAsesor = asesorData.Documento,
            NombreAsesor = asesorData.Nombre + " " + asesorData.Apellido,
            ArchivoCompraVentaAsesor = asesorData.ArchivoCompraVenta,
            EstadoArchivoCompraVentaAsesor = asesorData.EstadoArchivoCompraVenta,
            ArchivoCuentasParticipacionAsesor = asesorData.ArchivoCuentasParticipacion,
            EstadoCuentasParticipacionAsesor = asesorData.EstadoCuentasParticipacion,
            ArchivoAutorizacionMejorasAsesor = asesorData.ArchivoAutorizacionMejoras,
            EstadoAutorizacionMejorasAsesor = asesorData.EstadoAutorizacionMejoras,
            ArchivoDocumentoAsesor = asesorData.ArchivoDocumento,
            EstadoDocumentoAsesor = asesorData.EstadoDocumento,
            MesPagoAsesor = parseInt(asesorData.MesPago);
        const fechaActual = new Date();
        const mesActual = (fechaActual.getMonth() + 1);
        const ArchivoComprobantePagoAsesor = mesActual !== MesPagoAsesor ? false : asesorData.ArchivoComprobantePago;
        const EstadoComprobantePagoAsesor = mesActual !== MesPagoAsesor ? false : asesorData.EstadoComprobantePago;

        const CompraventaAsesor = { title: "Compraventa", href: ArchivoCompraVentaAsesor, estado: EstadoArchivoCompraVentaAsesor, id: idAsesor, nombre_estado: "EstadoArchivoCompraVenta" };
        const CuentasParticipacionAsesor = { title: "Cuentas De Participacion", href: ArchivoCuentasParticipacionAsesor, estado: EstadoCuentasParticipacionAsesor, id: idAsesor, nombre_estado: "EstadoCuentasParidAsesorticipacion" };
        const AutorizacionMejorasAsesor = { title: "Autorizacion De Mejoras", href: ArchivoAutorizacionMejorasAsesor, estado: EstadoAutorizacionMejorasAsesor, id: idAsesor, nombre_estado: "EstadoAutorizacionMejoras" };
        const Archivo_DocumentoAsesor = { title: "Documento", href: ArchivoDocumentoAsesor, estado: EstadoDocumentoAsesor, id: idAsesor, nombre_estado: "EstadoDocumento" };
        const UltimoPagoAsesor = {
            title: "Ultimo Pago",
            href: ArchivoComprobantePagoAsesor,
            estado: EstadoComprobantePagoAsesor,
            id: idAsesor,
            nombre_estado: "EstadoComprobantePago"
        };
        const estadosARevisarAsesor = [
            EstadoArchivoCompraVentaAsesor,
            EstadoCuentasParticipacionAsesor,
            EstadoAutorizacionMejorasAsesor,
            EstadoDocumentoAsesor,
            EstadoComprobantePagoAsesor,
        ];
        const completadoAsesor = estadosARevisarAsesor.every(estado => estado === "Aprobado");
        const asesorItem = { NombreAsesor: NombreAsesor, Archivo_DocumentoAsesor: Archivo_DocumentoAsesor, CompraventaAsesor: CompraventaAsesor, CuentasParticipacionAsesor: CuentasParticipacionAsesor, AutorizacionMejorasAsesor: AutorizacionMejorasAsesor, completadoAsesor: completadoAsesor, UltimoPagoAsesor: UltimoPagoAsesor, pagosAsesor: pagosAsesor };
        const inversorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", DocumentoAsesor).get();
        if (inversorQuerySnapshot.empty) { const objetoCombinado = Object.assign({}, asesorItem); rowData.push(objetoCombinado); } else {
            await Promise.all(inversorQuerySnapshot.docs.map(async (inversorDoc) => {
                const inversorData = inversorDoc.data();
                const idInversor = inversorDoc.id;
                const NombreInversor = inversorData.Nombre + " " + inversorData.Apellido,
                    ArchivoCompraVentaInversor = inversorData.ArchivoCompraVenta,
                    EstadoArchivoCompraVentaInversor = inversorData.EstadoArchivoCompraVenta,
                    ArchivoCuentasParticipacionInversor = inversorData.ArchivoCuentasParticipacion,
                    EstadoCuentasParticipacionInversor = inversorData.EstadoCuentasParticipacion,
                    ArchivoAutorizacionMejorasInversor = inversorData.ArchivoAutorizacionMejoras,
                    EstadoAutorizacionMejorasInversor = inversorData.EstadoAutorizacionMejoras,
                    ArchivoDocumentoInversor = inversorData.ArchivoDocumento,
                    EstadoDocumentoInversor = inversorData.EstadoDocumento,
                    MesPagoInversor = parseInt(inversorData.MesPago);
                const fechaActual = new Date();
                const mesActual = (fechaActual.getMonth() + 1);
                const ArchivoComprobantePagoInversor = mesActual !== MesPagoInversor ? false : inversorData.ArchivoComprobantePago;
                const EstadoComprobantePagoInversor = mesActual !== MesPagoInversor ? false : inversorData.EstadoComprobantePago;
                const carpetaPagoInversor = storage.ref().child('users/' + idInversor + '/comprobantes-pago/');
                let pagosInversor = [];
                carpetaPagoInversor.listAll()
                    .then((result) => {
                        result.items.forEach((itemRef) => {
                            // Obtiene el nombre del archivo
                            const nombreArchivo = itemRef.name;
                            // Obtiene la URL de descarga de cada archivo
                            itemRef.getDownloadURL()
                                .then((url) => {
                                    // Imprime el nombre y el enlace de descarga en la consola
                                    pagosInversor.push({ nombre: nombreArchivo, url: url });
                                    // También puedes utilizar estos datos en tu aplicación, por ejemplo, para crear enlaces o mostrarlos en una lista.
                                });
                        });
                    })
                const estadosARevisarInversor = [
                    EstadoArchivoCompraVentaInversor,
                    EstadoCuentasParticipacionInversor,
                    EstadoAutorizacionMejorasInversor,
                    EstadoDocumentoInversor,
                    EstadoComprobantePagoInversor
                ];
                const completadoInversor = estadosARevisarInversor.every(estado => estado === "Aprobado");
                const UltimoPagoInversor = {
                    title: "Ultimo Pago",
                    href: ArchivoComprobantePagoInversor,
                    estado: EstadoComprobantePagoInversor,
                    id: idAsesor,
                    nombre_estado: "EstadoComprobantePago"
                };
                const CompraventaInversor = {
                    title: "Compraventa",
                    href: ArchivoCompraVentaInversor,
                    estado: EstadoArchivoCompraVentaInversor,
                    id: idInversor,
                    nombre_estado: "EstadoArchivoCompraVenta"
                };
                const CuentasParticipacionInversor = {
                    title: "Cuentas De Participacion",
                    href: ArchivoCuentasParticipacionInversor,
                    estado: EstadoCuentasParticipacionInversor,
                    id: idInversor,
                    nombre_estado: "EstadoCuentasParticipacion"
                };
                const AutorizacionMejorasInversor = {
                    title: "Autorizacion De Mejoras",
                    href: ArchivoAutorizacionMejorasInversor,
                    estado: EstadoAutorizacionMejorasInversor,
                    id: idInversor,
                    nombre_estado: "EstadoAutorizacionMejoras"
                };
                const Archivo_DocumentoInversor = {
                    title: "Documento",
                    href: ArchivoDocumentoInversor,
                    estado: EstadoDocumentoInversor,
                    id: idInversor,
                    nombre_estado: "EstadoDocumento"
                };
                const inversorItem = {
                    NombreInversor: NombreInversor,
                    CompraventaInversor: CompraventaInversor,
                    CuentasParticipacionInversor: CuentasParticipacionInversor,
                    AutorizacionMejorasInversor: AutorizacionMejorasInversor,
                    Archivo_DocumentoInversor: Archivo_DocumentoInversor,
                    completadoInversor: completadoInversor,
                    UltimoPagoInversor: UltimoPagoInversor,
                    pagosInversor: pagosInversor
                };
                const objetoCombinado = Object.assign({}, asesorItem, inversorItem);
                rowData.push(objetoCombinado);
            }));
        }
    }));
    gridOptions.api.setRowData(rowData);
}
