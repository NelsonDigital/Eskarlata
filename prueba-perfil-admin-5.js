function contains(target, lookingFor) { return target && target.indexOf(lookingFor) >= 0; }

const columnDefs = [
    { headerName: 'Nombre Director', field: 'Nombre', filter: 'agTextColumnFilter' },
    { headerName: 'Contrato Ojo De Oso', field: 'ContratoOjoDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Compra Venta', field: 'CompraventaDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Documento', field: 'Archivo_DocumentoDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Documento', field: 'UltimoPagoDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Datos completos', field: 'completadoDirect', cellRenderer: renderizarIcono, filter: 'agTextColumnFilter' },
    {
        headerName: 'Asesores',
        children: [
            { headerName: 'Nombre Asesor', field: 'NombreAsesor', filter: 'agTextColumnFilter' },
            { headerName: 'Archivo Compra Venta', field: 'CompraventaAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Documento', field: 'Archivo_DocumentoAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Datos completos', field: 'completadoAsesor', cellRenderer: renderizarIcono, filter: 'agTextColumnFilter' },
            {
                headerName: 'Inversores',
                children: [
                    { headerName: 'Nombre Inversor', field: 'NombreInversor', filter: 'agTextColumnFilter' },
                    { headerName: 'Archivo Compra Venta', field: 'CompraventaInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
                    { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
                    { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
                    { headerName: 'Archivo Documento', field: 'Archivo_DocumentoInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
                    { headerName: 'Datos completos', field: 'completadoInversor', cellRenderer: renderizarIcono, filter: 'agTextColumnFilter' },
                ],
            },],
    },];

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
    const directorQuerySnapshot = await collectionRef.where("Rol", "==", "Director").get();
    await Promise.all(directorQuerySnapshot.docs.map(async (directorDoc) => {
        const directorData = directorDoc.data(); const idDirect = directorDoc.id;
        const Documento = directorData.Documento;
        const Nombre = directorData.Nombre + " " + directorData.Apellido,
            ArchivoContratoOjoDirect = directorData.ArchivoContratoOjo,
            EstadoContratoOjoDirect = directorData.EstadoContratoOjo,
            ArchivoCuentasParticipacionDirect = directorData.ArchivoCuentasParticipacion,
            EstadoCuentasParticipacionDirect = directorData.EstadoCuentasParticipacion,
            ArchivoCompraVentaDirect = directorData.ArchivoCompraVenta,
            EstadoArchivoCompraVentaDirect = directorData.EstadoArchivoCompraVenta,
            ArchivoAutorizacionMejorasDirect = directorData.ArchivoAutorizacionMejoras,
            EstadoAutorizacionMejorasDirect = directorData.EstadoArchivoAutorizacionMejoras,
            ArchivoDocumentoDirect = directorData.ArchivoDocumento,
            EstadoDocumentoDirect = directorData.EstadoDocumento,
            MesPagoDirect = directorData.MesPago;
        const fechaActual = new Date();
        const mesActual = (fechaActual.getMonth() + 1);
        const ArchivoComprobantePagoDirect = mesActual !== MesPagoDirect ? false : directorData.ArchivoComprobantePago;
        const EstadoComprobantePagoDirect = mesActual !== MesPagoDirect ? false : directorData.EstadoComprobantePago;
        
        console.log("Mes actual "+mesActual);
        console.log("Mes pago "+MesPagoDirect);
        console.log(typeof(mesActual));
        console.log(typeof(MesPagoDirect));
        console.log(ArchivoComprobantePagoDirect);
        console.log(EstadoComprobantePagoDirect);

        const ContratoOjoDirect = {
            title: "Contrato Ojo De Oso", href: ArchivoContratoOjoDirect,
            estado: EstadoContratoOjoDirect,
            id: idDirect,
            nombre_estado: "EstadoContratoOjo"
        };
        const CompraventaDirect = {
            title: "Compraventa",
            href: ArchivoCompraVentaDirect,
            estado: EstadoArchivoCompraVentaDirect,
            id: idDirect,
            nombre_estado: "EstadoArchivoCompraVenta"
        };
        const CuentasParticipacionDirect = {
            title: "Cuentas De Participacion",
            href: ArchivoCuentasParticipacionDirect,
            estado: EstadoCuentasParticipacionDirect,
            id: idDirect,
            nombre_estado: "EstadoCuentasParticipacion"
        };
        const AutorizacionMejorasDirect = {
            title: "Autorizacion De Mejoras",
            href: ArchivoAutorizacionMejorasDirect,
            estado: EstadoAutorizacionMejorasDirect,
            id: idDirect,
            nombre_estado: "EstadoArchivoAutorizacionMejoras"
        };
        const Archivo_DocumentoDirect = {
            title: "Documento",
            href: ArchivoDocumentoDirect,
            estado: EstadoDocumentoDirect,
            id: idDirect,
            nombre_estado: "EstadoDocumento"
        };
        const UltimoPagoDirect = {
            title: "Ultimo Pago",
            href: ArchivoComprobantePagoDirect,
            estado: EstadoComprobantePagoDirect,
            id: idDirect,
            nombre_estado: "EstadoComprobantePago"
        };
        console.log(UltimoPagoDirect);
        const estadosARevisarDirect = [
            EstadoContratoOjoDirect,
            EstadoCuentasParticipacionDirect,
            EstadoArchivoCompraVentaDirect,
            EstadoAutorizacionMejorasDirect,
            EstadoDocumentoDirect,
            EstadoComprobantePagoDirect
        ];
        const completadoDirect = estadosARevisarDirect.every(estado => estado === "Aprobado");
        const directorItem = {
            Nombre: Nombre,
            ContratoOjoDirect: ContratoOjoDirect,
            CompraventaDirect: CompraventaDirect,
            CuentasParticipacionDirect: CuentasParticipacionDirect,
            AutorizacionMejorasDirect: AutorizacionMejorasDirect,
            Archivo_DocumentoDirect: Archivo_DocumentoDirect,
            UltimoPagoDirect: UltimoPagoDirect,
            completadoDirect: completadoDirect
        };
        const asesorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", Documento).get();
        if (asesorQuerySnapshot.empty) {
            const objetoCombinado = Object.assign({}, directorItem);
            rowData.push(objetoCombinado);
        } else {
            await Promise.all(asesorQuerySnapshot.docs.map(async (asesorDoc) => {
                const asesorData = asesorDoc.data();
                const idAsesor = asesorDoc.id;
                const DocumentoAsesor = asesorData.Documento,
                    NombreAsesor = asesorData.Nombre + " " + asesorData.Apellido,
                    ArchivoCompraVentaAsesor = asesorData.ArchivoCompraVenta,
                    EstadoArchivoCompraVentaAsesor = asesorData.EstadoArchivoCompraVenta,
                    ArchivoCuentasParticipacionAsesor = asesorData.ArchivoCuentasParticipacion,
                    EstadoCuentasParticipacionAsesor = asesorData.EstadoCuentasParticipacion,
                    ArchivoAutorizacionMejorasAsesor = asesorData.ArchivoAutorizacionMejoras,
                    EstadoAutorizacionMejorasAsesor = asesorData.EstadoAutorizacionMejoras,
                    ArchivoDocumentoAsesor = asesorData.ArchivoDocumento,
                    EstadoDocumentoAsesor = asesorData.EstadoDocumento;
                const CompraventaAsesor = { title: "Compraventa", href: ArchivoCompraVentaAsesor, estado: EstadoArchivoCompraVentaAsesor, id: idAsesor, nombre_estado: "EstadoArchivoCompraVenta" };
                const CuentasParticipacionAsesor = { title: "Cuentas De Participacion", href: ArchivoCuentasParticipacionAsesor, estado: EstadoCuentasParticipacionAsesor, id: idAsesor, nombre_estado: "EstadoCuentasParidAsesorticipacion" };
                const AutorizacionMejorasAsesor = { title: "Autorizacion De Mejoras", href: ArchivoAutorizacionMejorasAsesor, estado: EstadoAutorizacionMejorasAsesor, id: idAsesor, nombre_estado: "EstadoAutorizacionMejoras" };
                const Archivo_DocumentoAsesor = { title: "Documento", href: ArchivoDocumentoAsesor, estado: EstadoDocumentoAsesor, id: idAsesor, nombre_estado: "EstadoDocumento" };
                const estadosARevisarAsesor = [
                    EstadoArchivoCompraVentaAsesor,
                    EstadoCuentasParticipacionAsesor,
                    EstadoAutorizacionMejorasAsesor,
                    EstadoDocumentoAsesor,
                ];
                const completadoAsesor = estadosARevisarAsesor.every(estado => estado === "Aprobado");
                const asesorItem = { NombreAsesor: NombreAsesor, Archivo_DocumentoAsesor: Archivo_DocumentoAsesor, CompraventaAsesor: CompraventaAsesor, CuentasParticipacionAsesor: CuentasParticipacionAsesor, AutorizacionMejorasAsesor: AutorizacionMejorasAsesor, completadoAsesor: completadoAsesor };
                const inversorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", DocumentoAsesor).get();
                if (inversorQuerySnapshot.empty) { const objetoCombinado = Object.assign({}, directorItem, asesorItem); rowData.push(objetoCombinado); } else {
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
                            EstadoDocumentoInversor = inversorData.EstadoDocumento;
                        const estadosARevisarInversor = [
                            EstadoArchivoCompraVentaInversor,
                            EstadoCuentasParticipacionInversor,
                            EstadoAutorizacionMejorasInversor,
                            EstadoDocumentoInversor,
                        ];
                        const completadoInversor = estadosARevisarInversor.every(estado => estado === "Aprobado");

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
                            completadoInversor: completadoInversor
                        };
                        const objetoCombinado = Object.assign({}, directorItem, asesorItem, inversorItem);
                        rowData.push(objetoCombinado);
                    }));
                }
            }));
        }
    }));
    gridOptions.api.setRowData(rowData);
}

document.addEventListener("DOMContentLoaded", function () { cargarDatosFirestore(); var e = document.querySelector("#myGrid"); new agGrid.Grid(e, gridOptions) });