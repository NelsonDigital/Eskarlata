const storage = firebase.storage();
function contains(target, lookingFor) { return target && target.indexOf(lookingFor) >= 0; }

const columnDefs = [
    { headerName: 'Nombre Director', field: 'Nombre', filter: 'agTextColumnFilter' },
    { headerName: 'Contrato Ojo De Oso', field: 'ContratoOjoDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Compra Venta', field: 'CompraventaDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Pagos Realizados', field: 'pagosDirect', cellRenderer: renderizarPagos, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Ultimo Pago', field: 'UltimoPagoDirect', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
    { headerName: 'Participaciones (Director)', field: 'ParticipacionesDirect', cellRenderer: renderizarInputParticipaciones, filter: 'agTextColumnFilter' },
    { headerName: 'Habilitado (Director)', field: 'DatosHabilitarDirect', cellRenderer: crearSelectInhabilitar, filter: 'agTextColumnFilter' },
    { headerName: 'Datos completos', field: 'completadoDirect', cellRenderer: renderizarIcono, filter: 'agTextColumnFilter' },
    {
        headerName: 'Asesores',
        children: [
            { headerName: 'Nombre Asesor', field: 'NombreAsesor', filter: 'agTextColumnFilter' },
            { headerName: 'Archivo Compra Venta', field: 'CompraventaAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Cuentas De Participacion', field: 'CuentasParticipacionAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Autorizacion De Mejoras', field: 'AutorizacionMejorasAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Archivo Documento', field: 'Archivo_DocumentoAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Pagos Realizados', field: 'pagosAsesor', cellRenderer: renderizarPagos, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Ultimo Pago', field: 'UltimoPagoAsesor', cellRenderer: renderizarEnlace, filter: 'agTextColumnFilter', hide: true },
            { headerName: 'Participaciones (Asesor)', field: 'ParticipacionesAsesor', cellRenderer: renderizarInputParticipaciones, filter: 'agTextColumnFilter' },
            { headerName: 'Habilitado (Asesor)', field: 'DatosHabilitarAsesor', cellRenderer: crearSelectInhabilitar, filter: 'agTextColumnFilter' },
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
                    { headerName: 'Habilitado (Inversor)', field: 'DatosHabilitarInversor', cellRenderer: crearSelectInhabilitar, filter: 'agTextColumnFilter' },
                    { headerName: 'Participaciones (Inversor)', field: 'ParticipacionesInversor', cellRenderer: renderizarInputParticipaciones, filter: 'agTextColumnFilter' },
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
function crearSelectInhabilitar(params) {
    const valores = params.value;
    if (valores) {
        const { estado, id, nombre_estado } = valores;
        let selectHTML = '<select class="selects" onchange="inhabilitarselect(this)" data-userId=' + id + ' data-estado=' + nombre_estado + '>';
        selectHTML += `<option value="true" ${estado === "true" ? 'selected="selected"' : ''}>Si</option>`;
        selectHTML += `<option value="false" ${estado === "false" ? 'selected="selected"' : ''}>No</option>`;
        selectHTML += '</select>';
        return selectHTML;
    }
    return "";
}

function renderizarInputParticipaciones(params) {
    const valores = params.value;
    console.log(valores);
    if (valores) {
        const { valor, id, nombre_campo } = valores;
        const inputHTML = `<input type="number" class="number-input selects" value="${valor}" onchange="ParticipacionesInput(this)" min="0" data-userId="${id}" data-estado="${nombre_campo}">`;
        return inputHTML;
    }
    return "";
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
            MesPagoDirect = parseInt(directorData.MesPago),
            CountParticipacionesDirect = parseInt(directorData.Participaciones) > 0 ? parseInt(directorData.Participaciones) : 1,
            HabilitadoDirect = directorData.habilitado;
        const fechaActual = new Date();
        const mesActual = (fechaActual.getMonth() + 1);
        const ArchivoComprobantePagoDirect = mesActual !== MesPagoDirect ? false : directorData.ArchivoComprobantePago;
        const EstadoComprobantePagoDirect = mesActual !== MesPagoDirect ? false : directorData.EstadoComprobantePago;
        var UserHabilitadoDirect = HabilitadoDirect === "false" ? "false" : "true";
        const carpetaPagoDirect = storage.ref().child('users/' + idDirect + '/comprobantes-pago/');
        let pagosDirect = [];
        carpetaPagoDirect.listAll()
            .then((result) => {
                result.items.forEach((itemRef) => {
                    // Obtiene el nombre del archivo
                    const nombreArchivo = itemRef.name;
                    // Obtiene la URL de descarga de cada archivo
                    itemRef.getDownloadURL()
                        .then((url) => {
                            // Imprime el nombre y el enlace de descarga en la consola
                            pagosDirect.push({ nombre: nombreArchivo, url: url });
                            // También puedes utilizar estos datos en tu aplicación, por ejemplo, para crear enlaces o mostrarlos en una lista.
                        });
                });
            })
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
        const DatosHabilitarDirect = {
            estado: UserHabilitadoDirect,
            id: idDirect,
            nombre_estado: "habilitado"
        };

        const estadosARevisarDirect = [
            EstadoContratoOjoDirect,
            EstadoCuentasParticipacionDirect,
            EstadoArchivoCompraVentaDirect,
            EstadoAutorizacionMejorasDirect,
            EstadoDocumentoDirect,
            EstadoComprobantePagoDirect
        ];
        const ParticipacionesDirect = {
            valor: CountParticipacionesDirect,
            id: idDirect,
            nombre_campo: "Participaciones"
        };
        const completadoDirect = estadosARevisarDirect.every(estado => estado === "Aprobado");
        const directorItem = {
            Nombre: Nombre,
            ContratoOjoDirect: ContratoOjoDirect,
            CompraventaDirect: CompraventaDirect,
            CuentasParticipacionDirect: CuentasParticipacionDirect,
            AutorizacionMejorasDirect: AutorizacionMejorasDirect,
            Archivo_DocumentoDirect: Archivo_DocumentoDirect,
            UltimoPagoDirect: UltimoPagoDirect,
            completadoDirect: completadoDirect,
            DatosHabilitarDirect: DatosHabilitarDirect,
            ParticipacionesDirect: ParticipacionesDirect,
            pagosDirect: pagosDirect
        };
        const asesorQuerySnapshot = await collectionRef.where("documentoreferencia", "==", Documento).get();
        if (asesorQuerySnapshot.empty) {
            const objetoCombinado = Object.assign({}, directorItem);
            rowData.push(objetoCombinado);
        } else {
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
                    CountParticipacionesAsesor = parseInt(asesorData.Participaciones) > 0 ? parseInt(asesorData.Participaciones) : 0,
                    MesPagoAsesor = parseInt(asesorData.MesPago),
                    HabilitadoAsesor = asesorData.habilitado;
                const fechaActual = new Date();
                const mesActual = (fechaActual.getMonth() + 1);
                const ArchivoComprobantePagoAsesor = mesActual !== MesPagoAsesor ? false : asesorData.ArchivoComprobantePago;
                const EstadoComprobantePagoAsesor = mesActual !== MesPagoAsesor ? false : asesorData.EstadoComprobantePago;
                var UserHabilitadoAsesor = HabilitadoAsesor === "false" ? "false" : "true";

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
                const DatosHabilitarAsesor = {
                    estado: UserHabilitadoAsesor,
                    id: idAsesor,
                    nombre_estado: "habilitado"
                };
                const ParticipacionesAsesor = {
                    valor: CountParticipacionesAsesor,
                    id: idAsesor,
                    nombre_campo: "Participaciones"
                };
                const completadoAsesor = estadosARevisarAsesor.every(estado => estado === "Aprobado");
                const asesorItem = { NombreAsesor: NombreAsesor, Archivo_DocumentoAsesor: Archivo_DocumentoAsesor, CompraventaAsesor: CompraventaAsesor, CuentasParticipacionAsesor: CuentasParticipacionAsesor, AutorizacionMejorasAsesor: AutorizacionMejorasAsesor, completadoAsesor: completadoAsesor, UltimoPagoAsesor: UltimoPagoAsesor, pagosAsesor: pagosAsesor, DatosHabilitarAsesor: DatosHabilitarAsesor, ParticipacionesAsesor: ParticipacionesAsesor };
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
                            EstadoDocumentoInversor = inversorData.EstadoDocumento,
                            MesPagoInversor = parseInt(inversorData.MesPago),
                            CountParticipacionesInversor = parseInt(inversorData.Participaciones) > 0 ? parseInt(inversorData.Participaciones) : 1,
                            HabilitadoInversor = inversorData.habilitado;
                        const fechaActual = new Date();
                        const mesActual = (fechaActual.getMonth() + 1);
                        const ArchivoComprobantePagoInversor = mesActual !== MesPagoInversor ? false : inversorData.ArchivoComprobantePago;
                        const EstadoComprobantePagoInversor = mesActual !== MesPagoInversor ? false : inversorData.EstadoComprobantePago;
                        var UserHabilitadoInversor = HabilitadoInversor === "false" ? "false" : "true";
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
                        const DatosHabilitarInversor = {
                            estado: UserHabilitadoInversor,
                            id: idInversor,
                            nombre_estado: "habilitado"
                        };
                        const ParticipacionesInversor = {
                            valor: CountParticipacionesInversor,
                            id: idInversor,
                            nombre_campo: "Participaciones"
                        };
                        const inversorItem = {
                            NombreInversor: NombreInversor,
                            CompraventaInversor: CompraventaInversor,
                            CuentasParticipacionInversor: CuentasParticipacionInversor,
                            AutorizacionMejorasInversor: AutorizacionMejorasInversor,
                            Archivo_DocumentoInversor: Archivo_DocumentoInversor,
                            completadoInversor: completadoInversor,
                            UltimoPagoInversor: UltimoPagoInversor,
                            pagosInversor: pagosInversor,
                            ParticipacionesInversor: ParticipacionesInversor,
                            DatosHabilitarInversor: DatosHabilitarInversor
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

document.addEventListener("DOMContentLoaded", function () {
    cargarDatosFirestore();
    var e = document.querySelector("#myGrid");
    new agGrid.Grid(e, gridOptions);
    gridOptions.localeText = {
        filterOoo: 'Filtrar...',
        searchOoo: 'Buscar...',
        loadingOoo: 'Cargando...',
        equals: 'Igual',
        notEqual: 'No igual',
        greater: 'Mayor que',
        greaterOrEqual: 'Mayor o igual que',
        less: 'Menor que',
        lessOrEqual: 'Menor o igual que',
        in: 'En',
        notIn: 'No en',
        contains: 'Contiene',
        notContains: 'No Contiene',
        blank: 'Vacío',
        notBlank: 'Sin espacio vacío',
        startsWith: 'Empieza con',
        pinColumn: 'Fijar Columna ',
        noPin: 'No fijar',
        pinRight: 'Fijar en la derecha',
        pinLeft: 'Fijar en la izquierda',
        autosizeThiscolumn: 'Ajustar El Ancho De Esta Columna',
        autosizeAllColumns: 'Ajustar El Ancho De Todas Las Columnas',
        resetColumns: 'Reestablecer Columna',
        endsWith: 'Termina con',
        between: 'Entre',
        notBetween: 'No entre',
        advancedFilterAnd: 'Y',
        advancedFilterOr: 'O',
        andCondition: 'Y',
        orCondition: 'O',
        clear: 'Limpiar',
        search: 'Buscar',
        previous: 'Anterior',
        next: 'Siguiente',
        first: 'Primera',
        last: 'Última',
        page: 'Página',
        pages: 'Páginas',
        rows: 'Filas',
        totalRows: 'Total de filas',
        totalRecords: 'Total de registros',
        copyWithHeaders: 'Copiar con encabezados',
        copyWithGroupHeaders: 'Copiar con encabezados de grupo',
        cut: 'Cortar',
        paste: 'Pegar',
        export: 'Exportar',
        print: 'Imprimir',
        csvExport: 'Exportar CSV',
        excelExport: 'Exportar Excel',
        copy: 'Copiar',
        loadingError: 'Error de carga',
        noRowsToShow: 'No hay filas para mostrar',
        enabled: 'Habilitado',
    };

});