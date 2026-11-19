# HowttaGraph

> Aprende cómo piensan los algoritmos que encuentran rutas, viéndolos trabajar paso a paso.

**HowttaGraph** es una app web de estudio del equipo **LEARN&TUDY** para aprender algoritmos de búsqueda en grafos. Tiene dos partes:

- **Aprender:** una ruta de 12 clases por niveles, de lo más fácil a lo más difícil, con evaluaciones que desbloquean la siguiente clase y un reconocimiento al terminar.
- **Visualizador:** muestra **BFS, DFS, Dijkstra y A\*** trabajando sobre un mapa de 15 cruces y, en cada paso, resalta la línea de código en Python que se ejecuta y explica qué hace.

Está pensada para estudiantes que quieren ir más allá del pseudocódigo del pizarrón y ver qué pasa dentro de la cola, la pila o la cola de prioridad en cada momento.

---

## Funcionalidades

### Ruta de aprendizaje (`aprender.html`)

- **4 niveles y 12 clases**, de qué es un grafo hasta A\*, ordenadas de lo más fácil a lo más difícil.
- Cada clase tiene objetivos, explicación por secciones, dibujos de grafos, tablas, código en Python, idea clave, práctica guiada y repaso rápido, con un índice del curso siempre a la mano.
- **Banco de 128 preguntas** (10 a 12 por clase). Cada evaluación saca 5 al azar, así que no se aprueba memorizando.
- Retroalimentación inmediata y revisión de las preguntas falladas con su explicación.
- **Desbloqueo progresivo:** aprobar una clase abre la siguiente.
- **XP, estrellas y barra de progreso**, guardados en el navegador.
- **Reto final** de 15 preguntas al azar de todo el curso (12 para aprobar), que al fallar indica qué clases repasar.
- **Reconocimiento de Aprendizaje básico de grafos** con nombre, fecha, calificación y folio, descargable como imagen.
- Modo libre para desbloquear todo durante una presentación.

### Visualizador (`grafos.html`)

- **Visualización paso a paso** de BFS, DFS, Dijkstra y A\*, con reproducción automática, avance y retroceso, velocidad ajustable y línea de tiempo.
- **Código en Python en vivo**: la línea que se ejecuta se resalta y debajo aparece su explicación. Al dar clic en cualquier línea se lee su explicación.
- **Estructuras de datos visibles**: cola (FIFO), pila (LIFO) o cola de prioridad, con las entradas viejas tachadas.
- **Tabla de nodos** con distancia o nivel, padre y estado de cada nodo. En A\* muestra `g`, `h` y `f`.
- **Heurística dibujada**: en A\* se traza la línea recta del nodo actual a la meta.
- **Mapas configurables**: origen y destino con un clic, y botón para generar un grafo nuevo.
- **Comparativa** de los cuatro algoritmos sobre el mismo mapa: nodos explorados, costo, número de aristas y si el camino es óptimo.
- **Teoría y glosario** integrados para repasar.
- **6 actividades prácticas** que se desbloquean con el reconocimiento: ordenar recorridos BFS y DFS, calcular distancias de Dijkstra, trazar el camino más barato, elegir qué nodo expande A* y una ronda relámpago de 60 segundos. Los grafos se generan al azar en cada intento.
- Interfaz tipo aplicación: barra superior con XP y estrellas, menú lateral, buscador de clases y escritorio con tablero por niveles (estilo kanban) o vista de lista. Estilo clásico y minimalista en tema claro, adaptable a celular.

## Cómo usarlo

No necesita instalación ni dependencias.

**Opción 1.** Descarga el proyecto y abre `index.html` con doble clic.

**Opción 2.** Con un servidor local:

```bash
python -m http.server 8000
# abre http://localhost:8000
```

Atajos del visualizador: `←` `→` paso a paso, `espacio` reproducir o pausar, `Inicio` y `Fin`.

Enlaces directos: `aprender.html#clase-5` abre la clase 5, `aprender.html#reto` el reto final y `aprender.html#reconocimiento` el reconocimiento. Para el visualizador: `grafos.html#bfs`, `grafos.html#dfs`, `grafos.html#dijkstra`, `grafos.html#astar`.

## Estructura del proyecto

```
howttagraph/
├── index.html            Portada de presentación
├── aprender.html         Ruta de aprendizaje (clases y preguntas)
├── grafos.html           Visualizador de algoritmos
├── css/
│   ├── base.css          Colores (claro/oscuro), tipografías, barra superior
│   ├── portada.css       Estilos de la portada
│   ├── aprender.css      Estilos de la ruta, clases y preguntas
│   └── grafos.css        Estilos del visualizador
├── js/
│   ├── portada.js        Integrantes y animación de la portada
│   ├── shell.js          Barra superior y menú lateral compartidos
│   ├── curso.js          Contenido del curso: niveles, clases y preguntas
│   ├── actividades.js    Actividades prácticas con grafos aleatorios
│   ├── aprender.js       Motor de la app de estudio: ruta, cuestionarios y progreso
│   ├── grafo.js          Generación del grafo y utilidades
│   ├── algoritmos.js     Código Python explicado y pasos de cada algoritmo
│   └── visualizador.js   Dibujo, controles, tabla, comparativa y teoría
└── docs/
    ├── DOCUMENTACION.md  Documentación técnica
    ├── ALGORITMOS.md     Teoría de los algoritmos
    ├── CURSO.md          Temario y reglas de la ruta de aprendizaje
    ├── MANUAL.md         Manual de usuario
    └── PLAN_DE_COMMITS.md  Reparto del trabajo en git
```

## Tecnologías

- HTML5, CSS3 y JavaScript sin frameworks.
- SVG para dibujar los grafos del visualizador y de las clases; Canvas para la animación de la portada y para generar la imagen del reconocimiento.
- Google Fonts: Lora (títulos), Source Sans 3 (texto) y JetBrains Mono (código).

Los scripts no usan módulos (`import`/`export`), por eso la página abre directamente desde el archivo sin servidor.

## Documentación

- [Documentación técnica](docs/DOCUMENTACION.md): arquitectura, flujo de datos y cómo agregar un algoritmo.
- [Algoritmos](docs/ALGORITMOS.md): teoría, complejidad y comparación.
- [Ruta de aprendizaje](docs/CURSO.md): temario, reglas de avance y cómo agregar clases.
- [Manual de usuario](docs/MANUAL.md): cómo usar la página.

## Deploy

**Cloudflare Pages:** conecta este repositorio, framework preset *None*, build command vacío y output directory `/`.

**GitHub Pages:** *Settings → Pages → Deploy from a branch → main / (root)*.

## Equipo LEARN&TUDY

| Integrante | Responsabilidad |
|---|---|
| Carlos Adrian Ramirez Gutiérrez | Estructura del proyecto, generación del grafo, visualizador y motor de la ruta de aprendizaje |
| Isaac Saldivar Zaldivar | Algoritmos, código explicado, contenido de las clases y preguntas, teoría |
| Daniel Padilla Echeverria | Portada, estilos de la ruta de aprendizaje, manual de usuario y documentación técnica |

Universidad de Guadalajara · CUCEI · 2026
