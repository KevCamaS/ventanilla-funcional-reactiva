# Sistema de Ventanilla Virtual de Reservas — Programación Funcional y Reactiva

Integración de patrones y técnicas de **Programación Funcional y Reactiva** en el Sistema de Ventanilla Virtual de Reservas de Locales Municipales de la Municipalidad Provincial de Cañete.

El proyecto parte de un sistema web de reservas existente (construido con HTML, CSS, JavaScript y PHP sobre MySQL) y reescribe su lógica de cálculo, transformación de datos y actualización de la interfaz aplicando los fundamentos del paradigma funcional y reactivo, con el fin de mejorar el flujo de atenciones, la mantenibilidad del código y la respuesta del sistema ante los cambios de estado de las reservas.

---

## Arquitectura del proyecto

El código se organiza en dos grandes capas independientes del sistema base, de modo que la lógica funcional y reactiva quede aislada, reutilizable y comprobable:

| Capa | Descripción | Archivo |
|---|---|---|
| Funcional | Funciones puras, inmutabilidad y operaciones de flujo (map / filter / reduce) para el cálculo y la transformación de reservas | `src/funcional/reservas-funcional.js` |
| Reactiva — Observer | Gestor de estado observable que propaga automáticamente los cambios de estado de una reserva a los componentes de la interfaz | `src/reactivo/gestor-estado-reactivo.js` |
| Reactiva — Flujos | Flujos de datos asíncronos con operadores y manejo de errores, en reemplazo del sondeo por temporizador | `src/reactivo/flujos-rxjs.js` |

---

## Conceptos aplicados

### Programación Funcional
- **Inmutabilidad:** las estructuras de datos no se modifican; cada operación devuelve una estructura nueva. La tabla de tarifas se protege con `Object.freeze`.
- **Funciones puras:** el cálculo de montos y las transformaciones no producen efectos secundarios; para una misma entrada devuelven siempre la misma salida.
- **Funciones de orden superior:** los predicados y transformadores se tratan como valores; se combinan y se pasan como argumentos a `map`, `filter` y `reduce`.
- **Operaciones de flujo:** el procesamiento de listas de reservas se expresa como un pipeline declarativo `filter → map → reduce`, sin bucles ni contadores manuales.

### Programación Reactiva
- **Patrón Observer:** un sujeto observable publica los cambios de estado y notifica automáticamente a los observadores suscritos (calendario, notificaciones y registro de actividad), sin acoplamiento directo entre ellos.
- **Flujos y operadores:** los eventos de la interfaz se modelan como flujos sobre los que se aplican operadores (`map`, `debounceTime`, `switchMap`, `distinctUntilChanged`).
- **Gestión de errores:** los errores se tratan como mensajes explícitos del flujo; los operadores `catchError` y `retry` aportan resiliencia y evitan la caída total de la aplicación.
- **Modelo no bloqueante:** la actualización de datos se realiza de forma asíncrona, liberando el hilo y evitando el sondeo continuo.

---

## Estructura del repositorio

```
.
├── README.md
├── INTEGRACION.md                    Documentación de la integración con el sistema base
├── package.json
├── src/
│   ├── funcional/
│   │   └── reservas-funcional.js     Capa funcional
│   └── reactivo/
│       ├── gestor-estado-reactivo.js Patrón Observer
│       └── flujos-rxjs.js            Flujos reactivos con RxJS
├── tests/
│   └── pruebas.js                    Pruebas unitarias de la capa funcional
└── sistema-base/                     Sistema web de reservas
    ├── calendario.html, admin.html, ...
    ├── funciones-calendario.js, funciones-admin.js, ...
    ├── *.php, *.css, *.sql
    └── img/
```

---

## Pruebas

La capa funcional cuenta con pruebas unitarias que validan el cálculo de montos, la inmutabilidad de las tarifas y las operaciones de flujo. Se ejecutan con Node.js:

```bash
node tests/pruebas.js
```

---

## Ejecución del sistema

El sistema requiere un servidor con soporte PHP y MySQL (por ejemplo, XAMPP):

1. Iniciar los servicios Apache y MySQL.
2. Crear la base de datos `muni_virtual` e importar `sistema-base/database.sql`.
3. Servir el contenido de `sistema-base/` y abrir `calendario.html` (vista ciudadana) o `admin.html` (panel administrativo).

El detalle de cómo la capa funcional y reactiva se conecta con el sistema base se documenta en [`INTEGRACION.md`](INTEGRACION.md).
