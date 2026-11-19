# HowttaGraph

> Aprende cómo piensan los algoritmos que encuentran rutas, viéndolos trabajar paso a paso.

**HowttaGraph** es una página web educativa del equipo **LEARN&TUDY** para estudiar algoritmos de búsqueda en grafos. Muestra cómo funcionan **BFS, DFS, Dijkstra y A\*** sobre un mapa de 15 cruces y, en cada paso, resalta la línea de código en Python que se está ejecutando y explica qué hace.

Está pensada para estudiantes que quieren ir más allá del pseudocódigo del pizarrón y ver qué pasa dentro de la cola, la pila o la cola de prioridad en cada momento.

---

## Funcionalidades

- **Visualización paso a paso** de BFS, DFS, Dijkstra y A\*, con reproducción automática, avance y retroceso, velocidad ajustable y línea de tiempo.
- **Código en Python en vivo**: la línea que se ejecuta se resalta y debajo aparece su explicación. Al dar clic en cualquier línea se lee su explicación.
- **Estructuras de datos visibles**: cola (FIFO), pila (LIFO) o cola de prioridad, con las entradas viejas tachadas.
- **Tabla de nodos** con distancia o nivel, padre y estado de cada nodo. En A\* muestra `g`, `h` y `f`.
- **Heurística dibujada**: en A\* se traza la línea recta del nodo actual a la meta.
- **Mapas configurables**: origen y destino con un clic, y botón para generar un grafo nuevo.
- **Comparativa** de los cuatro algoritmos sobre el mismo mapa: nodos explorados, costo, número de aristas y si el camino es óptimo.
- **Teoría y glosario** integrados para repasar.
- Tema claro y oscuro automático y diseño adaptable a celular.

## Cómo usarlo

No necesita instalación ni dependencias.

**Opción 1.** Descarga el proyecto y abre `index.html` con doble clic.

**Opción 2.** Con un servidor local:

```bash
python -m http.server 8000
# abre http://localhost:8000
```

Atajos del visualizador: `←` `→` paso a paso, `espacio` reproducir o pausar, `Inicio` y `Fin`.

Enlaces directos a cada algoritmo: `grafos.html#bfs`, `grafos.html#dfs`, `grafos.html#dijkstra`, `grafos.html#astar`.

## Estructura del proyecto

```
howttagraph/
├── index.html            Portada de presentación
├── grafos.html           Visualizador de algoritmos
├── css/
│   ├── base.css          Colores (claro/oscuro), tipografías, barra superior
│   ├── portada.css       Estilos de la portada
│   └── grafos.css        Estilos del visualizador
├── js/
│   ├── portada.js        Integrantes y animación de la portada
│   ├── grafo.js          Generación del grafo y utilidades
│   ├── algoritmos.js     Código Python explicado y pasos de cada algoritmo
│   └── visualizador.js   Dibujo, controles, tabla, comparativa y teoría
└── docs/
    ├── DOCUMENTACION.md  Documentación técnica
    ├── ALGORITMOS.md     Teoría de los algoritmos
    ├── MANUAL.md         Manual de usuario
    └── PLAN_DE_COMMITS.md  Reparto del trabajo en git
```

## Tecnologías

- HTML5, CSS3 y JavaScript sin frameworks.
- SVG para dibujar el grafo del visualizador y Canvas para la animación de la portada.
- Google Fonts: Bricolage Grotesque, Atkinson Hyperlegible y JetBrains Mono.

Los scripts no usan módulos (`import`/`export`), por eso la página abre directamente desde el archivo sin servidor.

## Documentación

- [Documentación técnica](docs/DOCUMENTACION.md): arquitectura, flujo de datos y cómo agregar un algoritmo.
- [Algoritmos](docs/ALGORITMOS.md): teoría, complejidad y comparación.
- [Manual de usuario](docs/MANUAL.md): cómo usar la página.

## Deploy

**Cloudflare Pages:** conecta este repositorio, framework preset *None*, build command vacío y output directory `/`.

**GitHub Pages:** *Settings → Pages → Deploy from a branch → main / (root)*.

## Equipo LEARN&TUDY

| Integrante | Responsabilidad |
|---|---|
| Carlos Adrian Ramirez Gutiérrez | Estructura del proyecto, generación del grafo y visualizador |
| Isaac Saldivar Zaldivar | Algoritmos, código explicado, estilos del visualizador y teoría |
| Daniel Padilla Echeverria | Portada, manual de usuario y documentación técnica |

Universidad de Guadalajara · CUCEI · 2026
