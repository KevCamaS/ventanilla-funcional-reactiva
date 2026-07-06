# Sistema de Ventanilla Virtual de Reservas de Locales Municipales

Sistema web para la gestión de reservas de locales municipales de la Municipalidad Provincial de Cañete. Permite a la ciudadanía consultar la disponibilidad de espacios públicos y registrar solicitudes de reserva, y al personal administrativo gestionar dichas solicitudes (aprobación, rechazo y registro de pagos) desde un panel de control.

El sistema aplica un enfoque de programación funcional y reactiva en su capa de lógica: el cálculo y la transformación de datos se resuelven con funciones puras e inmutabilidad, mientras que la actualización de la interfaz se realiza mediante propagación automática de eventos y flujos de datos asíncronos.

---

## Características

- Consulta de disponibilidad de locales en un calendario interactivo.
- Registro de solicitudes de reserva por parte de la ciudadanía (Alquiler, Concesión, Exoneración).
- Panel administrativo para aprobar, rechazar y dar seguimiento a las solicitudes.
- Cálculo automático del monto según el tipo de reserva y las horas solicitadas.
- Actualización automática del calendario, las notificaciones y el registro de actividad ante cualquier cambio de estado, sin recargar la página.
- Gestión de usuarios (personal de caja) e historial de reservas con exportación.

---

## Tecnologías

- **Frontend:** HTML, CSS y JavaScript. FullCalendar para el calendario y RxJS para el manejo de flujos de datos.
- **Backend:** PHP.
- **Base de datos:** MySQL / MariaDB.
- **Servidor local:** Apache (XAMPP).

---

## Estructura del proyecto

```
.
├── sistema-base/                     Aplicación web (frontend + backend)
│   ├── calendario.html               Vista ciudadana de reservas
│   ├── admin.html                    Panel administrativo
│   ├── reservas-funcional.js         Cálculo y transformación de datos (funciones puras)
│   ├── gestor-estado-reactivo.js     Propagación de cambios de estado (patrón Observer)
│   ├── flujos-rxjs.js                Flujos de datos asíncronos con RxJS
│   ├── funciones-calendario.js       Lógica de la vista ciudadana
│   ├── funciones-admin.js            Lógica del panel administrativo
│   ├── *.php                         Servicios de backend (conexión, reservas, usuarios, etc.)
│   └── *.css                         Estilos
├── src/                              Módulos de la lógica funcional y reactiva (referencia)
│   ├── funcional/reservas-funcional.js
│   └── reactivo/gestor-estado-reactivo.js, flujos-rxjs.js
├── tests/pruebas.js                  Pruebas unitarias de la capa funcional
└── database_muni.sql                 Script de creación de la base de datos
```

---

## Arquitectura de la lógica

La lógica del sistema se organiza en tres capas:

**Capa de cálculo (funcional).** Concentra el cálculo del monto de una reserva en funciones puras, apoyadas en una tabla de tarifas inmutable y en estrategias por tipo de reserva. No depende del estado global ni de la interfaz, por lo que es predecible y comprobable.

**Capa de eventos (Observer).** Un gestor de estado observable publica los cambios de estado de una reserva y notifica automáticamente a los componentes suscritos (calendario, notificaciones y registro de actividad), manteniendo el bajo acoplamiento entre ellos.

**Capa de flujos (reactiva).** La actualización periódica de la interfaz se realiza mediante flujos de datos asíncronos construidos con RxJS, con operadores de reintento y manejo de errores que mantienen el sistema operativo ante fallos temporales de comunicación.

---

## Instalación y ejecución

Requiere un servidor con soporte para PHP y MySQL/MariaDB (por ejemplo, XAMPP).

1. Iniciar los servicios **Apache** y **MySQL**.
2. Copiar el contenido de `sistema-base/` al directorio del servidor web (por ejemplo, `htdocs/ventanilla`).
3. En phpMyAdmin, importar el archivo `database_muni.sql`. Este crea la base de datos `muni_virtual` con sus tablas y datos de ejemplo.
4. Acceder a las vistas del sistema:
   - Vista ciudadana: `http://localhost/ventanilla/calendario.html`
   - Panel administrativo: `http://localhost/ventanilla/admin.html`

### Credenciales de ejemplo

- Administrador: `admin` / `admin123`

---

## Pruebas

La capa de cálculo cuenta con pruebas unitarias que validan el cálculo de montos, la inmutabilidad de las tarifas y las operaciones sobre listas de reservas. Se ejecutan con Node.js:

```bash
node tests/pruebas.js
```

---

## Base de datos

El sistema utiliza la base de datos `muni_virtual`, compuesta por las tablas `reservas`, `usuarios`, `pagos` y `config_ventanilla`. El script `database_muni.sql` contiene la estructura completa y un conjunto de datos de ejemplo para poner en marcha el sistema de inmediato.
