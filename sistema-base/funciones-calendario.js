document.addEventListener('DOMContentLoaded', function() {
    async function aplicarEstadoVentanillaPublica() {
    try {
        const res = await fetch("validar_ventanilla.php");
        const data = await res.json();

        const btnReservar = document.getElementById("btn-reservar");
        const campos = document.querySelectorAll(
            "#nombres, #apellidos, #dni, #celular, #correo, #ubicacion, #actividad, #tipo-solicitud, #fecha-reserva, #hora-inicio, #duracion, #todo-dia"
        );

        if (!data.permitido) {
            campos.forEach(campo => campo.disabled = true);

            if (btnReservar) {
                btnReservar.disabled = true;
                btnReservar.style.opacity = "0.6";
                btnReservar.style.cursor = "not-allowed";
            }

            let mensaje = document.getElementById("mensaje-ventanilla");
            if (!mensaje) {
                mensaje = document.createElement("div");
                mensaje.id = "mensaje-ventanilla";
                mensaje.style.background = "#dc2626";
                mensaje.style.color = "#fff";
                mensaje.style.padding = "10px";
                mensaje.style.marginBottom = "12px";
                mensaje.style.borderRadius = "8px";
                mensaje.style.fontWeight = "600";
                mensaje.style.fontSize = "14px";
            }

            mensaje.textContent = data.mensaje;

            if (btnReservar && btnReservar.parentNode) {
                btnReservar.parentNode.insertBefore(mensaje, btnReservar);
            }

        } else {
            campos.forEach(campo => campo.disabled = false);

            if (btnReservar) {
                btnReservar.disabled = false;
                btnReservar.style.opacity = "1";
                btnReservar.style.cursor = "pointer";
            }

            const mensaje = document.getElementById("mensaje-ventanilla");
            if (mensaje) mensaje.remove();
        }

    } catch (error) {
        console.error("Error al validar ventanilla pública:", error);
    }
}
    const parametrosURL = new URLSearchParams(window.location.search);
    const nombreArea = parametrosURL.get('area') || "LOCAL MUNICIPAL";
    
    const tituloArea = document.getElementById('area-titulo');
    if (tituloArea) { tituloArea.innerText = nombreArea.toUpperCase(); }

    const calendarEl = document.getElementById('calendar');
    const selectHora = document.getElementById('hora-inicio');
    const inputFecha = document.getElementById('fecha-reserva');

    const checkboxTodoDia = document.getElementById('todo-dia');
    const inputDuracion = document.getElementById('duracion');

    checkboxTodoDia.addEventListener('change', () => {
        if (checkboxTodoDia.checked) {
            inputDuracion.disabled = true;
            inputDuracion.value = '';

            selectHora.disabled = true;
            selectHora.value = "08"; 
        } else {
            inputDuracion.disabled = false;
            selectHora.disabled = false;
        }
    });
    
    const hoyStr = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoyStr);
    inputFecha.value = hoyStr;

   for (let i = 8; i <= 23; i++) {
        let hourLabel = i >= 12 ? (i === 12 ? 12 : i - 12) + ":00 p.m." : i + ":00 a.m.";
        selectHora.add(new Option(hourLabel, i < 10 ? '0'+i : i));
    }

    function generarCodigoUnico() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const precios = {
        "Coliseo Lolo Fernández": 50,
        "Losa Deportiva Beto D'Laura": 20,    
        "Auditorio": 40
    };

    const nombreNormalizado = nombreArea.trim();
    function limpiarFormulario() {
    document.getElementById('nombres').value = '';
    document.getElementById('apellidos').value = '';
    document.getElementById('dni').value = '';
    document.getElementById('celular').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('ubicacion').value = '';
    document.getElementById('actividad').value = '';

    document.getElementById('tipo-solicitud').selectedIndex = 0;
    document.getElementById('hora-inicio').selectedIndex = 0;
    document.getElementById('duracion').value = '';

    document.getElementById('todo-dia').checked = false;
    document.getElementById('duracion').disabled = false;
    document.getElementById('hora-inicio').disabled = false;
}

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        locale: 'es',
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

        eventDidMount: function(info) {
            const estado = (info.event.extendedProps.estado || "").trim().toLowerCase();
            const tipo = (info.event.extendedProps.tipo || "").trim().toLowerCase();
            
            if (tipo.includes("conces")) {
                if (estado === "aprobado") {
                    info.el.style.setProperty('background-color', '#2c5697', 'important');
                } else if (estado === "rechazado") {
                    info.el.style.setProperty('background-color', '#dc3545', 'important');
                } else {
                    info.el.style.setProperty('background-color', '#6c757d', 'important');
                }
                info.el.style.setProperty('color', '#ffffff', 'important');
                return; 
            }
            
            if (estado === "aprobado") {
                info.el.style.backgroundColor = "#2c5697";
            } 
            else if (estado === "rechazado") {
                info.el.style.backgroundColor = "#dc3545"; 
            } 
            else if (estado === "pendiente de pago") {
                info.el.style.backgroundColor = "#ffc107"; 
            } 
            else if (estado === "pagado") {
                info.el.style.backgroundColor = "#28a745"; 
            }

            console.log("TIPO:", tipo);
            console.log("ESTADO:", estado);
        },             
       

        eventContent: function(arg) {
            let info = arg.event.extendedProps;
            return {
                html: `
                <div style="font-size: 0.7rem; padding: 2px; line-height: 1.1; overflow: hidden;">
                    
                    <span>${arg.timeText}</span><br>
                    <span>${info.tipo}</span><br>
                    <span style="font-weight: bold; color: #ffeb3b;">${info.estado}</span>
                </div>`
            };
        },

        events: `obtener_reservas.php?local=${encodeURIComponent(nombreArea)}`,
        eventOverlap: false,
    });

    calendar.render();

    document.getElementById('btn-reservar').onclick = async function() {
         // 🔴 VALIDAR VENTANILLA (NUEVO)
    try {
        const res = await fetch("validar_ventanilla.php");
        const data = await res.json();

        if (!data.permitido) {
            Swal.fire({
                icon: 'error',
                title: 'Ventanilla cerrada',
                text: data.mensaje,
                confirmButtonColor: '#2c5697'
            });
            return;
        }

    } catch (error) {
        console.error("Error validando ventanilla:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error del sistema',
            text: 'No se pudo verificar el estado de la ventanilla.'
        });
        return;
    }

        const ahora = new Date();
        const fechaSeleccionada = inputFecha.value;

        const duracionInputVal = inputDuracion.value;
        const esTodoDia = checkboxTodoDia.checked;

        let horaInicio = esTodoDia ? 8 : parseInt(selectHora.value);

        // VALIDACIÓN: HORARIO DE ATENCIÓN GENERAL
        const fechaSel = new Date(fechaSeleccionada + 'T00:00:00');

        const hoy = new Date();
        hoy.setHours(0,0,0,0);
        
   
        if (fechaSel < hoy) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha inválida',
                text: 'No puedes reservar fechas pasadas.',
                confirmButtonColor: '#2c5697'
            });
            return;
        }
        
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, '0');
        const dia = String(ahora.getDate()).padStart(2, '0');
        const hoyFormateado = `${anio}-${mes}-${dia}`;
        
        if (fechaSeleccionada === hoyFormateado) {
            const horaActual = ahora.getHours();
            const minutosActuales = ahora.getMinutes();

            if (horaInicio < horaActual || (horaInicio === horaActual && minutosActuales > 0)) {
                Swal.fire({
                    icon: 'error',
                    title: 'Hora inválida',
                    text: 'La hora seleccionada ya ha pasado. Por favor, elige una hora posterior.',
                    confirmButtonColor: '#2c5697'
                });
                return;
            }
        }

        if (horaInicio < 8 || horaInicio >= 23){
    Swal.fire({
         icon: 'error',
        title: 'Horario inválido',
        text: 'Solo puedes reservar entre 8:00 a.m. y 11:00 p.m.',
        confirmButtonColor: '#2c5697'
    });
    return;
        }

        if (!esTodoDia && (!duracionInputVal || parseInt(duracionInputVal) <= 0)) {
            Swal.fire({
                icon: 'error',
                title: 'Duración inválida',
                text: 'Ingrese una cantidad de horas válida o seleccione "Día completo".',
                confirmButtonColor: '#2c5697'
            });
            return;
        }

        // CAPTURA DE DATOS
        const nombres = document.getElementById('nombres').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const dni = document.getElementById('dni').value.trim();
        const celular = document.getElementById('celular').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const ubicacion = document.getElementById('ubicacion').value.trim();
        const actividad = document.getElementById('actividad').value.trim();
        const tipoSolicitud = document.getElementById('tipo-solicitud').value;
        
        // VALIDACIÓN: CAMPOS OBLIGATORIOS
        if(!nombres || !apellidos || !dni || !celular || !correo || !ubicacion || !actividad || !fechaSeleccionada) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', text: 'Por favor, rellene todos los campos del formulario.', confirmButtonColor: '#2c5697' });
            return;
        }

        // VALIDACIÓN DNI Y CELULAR
        if (!/^\d{8}$/.test(dni)) {
            Swal.fire({ icon: 'error', title: 'DNI inválido', text: 'El DNI debe tener 8 números.', confirmButtonColor: '#2c5697' });
            return;
        }
        if (!/^\d{9}$/.test(celular)) {
            Swal.fire({ icon: 'error', title: 'Celular inválido', text: 'El celular debe tener 9 números.', confirmButtonColor: '#2c5697' });
            return;
        }

        let horaFinNum = esTodoDia ? 23 : horaInicio + parseInt(duracionInputVal);

if (horaFinNum > 23) {
    Swal.fire({
        icon: 'error',
        title: 'Horario excedido',
        text: 'La reserva no puede terminar después de las 11:00 p.m.',
        confirmButtonColor: '#2c5697'
    });
    return;
}

        let horasTotales = esTodoDia ? (horaFinNum - horaInicio) : parseInt(duracionInputVal);

        // ── ENFOQUE FUNCIONAL ────────────────────────────────────────────
        // El monto se calcula con una función PURA (sin efectos secundarios,
        // misma entrada => misma salida). Usa una tabla de tarifas inmutable
        // y estrategias de cálculo por tipo (funciones de orden superior).
        let totalPagar;
        if (window.ReservasFuncional) {
            totalPagar = window.ReservasFuncional.calcularMonto(
                tipoSolicitud, nombreNormalizado, horasTotales
            );
        } else {
            // Respaldo: lógica previa basada en Factory
            const reservaObj = crearReserva(tipoSolicitud, nombreNormalizado);
            totalPagar = reservaObj.calcularMonto(precios) * horasTotales;
        }
        // ─────────────────────────────────────────────────────────────────

        let totalFormateado = totalPagar.toFixed(2);

        const inicioReserva = new Date(`${fechaSeleccionada}T${horaInicio < 10 ? '0'+horaInicio : horaInicio}:00:00`);
        const finReserva = new Date(`${fechaSeleccionada}T${horaFinNum < 10 ? '0'+horaFinNum : horaFinNum}:00:00`);

        const ocupado = calendar.getEvents().some(ev => 
            (inicioReserva < ev.end && finReserva > ev.start)
        );

        if (ocupado) {
            Swal.fire({ icon: 'error', title: 'No disponible', text: 'El horario ya está reservado.' });
        } else {
            const primerNombre = nombres.split(' ')[0];
            const nombreCompleto = `${nombres} ${apellidos}`;

            if (tipoSolicitud.toLowerCase().includes("conces")) {
                const codigoReserva = generarCodigoUnico();
    
                fetch('guardar_reserva.php', {        
                    method: 'POST',        
                    headers: {            
                        'Content-Type': 'application/x-www-form-urlencoded'        
                    },        
                    body: new URLSearchParams({            
                        nombres,            
                        apellidos,            
                        dni,            
                        celular,            
                        correo,            
                        ubicacion,            
                        actividad,            
                        tipo: tipoSolicitud,            
                        fecha: fechaSeleccionada,            
                        hora_inicio: horaInicio + ":00:00",            
                        hora_fin: horaFinNum + ":00:00",            
                        estado: 'Pendiente de evaluación',            
                        codigo: codigoReserva,            
                        local: nombreArea,            
                        monto: 0        
                    })
    
                })
    
                .then(res => res.text())    
                .then(data => {
        
                    if (data === "ok") {
            
                        Swal.fire({
                        icon: 'info',
                        title: 'Solicitud enviada',
                            html: `
                             <p>Tu solicitud de concesión fue registrada correctamente.</p>
                             <p>Un administrador se comunicará contigo para continuar el proceso.</p> `,
                             confirmButtonColor: '#2c5697'
                            }).then(() => {
                                limpiarFormulario();
                                   calendar.refetchEvents();
                           });     
                    }    
                });

            } else {
                const codigoReserva = generarCodigoUnico();

                // Enviar a la BD
                fetch('guardar_reserva.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },

                    body: new URLSearchParams({
                        nombres,
                        apellidos,
                        dni,
                        celular,
                        correo,
                        ubicacion,
                        actividad,
                        tipo: tipoSolicitud,
                        fecha: fechaSeleccionada,
                        hora_inicio: horaInicio + ":00:00",
                        hora_fin: horaFinNum + ":00:00",
                        estado: 'Pendiente de evaluación',
                        codigo: codigoReserva,
                        local: nombreArea,
                        monto: totalFormateado
                    })
                })

                .then(res => res.text())
                .then(data => {
                    console.log("Respuesta BD:", data);

                    if (data === "ocupado") {
                        Swal.fire({
                            icon: 'error',
                            title: 'Horario ocupado',
                            text: 'Ese horario ya está reservado en el sistema'
                        });
                        return;
                    }

                    if (data === "ok") {

                        limpiarFormulario();
                        Swal.fire({
                            icon: 'success',
                            title: 'Reserva realizada',
                            html: `
                             <p>Su solicitud fue registrada correctamente.</p>
                              <p>Espere respuesta a sus medios de comunicación: celular o correo electrónico.</p>
                              `,
                              confirmButtonText: 'Entendido',
                               confirmButtonColor: '#2974b8'
                               });

                        

                        calendar.refetchEvents();
                    }
                });
                
            }

        }

    };

});