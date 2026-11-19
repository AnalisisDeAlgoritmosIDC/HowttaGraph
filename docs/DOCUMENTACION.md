# Documentación técnica · HowttaGraph

Equipo LEARN&TUDY · Universidad de Guadalajara, CUCEI

## 1. Objetivo

HowttaGraph es una herramienta educativa que muestra cómo funcionan los algoritmos de búsqueda en grafos más usados por las aplicaciones de rutas. El objetivo es que un estudiante pueda relacionar tres cosas al mismo tiempo: el código, el estado de las estructuras de datos y lo que pasa en el grafo.

## 2. Arquitectura

La aplicación es estática: HTML, CSS y JavaScript sin frameworks ni proceso de compilación. Tiene dos páginas.

| Página | Archivos que usa | Función |
|---|---|---|
| `index.html` | `css/base.css`, `css/portada.css`, `js/portada.js` | Portada de presentación del proyecto y del equipo |
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

## 4. Estilos

- `base.css` define todos los colores como variables CSS (`--paper`, `--ink`, `--accent`, `--st-front`, etc.) y los redefine para el tema oscuro con `prefers-color-scheme`.
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
- Sin desplazamiento horizontal de la página en ninguno de los dos anchos.
- Tema claro y oscuro.
- En el mapa inicial (origen A, destino O), Dijkstra y A\* encuentran el mismo costo mínimo (24), y A\* explora menos nodos (10 contra 15).

## 7. Limitaciones y mejoras futuras

- El grafo tiene un tamaño fijo de 15 nodos.
- No se pueden dibujar nodos ni aristas a mano.
- Posibles mejoras: editor de grafos, pesos negativos con Bellman-Ford, modo cuadrícula tipo laberinto y versión del código en C++.
