/**
 * ============================================================================
 *  reservas-funcional.js
 *  MÓDULO A — Programación Funcional aplicada al Sistema de Reservas
 * ============================================================================
 *
 *  TEMAS DEL CURSO QUE DEMUESTRA ESTE ARCHIVO:
 *   - Semana 1: Inmutabilidad, funciones puras, código declarativo.
 *   - Semana 2: Interfaces funcionales (predicados, transformadores).
 *   - Funciones de Orden Superior: funciones que reciben/devuelven funciones.
 *   - Semana 4: Operaciones de flujo (map, filter, reduce) como pipeline.
 *
 *  IDEA CENTRAL:
 *   Toda la lógica de cálculo y transformación de reservas vive aquí, en
 *   funciones PURAS (misma entrada => misma salida, sin efectos secundarios,
 *   sin tocar el DOM, sin variables globales). El resto del sistema solo las
 *   llama; no necesita saber cómo están hechas.
 *
 *  Estas funciones NO modifican los datos originales: siempre devuelven
 *  estructuras nuevas (inmutabilidad).
 * ============================================================================
 */

// ─── 1. INMUTABILIDAD: tabla de tarifas congelada ───────────────────────────
// Object.freeze impide que cualquier parte del sistema modifique los precios.
// Es el equivalente funcional de una constante inmutable.
const TARIFAS = Object.freeze({
    "Coliseo Lolo Fernández":        50,
    "Losa Deportiva Beto D'Laura":   20,
    "Auditorio":                     40,
});

// ─── 2. FUNCIONES DE ORDEN SUPERIOR: estrategias de cálculo por tipo ─────────
// Cada tipo de reserva es una FUNCIÓN. En lugar de if/else dispersos, usamos
// un diccionario de funciones. Esto es "funciones como ciudadanos de primera
// clase": las guardamos en un objeto y las invocamos según el tipo.
const ESTRATEGIAS_MONTO = Object.freeze({
    "Alquiler":           (local, horas) => (TARIFAS[local] ?? 0) * horas,
    "Concesión":          ()             => 0,   // institucional, sin costo
    "Concesión de uso":   ()             => 0,
    "Exoneración":        ()             => 0,   // exonerada, sin costo
});

/**
 * FUNCIÓN PURA — calcula el monto total de una reserva.
 * No depende de ninguna variable global ni del DOM: solo de sus parámetros.
 *
 * @param {string} tipo  - "Alquiler" | "Concesión" | "Exoneración"
 * @param {string} local - nombre del local municipal
 * @param {number} horas - cantidad de horas reservadas
 * @returns {number} monto total a pagar
 */
function calcularMonto(tipo, local, horas) {
    const estrategia = ESTRATEGIAS_MONTO[tipo] ?? (() => 0);
    return estrategia(local, horas);
}

// ─── 3. PREDICADOS (interfaces funcionales tipo Predicate) ──────────────────
// Un predicado es una función que recibe un dato y devuelve true/false.
// Se usan con filter(). Son reutilizables y combinables.
const esAprobada   = (r) => (r.estado || "").toLowerCase() === "aprobado";
const esPendiente  = (r) => (r.estado || "").toLowerCase() === "pendiente";
const esPagada     = (r) => (r.estado || "").toLowerCase() === "pagado";
const esDelTipo    = (tipo) => (r) => (r.tipo || "").toLowerCase() === tipo.toLowerCase();

/**
 * FUNCIÓN DE ORDEN SUPERIOR — combina varios predicados con "Y" lógico.
 * Recibe funciones y DEVUELVE una función nueva. Ejemplo:
 *   const aprobadasAlquiler = todos(esAprobada, esDelTipo("Alquiler"));
 *
 * @param  {...Function} predicados
 * @returns {Function} predicado combinado
 */
function todos(...predicados) {
    return (item) => predicados.every(p => p(item));
}

// ─── 4. TRANSFORMADORES (interfaces funcionales tipo Function) ──────────────
/**
 * FUNCIÓN PURA — transforma una reserva cruda a un objeto de visualización.
 * Usa el operador spread (...) para crear un objeto NUEVO sin modificar el
 * original (inmutabilidad).
 *
 * @param {Object} r - reserva cruda
 * @returns {Object} reserva con campos de presentación añadidos
 */
function aVistaReserva(r) {
    const horas = Number(r.horas ?? 0);
    return {
        ...r,                                            // copia inmutable
        montoCalculado: calcularMonto(r.tipo, r.local, horas),
        etiqueta: `${r.local} — ${r.tipo} (S/ ${r.monto ?? 0})`,
    };
}

// ─── 5. PIPELINE: el corazón del enfoque funcional (map/filter/reduce) ───────
/**
 * FUNCIÓN PURA — procesa una lista de reservas de forma declarativa.
 * Reemplaza los bucles imperativos por un pipeline filter → map.
 * No modifica el arreglo original.
 *
 * @param {Array}  reservas - lista cruda de reservas
 * @param {Function} [predicado] - filtro opcional (por defecto, todas)
 * @returns {Array} nueva lista de reservas transformadas
 */
function procesarReservas(reservas, predicado = () => true) {
    return reservas
        .filter(predicado)        // FILTER: selecciona las que cumplen la condición
        .map(aVistaReserva);      // MAP: transforma cada una (inmutable)
}

/**
 * FUNCIÓN PURA — suma la recaudación total de una lista de reservas.
 * Usa REDUCE para combinar todos los montos en un único valor.
 *
 * @param {Array} reservas
 * @returns {number} suma total de los montos
 */
function calcularRecaudacion(reservas) {
    return reservas
        .filter(esAprobada)                              // solo aprobadas
        .reduce((acc, r) => acc + Number(r.monto ?? 0), 0); // REDUCE: acumula
}

/**
 * FUNCIÓN PURA — cuenta reservas agrupadas por estado.
 * Otro ejemplo de REDUCE: construye un objeto-resumen de forma inmutable.
 *
 * @param {Array} reservas
 * @returns {Object} { aprobado: n, pendiente: n, ... }
 */
function resumenPorEstado(reservas) {
    return reservas.reduce((acc, r) => {
        const estado = (r.estado || "sin estado").toLowerCase();
        return { ...acc, [estado]: (acc[estado] ?? 0) + 1 }; // objeto nuevo cada vez
    }, {});
}

// ─── 6. EXPORTACIÓN ─────────────────────────────────────────────────────────
// Se expone en window para que el sistema (no modular) pueda usarlo,
// y también con module.exports para poder PROBARLO con pruebas unitarias.
if (typeof window !== "undefined") {
    window.ReservasFuncional = {
        TARIFAS, calcularMonto,
        esAprobada, esPendiente, esPagada, esDelTipo, todos,
        aVistaReserva, procesarReservas, calcularRecaudacion, resumenPorEstado,
    };
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        TARIFAS, calcularMonto,
        esAprobada, esPendiente, esPagada, esDelTipo, todos,
        aVistaReserva, procesarReservas, calcularRecaudacion, resumenPorEstado,
    };
}
