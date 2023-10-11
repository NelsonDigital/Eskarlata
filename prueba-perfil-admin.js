function contains(target, lookingFor) { return target && target.indexOf(lookingFor) >= 0; }

const columnDefs = [
    { headerName: 'Nombre Director', field: 'Nombre', filter: 'agTextColumnFilter' },
    {
        headerName: 'Asesores',
        children: [
            { headerName: 'Nombre Asesor', field: 'NombreAsesor', filter: 'agTextColumnFilter' },
            { headerName: 'Archivo Compra Venta', field: 'CompraventaAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
            { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
            { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
            { headerName: 'Archivo Documento', field: 'Archivo_DocumentoAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
            {
                headerName: 'Inversores',
                children: [
                    { headerName: 'Nombre Inversor', field: 'NombreInversor', filter: 'agTextColumnFilter' },
                    { headerName: 'Archivo Compra Venta', field: 'CompraventaInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
                    { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
                    { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
                    { headerName: 'Archivo Documento', field: 'Archivo_DocumentoInversor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', openByDefault: false },
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

const gridOptions = {
    defaultColDef: { flex: 1, sortable: true, filter: true, },
    columnDefs: columnDefs, rowData: null, theme: 'ag-theme-balham',
};

const collectionRef = db.collection("users");
async function cargarDatosFirestore() {
    const rowData = [];
    const directorQuerySnapshot = await collectionRef.where("Rol", "==", "Director").get();
    await Promise.all(directorQuerySnapshot.docs.map(async (directorDoc) => {
        const directorData = directorDoc.data();
        const Documento = directorData.Documento, Nombre = directorData.Nombre + " " + directorData.Apellido;
        const directorItem = { Nombre: Nombre, };
        const asesorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", Documento).get();
        if (asesorQuerySnapshot.empty) {
            const objetoCombinado = Object.assign({}, directorItem);
            rowData.push(objetoCombinado);
        } else {
            await Promise.all(asesorQuerySnapshot.docs.map(async (asesorDoc) => {
                const asesorData = asesorDoc.data();
                const id = asesorDoc.id;
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
                const CompraventaAsesor = { title: "Compraventa", href: ArchivoCompraVentaAsesor, estado: EstadoArchivoCompraVentaAsesor, id: id, nombre_estado: "EstadoArchivoCompraVenta" };
                const CuentasParticipacionAsesor = { title: "Cuentas De Participacion", href: ArchivoCuentasParticipacionAsesor, estado: EstadoCuentasParticipacionAsesor, id: id, nombre_estado: "EstadoCuentasParticipacion" };
                const AutorizacionMejorasAsesor = { title: "Autorizacion De Mejoras", href: ArchivoAutorizacionMejorasAsesor, estado: EstadoAutorizacionMejorasAsesor, id: id, nombre_estado: "EstadoAutorizacionMejoras" };
                const Archivo_DocumentoAsesor = { title: "Documento", href: ArchivoDocumentoAsesor, estado: EstadoDocumentoAsesor, id: id, nombre_estado: "EstadoDocumento" };
                const asesorItem = { NombreAsesor: NombreAsesor, Archivo_DocumentoAsesor: Archivo_DocumentoAsesor, CompraventaAsesor: CompraventaAsesor, CuentasParticipacionAsesor: CuentasParticipacionAsesor, AutorizacionMejorasAsesor: AutorizacionMejorasAsesor };
                const inversorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", DocumentoAsesor).get();
                if (inversorQuerySnapshot.empty) { const objetoCombinado = Object.assign({}, directorItem, asesorItem); rowData.push(objetoCombinado); } else {
                    await Promise.all(inversorQuerySnapshot.docs.map(async (inversorDoc) => {
                        const inversorData = inversorDoc.data();
                        const NombreInversor = inversorData.Nombre + " " + inversorData.Apellido,
                            ArchivoCompraVentaInversor = inversorData.ArchivoCompraVenta,
                            EstadoArchivoCompraVentaInversor = inversorData.EstadoArchivoCompraVenta,
                            ArchivoCuentasParticipacionInversor = inversorData.ArchivoCuentasParticipacion,
                            EstadoCuentasParticipacionInversor = inversorData.EstadoCuentasParticipacion,
                            ArchivoAutorizacionMejorasInversor = inversorData.ArchivoAutorizacionMejoras,
                            EstadoAutorizacionMejorasInversor = inversorData.EstadoAutorizacionMejoras,
                            ArchivoDocumentoInversor = inversorData.ArchivoDocumento,
                            EstadoDocumentoInversor = inversorData.EstadoDocumento;
                        const CompraventaInversor = {
                            title: "Compraventa",
                            href: ArchivoCompraVentaInversor,
                            estado: EstadoArchivoCompraVentaInversor,
                            id: id,
                            nombre_estado: "EstadoArchivoCompraVenta"
                        };
                        const CuentasParticipacionInversor = {
                            title: "Cuentas De Participacion",
                            href: ArchivoCuentasParticipacionInversor,
                            estado: EstadoCuentasParticipacionInversor,
                            id: id,
                            nombre_estado: "EstadoCuentasParticipacion"
                        };
                        const AutorizacionMejorasInversor = {
                            title: "Autorizacion De Mejoras",
                            href: ArchivoAutorizacionMejorasInversor,
                            estado: EstadoAutorizacionMejorasInversor,
                            id: id,
                            nombre_estado: "EstadoAutorizacionMejoras"
                        };
                        const Archivo_DocumentoInversor = {
                            title: "Documento",
                            href: ArchivoDocumentoInversor,
                            estado: EstadoDocumentoInversor,
                            id: id,
                            nombre_estado: "EstadoDocumento"
                        };

                        const inversorItem = {
                            NombreInversor: NombreInversor,
                            CompraventaInversor: CompraventaInversor,
                            CuentasParticipacionInversor: CuentasParticipacionInversor,
                            AutorizacionMejorasInversor: AutorizacionMejorasInversor,
                            Archivo_DocumentoInversor: Archivo_DocumentoInversor
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
