# Guía de Integración — Cómo conectar los módulos al sistema base

Esta guía indica **exactamente** qué líneas agregar o cambiar en el sistema base para que los módulos funcional y reactivo entren en funcionamiento. Cada cambio es pequeño y reversible.

> Convención: 🔵 ANTES = código original · 🟢 DESPUÉS = código integrado.

---

## 1. `sistema-base/calendario.html`

Al final del `<body>`, **antes** de cargar `funciones-calendario.js`, añade RxJS y el módulo funcional.

🔵 **ANTES:**
```html
    <!-- PATRÓN FACTORY: debe cargarse antes que funciones-calendario.js -->
    <script src="factory-reserva.js"></script>
    <script src="funciones-calendario.js"></script>
</body>
```

🟢 **DESPUÉS:**
```html
    <!-- Módulo funcional: funciones puras, inmutabilidad, map/filter/reduce -->
    <script src="../src/funcional/reservas-funcional.js"></script>

    <!-- RxJS desde CDN (necesario para los flujos reactivos) -->
    <script src="https://cdn.jsdelivr.net/npm/rxjs@7.8.1/dist/bundles/rxjs.umd.min.js"></script>

    <script src="funciones-calendario.js"></script>
</body>
```

> Ajusta la ruta `../src/funcional/...` según dónde quede el archivo respecto al HTML. Si copiaste todo dentro de `htdocs/ventanilla/`, mueve también la carpeta `src/` ahí y usa `src/funcional/reservas-funcional.js`.

---

## 2. `sistema-base/funciones-calendario.js`

Reemplaza el cálculo de monto por la función pura del módulo funcional.

🔵 **ANTES** (alrededor de la línea 339, donde está el Factory):
```js
// ── PATRÓN FACTORY ──────────────────────────────────────
const reservaObj = crearReserva(tipoSolicitud, nombreNormalizado);
const precioHora = reservaObj.calcularMonto(precios);

let horasTotales = esTodoDia ? (horaFinNum - horaInicio) : parseInt(duracionInputVal);
let totalPagar   = precioHora * horasTotales;
```

🟢 **DESPUÉS** (usando la función pura — Semana 1, 2 y 4):
```js
// ── ENFOQUE FUNCIONAL: cálculo con función pura ──────────
// calcularMonto no tiene efectos secundarios: misma entrada => misma salida.
let horasTotales = esTodoDia ? (horaFinNum - horaInicio) : parseInt(duracionInputVal);

let totalPagar = window.ReservasFuncional.calcularMonto(
    tipoSolicitud,        // "Alquiler" | "Concesión" | "Exoneración"
    nombreNormalizado,    // nombre del local
    horasTotales          // horas reservadas
);
```

> Esto elimina la dependencia del Factory para el cálculo. Si prefieres conservar el Factory para crear el objeto-reserva, puedes mantenerlo, pero el monto ahora lo da la función pura.

---

## 3. `sistema-base/admin.html`

En el `<body>`, antes de `funciones-admin.js`, añade RxJS, el módulo funcional y el gestor reactivo. El Observer (`gestor-estado-reactivo.js`) reemplaza al `observer-reserva.js` original.

🔵 **ANTES:**
```html
    <!-- PATRÓN OBSERVER: debe cargarse antes que funciones-admin.js -->
    <script src="observer-reserva.js"></script>
    <script src="funciones-admin.js?v=10"></script>
</body>
```

🟢 **DESPUÉS:**
```html
    <!-- Módulo funcional -->
    <script src="../src/funcional/reservas-funcional.js"></script>

    <!-- RxJS desde CDN -->
    <script src="https://cdn.jsdelivr.net/npm/rxjs@7.8.1/dist/bundles/rxjs.umd.min.js"></script>

    <!-- Módulo reactivo: patrón Observer (reemplaza a observer-reserva.js) -->
    <script src="../src/reactivo/gestor-estado-reactivo.js"></script>

    <!-- Módulo reactivo: flujos RxJS -->
    <script src="../src/reactivo/flujos-rxjs.js"></script>

    <script src="funciones-admin.js?v=11"></script>
</body>
```

---

## 4. `sistema-base/funciones-admin.js`

### 4.a — Publicar el cambio de estado (patrón Observer, Semana 6)

Esto probablemente ya lo hacía el archivo de tu compañero. Confirma que tras actualizar el estado en el servidor se llame a `publicarCambio`:

🟢 **DEBE QUEDAR ASÍ** (dentro del `.then(resp => { if (resp === "ok") {...} })`):
```js
if (resp === "ok") {
    evento.setExtendedProp('estado', nuevoEstado);

    // PATRÓN OBSERVER: notifica automáticamente a calendario, notificaciones y log
    gestorReservas.publicarCambio(datos.codigo, nuevoEstado);

    cargarHistorial();
    // ... resto de la lógica (PDFs, etc.) sin cambios
}
```

### 4.b — Reemplazar el polling por un flujo reactivo (Semanas 7, 9 y 10)

🔵 **ANTES** (dentro de `DOMContentLoaded`, ~línea 150):
```js
setInterval(() => {
    calendar.refetchEvents();
    cargarNotificaciones();
}, 5000);
```

🟢 **DESPUÉS** (flujo reactivo con manejo de errores y reintentos):
```js
// ENFOQUE REACTIVO: en lugar de un setInterval "ciego", usamos un flujo
// que recarga los datos, reintenta ante fallos y no rompe la app si hay error.
if (window.FlujosRxJS) {
    window.FlujosRxJS.crearFlujoDeRefresco(
        5000,                                   // cada 5 segundos
        () => fetch(                            // función que trae las reservas
            `obtener_reservas.php?local=${encodeURIComponent(document.getElementById('area-admin').value)}&tipo=${document.getElementById('filtro-tipo').value}`
        ).then(r => r.json()),
        (reservas) => {                         // qué hacer con los datos
            calendar.refetchEvents();
            cargarNotificaciones();
        }
    );
} else {
    // Respaldo: si RxJS no cargó, se mantiene el comportamiento original.
    setInterval(() => { calendar.refetchEvents(); cargarNotificaciones(); }, 5000);
}
```

### 4.c — (Opcional) Reaccionar al cambio de filtro con un flujo

🔵 **ANTES:**
```js
document.getElementById('filtro-tipo').addEventListener('change', function() {
    cargarNotificaciones();
    calendar.refetchEvents();
});
```

🟢 **DESPUÉS** (flujo con debounce y manejo de error — Semana 7 y 9):
```js
if (window.FlujosRxJS) {
    window.FlujosRxJS.crearFlujoDeFiltro(
        document.getElementById('filtro-tipo'),
        (tipo) => fetch(
            `obtener_reservas.php?local=${encodeURIComponent(document.getElementById('area-admin').value)}&tipo=${tipo}`
        ).then(r => r.json()),
        (reservas) => { calendar.refetchEvents(); cargarNotificaciones(); }
    );
} else {
    document.getElementById('filtro-tipo').addEventListener('change', function() {
        cargarNotificaciones(); calendar.refetchEvents();
    });
}
```

---

## 5. Verificación

1. Abre `admin.html` en el navegador con la consola (F12) abierta.
2. Aprueba o rechaza una reserva. Deberías ver en consola:
   ```
   [OBSERVER] Publicando → Reserva 001: Aprobado
   [CALENDARIO] 001 → "Aprobado"
   [NOTIFICACIONES] Actividad en 001
   [LOG] hh:mm:ss | Reserva 001 → "Aprobado"
   ```
3. Al cargar la página deberías ver `[RxJS] Módulo de flujos reactivos cargado.`
4. Corta la conexión (o apaga Apache un momento) y observa que la app **no se rompe**: el `catchError` devuelve una lista vacía en lugar de detener todo.

---

## Resumen de archivos tocados

| Archivo | Cambio |
|---|---|
| `calendario.html` | + scripts (RxJS, módulo funcional) |
| `funciones-calendario.js` | cálculo de monto → `ReservasFuncional.calcularMonto` |
| `admin.html` | + scripts (RxJS, gestor reactivo, flujos) |
| `funciones-admin.js` | Observer + flujo reactivo en lugar de `setInterval` |

Nada del backend PHP necesita cambiar para esta integración. Las recomendaciones de migrar el backend a Java/Reactor quedan documentadas como trabajo futuro en el informe.
