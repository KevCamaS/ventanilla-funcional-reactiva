/**
 * ============================================================================
 *  gestor-estado-reactivo.js
 *  MÓDULO B (parte 1) — Patrón Observer aplicado al Sistema de Reservas
 * ============================================================================
 *   - Fundamentos reactivos y Manifiesto Reactivo (orientado a
 *     mensajes, bajo acoplamiento).
 *   - Patrón Observer — base conceptual de la programación reactiva.
 *
 *  PROBLEMA QUE RESUELVE:
 *   Antes, cuando el administrador aprobaba/rechazaba una reserva, había que
 *   recargar o esperar al temporizador para que el calendario, el contador de
 *   notificaciones y el log se actualizaran. Ahora, al PUBLICAR un cambio de
 *   estado, todos los observadores reaccionan automáticamente.
 *
 *  El sujeto (GestorEstadoReserva) NO conoce los detalles de cada observador:
 *   solo publica el evento. Esto es "bajo acoplamiento" (Manifiesto Reactivo).
 * ============================================================================
 */

// ─── SUJETO OBSERVABLE ───────────────────────────────────────────────────────
class GestorEstadoReserva {
    constructor() {
        // Lista inmutable de observadores: nunca la mutamos con push;
        // creamos una lista nueva en cada suscripción (estilo funcional).
        this._observadores = [];
    }

    /**
     * Suscribe un observador. Debe implementar actualizar(evento).
     * Devuelve una función para CANCELAR la suscripción (estilo reactivo).
     */
    suscribir(observador) {
        this._observadores = [...this._observadores, observador]; // lista nueva
        console.log(`[OBSERVER] Suscrito: ${observador.nombre}`);
        // Retorna el "unsubscribe", como en los flujos reactivos:
        return () => this.desuscribir(observador);
    }

    /** Cancela la suscripción de un observador. */
    desuscribir(observador) {
        this._observadores = this._observadores.filter(o => o !== observador);
        console.log(`[OBSERVER] Desuscrito: ${observador.nombre}`);
    }

    /**
     * Publica un cambio de estado y notifica a TODOS los observadores.
     * Cada observador se aísla en try/catch: si uno falla, los demás
     * siguen recibiendo el evento (principio de RESILIENCIA).
     *
     * @param {string} codigo      - código de la reserva
     * @param {string} nuevoEstado - "Aprobado" | "Rechazado" | "Pagado" | ...
     */
    publicarCambio(codigo, nuevoEstado) {
        const evento = Object.freeze({           // evento inmutable
            codigo,
            nuevoEstado,
            timestamp: new Date(),
        });
        console.log(`[OBSERVER] Publicando → Reserva ${codigo}: ${nuevoEstado}`);
        this._observadores.forEach(obs => {
            try {
                obs.actualizar(evento);
            } catch (e) {
                // Resiliencia: el fallo de un observador no detiene a los demás
                console.error(`[OBSERVER] Error en "${obs.nombre}":`, e);
            }
        });
    }
}

// ─── OBSERVADOR 1: refresca el calendario visual ─────────────────────────────
const ObservadorCalendario = {
    nombre: "Calendario",
    actualizar(evento) {
        console.log(`[CALENDARIO] ${evento.codigo} → "${evento.nuevoEstado}"`);
        if (typeof calendar !== "undefined" && calendar) {
            calendar.refetchEvents();
        }
    },
};

// ─── OBSERVADOR 2: refresca el contador de notificaciones ────────────────────
const ObservadorNotificaciones = {
    nombre: "Notificaciones",
    actualizar(evento) {
        console.log(`[NOTIFICACIONES] Actividad en ${evento.codigo}`);
        if (typeof cargarNotificaciones === "function") {
            cargarNotificaciones();
        }
    },
};

// ─── OBSERVADOR 3: log de auditoría ──────────────────────────────────────────
const ObservadorLog = {
    nombre: "Log",
    actualizar(evento) {
        console.log(
            `[LOG] ${evento.timestamp.toLocaleTimeString()} | ` +
            `Reserva ${evento.codigo} → "${evento.nuevoEstado}"`
        );
    },
};

// ─── INSTANCIA GLOBAL + SUSCRIPCIONES ────────────────────────────────────────
const gestorReservas = new GestorEstadoReserva();
gestorReservas.suscribir(ObservadorCalendario);
gestorReservas.suscribir(ObservadorNotificaciones);
gestorReservas.suscribir(ObservadorLog);

// ─── EXPORTACIÓN (para navegador y para pruebas) ─────────────────────────────
if (typeof window !== "undefined") {
    window.gestorReservas = gestorReservas;
    window.GestorEstadoReserva = GestorEstadoReserva;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        GestorEstadoReserva, gestorReservas,
        ObservadorCalendario, ObservadorNotificaciones, ObservadorLog,
    };
}
