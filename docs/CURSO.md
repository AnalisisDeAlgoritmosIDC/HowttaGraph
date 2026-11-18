# Ruta de aprendizaje · HowttaGraph

Equipo LEARN&TUDY

La sección **Aprender** (`aprender.html`) convierte HowttaGraph en una app de estudio: el estudiante avanza por **4 niveles y 12 clases**, de lo más sencillo a lo más difícil, y en cada clase presenta una evaluación para desbloquear la siguiente. El banco tiene **128 preguntas** (de 10 a 12 por clase) y en cada intento se eligen 5 al azar, así que repetir no basta para aprobar: hay que entender.

## Temario

### Nivel 1 · Fundamentos (Básico)

Qué es un grafo, qué tipos existen y cómo se guarda en la memoria de una computadora.

| # | Clase | Al terminar podrás | Banco de preguntas |
|---|---|---|---|
| 1 | ¿Qué es un grafo? | Identificar nodos y aristas en un problema real; Calcular el grado de un nodo; Reconocer un camino válido | 11 |
| 2 | Tipos de grafos | Distinguir grafos dirigidos y no dirigidos; Entender qué es un peso; Reconocer ciclos y árboles | 11 |
| 3 | Cómo se guarda un grafo | Construir una matriz de adyacencia; Construir una lista de adyacencia; Elegir la representación adecuada | 11 |

### Nivel 2 · Recorridos (Intermedio)

Las dos formas básicas de explorar un grafo: por capas (BFS) y en profundidad (DFS).

| # | Clase | Al terminar podrás | Banco de preguntas |
|---|---|---|---|
| 4 | Cola y pila | Simular una cola FIFO; Simular una pila LIFO; Saber por qué usar deque en Python | 10 |
| 5 | BFS · búsqueda en anchura | Ejecutar BFS a mano; Calcular niveles; Saber qué camino garantiza BFS | 11 |
| 6 | DFS · búsqueda en profundidad | Ejecutar DFS a mano; Comparar el camino de DFS con el de BFS; Conocer los usos de DFS | 10 |

### Nivel 3 · Caminos con peso (Avanzado)

Cuando las calles cuestan distinto: colas de prioridad y el algoritmo de Dijkstra.

| # | Clase | Al terminar podrás | Banco de preguntas |
|---|---|---|---|
| 7 | Cola de prioridad y heap | Entender qué es una cola de prioridad; Usar heapq en Python; Conocer el costo de sus operaciones | 10 |
| 8 | Dijkstra · el camino más barato | Entender la relajación; Ejecutar Dijkstra a mano; Saber cuándo falla | 12 |
| 9 | Padres y entradas viejas | Reconstruir un camino con el diccionario de padres; Entender por qué hay entradas repetidas en el heap; Conocer la complejidad de Dijkstra | 11 |

### Nivel 4 · Búsqueda informada (Experto)

Usar información extra sobre la meta para buscar más rápido: heurísticas y A*.

| # | Clase | Al terminar podrás | Banco de preguntas |
|---|---|---|---|
| 10 | Heurísticas | Calcular distancia Manhattan y euclidiana; Saber qué es una heurística admisible; Relacionar h = 0 con Dijkstra | 10 |
| 11 | A* · Dijkstra con brújula | Calcular f = g + h; Elegir el siguiente nodo de la lista abierta; Comparar A* con Dijkstra | 10 |
| 12 | ¿Qué algoritmo uso? | Elegir el algoritmo correcto según el problema; Conocer alternativas para casos especiales; Saber qué usan las apps de rutas reales | 11 |

### Reto final

15 preguntas al azar tomadas del banco completo (128). Se aprueba con 12 correctas (80 %). Si el estudiante falla, la página le dice qué clases repasar.

### Reconocimiento de aprendizaje

Al aprobar el reto se desbloquea el **Reconocimiento de Aprendizaje básico de grafos** de HowttaGraph (`aprender.html#reconocimiento`):

- El nombre completo (y la escuela, opcional) se piden al entrar por primera vez y se editan en **Mi perfil** (`aprender.html#perfil`). El reto final confirma a nombre de quién se emitirá.
- Incluye fecha, calificación del reto, folio único (`HG-AAAA-XXXXX`) y la leyenda "Otorgado por Equipo LEARN&TUDY".
- Se descarga como imagen PNG de 2000 × 1414 px (proporción de hoja A4 horizontal), generada en el navegador con `<canvas>`.

## Después del reconocimiento: actividades

Al obtener el reconocimiento se desbloquean 6 actividades prácticas con grafos generados al azar (ver [DOCUMENTACION.md](DOCUMENTACION.md#8-actividades-prácticas-jsactividadesjs)): ordenar recorridos BFS y DFS, calcular distancias de Dijkstra, trazar el camino más barato, elegir el nodo que expande A* y una ronda relámpago de 60 segundos.

## Cómo es cada clase

1. **Índice del curso** (columna izquierda): todas las clases con su estado; en celular se despliega.
2. **Encabezado:** nivel con su color, tiempo de lectura, dificultad y estrellas obtenidas.
3. **Objetivos:** lo que el estudiante podrá hacer al terminar.
4. **En esta clase:** accesos a cada sección.
5. **Explicación por secciones:** párrafos, recuadros de *idea clave*, dibujos de grafos, tablas y código en Python con botón de copiar.
6. **Práctica guiada:** en las clases de algoritmos, un botón abre el visualizador con ese algoritmo.
7. **Repaso rápido** y **evaluación**: 5 preguntas al azar del banco, con retroalimentación inmediata. Al terminar se pueden revisar las preguntas falladas con su explicación.
8. **Anterior / siguiente** para moverse entre clases.

## Reglas de avance

| Regla | Valor |
|---|---|
| Evaluación de una clase | 5 preguntas al azar del banco de la clase |
| Para aprobar una clase | 4 de 5 correctas |
| Desbloqueo | Cada clase se abre al aprobar la anterior |
| XP | 10 por acierto + 20 de bono la primera vez que se aprueba una clase |
| Repetir una clase | Solo suma XP si se mejora el puntaje anterior |
| Estrellas | 3 = 5 de 5 · 2 = 4 de 5 |
| Reto final | Se abre al completar las 12 clases; 15 preguntas, 12 para aprobar; +100 XP la primera vez |
| Reconocimiento | Se obtiene al aprobar el reto final |
| Modo libre | Desbloquea todo (útil para presentar el proyecto o para el profesor) |

El progreso se guarda en el `localStorage` del navegador con la clave `howttagraph-progreso-v1`. No se envía a ningún servidor, así que cada navegador lleva su propio avance.

## Cómo agregar o editar una clase

Todo el contenido vive en `js/curso.js`; no hace falta tocar `aprender.js`.

```js
{ id: "mi-clase", titulo: "Título", min: 6,
  objetivos: ["...", "..."],
  bloques: [
    { h: "Título de sección" },
    { p: "Párrafo con <b>HTML</b>" },
    { key: "Idea clave" },
    { code: "print('hola')" },
    { fig: { w: 300, h: 150, n: [[40,75,"A"],[260,75,"B"]], e: [[0,1,5]] }, cap: "Pie de figura" },
    { try: "dijkstra" }
  ],
  resumen: ["punto 1", "punto 2"],
  preguntas: [
    { q: "¿Pregunta?", o: ["opción A", "opción B", "opción C"], a: 1, why: "Por qué B es correcta" }
  ] }
```

- `a` es la posición de la respuesta correcta empezando en 0.
- Conviene que cada clase tenga al menos 10 preguntas para que los intentos no se repitan. Cuántas salen por intento y cuántas se necesitan para aprobar se configura con `porIntento` y `minimoClase` al final de `curso.js`.
- Las opciones se revuelven solas, excepto en preguntas de verdadero/falso o con opciones como "Cualquiera de las anteriores".
- Si cambias el `id` de una clase, los estudiantes pierden el progreso guardado de esa clase.
