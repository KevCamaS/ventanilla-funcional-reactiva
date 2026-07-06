/**
 * ============================================================================
 *  flujos-rxjs.js
 *  MÓDULO B (parte 2) — Flujos Reactivos con RxJS
 * ============================================================================
 *   - Programación reactiva (flujos de datos asíncronos).
 *   - Operadores reactivos (map, filter, debounceTime, switchMap)
 *     y el ciclo de un flujo (emisión, error, completado).
 *   - Gestión de errores en flujos reactivos (catchError, retry).
 *   - Modelos no bloqueantes (asíncronos) — el flujo no detiene
 *     la interfaz mientras espera la respuesta del servidor.
 *
 *  REQUISITO: cargar RxJS desde CDN en el HTML, ANTES de este archivo:
 *    <script src="https://cdn.jsdelivr.net/npm/rxjs@7.8.1/dist/bundles/rxjs.umd.min.js"></script>
 *  RxJS queda disponible como variable global "rxjs".
 *
 *  PROBLEMA QUE RESUELVE:
 *   El sistema base usa setInterval(..., 5000) para recargar el calendario
 *   cada 5 segundos (sondeo/polling). Eso consume recursos aunque no haya
 *   cambios. Aquí lo reemplazamos por FLUJOS que reaccionan SOLO cuando
 *   ocurre un evento real (cambio de filtro, clic en "refrescar", etc.),
 *   y que manejan los errores sin romper la aplicación.
 * ============================================================================
 */

(function () {
    // Verifica que RxJS esté cargado.
    if (typeof rxjs === "undefined") {
        console.warn("[RxJS] No se cargó RxJS. Incluye el script del CDN antes de flujos-rxjs.js");
        return;
    }

    // Desestructuramos lo que usaremos de RxJS.
    const { fromEvent, of, interval, timer } = rxjs;
    const {
        debounceTime, map, filter, switchMap,
        catchError, retry, startWith, distinctUntilChanged,
    } = rxjs.operators;

    /**
     * Crea un flujo reactivo que carga reservas cada vez que cambia el filtro.
     *
     * @param {HTMLElement} elementoFiltro - el <select> de tipo o local
     * @param {Function} fetchReservas - función que recibe (valor) y devuelve
     *                                   una Promesa con la lista de reservas
     * @param {Function} onDatos - callback que recibe las reservas ya cargadas
     */
    function crearFlujoDeFiltro(elementoFiltro, fetchReservas, onDatos) {
        const flujo$ = fromEvent(elementoFiltro, "change").pipe(
            map(e => e.target.value),          // OPERADOR map: evento → valor
            startWith(elementoFiltro.value),   // emite el valor inicial al cargar
            distinctUntilChanged(),            // ignora si el valor no cambió
            debounceTime(300),                 // espera 300ms (evita exceso de peticiones)
            switchMap(valor =>                 // cambia al flujo de la nueva petición
                fetchReservas(valor).catch(() => []) // protege la promesa
            ),
            catchError(err => {                // GESTIÓN DE ERRORES (Semana 9)
                console.error("[RxJS] Error en el flujo de filtro:", err);
                return of([]);                 // devuelve flujo alternativo: lista vacía
            })
        );

        // subscribe() arranca el flujo. Devuelve la suscripción para cancelarla.
        return flujo$.subscribe({
            next:  reservas => onDatos(reservas),                 // emisión
            error: err => console.error("[RxJS] Flujo terminado por error:", err),
            complete: () => console.log("[RxJS] Flujo completado"), // señal OnComplete
        });
    }

    /**
     * Reemplazo reactivo del setInterval de polling.
     * Crea un flujo que emite cada N milisegundos y recarga los datos,
     * pero con manejo de errores y reintentos (resiliencia).
     *
     * @param {number} ms - milisegundos entre cada refresco
     * @param {Function} fetchReservas - devuelve una Promesa con las reservas
     * @param {Function} onDatos - callback con las reservas
     */
    function crearFlujoDeRefresco(ms, fetchReservas, onDatos) {
        const flujo$ = timer(0, ms).pipe(      // emite en 0 y luego cada "ms"
            switchMap(() =>
                fetchReservas().catch(() => { throw new Error("fallo de red"); })
            ),
            retry({ count: 2, delay: 1000 }),  // reintenta 2 veces antes de rendirse
            catchError(err => {                // si aún falla, no rompe la app
                console.error("[RxJS] Refresco falló tras reintentos:", err);
                return of([]);
            })
        );

        return flujo$.subscribe(reservas => onDatos(reservas));
    }

    // Exponer la API reactiva globalmente.
    window.FlujosRxJS = { crearFlujoDeFiltro, crearFlujoDeRefresco };
    console.log("[RxJS] Módulo de flujos reactivos cargado.");
})();
