let codigoPendiente = null;
let calendar;

function ver(s) {
    document.getElementById('seccion-calendario').style.display = s === 'calendario' ? 'flex' : 'none';
    document.getElementById('seccion-usuarios').style.display = s === 'usuarios' ? 'flex' : 'none';
    document.getElementById('seccion-historial').style.display = s === 'historial' ? 'block' : 'none';
    
    document.getElementById('btn-cal').className = s === 'calendario' ? 'active' : '';
    document.getElementById('btn-usu').className = s === 'usuarios' ? 'active' : '';
    document.getElementById('btn-his').className = s === 'historial' ? 'active' : '';
    
    if(s === 'calendario') {
        window.dispatchEvent(new Event('resize'));
    }
    if (s === 'historial') {
    cargarHistorial();
}
}

document.addEventListener('DOMContentLoaded', function() {
    
    // CONFIGURACIÓN DEL CALENDARIO 
    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',

        events: function(fetchInfo, successCallback, failureCallback) {
            const local = document.getElementById('area-admin').value;
            const tipo = document.getElementById('filtro-tipo').value;
            fetch(`obtener_reservas.php?local=${encodeURIComponent(local)}&tipo=${tipo}`)
                .then(response => response.json())
                .then(data => successCallback(data))
                .catch(error => failureCallback(error));
        },

        eventDidMount: function(info) {
        const estado = (info.event.extendedProps.estado || "").trim().toLowerCase();
        const tipo = (info.event.extendedProps.tipo || "").trim().toLowerCase();

        if (tipo.includes("concesion")) {
            if (estado.includes("aprobado")) {
                info.el.style.backgroundColor = "#2c5697";
            } else if (estado.includes("rechazado")) {
                info.el.style.backgroundColor = "#dc3545";
            } else {
                info.el.style.backgroundColor = "#6c757d";
            }
            info.el.style.color = "#fff";
            return;
        }

        if (estado.includes("aprobado")) {
            info.el.style.backgroundColor = "#2c5697";
        } 
        else if (estado.includes("rechazado")) {
            info.el.style.backgroundColor = "#dc3545";
        } 
        else if (estado.includes("pendiente")) {
            info.el.style.backgroundColor = "#ffc107";
        } 
        else if (estado.includes("pagado")) {
            info.el.style.backgroundColor = "#28a745";
        }
    },

        slotMinTime: '08:00:00',
        slotMaxTime: '23:00:00',
        allDaySlot: false,
        slotDuration: '01:00:00',
        height: 'auto',
        aspectRatio: 1.8, 

        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,dayGridMonth'
        },

        buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana' },

        // HORAS
        slotLabelContent: function(arg) {
            const format = (h) => {
                let p = h >= 12 ? 'p.m.' : 'a.m.';
                let d = h > 12 ? h - 12 : h;
                if (h === 0) d = 12;
                return `${d}:00 ${p}`;
            };
            let start = arg.date.getHours();
            let end = start + 1;

            return { 
                html: `<div style="font-size: 0.7rem; font-weight: 600; color: #2c5697; padding: 5px 0;">
                        ${format(start)} - ${format(end)}
                       </div>` 
            };
        },

        eventContent: function(arg) {
            let info = arg.event.extendedProps;
            
            return {
                html: `
                <div style="font-size: 0.7rem; padding: 2px; line-height:1.2;">
                <b>${arg.event.title}</b><br>
                <span>${arg.timeText}</span><br>
                <span>${info.tipo}</span><br>
                <span style="font-weight:bold; color: #fff;">${info.estado}</span>
                </div>`
            };
        },

        eventsSet: function(eventos) {
            
            console.log("Eventos cargados:", eventos.map(e => e.extendedProps));
            console.log("Buscando código:", codigoPendiente);
            
            if (!codigoPendiente) return;
            
            const evento = eventos.find(ev => 
                String(ev.extendedProps.codigo) === String(codigoPendiente)
            );
            
            if (evento) {
                console.log("Evento encontrado:", evento);
                
                setTimeout(() => {
                    abrirDetalleEvento(evento);
                }, 300);

                codigoPendiente = null;
            } else {
                console.log("⏳ Aún no se encuentra el evento...");
            }
        },

        // CLICK EN RESERVA
        eventClick: function(info) {
            abrirDetalleEvento(info.event);
        }
    });

    calendar.render();

    cargarNotificaciones();

 setInterval(() => {
    calendar.refetchEvents();
    cargarNotificaciones();
}, 5000);

    document.getElementById('area-admin').addEventListener('change', function() {
        calendar.refetchEvents();
    });

    document.getElementById('filtro-tipo').addEventListener('change', function() {
        cargarNotificaciones();
        calendar.refetchEvents();
    });

    cargarCajeras();
});

    // MOSTRAR / OCULTAR CONTRASEÑA
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('new-p');

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {

            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            const icon = document.getElementById('icon-eye');

            if (type === 'password') {
                icon.innerHTML = `
                <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                `;
            } else {
                icon.innerHTML = `
                <path d="M2 2l20 20M12 5c-7 0-10 7-10 7a18.4 18.4 0 0 0 5 5M9.5 9.5A3 3 0 0 0 12 15a3 3 0 0 0 2.5-5.5M17 17c2-1.5 3-5 3-5s-3-7-10-7"/>
                `;
            }
        });
    }

// FUNCIÓN CAJERA
function cargarCajeras() {
    fetch('obtener_usuarios.php')
    .then(res => res.json())
    .then(data => {

        console.log(data);

        const tbody = document.getElementById('tbody-usuarios');
        tbody.innerHTML = '';

        data.forEach(u => {
            const fila = `
            <tr>
                <td><b>${u.usuario}</b></td>
                <td><span class="badge-rol">Caja</span></td>
                <td><code>${u.contraseña}</code></td>
                <td>
                    <button class="btn-delete" onclick="eliminarCajera(${u.id})">
                        ELIMINAR
                    </button>
                </td>
            </tr>`;
            
            tbody.insertAdjacentHTML('beforeend', fila);
        });

    });
}

function generarPDFTicketPago(evento) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const datos = evento.extendedProps || {};

    const codigoReserva = datos.codigo || '';
    const nombreCompleto = `${datos.nombres || ''} ${datos.apellidos || ''}`.trim();
    const nombreArea = datos.local || document.getElementById('area-admin').value || '';
    const actividad = datos.actividad || '';
    const totalFormateado = parseFloat(datos.monto || 0).toFixed(2);

    const azul = [44, 86, 151];
    const amarillo = [253, 216, 8];

    doc.setFillColor(azul[0], azul[1], azul[2]);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("MUNICIPALIDAD PROVINCIAL DE CAÑETE", 105, 12, { align: "center" });

    doc.setFontSize(12);
    doc.text("FICHA DE RESERVA - ALQUILER", 105, 20, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Código de Reserva: ${codigoReserva}`, 20, 40);

    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL SOLICITANTE", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);

    doc.text(`Nombre completo: ${nombreCompleto}`, 20, 65);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("DETALLE DE LA RESERVA", 20, 110);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);

    doc.text(`Local: ${nombreArea}`, 20, 120);
    doc.text(`Actividad: ${actividad}`, 20, 128);
    doc.text(`Total a pagar: S/ ${totalFormateado}`, 20, 168);

    doc.setFillColor(amarillo[0], amarillo[1], amarillo[2]);
    doc.rect(20, 180, 170, 25, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("PRESENTAR ESTE DOCUMENTO EN CAJA PARA REALIZAR EL PAGO", 105, 190, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Este documento es válido únicamente para el trámite solicitado.", 105, 198, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Municipalidad Provincial de Cañete", 105, 215, { align: "center" });

    doc.save(`Reserva_Alquiler_${codigoReserva}.pdf`);
}
function agregarCajera() {

    const u = document.getElementById('new-u').value.trim();
    const p = document.getElementById('new-p').value.trim();

    if (!u || !p) {
        Swal.fire('Atención', 'Completa los campos', 'warning');
        return;
    }

    fetch('crear_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            usuario: u,
            password: p
        })
    })
    .then(res => res.text())
    .then(resp => {

        if (resp === "ok") {
            Swal.fire('Éxito', 'Cajera creada', 'success');
            cargarCajeras();

            document.getElementById('new-u').value = '';
            document.getElementById('new-p').value = '';
        } else {
            Swal.fire('Error', 'No se pudo crear', 'error');
        }

    });
}

function eliminarCajera(id) {

    Swal.fire({
        title: '¿Eliminar usuario?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        confirmButtonColor: '#dc3545'
    }).then((result) => {

        if (result.isConfirmed) {

            fetch('eliminar_usuario.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    id: id
                })
            })
            .then(res => res.text())
            .then(resp => {

                if (resp === "ok") {
                    Swal.fire('Eliminado', 'Usuario eliminado', 'success');
                    cargarCajeras();
                } else {
                    Swal.fire('Error', 'No se pudo eliminar', 'error');
                }

            });
        }
    });
}

function cargarNotificaciones() {
    const tipo = document.getElementById('filtro-tipo').value;

    fetch(`obtener_notificaciones.php?tipo=${tipo}`)
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('lista-notificaciones');
        contenedor.innerHTML = '';

        data.forEach(n => {
            const hora = (n.hora_inicio || '').substring(0, 5);
            const estado = (n.estado || '').trim().toLowerCase();
            const tipoReserva = (n.tipo || '').trim().toLowerCase();

            const div = document.createElement('div');
            div.classList.add('notificacion-item');

            let mensaje = '';
            let mostrar = false;

            // 1) CONCESIÓN: notificar cuando recién la solicitaron
            if (tipoReserva === "concesión" || tipoReserva === "concesion") {
                if (estado === "pendiente de evaluación") {
                    mensaje = `<b>${n.nombres.split(' ')[0]}</b> solicitó concesión`;
                    div.style.backgroundColor = "#f1f3f5";
                    div.style.color = "#333";
                    div.style.borderLeft = "5px solid #6c757d";
                    mostrar = true;
                }
            }

            // 2) ALQUILER: notificar solo cuando ya está PAGADO
            else {
                if (estado === "pagado") {
                    mensaje = `<b>${n.nombres.split(' ')[0]}</b> pagó su reserva`;
                    div.style.backgroundColor = "#e6f4ea";
                    div.style.color = "#155724";
                    div.style.borderLeft = "5px solid #28a745";
                    mostrar = true;
                }
            }

            if (!mostrar) return;

            div.innerHTML = `
                ${mensaje}<br>
                <small>${n.local} - ${hora} (${n.fecha})</small>
            `;

            div.addEventListener('click', () => {
                irAReserva(n.codigo, n.fecha, n.local);
            });

            contenedor.appendChild(div);
        });
    })
    .catch(error => {
        console.error('Error al cargar notificaciones:', error);
    });
}
/*generar pdf autoización*/
function generarPDFAutorizacion(evento) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const datos = evento.extendedProps || {};

    const nombreCompleto = `${datos.nombres || ''} ${datos.apellidos || ''}`.trim();
    const local = datos.local || document.getElementById('area-admin').value || '';
    const fecha = formatearFechaDesdeDate(evento.start);
    const horaInicio = formatearHoraDesdeDate(evento.start);
    const horaFin = formatearHoraDesdeDate(evento.end);
    const horario = `${horaInicio} - ${horaFin}`;
    const eventoTexto = datos.actividad || '';
    const recibo = datos.codigo || '';

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text("AUTORIZACION PARA EL USO DE LOS LOCALES", 105, 20, { align: "center" });
    doc.text("MUNICIPALES", 105, 28, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    doc.text("Sr. (a):", 20, 45);
    doc.text(nombreCompleto, 45, 45);

    doc.text("Representante de:", 20, 55);
    doc.line(60, 55, 180, 55);

    doc.text("Después de haber solicitado la Autorización según procedimiento de acuerdo", 20, 68);
    doc.text("al TUSNE, motivo por el cual se le autoriza el uso del siguiente local:", 20, 75);

    doc.setFont("helvetica", "bold");
    doc.text("LOCAL:", 20, 90);
    doc.text("EL DIA:", 20, 100);
    doc.text("LA HORA:", 20, 110);
    doc.text("EVENTO:", 20, 120);
    doc.text("EXP.:", 20, 130);
    doc.text("RECIBO DE PAGO:", 20, 140);

    doc.setFont("helvetica", "normal");
    doc.text(local, 55, 90);
    doc.text(fecha, 55, 100);
    doc.text(horario, 55, 110);
    doc.text(eventoTexto, 55, 120);
    doc.text("", 55, 130);
    doc.text(String(recibo), 85, 140);

    doc.setFont("helvetica", "bold");
    doc.text("OBSERVACION:", 20, 152);
    doc.setFont("helvetica", "normal");
    doc.text("DEJAR LIMPIO EL LOCAL LUEGO DE CULMINAR SU CHARLA", 58, 152);

    doc.setFont("helvetica", "bold");
    doc.text("Dispositivos Municipales:", 20, 168);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Ordenanza N°22-2022-MPC del 26-09-2022 que aprueba el Reglamento especial", 20, 176);
    doc.text("que prohíbe el ingreso y consumo de todo tipo de bebidas en los espectáculos", 20, 182);
    doc.text("deportivos.", 20, 188);

    doc.setFontSize(11);
    doc.text("ENTREGÓ", 45, 215);
    doc.text("RECIBIÓ", 140, 215);

    doc.line(25, 245, 80, 245);
    doc.line(120, 245, 175, 245);

    doc.setFontSize(10);
    doc.text("ES RESPONSABILIDAD DEL USURIO Y/O INSTITUCION:", 20, 258);
    doc.text("1.- Dejar limpio el local donde se realizará el evento.", 20, 266);
    doc.text("2.- Asumir cualquier daño o perjuicio de la infraestructura, mobiliarios que formen parte", 20, 272);
    doc.text("de las instalaciones.", 20, 278);

    doc.text("Firma:", 20, 288);
    doc.text("Nombre:", 80, 288);
    doc.text("Nº Celular:", 20, 296);
    doc.text("Fecha:", 140, 296);

    doc.save(`Autorizacion_${recibo}.pdf`);
}

/*cargar historial*/
function cargarHistorial() {
    const tipo = document.getElementById('filtro-historial-tipo').value;
    const desde = document.getElementById('filtro-historial-desde').value;
    const hasta = document.getElementById('filtro-historial-hasta').value;

    fetch(`obtener_historial.php?tipo=${encodeURIComponent(tipo)}&desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`)
        .then(res => res.json())
        .then(data => {
            const tbody = document.getElementById('tbody-historial');
            tbody.innerHTML = '';

           if (data.length === 0) {
    tbody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center; padding:20px;">
                No se encontraron registros
            </td>
        </tr>
    `;
    return;
}

            data.forEach(item => {
                const fila = `
                    <tr>
                        <td><b>${item.codigo}</b></td>
                        <td>${item.nombre}</td>
                        <td>${item.local}</td>
                        <td>${item.tipo}</td>
                        <td>${item.fecha}</td>
<td>${item.fecha_aprobacion ?? ''}</td>
<td>${item.monto}</td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', fila);
            });
        })
        .catch(error => {
            console.error('Error al cargar historial:', error);
        });
}

function descargarHistorialExcel() {
    const tipo = document.getElementById('filtro-historial-tipo').value;
    const desde = document.getElementById('filtro-historial-desde').value;
    const hasta = document.getElementById('filtro-historial-hasta').value;

    window.location.href = `exportar_historial_excel.php?tipo=${encodeURIComponent(tipo)}&desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`;
} 
/*formatera hora*/
function formatearHora(hora24) {
    if (!hora24) return '';
    const partes = hora24.split(':');
    let h = parseInt(partes[0], 10);
    const m = partes[1] || '00';
    const sufijo = h >= 12 ? 'p.m.' : 'a.m.';
    let hora12 = h % 12;
    if (hora12 === 0) hora12 = 12;
    return `${hora12}:${m} ${sufijo}`;
}

function formatearFechaLarga(fecha) {
    if (!fecha) return '';
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
}
/*fuction recien agregada */
function formatearHoraDesdeDate(fechaObj) {
    if (!fechaObj) return '';
    let h = fechaObj.getHours();
    let m = String(fechaObj.getMinutes()).padStart(2, '0');
    const sufijo = h >= 12 ? 'p.m.' : 'a.m.';
    let hora12 = h % 12;
    if (hora12 === 0) hora12 = 12;
    return `${hora12}:${m} ${sufijo}`;
}

function formatearFechaDesdeDate(fechaObj) {
    if (!fechaObj) return '';
    const dia = String(fechaObj.getDate()).padStart(2, '0');
    const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
    const anio = fechaObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
}
function irAReserva(codigo, fecha, local) {
    
    console.log("Código que llega:", codigo);

    ver('calendario');
    document.getElementById('area-admin').value = local;

    codigoPendiente = codigo;
    calendar.gotoDate(fecha);
    calendar.refetchEvents();

}

function abrirDetalleEvento(evento) {

    const datos = evento.extendedProps;
    let botones = {};

    if (
        datos.estado === "Pendiente de pago" ||
        datos.estado === "Pagado" ||
        datos.estado === "Pendiente de evaluación"
    ) {
        botones = {
            showDenyButton: true,
            confirmButtonText: 'Aprobar',
            denyButtonText: 'Rechazar',
            confirmButtonColor: '#28a745',
            denyButtonColor: '#dc3545'
        };
    } else {
        botones = {
            showConfirmButton: false,
            showDenyButton: false
        };
    }

   Swal.fire({
    title: 'Detalle de Reserva',
    html: `
        <b>Código:</b> ${datos.codigo}<br>        
        <b>Nombre:</b> ${datos.nombres} ${datos.apellidos}<br>
        <b>DNI:</b> ${datos.dni}<br>
        <b>Celular:</b> ${datos.celular}<br>
        <b>Correo:</b> ${datos.correo}<br>
        <b>Ubicación:</b> ${datos.ubicacion}<br>
        <b>Actividad:</b> ${datos.actividad}<br>
        <b>Tipo:</b> ${datos.tipo}<br>
        <b>Estado:</b> <b>${datos.estado}</b>

        <br><br>

        <button id="btn-pdf" style="
            background:#2c5697;
            color:white;
            border:none;
            padding:8px 15px;
            border-radius:6px;
            cursor:pointer;
        ">
            📄 Generar PDF
        </button>
    `,
    showCloseButton: true,
    ...botones,
    didOpen: () => {
        document.getElementById("btn-pdf").onclick = () => {
            if (datos.tipo === "Concesión") {
                generarPDFAutorizacion(evento);
            } else {
                if (datos.estado === "Pendiente de pago") {
                    generarPDFTicketPago(evento);
                } else {
                    generarPDFAutorizacion(evento);
                }
            }
        };
    }
        
    }) 
    


    
    .then((result) => {

        if (result.isConfirmed) {

            let nuevoEstado = '';

            // CONCESIÓN: NO TOCAR, sigue igual
            if (datos.tipo === "Concesión") {
                nuevoEstado = 'Aprobado';
            }

            // ALQUILER: nuevo camino
            else {
                if (datos.estado === "Pendiente de evaluación") {
                    nuevoEstado = 'Pendiente de pago';
                } 
                else if (datos.estado === "Pagado") {
                    nuevoEstado = 'Aprobado';
                } 
                else {
                    Swal.fire('Error', 'Esta reserva aún no puede aprobarse.', 'warning');
                    return;
                }
            }

            fetch('actualizar_estado.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: new URLSearchParams({
                    codigo: datos.codigo,
                    estado: nuevoEstado
                })
            })
            .then(res => res.text())
            .then(resp => {
               if (resp === "ok") {
    evento.setExtendedProp('estado', nuevoEstado);
    calendar.refetchEvents();
    cargarHistorial();

    // SOLO eliminar notificación cuando ya terminó la acción útil
    // - concesión: cuando se aprueba o rechaza
    // - alquiler: cuando pasa de Pagado a Aprobado
    if (datos.tipo === "Concesión" && nuevoEstado === "Aprobado") {
        eliminarNotificacion(datos.codigo);
    }

    if (datos.tipo !== "Concesión" && datos.estado === "Pagado" && nuevoEstado === "Aprobado") {
        eliminarNotificacion(datos.codigo);
    }

    // CONCESIÓN
    if (datos.tipo === "Concesión") {
        Swal.fire({
            icon: 'success',
            title: 'Reserva aprobada',
            text: 'Se generará la autorización en PDF'
        }).then(() => {
            generarPDFAutorizacion(evento);
        });
    }

    // ALQUILER - PRIMERA APROBACIÓN
    else if (nuevoEstado === 'Pendiente de pago') {
        Swal.fire({
            icon: 'success',
            title: 'Solicitud aprobada para pago',
            text: 'Se generará el ticket de pago'
        }).then(() => {
            generarPDFTicketPago(evento);
        });
    }

    // ALQUILER - SEGUNDA APROBACIÓN
    else if (nuevoEstado === 'Aprobado') {
        Swal.fire({
            icon: 'success',
            title: 'Reserva aprobada',
            text: 'Se generará la autorización en PDF'
        }).then(() => {
            generarPDFAutorizacion(evento);
        });
    }
}
            });
        }

        else if (result.isDenied) {

            Swal.fire({
                title: 'Motivo de rechazo',
                input: 'textarea',
                showCancelButton: true
            }).then(r => {

                if (r.isConfirmed) {

                    fetch('actualizar_estado.php', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body: new URLSearchParams({
                            codigo: datos.codigo,
                            estado: 'Rechazado',
                            motivo: r.value
                        })
                    })
                    .then(res => res.text())
                    .then(resp => {
                        if (resp === "ok") {
                            evento.remove();
                            eliminarNotificacion(datos.codigo);
                            Swal.fire('Rechazado', 'Reserva eliminada', 'success');
                        }
                    });
                }
            });
        }
    });
}
function generarPDFTicketPago(evento) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const datos = evento.extendedProps || {};

    const codigoReserva = datos.codigo || '';
    const nombreCompleto = `${datos.nombres || ''} ${datos.apellidos || ''}`.trim();
    const nombreArea = datos.local || document.getElementById('area-admin').value || '';
    const actividad = datos.actividad || '';
    const totalFormateado = parseFloat(datos.monto || 0).toFixed(2);

    // COLORES
    const azul = [44, 86, 151];
    const amarillo = [253, 216, 8];

    // ENCABEZADO
    doc.setFillColor(azul[0], azul[1], azul[2]);
    doc.rect(0, 0, 210, 30, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text("MUNICIPALIDAD PROVINCIAL DE CAÑETE", 105, 12, { align: "center" });

    doc.setFontSize(12);
    doc.text("FICHA DE RESERVA - ALQUILER", 105, 20, { align: "center" });

    // SUBTÍTULO
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.text(`Código de Reserva: ${codigoReserva}`, 20, 40);

    // LÍNEA
    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    // DATOS DEL USUARIO
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL SOLICITANTE", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);

    doc.text(`Nombre completo: ${nombreCompleto}`, 20, 65);

    // DETALLE RESERVA
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("DETALLE DE LA RESERVA", 20, 110);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);

    doc.text(`Local: ${nombreArea}`, 20, 120);
    doc.text(`Actividad: ${actividad}`, 20, 128);
    doc.text(`Total a pagar: S/ ${totalFormateado}`, 20, 168);

    // CAJA DESTACADA
    doc.setFillColor(amarillo[0], amarillo[1], amarillo[2]);
    doc.rect(20, 180, 170, 25, 'F');
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.text("PRESENTAR ESTE DOCUMENTO EN CAJA PARA REALIZAR EL PAGO", 105, 190, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Este documento es válido únicamente para el trámite solicitado.", 105, 198, { align: "center" });

    // PIE
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Municipalidad Provincial de Cañete", 105, 215, { align: "center" });

    doc.save(`Reserva_Alquiler_${codigoReserva}.pdf`);
}
function eliminarNotificacion(codigo) {
    fetch('eliminar_notificacion.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({
            codigo: codigo
        })
    })
    .then(() => {
        cargarNotificaciones();
    });
}   

/*Descarga excel*/
function descargarHistorialExcel() {
    const tipo = document.getElementById("filtro-historial-tipo").value;
    const desde = document.getElementById("filtro-historial-desde").value;
    const hasta = document.getElementById("filtro-historial-hasta").value;

    const url = `exportar_historial_excel.php?tipo=${encodeURIComponent(tipo)}&desde=${encodeURIComponent(desde)}&hasta=${encodeURIComponent(hasta)}`;

    window.location.href = url;
}/*prendido y apagado */
async function cargarEstadoVentanilla() {
    try {
        const res = await fetch("estado_ventanilla.php");
        const data = await res.json();

        const btn = document.getElementById("btn-ventanilla");
        if (!btn) return;

        btn.classList.remove("btn-ventanilla-abierta", "btn-ventanilla-cerrada", "btn-ventanilla-automatico");

        if (data.ok && data.modo === "forzado_abierto") {
            btn.textContent = "Ventanilla abierta";
            btn.classList.add("btn-ventanilla-abierta");
        } else if (data.ok && data.modo === "forzado_cerrado") {
            btn.textContent = "Ventanilla cerrada";
            btn.classList.add("btn-ventanilla-cerrada");
        } else {
            btn.textContent = "Modo automático";
            btn.classList.add("btn-ventanilla-automatico");
        }

    } catch (error) {
        console.error("Error al cargar estado de ventanilla:", error);
    }
}
async function toggleVentanilla() {
    try {
        const res = await fetch("toggle_ventanilla.php");
        const data = await res.json();

        if (data.ok) {
            cargarEstadoVentanilla(); // 🔥 refresca color
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    cargarEstadoVentanilla();
});