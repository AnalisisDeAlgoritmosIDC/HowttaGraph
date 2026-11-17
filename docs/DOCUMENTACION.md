# Documentación técnica · HowttaGraph

Equipo LEARN&TUDY · Universidad de Guadalajara, CUCEI

## 1. Objetivo

HowttaGraph es una herramienta educativa que muestra cómo funcionan los algoritmos de búsqueda en grafos más usados por las aplicaciones de rutas. El objetivo es que un estudiante pueda relacionar tres cosas al mismo tiempo: el código, el estado de las estructuras de datos y lo que pasa en el grafo.

## 2. Arquitectura

La aplicación es estática: HTML, CSS y JavaScript sin frameworks ni proceso de compilación. Tiene tres páginas.

| Página | Archivos que usa | Función |
|---|---|---|
| `index.html` | `css/base.css`, `css/portada.css`, `js/portada.js` | Portada de presentación del proyecto y del equipo |
| `aprender.html` | `css/base.css`, `css/aprender.css`, `js/curso.js`, `js/aprender.js` | Ruta de aprendizaje: clases, preguntas y progreso |
| `grafos.html` | `css/base.css`, `css/grafos.css`, `js/grafo.js`, `js/algoritmos.js`, `js/visualizador.js` | Visualizador interactivo |

### Orden de carga de los scripts

```html
<script src="js/grafo.js"></script>        <!-- 1. define G, genGraph, utilidades -->
<script src="js/algoritmos.js"></script>   <!-- 2. define CODE, ALGOS y run() -->
<script src="js/visualizador.js"></script> <!-- 3. usa todo lo anterior y arranca -->
```

Los tres archivos comparten variables globales. No se usan módulos ES (`import`/`export`) porque el navegador los bloquea al abrir el archivo directamente (`file://`). Así la página funciona con doble clic.

## 3. Módulos

### 3.1 `js/grafo.js`: el mapa

Genera un grafo no dirigido y ponderado de 15 nodos (A a O).

- **Nodos.** Se colocan en una cuadrícula de 5 columnas por 3 filas con un desplazamiento aleatorio, para que parezca un mapa de cruces.
- **Aristas.**
  - Siempre se conecta cada nodo con su vecino de la derecha.
  - La columna izquierda siempre se conecta hacia abajo. Esto garantiza que el grafo sea **conexo**.
  - Las demás conexiones hacia abajo aparecen con 70 % de probabilidad.
  - Cada celda puede tener una diagonal con 45 % de probabilidad.
- **Pesos.** `peso = ⌈distancia / 40⌉ + extra`. El extra vale de 1 a 3 en el 35 % de las calles y simula tráfico.
- **Aleatoriedad reproducible.** Se usa el generador `mulberry32(semilla)`: la misma semilla produce siempre el mismo mapa. El mapa inicial usa la semilla `7`.

Estructura resultante:

```js
G = {
  nodes: [{ x, y }, ...],                 // posición en el dibujo
  edges: [{ a, b, w }, ...],              // nodos que une y su peso
  adj:   [[{ to, w, e }, ...], ...]       // lista de adyacencia, ordenada por vecino
}
```

Funciones de apoyo: `edgeIndex(a, b)` devuelve el índice de la arista que une dos nodos, `hOf(n, meta)` calcula la heurística de A\* y `fmt(v)` da formato a los números (∞ y un decimal).

#### Heurística de A\*

```
h(n) = ⌊ distancia_euclidiana(n, meta) / 40 × 10 ⌋ / 10
```

Es **admisible**: como cada peso es al menos `distancia / 40`, y la línea recta es lo más corto posible, `h` nunca sobreestima el costo real que falta. Por eso A\* encuentra el camino óptimo.

### 3.2 `js/algoritmos.js`: el cerebro

Contiene dos partes.

**a) `CODE`.** Para cada algoritmo guarda el código en Python que se muestra en pantalla. Cada línea es un arreglo de tres elementos:

```js
["clave", "texto de la línea en Python", "explicación en HTML"]
```

La **clave** une la línea con los pasos de la ejecución. Por ejemplo, todos los pasos con clave `"pop"` resaltan la línea donde se saca un elemento de la cola.

**b) `run(algo, origen, meta)`.** Ejecuta el algoritmo de verdad en JavaScript y, en cada momento importante, guarda una **fotografía** del estado con la función interna `snap()`:

```js
{
  key,       // clave de la línea de código que se resalta
  msg,       // texto que explica el paso
  cur,       // nodo actual
  edge,      // arista que se está revisando
  changed,   // nodo cuya fila cambió en la tabla
  frontier,  // contenido de la cola / pila / cola de prioridad
  closed,    // nodos explorados
  seen,      // nodos descubiertos
  val,       // distancia, nivel, orden o g según el algoritmo
  padre,     // padre de cada nodo
  path       // camino final (solo en el último paso)
}
```

Devuelve `{ steps, path, cost, explored }`. Como todos los pasos se calculan de antemano, el usuario puede avanzar y **retroceder** sin volver a ejecutar nada.

### 3.3 `js/visualizador.js`: la interfaz

| Función | Qué hace |
|---|---|
| `buildSVG()` | Dibuja aristas, etiquetas de peso y nodos una sola vez por grafo |
| `renderCode()` | Pinta el código del algoritmo activo con colores de sintaxis |
| `renderStep()` | Toma la fotografía `R.steps[idx]` y actualiza grafo, código, explicación, estructura de datos, tabla y bitácora |
| `renderCompare()` | Ejecuta los cuatro algoritmos y llena la tabla comparativa |
| `recompute()` | Se llama al cambiar algoritmo, origen, destino o grafo; recalcula los pasos |
| `play()`, `go(i)`, `detener()` | Control de la reproducción |

El estado de un nodo en pantalla se decide en este orden de prioridad: **camino → actual → explorado → frontera → descubierto → sin descubrir**.

El hash de la URL (`#bfs`, `#dfs`, `#dijkstra`, `#astar`) selecciona el algoritmo al abrir la página; así funcionan los enlaces de la portada.

### 3.4 `js/portada.js`

Llena la sección de equipo a partir del arreglo `INTEGRANTES` y dibuja en un `<canvas>` una animación de BFS real sobre un grafo de 12 nodos. Si el usuario tiene activado *reducir movimiento*, muestra el resultado final sin animar.

### 3.5 `js/curso.js` y `js/aprender.js`: la ruta de aprendizaje

Se separó el **contenido** del **motor**, para que se puedan escribir clases nuevas sin tocar la lógica.

- `curso.js` define la variable global `CURSO` con `niveles` → `clases` → `bloques` y `preguntas`, más la configuración del `reto`. El formato completo está en [CURSO.md](CURSO.md).
- `aprender.js` lee `CURSO` y arma la app.

**Vistas.** Se eligen con el hash de la URL y la función `route()`, que se ejecuta al cargar y en cada `hashchange`:

| Hash | Función | Qué muestra |
|---|---|---|
| `#ruta` (o vacío) | `vistaRuta()` | Panel de avance, siguiente clase, niveles, reto final y opciones |
| `#clase-N` | `vistaClase(i)` | Índice del curso, objetivos, secciones, repaso, evaluación y navegación entre clases |
| `#reto` | `vistaReto()` | Reto final |
| `#perfil` | `vistaPerfil(false)` | Nombre y escuela del estudiante; con `vistaPerfil(true)` es la bienvenida que se muestra si aún no hay nombre |
| `#reconocimiento` | `vistaReconocimiento()` | Reconocimiento con nombre editable y descarga en PNG |

**Dibujos.** `figura(spec)` convierte la descripción de un grafo pequeño en SVG (nodos, aristas, pesos, flechas y etiquetas) usando las mismas variables de color que el visualizador, por lo que funciona en tema claro y oscuro. `bloque(b)` convierte cada bloque de contenido en HTML.

**Banco de preguntas.** Cada clase tiene de 10 a 12 preguntas. Al iniciar una evaluación se barajan con Fisher-Yates (`barajar()`) y se toman `CURSO.porIntento` (5). El reto toma 15 de las 128.

**Cuestionario.** `cuestionario(contenedor, preguntas, alTerminar)` es un componente reutilizable que usan las clases y el reto: muestra una pregunta a la vez, revuelve las opciones, marca la correcta, enseña la explicación y al final llama a `alTerminar({ aciertos, total, fallos })`. Acepta respuestas con las teclas 1 a 4 y Enter.

**Progreso.** El objeto `P` se guarda en `localStorage` (clave `howttagraph-progreso-v1`):

```js
P = {
  done:  { "bfs": { stars: 3, score: 4, total: 4 }, ... },  // clases aprobadas
  xp:    120,
  libre: false,          // modo libre
  reto:  { best: 14, aprobado: true, aciertos: 14, fecha: "2026-11-14T…", folio: "HG-2026-K3F9Q" },
  nombre: "Nombre del estudiante",  // obligatorio: se pide al entrar por primera vez
  escuela: "Escuela (opcional)",    // aparece debajo del nombre en el reconocimiento
  registro: "2026-11-14T…"         // fecha en que se registró
}
```

**Reconocimiento.** Se muestra como HTML (con unidades `cqw` para que escale con su contenedor) y `descargarReconocimiento()` lo vuelve a dibujar en un `<canvas>` de 2000 × 1414 px, lo convierte en PNG con `toBlob()` y lo descarga.

Todas las lecturas y escrituras van dentro de `try/catch`: si el navegador bloquea el almacenamiento (modo incógnito estricto), la app funciona igual, solo que no recuerda el avance.

## 4. Estilos

- Estilo clásico y minimalista, **siempre en tema claro** (decisión de diseño: no cambia con el modo oscuro del sistema): fondo casi blanco, paneles con borde fino y sin sombras, títulos en **Lora** (serif), texto en **Source Sans 3** y JetBrains Mono para el código.
- La estructura compartida (`.app`, `.appbar`, `.sidebar`, `.workspace`) vive en `base.css`; `js/shell.js` abre el menú en celular, marca la sección activa y muestra nombre, XP, estrellas y avance en `aprender.html` y `grafos.html`.
- Cada nivel tiene un color suave (`--lv1` verde salvia, `--lv2` ámbar, `--lv3` azul, `--lv4` lavanda) que se usa en su insignia, chips, barras de progreso y títulos de sección.
- `base.css` define todos los colores como variables CSS en un solo bloque `:root` (tema claro).
- Los colores de estado son los mismos en toda la aplicación:

| Estado | Variable | Significado |
|---|---|---|
| Frontera | `--st-front` (ámbar) | Descubierto, esperando a ser explorado |
| Actual | `--st-cur` (rojo) | Nodo que se está procesando |
| Explorado | `--st-closed` (verde azulado) | Ya se procesó |
| Camino | `--st-path` (magenta) | Ruta final encontrada |

- El diseño es adaptable: en pantallas angostas el código pasa debajo del grafo y las tablas se desplazan horizontalmente dentro de su contenedor.

## 5. Cómo agregar un algoritmo nuevo

Ejemplo: búsqueda voraz (*Greedy Best-First*).

1. En `algoritmos.js`, agrega su entrada en `CODE` con `fn`, `title`, `ds`, `col` y sus `lines` con claves.
2. Agrégalo a `ALGOS`: `{ id: "greedy", name: "Greedy", sub: "voraz" }`.
3. En `run()`, agrega un bloque `if (algo === "greedy") { ... }` que llame a `snap(clave, mensaje, arista)` en cada paso y termine con `return finish();`.
4. Si muestra valores propios en los nodos, ajusta la etiqueta en `renderStep()`.

La comparativa y las pestañas se actualizan solas porque recorren `ALGOS`.

## 6. Pruebas realizadas

- Carga sin errores en consola en Chromium, en escritorio (1300 px) y celular (400 px).
- Ruta de aprendizaje: se aprobaron las clases 1 a 3 (una con un error, 2 estrellas), la clase 5 aparece bloqueada, las 12 clases cargan, el reto de 15 preguntas se aprobó y el reconocimiento se descargó como PNG de 2000 × 1414.
- Las 128 preguntas tienen su respuesta dentro del rango de opciones.
- Sin desplazamiento horizontal de la página en ninguno de los dos anchos.
- Tema claro y oscuro.
- En el mapa inicial (origen A, destino O), Dijkstra y A\* encuentran el mismo costo mínimo (24), y A\* explora menos nodos (10 contra 15).

## 7. Limitaciones y mejoras futuras

- El grafo tiene un tamaño fijo de 15 nodos.
- No se pueden dibujar nodos ni aristas a mano.
- El progreso de la ruta vive en un solo navegador; no hay cuentas de usuario.
- Posibles mejoras: cuentas para guardar el progreso en la nube, editor de grafos, pesos negativos con Bellman-Ford, modo cuadrícula tipo laberinto y versión del código en C++.

## 8. Actividades prácticas (`js/actividades.js`)

Se desbloquean al obtener el reconocimiento (o en modo libre). Cada una genera un **grafo aleatorio** de 7 nodos:

1. Se colocan 7 posiciones fijas y una lista de 12 aristas candidatas que no se cruzan.
2. Con las candidatas en orden aleatorio se arma primero un **árbol** (unión-búsqueda), lo que garantiza que el grafo sea conexo.
3. Cada arista sobrante entra con 45 % de probabilidad para formar ciclos; los pesos van de 1 a 9 y las letras se reparten al azar.

La respuesta correcta la calculan versiones de referencia de los algoritmos (`ordenBFS`, `ordenDFS`, `dijkstra`), probadas contra Floyd-Warshall en 300 grafos aleatorios.

| Actividad | Qué hace el estudiante | Puntaje |
|---|---|---|
| Ordena el recorrido BFS / DFS | Clic en los nodos en orden de visita; ayuda opcional que muestra la cola o la pila | 100 − 15 por error |
| Calcula las distancias | Llena la tabla de distancias mínimas desde el origen | % de distancias correctas en el primer intento |
| Encuentra el camino más barato | Traza con clics la ruta entre origen y destino | costo óptimo ÷ costo del estudiante × 100 |
| ¿Quién sale de la lista abierta? | 5 rondas eligiendo el nodo con menor f = g + h | 20 por acierto |
| Ronda relámpago | Preguntas del banco durante 60 segundos | número de correctas |

El resultado se guarda en `P.act[id] = { best, veces }` y la primera vez que se completa cada actividad da 30 XP.
