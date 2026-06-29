# Integración de la capa funcional y reactiva con el sistema base

Este documento describe cómo los módulos de las carpetas `src/funcional` y `src/reactivo` se conectan con el sistema web de reservas (`sistema-base/`). La integración es no intrusiva: los módulos se cargan como scripts adicionales y el sistema base conserva su funcionamiento aun si alguno no se carga.

---

## 1. Carga de los módulos

### `sistema-base/calendario.html`

La vista ciudadana incorpora la capa funcional y la librería RxJS antes de su script principal:

```html
    <!-- Capa funcional: funciones puras, inmutabilidad, map/filter/reduce -->
    <script src="../src/funcional/reservas-funcional.js"></script>

    <!-- RxJS (flujos reactivos) -->
    <script src="https://cdn.jsdelivr.net/npm/rxjs@7.8.1/dist/bundles/rxjs.umd.min.js"></script>

    <script src="funciones-calendario.js"></script>
</body>
```

### `sistema-base/admin.html`

El panel administrativo incorpora además el gestor reactivo (patrón Observer) y los flujos:

```html
    <!-- Capa funcional -->
    <script src="../src/funcional/reservas-funcional.js"></script>

    <!-- RxJS -->
    <script src="https://cdn.jsdelivr.net/npm/rxjs@7.8.1/dist/bundles/rxjs.umd.min.js"></script>

    <!-- Capa reactiva: patrón Observer -->
    <script src="../src/reactivo/gestor-estado-reactivo.js"></script>

    <!-- Capa reactiva: flujos RxJS -->
    <script src="../src/reactivo/flujos-rxjs.js"></script>

    <script src="funciones-admin.js"></script>
</body>
```

---

## 2. Cálculo de montos con funciones puras

En `sistema-base/funciones-calendario.js`, el cálculo del monto de una reserva se delega a la función pura `calcularMonto` de la capa funcional, que no depende de variables globales ni del DOM:

```js
const horasTotales = esTodoDia ? (horaFinNum - horaInicio) : parseInt(duracionInputVal);

const totalPagar = window.ReservasFuncional.calcularMonto(
    tipoSolicitud,        // "Alquiler" | "Concesión" | "Exoneración"
    nombreNormalizado,    // local municipal
    horasTotales          // horas reservadas
);
```

El monto se obtiene a partir de una tabla de tarifas inmutable y de un diccionario de estrategias de cálculo por tipo de reserva, eliminando los condicionales dispersos del enfoque imperativo.

---

## 3. Propagación reactiva de los cambios de estado (patrón Observer)

En `sistema-base/funciones-admin.js`, al confirmar el cambio de estado de una reserva en el servidor, se publica el cambio en el gestor observable. Los observadores suscritos (calendario, notificaciones y registro) reaccionan automáticamente:

```js
if (resp === "ok") {
    evento.setExtendedProp('estado', nuevoEstado);

    // Publicación del cambio: el gestor notifica a todos los observadores
    gestorReservas.publicarCambio(datos.codigo, nuevoEstado);

    cargarHistorial();
}
```

---

## 4. Actualización mediante flujos reactivos

La actualización periódica de la interfaz se realiza con un flujo reactivo que recarga los datos, reintenta ante fallos de comunicación y no interrumpe la aplicación si el error persiste, en lugar de un temporizador de sondeo:

```js
window.FlujosRxJS.crearFlujoDeRefresco(
    5000,
    () => fetch(
        `obtener_reservas.php?local=${encodeURIComponent(areaAdmin.value)}&tipo=${filtroTipo.value}`
    ).then(r => r.json()),
    (reservas) => { calendar.refetchEvents(); cargarNotificaciones(); }
);
```

De forma análoga, el cambio del filtro de tipo se modela como un flujo con `debounceTime` y `catchError`, evitando peticiones excesivas y protegiendo la interfaz ante errores de red.

---

## 5. Comportamiento en consola

Durante la operación del panel administrativo, la capa reactiva registra en consola la traza de los eventos, lo que permite verificar el funcionamiento del patrón Observer y de los flujos:

```
[OBSERVER] Publicando → Reserva 001: Aprobado
[CALENDARIO] 001 → "Aprobado"
[NOTIFICACIONES] Actividad en 001
[LOG] hh:mm:ss | Reserva 001 → "Aprobado"
```

---

## Archivos involucrados en la integración

| Archivo | Rol en la integración |
|---|---|
| `calendario.html` | Carga la capa funcional y RxJS |
| `funciones-calendario.js` | Cálculo de montos mediante funciones puras |
| `admin.html` | Carga la capa funcional, el gestor reactivo y los flujos |
| `funciones-admin.js` | Publicación de cambios (Observer) y actualización por flujos |

El backend PHP no requiere modificaciones para esta integración.
