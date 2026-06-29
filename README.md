# Sistema de Ventanilla Virtual de Reservas — Programación Funcional y Reactiva

Proyecto del curso **Programación Funcional y Reactiva** — Universidad Nacional de Cañete (2026).

Este repositorio toma el sistema base de la **Ventanilla Virtual de Reservas de Locales Municipales** (desarrollado previamente, con autorización de sus autores) e integra patrones y técnicas de **Programación Funcional y Reactiva** vistos en el curso.

**Integrantes:** Yaya Carbonero Andy Alexis · Yaranga Huamanchaqui Oscar Andrés · Cama Sánchez Kevin
**Docente:** Mag. Wilson Wilmar Candia Quispe

---

## ¿Qué se integró y dónde está cada tema del curso?

| Tema del curso | Archivo que lo demuestra |
|---|---|
| Semana 1 — Inmutabilidad, funciones puras, código declarativo | `src/funcional/reservas-funcional.js` |
| Semana 2 — Interfaces funcionales (predicados, transformadores) | `src/funcional/reservas-funcional.js` |
| Funciones de Orden Superior | `src/funcional/reservas-funcional.js` |
| Semana 4 — Operaciones de flujo (map / filter / reduce) | `src/funcional/reservas-funcional.js` |
| Semana 5 — Fundamentos reactivos y Manifiesto Reactivo | `src/reactivo/gestor-estado-reactivo.js` |
| Semana 6 — Patrón Observer | `src/reactivo/gestor-estado-reactivo.js` |
| Semana 7 — Operadores reactivos (debounceTime, switchMap, map…) | `src/reactivo/flujos-rxjs.js` |
| Semana 9 — Gestión de errores en flujos (catchError, retry) | `src/reactivo/flujos-rxjs.js` |
| Semana 10 — Modelos no bloqueantes (asíncronos) | `src/reactivo/flujos-rxjs.js` |

---

## Estructura del repositorio

```
.
├── README.md                         ← este archivo
├── INTEGRACION.md                    ← guía exacta de qué cambiar en el sistema base
├── src/
│   ├── funcional/
│   │   └── reservas-funcional.js     ← Módulo A: funciones puras, inmutabilidad, map/filter/reduce
│   └── reactivo/
│       ├── gestor-estado-reactivo.js ← Módulo B: patrón Observer
│       └── flujos-rxjs.js            ← Módulo B: flujos reactivos con RxJS
├── tests/
│   └── pruebas.js                    ← casos de prueba CP-01…CP-05 (Node.js)
└── sistema-base/                     ← AQUÍ COLOCAS TODO EL SISTEMA ORIGINAL (ver paso 2)
    ├── calendario.html
    ├── admin.html
    ├── funciones-calendario.js
    ├── funciones-admin.js
    ├── *.php
    └── *.css
```

---

## PASO A PASO para crear el repositorio

### Paso 1 — Crear el repositorio en GitHub

1. Entra a GitHub y crea un repositorio nuevo, por ejemplo `ventanilla-funcional-reactiva`.
2. Márcalo como **público** (o privado, según pida tu docente) y créalo **sin** README (lo subes tú).
3. En tu PC, abre una terminal en una carpeta vacía y clónalo:
   ```bash
   git clone https://github.com/TU_USUARIO/ventanilla-funcional-reactiva.git
   cd ventanilla-funcional-reactiva
   ```

### Paso 2 — Colocar el sistema base

1. Crea la carpeta `sistema-base/`.
2. Copia **todo** el sistema original tal cual (los `.html`, `.js`, `.php`, `.css`, imágenes y los `.sql`) dentro de `sistema-base/`.
3. Este es el punto de partida sin tocar. Haz un primer commit para dejar registrado el estado original:
   ```bash
   git add sistema-base/
   git commit -m "Sistema base original (sin cambios)"
   ```

> Hacer este commit primero es importante: deja evidencia del "antes", para que se note claramente el "después" con la integración funcional y reactiva.

### Paso 3 — Agregar los archivos de este paquete

1. Copia las carpetas `src/`, `tests/` y los archivos `README.md` e `INTEGRACION.md` (los que te entrego) a la raíz del repositorio.
2. Commit:
   ```bash
   git add src/ tests/ README.md INTEGRACION.md
   git commit -m "Modulos funcional y reactivo + pruebas"
   ```

### Paso 4 — Integrar los módulos al sistema base

Sigue la guía detallada en **`INTEGRACION.md`**. Resumen de los cambios:

1. **`sistema-base/calendario.html`** y **`sistema-base/admin.html`**: añadir los `<script>` de RxJS (CDN) y de los nuevos módulos `src/...`.
2. **`sistema-base/funciones-calendario.js`**: usar `ReservasFuncional.calcularMonto(...)` en lugar del cálculo manual de monto.
3. **`sistema-base/funciones-admin.js`**: usar `gestorReservas.publicarCambio(...)` al cambiar estado, y reemplazar el `setInterval` de polling por `FlujosRxJS.crearFlujoDeRefresco(...)`.

Tras integrar:
```bash
git add sistema-base/
git commit -m "Integracion funcional y reactiva en el sistema base"
```

### Paso 5 — Ejecutar las pruebas

Requiere Node.js instalado.
```bash
node tests/pruebas.js
```
Debe mostrar `11 pasadas, 0 fallidas`. Toma una captura para el Anexo D del informe.

### Paso 6 — Subir todo a GitHub

```bash
git push origin main
```

---

## Cómo ejecutar el sistema completo

El sistema usa PHP + MySQL, así que necesitas un servidor local (XAMPP recomendado):

1. Instala **XAMPP** y enciende **Apache** y **MySQL**.
2. Copia el contenido de `sistema-base/` a `C:/xampp/htdocs/ventanilla/`.
3. Abre `http://localhost/phpmyadmin`, crea la base de datos `muni_virtual` e importa el archivo `database.sql` (o `code.sql`).
4. Abre `http://localhost/ventanilla/calendario.html` en el navegador.
5. Abre la consola del navegador (F12) para ver los mensajes `[OBSERVER]`, `[RxJS]`, `[CALENDARIO]`, etc., que evidencian el funcionamiento reactivo.

---

## Notas

- Los módulos nuevos están desacoplados: si un `<script>` no carga, el sistema base sigue funcionando (degradación elegante).
- Los archivos exponen su API tanto en `window` (para el navegador) como con `module.exports` (para las pruebas con Node), por eso se pueden probar sin abrir el navegador.
