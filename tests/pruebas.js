/**
 * ============================================================================
 *  pruebas.js — Casos de prueba (CP-01 a CP-05) del Módulo A
 * ============================================================================
 *
 *  Pruebas unitarias de las funciones puras del módulo funcional.
 *  No requieren librerías externas: se ejecutan con Node.js.
 *
 *  CÓMO EJECUTAR:
 *    node tests/pruebas.js
 *
 *  Las funciones puras son fáciles de probar precisamente porque no tienen
 *  efectos secundarios: misma entrada => misma salida.
 * ============================================================================
 */

const F = require("../src/funcional/reservas-funcional.js");

// Mini-framework de aserciones (sin dependencias).
let pasadas = 0, fallidas = 0;
function assert(nombre, condicion) {
    if (condicion) { console.log(`  ✓ ${nombre}`); pasadas++; }
    else           { console.log(`  ✗ ${nombre}`); fallidas++; }
}

// Datos de ejemplo (inmutables) para las pruebas.
const reservas = [
    { codigo: "001", local: "Coliseo Lolo Fernández", tipo: "Alquiler",  estado: "Aprobado",  monto: 150, horas: 3 },
    { codigo: "002", local: "Auditorio",              tipo: "Concesión", estado: "Pendiente", monto: 0,   horas: 2 },
    { codigo: "003", local: "Coliseo Lolo Fernández", tipo: "Alquiler",  estado: "Aprobado",  monto: 100, horas: 2 },
    { codigo: "004", local: "Auditorio",              tipo: "Alquiler",  estado: "Rechazado", monto: 80,  horas: 2 },
];

console.log("\n=== CP-01: Cálculo de monto de Alquiler ===");
assert("Coliseo (50) x 3 horas = 150", F.calcularMonto("Alquiler", "Coliseo Lolo Fernández", 3) === 150);

console.log("\n=== CP-02: Cálculo de monto de Concesión ===");
assert("Concesión siempre = 0", F.calcularMonto("Concesión", "Auditorio", 5) === 0);
assert("Exoneración siempre = 0", F.calcularMonto("Exoneración", "Auditorio", 5) === 0);

console.log("\n=== CP-03: Inmutabilidad de tarifas ===");
let tarifasNoCambian = true;
try {
    F.TARIFAS["Coliseo Lolo Fernández"] = 9999; // intento de mutación
    if (F.TARIFAS["Coliseo Lolo Fernández"] === 9999) tarifasNoCambian = false;
} catch (e) { /* en modo estricto lanza error: también es correcto */ }
assert("Las tarifas congeladas no se modifican", tarifasNoCambian);

console.log("\n=== CP-04: Filtrado de aprobadas (filter) ===");
const aprobadas = F.procesarReservas(reservas, F.esAprobada);
assert("Devuelve exactamente 2 aprobadas", aprobadas.length === 2);
assert("Todas tienen estado Aprobado", aprobadas.every(r => r.estado === "Aprobado"));
assert("No modifica el arreglo original", reservas.length === 4);

console.log("\n=== CP-05: Suma de recaudación (reduce) ===");
assert("Recaudación de aprobadas = 250", F.calcularRecaudacion(reservas) === 250);

console.log("\n=== EXTRA: combinación de predicados (HOF) ===");
const aprobadasAlquiler = reservas.filter(F.todos(F.esAprobada, F.esDelTipo("Alquiler")));
assert("2 reservas aprobadas de tipo Alquiler", aprobadasAlquiler.length === 2);

console.log("\n=== EXTRA: resumen por estado (reduce a objeto) ===");
const resumen = F.resumenPorEstado(reservas);
assert("2 aprobadas en el resumen", resumen["aprobado"] === 2);
assert("1 pendiente en el resumen", resumen["pendiente"] === 1);

// ─── Resultado final ─────────────────────────────────────────────────────────
console.log(`\n────────────────────────────────────────`);
console.log(`  RESULTADO: ${pasadas} pasadas, ${fallidas} fallidas`);
console.log(`────────────────────────────────────────\n`);
process.exit(fallidas === 0 ? 0 : 1);
