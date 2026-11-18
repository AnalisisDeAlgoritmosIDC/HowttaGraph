/* HowttaGraph · equipo LEARN&TUDY
 * curso.js — contenido de la ruta de aprendizaje: niveles, clases, explicaciones y preguntas.
 *
 * Tipos de bloque dentro de una clase:
 *   { p: "html" }                       párrafo
 *   { key: "html" }                     recuadro de idea clave
 *   { list: ["html", ...] }             lista
 *   { code: "texto" }                   código en Python
 *   { fig: FIGURA, cap: "texto" }       dibujo de un grafo pequeño
 *   { table: { head: [...], rows: [[...]] } }
 *   { try: "bfs" | "dfs" | "dijkstra" | "astar" }   botón al visualizador
 *   { h: "Título" }                     encabezado de sección (aparece en el índice de la clase)
 *
 * Cada clase tiene un BANCO de preguntas; en cada intento se sacan PREGUNTAS_POR_INTENTO al azar.
 *
 * FIGURA = { w, h, dir?, n: [[x, y, "A", estado?, "etiqueta"?]], e: [[i, j, peso?, estado?]] }
 *   estados: "front" (ámbar), "closed" (verde), "cur" (rojo), "path" (magenta)
 *
 * Pregunta = { q: "html", o: ["opción", ...], a: índiceCorrecto, why: "explicación", fig?, code? }
 */
"use strict";

/* ---------- grafos que se repiten en varias clases ---------- */
const G_BASICO = { w: 370, h: 140, n: [[40,70,"A"],[140,30,"B"],[140,110,"C"],[240,70,"D"],[330,70,"E"]], e: [[0,1],[0,2],[1,3],[2,3],[3,4]] };
const G_RECORRIDO = (tags, est) => ({ w: 410, h: 180,
  n: [[40,90,"A"],[140,35,"B"],[140,145,"C"],[260,35,"D"],[260,145,"E"],[370,90,"F"]].map((n,i)=>[...n, est ? est[i] : undefined, tags ? tags[i] : undefined]),
  e: [[0,1],[0,2],[1,3],[2,3],[2,4],[3,5],[4,5]] });
const G_DIJKSTRA = (tags, est, eEst) => ({ w: 370, h: 180,
  n: [[40,90,"A"],[185,30,"B"],[185,150,"C"],[330,90,"D"]].map((n,i)=>[...n, est ? est[i] : undefined, tags ? tags[i] : undefined]),
  e: [[0,1,4],[0,2,1],[2,1,2],[1,3,1],[2,3,5]].map((e,i)=>[...e, eEst ? eEst[i] : undefined]) });

const CURSO = {
niveles: [
/* =====================================================================
   NIVEL 1 · FUNDAMENTOS
   ===================================================================== */
{ id: "n1", titulo: "Fundamentos", dificultad: 1,
  desc: "Qué es un grafo, qué tipos existen y cómo se guarda en la memoria de una computadora.",
  clases: [

{ id: "grafo", titulo: "¿Qué es un grafo?", min: 5,
  objetivos: ["Identificar nodos y aristas en un problema real", "Calcular el grado de un nodo", "Reconocer un camino válido"],
  bloques: [
    { h: "La idea" },
    { p: "Un <b>grafo</b> es una forma de representar cosas y las conexiones entre ellas. Formalmente se escribe <b>G = (V, E)</b>: un conjunto de <b>vértices</b> o <b>nodos</b> (V) y un conjunto de <b>aristas</b> (E) que unen pares de nodos." },
    { fig: G_BASICO, cap: "Un grafo con 5 nodos (A a E) y 5 aristas." },
    { h: "Grafos en la vida real" },
    { p: "Los grafos aparecen en todos lados. Lo que cambia es qué significan los nodos y las aristas:" },
    { table: { head: ["Problema", "Nodos", "Aristas"], rows: [
      ["Google Maps", "Cruces de calles", "Tramos de calle"],
      ["Red social", "Personas", "Amistades"],
      ["Internet", "Routers", "Cables o enlaces"],
      ["Plan de estudios", "Materias", "Prerrequisitos"] ] } },
    { h: "Vocabulario básico" },
    { key: "Dos nodos son <b>vecinos</b> (adyacentes) si una arista los une. El <b>grado</b> de un nodo es cuántas aristas lo tocan. En la figura, D tiene grado 3 porque está unido a B, C y E." },
    { p: "Si sumas los grados de todos los nodos de un grafo no dirigido obtienes el <b>doble del número de aristas</b>, porque cada arista toca dos nodos. En la figura: 2 + 2 + 2 + 3 + 1 = 10 = 2 × 5. A esto se le llama <i>lema del apretón de manos</i>." },
    { p: "Un <b>camino</b> es una secuencia de nodos donde cada par consecutivo está unido por una arista. A → B → D → E es un camino; A → D no lo es, porque no hay arista entre A y D." },
    { p: "Un nodo puede no tener ninguna arista: se llama <b>nodo aislado</b>. Encontrar un camino entre dos nodos es justo lo que hacen todos los algoritmos de este curso." }
  ],
  resumen: ["Grafo = nodos + aristas", "Vecinos: unidos por una arista", "Grado: número de aristas de un nodo", "Camino: nodos consecutivos conectados"],
  preguntas: [
    { q: "Si modelamos Google Maps como un grafo, ¿qué representan las aristas?", o: ["Las ciudades", "Los tramos de calle entre cruces", "Los autos", "Los semáforos"], a: 1, why: "Los cruces son los nodos y cada tramo de calle que conecta dos cruces es una arista." },
    { q: "¿Cuál es el grado del nodo D?", fig: G_BASICO, o: ["2", "3", "4", "5"], a: 1, why: "D está unido a B, C y E: tres aristas, grado 3." },
    { q: "¿Cuál de estas secuencias es un camino válido en este grafo?", fig: G_BASICO, o: ["A → D → E", "B → C → E", "A → B → D → E", "E → C → A"], a: 2, why: "A–B, B–D y D–E existen. En las demás falta alguna arista: A–D, B–C, C–E o E–C." },
    { q: "Verdadero o falso: un grafo puede tener nodos sin ninguna arista.", o: ["Verdadero", "Falso"], a: 0, why: "Se llaman nodos aislados. Siguen siendo parte del grafo, solo que no hay forma de llegar a ellos." },
    { q: "En G = (V, E), ¿qué representa E?", o: ["El conjunto de nodos", "El conjunto de aristas", "El número de caminos", "El peso total"], a: 1, why: "V son los vértices (nodos) y E (de <i>edges</i>) son las aristas." },
    { q: "¿Cuáles son los vecinos de B?", fig: G_BASICO, o: ["A y C", "A y D", "C y D", "Solo D"], a: 1, why: "B tiene aristas con A y con D. No hay arista entre B y C." },
    { q: "¿Cuál es el grado del nodo E?", fig: G_BASICO, o: ["0", "1", "2", "3"], a: 1, why: "E solo está unido a D." },
    { q: "En una red social modelada como grafo, el grado de una persona es…", o: ["Su edad", "Su número de amistades", "Cuántas publicaciones tiene", "Su distancia a la persona más lejana"], a: 1, why: "Cada amistad es una arista que toca a la persona, así que el grado cuenta sus amistades." },
    { q: "En un grafo no dirigido, la suma de los grados de todos los nodos es igual a…", o: ["El número de aristas", "El doble del número de aristas", "El número de nodos", "El cuadrado del número de nodos"], a: 1, why: "Cada arista toca dos nodos, así que se cuenta dos veces. A esto se le llama lema del apretón de manos." },
    { q: "¿Cuánto suman los grados de todos los nodos de este grafo?", fig: G_BASICO, o: ["5", "8", "10", "12"], a: 2, why: "Tiene 5 aristas y cada una aporta 2: 2 + 2 + 2 + 3 + 1 = 10." },
    { q: "¿Cuál de estos casos NO se modela naturalmente como grafo?", o: ["Estaciones y vías del metro", "Aeropuertos y vuelos directos", "Una lista de compras sin relación entre productos", "Páginas web y sus enlaces"], a: 2, why: "Si los elementos no tienen conexiones entre sí, no hay aristas que modelar." }
  ] },

{ id: "tipos", titulo: "Tipos de grafos", min: 6,
  objetivos: ["Distinguir grafos dirigidos y no dirigidos", "Entender qué es un peso", "Reconocer ciclos y árboles"],
  bloques: [
    { h: "Clasificaciones" },
    { p: "No todos los grafos son iguales. Antes de elegir un algoritmo hay que saber qué tipo de grafo tienes." },
    { list: [
      "<b>No dirigido:</b> las aristas van en ambos sentidos. Una amistad en Facebook: si tú eres mi amigo, yo soy tu amigo.",
      "<b>Dirigido:</b> cada arista tiene una flecha. Seguir a alguien en Instagram, o una calle de un solo sentido.",
      "<b>Ponderado:</b> cada arista tiene un <b>peso</b>: kilómetros, minutos, costo de una caseta.",
      "<b>Conexo:</b> existe un camino entre cualquier par de nodos." ] },
    { fig: { w: 340, h: 170, dir: true, n: [[40,85,"A"],[165,30,"B"],[165,140,"C"],[300,85,"D"]], e: [[0,1,5],[1,2,3],[0,2,9],[2,3,2]] }, cap: "Grafo dirigido y ponderado: de A a C se puede ir directo (9) o pasando por B (5 + 3 = 8). De C no se puede regresar a A." },
    { h: "Ciclos y árboles" },
    { key: "Un <b>ciclo</b> es un camino que regresa a su nodo inicial. Un <b>árbol</b> es un grafo conexo <b>sin ciclos</b>, y siempre tiene exactamente <b>n − 1 aristas</b> si tiene n nodos." },
    { p: "Los algoritmos de búsqueda tienen que cuidarse de los ciclos: si no recuerdan qué nodos ya visitaron, pueden dar vueltas para siempre." }
  ],
  resumen: ["Dirigido: aristas con sentido", "Ponderado: aristas con costo", "Ciclo: regresa al inicio", "Árbol: conexo, sin ciclos, n − 1 aristas"],
  preguntas: [
    { q: "Seguir a alguien en Instagram, sin que te siga de vuelta, se modela mejor con un grafo…", o: ["No dirigido", "Dirigido", "Sin aristas", "Completo"], a: 1, why: "La relación tiene sentido: que tú sigas a alguien no significa que te siga. Eso es una arista con flecha." },
    { q: "Un árbol tiene 8 nodos. ¿Cuántas aristas tiene?", o: ["6", "7", "8", "9"], a: 1, why: "Todo árbol con n nodos tiene n − 1 aristas: 8 − 1 = 7." },
    { q: "En un grafo de rutas, el peso de una arista puede representar…", o: ["La distancia en km", "El tiempo de recorrido", "El costo de la caseta", "Cualquiera de las anteriores"], a: 3, why: "El peso es cualquier costo que queramos minimizar. Las apps de rutas suelen usar el tiempo estimado." },
    { q: "¿Este grafo tiene un ciclo?", fig: { w: 300, h: 150, n: [[40,40,"A"],[170,40,"B"],[105,120,"C"],[250,120,"D"]], e: [[0,1],[1,2],[2,0],[2,3]] }, o: ["Sí: A → B → C → A", "No, porque D tiene una sola arista", "No, los grafos no dirigidos no tienen ciclos", "Sí: C → D → C"], a: 0, why: "A, B y C forman un triángulo y se puede regresar al inicio. C → D → C reutiliza la misma arista, eso no cuenta como ciclo." },
    { q: "En este grafo dirigido, ¿se puede ir de C a A?", fig: { w: 340, h: 170, dir: true, n: [[40,85,"A"],[165,30,"B"],[165,140,"C"],[300,85,"D"]], e: [[0,1,5],[1,2,3],[0,2,9],[2,3,2]] }, o: ["Sí, directo", "Sí, pasando por B", "No, todas las flechas salen de A o van hacia D", "Sí, pasando por D"], a: 2, why: "Las flechas solo permiten avanzar en su sentido. Desde C solo se puede ir a D." },
    { q: "En ese mismo grafo, ¿cuál es el costo más barato para ir de A a C?", fig: { w: 340, h: 170, dir: true, n: [[40,85,"A"],[165,30,"B"],[165,140,"C"],[300,85,"D"]], e: [[0,1,5],[1,2,3],[0,2,9],[2,3,2]] }, o: ["9", "8", "5", "3"], a: 1, why: "Directo cuesta 9; pasando por B cuesta 5 + 3 = 8." },
    { q: "Un grafo en el que existe un camino entre cualquier par de nodos se llama…", o: ["Dirigido", "Ponderado", "Conexo", "Completo"], a: 2, why: "Conexo significa que no hay nodos o grupos de nodos aislados del resto." },
    { q: "Una calle de un solo sentido se modela con…", o: ["Un nodo", "Una arista dirigida", "Una arista con peso 0", "Un ciclo"], a: 1, why: "La flecha indica que solo se puede recorrer en un sentido." },
    { q: "Si a un árbol le agregas una arista entre dos nodos que ya tenía…", o: ["Sigue siendo árbol", "Se forma un ciclo", "Se desconecta", "Pierde un nodo"], a: 1, why: "En un árbol ya existe un camino entre esos dos nodos; la arista nueva cierra un ciclo." },
    { q: "Un grafo conexo tiene 6 nodos y 5 aristas. ¿Qué es?", o: ["Un árbol", "Un grafo con ciclo", "Un grafo dirigido", "No puede existir"], a: 0, why: "Conexo con n − 1 aristas implica que no tiene ciclos: es un árbol." },
    { q: "Verdadero o falso: un árbol puede tener ciclos.", o: ["Verdadero", "Falso"], a: 1, why: "Por definición, un árbol es un grafo conexo sin ciclos." }
  ] },

{ id: "representar", titulo: "Cómo se guarda un grafo", min: 7,
  objetivos: ["Construir una matriz de adyacencia", "Construir una lista de adyacencia", "Elegir la representación adecuada"],
  bloques: [
    { h: "El problema" },
    { p: "Para que un programa trabaje con un grafo hay que guardarlo en memoria. Las dos formas más comunes son la matriz y la lista de adyacencia." },
    { fig: { w: 300, h: 150, n: [[40,40,"A"],[170,40,"B"],[40,120,"C"],[170,120,"D"]], e: [[0,1],[0,2],[2,3]] }, cap: "Grafo de ejemplo con aristas A–B, A–C y C–D." },
    { h: "Matriz de adyacencia" },
    { p: "<b>Matriz de adyacencia:</b> una tabla de V × V. La celda [i][j] vale 1 (o el peso) si hay arista entre i y j, y 0 si no." },
    { table: { head: ["", "A", "B", "C", "D"], rows: [["A","0","1","1","0"],["B","1","0","0","0"],["C","1","0","0","1"],["D","0","0","1","0"]] } },
    { p: "En un grafo no dirigido la matriz es <b>simétrica</b>: [i][j] siempre es igual a [j][i]." },
    { h: "Lista de adyacencia" },
    { p: "<b>Lista de adyacencia:</b> para cada nodo se guarda solo la lista de sus vecinos. En Python es un diccionario:" },
    { code: "grafo = {\n    'A': ['B', 'C'],\n    'B': ['A'],\n    'C': ['A', 'D'],\n    'D': ['C'],\n}\n\n# con pesos: lista de pares (vecino, peso)\ngrafo_p = {'A': [('B', 4), ('C', 1)], ...}" },
    { h: "Comparación" },
    { table: { head: ["", "Matriz", "Lista"], rows: [["Memoria", "O(V²)", "O(V + E)"], ["¿Hay arista entre u y v?", "O(1)", "O(grado de u)"], ["Recorrer vecinos de u", "O(V)", "O(grado de u)"]] } },
    { key: "Un mapa real tiene millones de cruces, pero cada cruce tiene solo 3 o 4 calles. La matriz desperdiciaría casi toda su memoria en ceros, por eso los algoritmos de rutas usan <b>listas de adyacencia</b>. HowttaGraph también." }
  ],
  resumen: ["Matriz: tabla V × V, memoria O(V²)", "Lista: vecinos de cada nodo, memoria O(V + E)", "Grafos dispersos (mapas) → lista"],
  preguntas: [
    { q: "Un mapa con 1,000,000 de cruces y unas 4 calles por cruce. ¿Qué representación conviene?", o: ["Matriz de adyacencia", "Lista de adyacencia", "Da igual", "Ninguna de las dos"], a: 1, why: "La matriz ocuparía 10¹² celdas, casi todas en cero. La lista solo guarda unas 4 millones de conexiones." },
    { q: "¿Cuánta memoria ocupa la matriz de adyacencia de un grafo con V nodos?", o: ["O(V)", "O(E)", "O(V²)", "O(log V)"], a: 2, why: "Es una tabla de V filas por V columnas, sin importar cuántas aristas haya." },
    { q: "Con esta lista de adyacencia, ¿cuántos vecinos tiene A?", code: "grafo = {'A': ['B', 'C'], 'B': ['A'], 'C': ['A']}", o: ["1", "2", "3", "0"], a: 1, why: "La lista de A es ['B', 'C']: dos vecinos." },
    { q: "En la matriz de un grafo <b>no dirigido</b>, M[i][j] y M[j][i]…", o: ["Siempre son iguales", "Siempre son distintos", "Uno siempre vale 0", "Depende del peso"], a: 0, why: "Si hay arista de i a j también la hay de j a i, por eso la matriz es simétrica." },
    { q: "La matriz de adyacencia de un grafo con 5 nodos tiene…", o: ["5 celdas", "10 celdas", "25 celdas", "Depende de las aristas"], a: 2, why: "Es una tabla de 5 × 5 = 25 celdas, haya muchas o pocas aristas." },
    { q: "En la matriz de este grafo, ¿cuánto vale la celda [B][C]?", fig: { w: 300, h: 150, n: [[40,40,"A"],[170,40,"B"],[40,120,"C"],[170,120,"D"]], e: [[0,1],[0,2],[2,3]] }, o: ["0", "1", "2", "No existe esa celda"], a: 0, why: "No hay arista entre B y C, así que la celda vale 0." },
    { q: "Si necesitas responder muchas veces y muy rápido «¿hay arista entre u y v?», conviene…", o: ["Matriz de adyacencia", "Lista de adyacencia", "Una pila", "Una cola"], a: 0, why: "En la matriz basta consultar una celda: O(1)." },
    { q: "En una lista de adyacencia de un grafo ponderado, cada vecino se guarda como…", o: ["Solo el nombre del vecino", "Un par (vecino, peso)", "Una fila completa de la matriz", "El grado del vecino"], a: 1, why: "Además del vecino hay que guardar cuánto cuesta llegar a él." },
    { q: "Un grafo no dirigido con E aristas. ¿Cuántas entradas hay en total sumando todas sus listas de adyacencia?", o: ["E", "2E", "E²", "V"], a: 1, why: "Cada arista u–v aparece en la lista de u y en la de v." },
    { q: "¿Qué tipo de grafo representa esta lista?", code: "grafo = {'A': ['B'], 'B': ['C'], 'C': []}", o: ["No dirigido", "Dirigido", "Ponderado", "Completo"], a: 1, why: "A apunta a B pero B no tiene a A en su lista: las aristas tienen sentido." },
    { q: "Un grafo denso, donde casi todos los nodos están conectados con todos, …", o: ["Siempre debe usar lista", "Puede usar matriz sin desperdiciar mucha memoria", "No se puede representar", "Se representa con una pila"], a: 1, why: "Si E se acerca a V², la matriz casi no tiene ceros y su acceso O(1) es una ventaja." }
  ] }
]},

/* =====================================================================
   NIVEL 2 · RECORRIDOS
   ===================================================================== */
{ id: "n2", titulo: "Recorridos", dificultad: 2,
  desc: "Las dos formas básicas de explorar un grafo: por capas (BFS) y en profundidad (DFS).",
  clases: [

{ id: "colapila", titulo: "Cola y pila", min: 5,
  objetivos: ["Simular una cola FIFO", "Simular una pila LIFO", "Saber por qué usar deque en Python"],
  bloques: [
    { h: "Por qué importan" },
    { p: "BFS y DFS son casi el mismo algoritmo. La única diferencia importante es la estructura donde guardan los nodos pendientes: una <b>cola</b> o una <b>pila</b>." },
    { h: "Cola" },
    { p: "<b>Cola (FIFO, first in, first out):</b> como la fila de las tortillas. El que llega se forma al final y se atiende al del frente." },
    { code: "from collections import deque\n\ncola = deque()\ncola.append('A')     # entra al final\ncola.append('B')\ncola.append('C')\ncola.popleft()       # sale 'A', el primero que entró" },
    { h: "Pila" },
    { p: "<b>Pila (LIFO, last in, first out):</b> como una pila de platos. El último que pones es el primero que quitas." },
    { code: "pila = []\npila.append('A')     # se pone arriba\npila.append('B')\npila.append('C')\npila.pop()           # sale 'C', el último que entró" },
    { key: "En Python, <code>list.pop(0)</code> funciona como cola pero cuesta <b>O(n)</b>, porque recorre todos los elementos para acomodarlos. <code>deque.popleft()</code> cuesta <b>O(1)</b>." }
  ],
  resumen: ["Cola: sale el más antiguo (FIFO)", "Pila: sale el más reciente (LIFO)", "Cola en Python: deque + popleft()"],
  preguntas: [
    { q: "En una cola vacía metes A, luego B, luego C. Sacas uno. ¿Cuál sale?", o: ["A", "B", "C", "Ninguno"], a: 0, why: "La cola es FIFO: sale el primero que entró." },
    { q: "En una pila vacía metes A, luego B, luego C. Sacas uno. ¿Cuál sale?", o: ["A", "B", "C", "Ninguno"], a: 2, why: "La pila es LIFO: sale el último que entró." },
    { q: "Pila vacía: push 1, push 2, pop, push 3, pop, pop. ¿En qué orden salen?", o: ["1, 2, 3", "2, 3, 1", "3, 2, 1", "2, 1, 3"], a: 1, why: "Sale 2 (estaba arriba). Entra 3 y sale 3. Al final solo queda 1." },
    { q: "¿Por qué se usa deque y no list.pop(0) para la cola?", o: ["deque ordena los elementos", "list.pop(0) cuesta O(n) y popleft() O(1)", "list no permite repetidos", "deque usa menos memoria siempre"], a: 1, why: "Sacar el primer elemento de una lista obliga a recorrer todos los demás para moverlos." },
    { q: "Cola vacía: append A, append B, popleft, append C, popleft. ¿Qué queda en la cola?", o: ["[A]", "[B]", "[C]", "Está vacía"], a: 2, why: "Sale A, luego entra C, luego sale B. Solo queda C." },
    { q: "El botón Deshacer (Ctrl + Z) de un editor funciona como…", o: ["Una cola", "Una pila", "Una cola de prioridad", "Una matriz"], a: 1, why: "Se deshace primero el último cambio que hiciste: LIFO." },
    { q: "La fila de documentos de una impresora funciona como…", o: ["Una cola", "Una pila", "Un árbol", "Un grafo dirigido"], a: 0, why: "Se imprime primero lo que se mandó primero: FIFO." },
    { q: "Cuando una función se llama a sí misma (recursión), las llamadas pendientes se guardan en…", o: ["Una cola", "La pila de llamadas", "Un heap", "Un diccionario"], a: 1, why: "La última llamada en empezar es la primera en terminar: es una pila." },
    { q: "¿Qué imprime este código?", code: "pila = [1, 2, 3]\npila.pop()\npila.append(4)\nprint(pila)", o: ["[1, 2, 3, 4]", "[2, 3, 4]", "[1, 2, 4]", "[4, 1, 2]"], a: 2, why: "pop() quita el 3 del final y append(4) agrega el 4 al final." },
    { q: "¿Qué imprime este código?", code: "from collections import deque\ncola = deque([1, 2, 3])\ncola.popleft()\ncola.append(4)\nprint(list(cola))", o: ["[1, 2, 3, 4]", "[2, 3, 4]", "[1, 2, 4]", "[4, 2, 3]"], a: 1, why: "popleft() quita el 1 del frente y append(4) lo agrega al final." }
  ] },

{ id: "bfs", titulo: "BFS · búsqueda en anchura", min: 8,
  objetivos: ["Ejecutar BFS a mano", "Calcular niveles", "Saber qué camino garantiza BFS"],
  bloques: [
    { h: "La idea" },
    { p: "BFS (<i>Breadth-First Search</i>) explora el grafo <b>por capas</b>, como una onda en el agua: primero el origen, después todos sus vecinos, después los vecinos de esos, y así." },
    { fig: G_RECORRIDO(["nivel 0","nivel 1","nivel 1","nivel 2","nivel 2","nivel 3"], ["cur","front","front","closed","closed","path"]), cap: "BFS desde A. Cada color es una capa: A (0), B y C (1), D y E (2), F (3)." },
    { h: "Paso a paso" },
    { p: "El algoritmo usa una <b>cola</b>:" },
    { list: ["Mete el origen a la cola y márcalo como visitado.", "Saca el nodo del frente.", "Mete a la cola a cada vecino que no esté visitado, y márcalo.", "Repite hasta encontrar la meta o vaciar la cola."] },
    { h: "En código" },
    { code: "from collections import deque\n\ndef bfs(grafo, inicio, meta):\n    cola = deque([inicio])\n    visitado = {inicio}\n    padre = {inicio: None}\n    while cola:\n        actual = cola.popleft()\n        if actual == meta:\n            return padre\n        for vecino in grafo[actual]:\n            if vecino not in visitado:\n                visitado.add(vecino)\n                padre[vecino] = actual\n                cola.append(vecino)\n    return None" },
    { h: "Lo que garantiza" },
    { key: "El nodo se marca como visitado al <b>meterlo</b> a la cola, no al sacarlo. Así ningún nodo entra dos veces. Como explora por capas, BFS encuentra el camino con <b>menos aristas</b>, pero ignora los pesos." },
    { p: "Complejidad: <b>O(V + E)</b>. Cada nodo entra a la cola una vez y cada arista se revisa una vez por extremo." },
    { try: "bfs" }
  ],
  resumen: ["Cola FIFO", "Explora por capas (niveles)", "Marca al encolar", "Camino con menos aristas, ignora pesos", "O(V + E)"],
  preguntas: [
    { q: "BFS desde A, revisando vecinos en orden alfabético. ¿En qué orden se exploran los nodos?", fig: G_RECORRIDO(), o: ["A, B, D, C, E, F", "A, B, C, D, E, F", "A, C, E, F, B, D", "A, B, C, E, D, F"], a: 1, why: "Capa 0: A. Capa 1: B y C. De B se descubre D y de C se descubre E. Al final F." },
    { q: "En ese mismo grafo, ¿en qué nivel queda F?", fig: G_RECORRIDO(), o: ["1", "2", "3", "4"], a: 2, why: "El camino más corto en aristas es A → B → D → F (o A → C → E → F): 3 aristas." },
    { q: "Si las calles tienen pesos distintos, BFS garantiza el camino con…", o: ["Menor costo total", "Menos aristas", "Más aristas", "Menor heurística"], a: 1, why: "BFS no lee los pesos. Solo cuenta pasos, así que puede elegir un camino corto en pasos pero caro." },
    { q: "¿Por qué BFS marca un nodo como visitado al meterlo a la cola?", o: ["Para que salga más rápido", "Para no meter el mismo nodo varias veces", "Para ordenar la cola", "Para calcular los pesos"], a: 1, why: "Si se marcara al sacarlo, un nodo con varios vecinos ya descubiertos podría encolarse varias veces." },
    { q: "BFS desde A. Justo después de procesar B (sacarlo y meter a sus vecinos), ¿qué hay en la cola?", fig: G_RECORRIDO(), o: ["[C, D]", "[D, C]", "[C]", "[D, E]"], a: 0, why: "Tras A la cola es [B, C]. Sale B y entra D al final: [C, D]." },
    { q: "BFS desde A en orden alfabético. ¿Quién es el padre de E?", fig: G_RECORRIDO(), o: ["A", "C", "D", "F"], a: 1, why: "E se descubre al procesar C, que es su único vecino explorado antes que F." },
    { q: "BFS desde A en orden alfabético. ¿Quién es el padre de D?", fig: G_RECORRIDO(), o: ["B", "C", "F", "A"], a: 0, why: "B sale de la cola antes que C, así que es B quien descubre a D." },
    { q: "BFS desde F. ¿En qué nivel queda A?", fig: G_RECORRIDO(), o: ["1", "2", "3", "5"], a: 2, why: "F → D → B → A (o F → E → C → A): 3 aristas." },
    { q: "¿Cuál es la complejidad de BFS con lista de adyacencia?", o: ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], a: 1, why: "Cada nodo entra a la cola una vez y cada arista se revisa una vez por extremo." },
    { q: "En un laberinto en cuadrícula donde cada paso cuesta 1, BFS encuentra…", o: ["Una salida cualquiera", "La salida con menos pasos", "La salida más lejana", "Todas las salidas a la vez"], a: 1, why: "Con costos iguales, menos aristas significa menor costo, y eso es lo que garantiza BFS." },
    { q: "¿Qué puede pasar si BFS no lleva un registro de visitados en un grafo con ciclos?", o: ["Nada, termina igual", "Puede meter nodos a la cola una y otra vez sin terminar", "Se vuelve DFS", "Encuentra caminos más cortos"], a: 1, why: "Los ciclos harían que se redescubran los mismos nodos indefinidamente." }
  ] },

{ id: "dfs", titulo: "DFS · búsqueda en profundidad", min: 7,
  objetivos: ["Ejecutar DFS a mano", "Comparar el camino de DFS con el de BFS", "Conocer los usos de DFS"],
  bloques: [
    { h: "La idea" },
    { p: "DFS (<i>Depth-First Search</i>) se mete <b>lo más hondo posible</b> por una rama y solo regresa cuando ya no puede avanzar. A ese regreso se le llama <i>backtracking</i>." },
    { p: "Es el mismo esquema que BFS, pero con una <b>pila</b> en vez de una cola. También se puede escribir con recursión, porque la recursión usa la pila de llamadas." },
    { h: "En código" },
    { code: "def dfs(grafo, actual, meta, visitado, padre):\n    visitado.add(actual)\n    if actual == meta:\n        return True\n    for vecino in grafo[actual]:\n        if vecino not in visitado:\n            padre[vecino] = actual\n            if dfs(grafo, vecino, meta, visitado, padre):\n                return True\n    return False" },
    { h: "Ejemplo" },
    { fig: G_RECORRIDO(["#1","#2","#4","#3","#5","#6"], ["path","path","path","path","path","path"]), cap: "DFS desde A en orden alfabético: A, B, D, C, E, F. Llega a F con 5 aristas; BFS lo hacía con 3." },
    { h: "Para qué sirve" },
    { key: "DFS encuentra <b>un</b> camino, no necesariamente el más corto. Su fuerza está en otros problemas: <b>detectar ciclos</b>, <b>orden topológico</b> (en qué orden llevar materias con prerrequisitos) y encontrar <b>componentes conectadas</b>." },
    { p: "Complejidad: <b>O(V + E)</b>, igual que BFS." },
    { try: "dfs" }
  ],
  resumen: ["Pila LIFO o recursión", "Profundiza y luego regresa", "No garantiza el camino más corto", "Útil para ciclos y orden topológico", "O(V + E)"],
  preguntas: [
    { q: "DFS desde A, visitando vecinos en orden alfabético. ¿En qué orden se visitan?", fig: G_RECORRIDO(), o: ["A, B, C, D, E, F", "A, B, D, C, E, F", "A, B, D, F, E, C", "A, C, E, F, D, B"], a: 1, why: "A → B → D. Desde D el primer vecino libre en orden alfabético es C (B ya está visitado). Luego C → E → F." },
    { q: "En ese recorrido, ¿cuántas aristas tiene el camino que DFS encontró de A a F?", fig: G_RECORRIDO(), o: ["3", "4", "5", "6"], a: 2, why: "Siguiendo los padres: A → B → D → C → E → F, cinco aristas. El más corto tiene 3." },
    { q: "¿Qué estructura usa DFS?", o: ["Cola", "Pila (o recursión)", "Cola de prioridad", "Matriz"], a: 1, why: "Siempre continúa por el último nodo descubierto: comportamiento LIFO." },
    { q: "¿Para cuál de estos problemas es más útil DFS que BFS?", o: ["Camino con menos pasos en un laberinto", "Detectar si las materias tienen prerrequisitos circulares", "Ruta más barata en un mapa", "Grados de separación entre dos personas"], a: 1, why: "Detectar ciclos y obtener un orden topológico son aplicaciones clásicas de DFS." },
    { q: "DFS desde A en orden alfabético. ¿Quién es el padre de C?", fig: G_RECORRIDO(), o: ["A", "B", "D", "E"], a: 2, why: "El recorrido es A, B, D, C…: C se alcanza desde D." },
    { q: "DFS desde F, visitando vecinos en orden alfabético. ¿En qué orden se visitan?", fig: G_RECORRIDO(), o: ["F, D, E, B, C, A", "F, D, B, A, C, E", "F, E, C, A, B, D", "F, D, C, A, B, E"], a: 1, why: "F → D → B → A → C → E. La primera opción es el orden de BFS." },
    { q: "En el DFS recursivo, ¿qué es el <i>backtracking</i>?", o: ["Borrar nodos visitados", "Regresar a la llamada anterior cuando ya no hay vecinos por visitar", "Ordenar los vecinos", "Volver a empezar desde el origen"], a: 1, why: "Cuando una llamada termina, la ejecución continúa en la llamada que la invocó." },
    { q: "Un grafo es una línea de 100,000 nodos. El DFS recursivo en Python probablemente…", o: ["Termina sin problema", "Lanza RecursionError por exceder el límite de recursión", "Se vuelve BFS", "Encuentra un ciclo"], a: 1, why: "Python limita la profundidad de recursión (unas 1,000 llamadas por defecto). Para grafos profundos se usa la versión con pila explícita." },
    { q: "Verdadero o falso: DFS y BFS tienen la misma complejidad, O(V + E).", o: ["Verdadero", "Falso"], a: 0, why: "Ambos visitan cada nodo y cada arista un número constante de veces." },
    { q: "¿Para qué sirve un orden topológico?", o: ["Para encontrar el camino más barato", "Para ordenar tareas respetando sus dependencias", "Para ordenar números", "Para contar aristas"], a: 1, why: "Por ejemplo, decidir en qué orden cursar materias con prerrequisitos." }
  ] }
]},

/* =====================================================================
   NIVEL 3 · CAMINOS CON PESO
   ===================================================================== */
{ id: "n3", titulo: "Caminos con peso", dificultad: 3,
  desc: "Cuando las calles cuestan distinto: colas de prioridad y el algoritmo de Dijkstra.",
  clases: [

{ id: "heap", titulo: "Cola de prioridad y heap", min: 6,
  objetivos: ["Entender qué es una cola de prioridad", "Usar heapq en Python", "Conocer el costo de sus operaciones"],
  bloques: [
    { h: "La idea" },
    { p: "En una <b>cola de prioridad</b> no sale el primero que llegó, sino el que tiene <b>menor prioridad</b> (el más urgente). Como en urgencias de un hospital." },
    { p: "Se implementa con un <b>min-heap</b>: un árbol binario donde cada padre es menor o igual que sus hijos. Así, el mínimo siempre está en la raíz." },
    { fig: { w: 320, h: 170, n: [[160,30,"2","path"],[90,90,"5"],[230,90,"3"],[50,145,"9"],[130,145,"7"]], e: [[0,1],[0,2],[1,3],[1,4]] }, cap: "Min-heap: cada padre es menor que sus hijos. El 2 está en la raíz." },
    { h: "En Python" },
    { code: "import heapq\n\npq = []\nheapq.heappush(pq, (5, 'A'))\nheapq.heappush(pq, (2, 'B'))\nheapq.heappush(pq, (8, 'C'))\nheapq.heappop(pq)    # (2, 'B'): la tupla con el primer valor más chico" },
    { table: { head: ["Operación", "Costo"], rows: [["Ver el mínimo", "O(1)"], ["Meter (heappush)", "O(log n)"], ["Sacar el mínimo (heappop)", "O(log n)"]] } },
    { key: "Python compara tuplas por su primer elemento. Por eso guardamos <code>(distancia, nodo)</code>: así el heap siempre entrega el nodo con la menor distancia." }
  ],
  resumen: ["Sale el de menor prioridad", "Min-heap: mínimo en la raíz", "push y pop: O(log n)", "Tuplas (prioridad, dato)"],
  preguntas: [
    { q: "¿Qué devuelve el último heappop?", code: "pq = []\nheapq.heappush(pq, (5, 'A'))\nheapq.heappush(pq, (2, 'B'))\nheapq.heappush(pq, (8, 'C'))\nheapq.heappop(pq)", o: ["(5, 'A')", "(2, 'B')", "(8, 'C')", "(5, 'B')"], a: 1, why: "El heap entrega la tupla con el primer valor más pequeño: 2." },
    { q: "¿Cuánto cuesta heappush en un heap con n elementos?", o: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], a: 1, why: "El nuevo elemento sube por el árbol, cuya altura es log n." },
    { q: "En un min-heap, ¿dónde está siempre el elemento más pequeño?", o: ["En la última posición", "En una hoja", "En la raíz (posición 0)", "En cualquier lugar"], a: 2, why: "Cada padre es menor o igual que sus hijos, así que el mínimo queda arriba." },
    { q: "¿Por qué Dijkstra no puede usar una cola normal?", o: ["Porque la cola no acepta números", "Porque necesita sacar siempre el nodo con menor distancia, no el primero que llegó", "Porque la cola es más lenta", "Sí puede usarla sin problema"], a: 1, why: "Con una cola FIFO se procesaría en orden de llegada, que no tiene relación con la distancia acumulada." },
    { q: "Metes 7, 3, 9 y 1 a un min-heap. Haces dos heappop seguidos. ¿Qué sale?", o: ["7 y 3", "1 y 3", "1 y 7", "9 y 7"], a: 1, why: "Siempre sale el menor: primero 1 y luego 3." },
    { q: "Python compara las tuplas (4, 'C') y (4, 'A'). ¿Cuál es menor?", o: ["(4, 'C')", "(4, 'A')", "Son iguales", "Da error"], a: 1, why: "Empatan en el primer elemento, así que se compara el segundo: 'A' < 'C'." },
    { q: "¿Es este árbol un min-heap válido?", fig: { w: 320, h: 170, n: [[160,30,"2"],[90,90,"5"],[230,90,"3"],[50,145,"9"],[130,145,"4"]], e: [[0,1],[0,2],[1,3],[1,4]] }, o: ["Sí", "No, porque 4 es hijo de 5", "No, porque 9 es una hoja", "No, porque 3 es mayor que 2"], a: 1, why: "En un min-heap cada padre debe ser menor o igual que sus hijos, y 5 > 4." },
    { q: "¿Cuál es la altura de un heap binario con n elementos?", o: ["O(1)", "O(log n)", "O(n)", "O(n²)"], a: 1, why: "Es un árbol binario casi completo: cada nivel duplica la capacidad." },
    { q: "Meter n números a un heap y sacarlos todos los entrega ordenados. ¿Cuánto cuesta en total?", o: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], a: 1, why: "Son n operaciones de O(log n). Así funciona el algoritmo heapsort." },
    { q: "¿Cuál es un ejemplo de cola de prioridad en la vida real?", o: ["La fila del banco", "Urgencias de un hospital", "Una pila de platos", "Una lista de reproducción en orden"], a: 1, why: "Se atiende primero al paciente más grave, no al que llegó primero." }
  ] },

{ id: "dijkstra", titulo: "Dijkstra · el camino más barato", min: 10,
  objetivos: ["Entender la relajación", "Ejecutar Dijkstra a mano", "Saber cuándo falla"],
  bloques: [
    { h: "La idea" },
    { p: "Edsger Dijkstra diseñó este algoritmo en 1956. Encuentra el camino de <b>menor costo</b> desde un origen cuando todos los pesos son <b>≥ 0</b>." },
    { p: "La idea: siempre expande el nodo con la <b>menor distancia acumulada</b> que aún no se ha fijado. Como no hay pesos negativos, nadie podrá llegar a él más barato después." },
    { h: "Relajación" },
    { key: "<b>Relajar</b> la arista u → v es preguntar: ¿pasando por u llego a v más barato que como lo conocía? Si <code>dist[u] + peso &lt; dist[v]</code>, se actualiza <code>dist[v]</code> y su padre." },
    { h: "Ejemplo resuelto" },
    { fig: G_DIJKSTRA(), cap: "Ejemplo: origen A. Ir directo a B cuesta 4, pero A → C → B cuesta 1 + 2 = 3." },
    { p: "Así se ejecuta paso a paso:" },
    { table: { head: ["Paso", "Sale de la cola", "Actualiza", "Cola después"], rows: [
      ["1", "A (0)", "B = 4, C = 1", "(1,C) (4,B)"],
      ["2", "C (1)", "B = 3, D = 6", "(3,B) (4,B) (6,D)"],
      ["3", "B (3)", "D = 4", "(4,B) (4,D) (6,D)"],
      ["4", "(4,B)", "entrada vieja, se ignora", "(4,D) (6,D)"],
      ["5", "D (4)", "¡meta!", ""] ] } },
    { fig: G_DIJKSTRA(["d=0","d=3","d=1","d=4"], ["path","path","path","path"], [null,"path","path","path",null]), cap: "Resultado: A → C → B → D con costo 4." },
    { h: "En código" },
    { code: "import heapq\n\ndef dijkstra(grafo, inicio, meta):\n    dist = {n: float('inf') for n in grafo}\n    dist[inicio] = 0\n    padre = {inicio: None}\n    pq = [(0, inicio)]\n    while pq:\n        d, actual = heapq.heappop(pq)\n        if d > dist[actual]:\n            continue\n        if actual == meta:\n            return dist[meta], padre\n        for vecino, peso in grafo[actual]:\n            nueva = d + peso\n            if nueva < dist[vecino]:\n                dist[vecino] = nueva\n                padre[vecino] = actual\n                heapq.heappush(pq, (nueva, vecino))\n    return float('inf'), padre" },
    { h: "Cuándo falla" },
    { p: "Con <b>pesos negativos</b> Dijkstra puede fallar: un nodo ya fijado podría abaratarse después por una arista negativa. Para esos casos existe Bellman-Ford." },
    { try: "dijkstra" }
  ],
  resumen: ["Expande el nodo con menor distancia", "Relajación: dist[u] + peso < dist[v]", "Óptimo si los pesos son ≥ 0", "O((V + E) log V) con heap"],
  preguntas: [
    { q: "Dijkstra desde A. ¿Cuál es la distancia final a B?", fig: G_DIJKSTRA(), o: ["4", "3", "1", "5"], a: 1, why: "Directo cuesta 4, pero A → C → B cuesta 1 + 2 = 3." },
    { q: "¿Cuál es el camino más barato de A a D?", fig: G_DIJKSTRA(), o: ["A → B → D", "A → C → D", "A → C → B → D", "A → D"], a: 2, why: "Costos: A→B→D = 5, A→C→D = 6, A→C→B→D = 1 + 2 + 1 = 4." },
    { q: "Después de A, ¿qué nodo sale de la cola de prioridad?", fig: G_DIJKSTRA(), o: ["B", "C", "D", "A otra vez"], a: 1, why: "Tras procesar A, la cola tiene (1, C) y (4, B). Sale el de menor distancia: C." },
    { q: "Dijkstra puede dar una respuesta incorrecta cuando…", o: ["El grafo es no dirigido", "Hay aristas con peso negativo", "Hay ciclos", "Hay más de 100 nodos"], a: 1, why: "Asume que una vez fijada, la distancia de un nodo ya no puede bajar. Un peso negativo rompe esa idea." },
    { q: "¿Qué significa relajar la arista u → v?", o: ["Borrarla del grafo", "Revisar si pasar por u mejora la distancia conocida a v", "Bajarle el peso", "Marcar v como visitado"], a: 1, why: "Si dist[u] + peso < dist[v], se encontró un camino mejor y se actualiza." },
    { q: "Dijkstra desde A. Después de procesar A, ¿cuánto vale dist[D]?", fig: G_DIJKSTRA(), o: ["0", "5", "6", "∞"], a: 3, why: "A no tiene arista con D, así que D sigue en infinito." },
    { q: "Dijkstra desde A. Después de procesar C, ¿cuánto vale dist[D]?", fig: G_DIJKSTRA(), o: ["4", "5", "6", "∞"], a: 2, why: "Desde C: 1 + 5 = 6. Todavía no se ha procesado B, que lo bajará a 4." },
    { q: "Dijkstra desde D. ¿Cuál es la distancia a A?", fig: G_DIJKSTRA(), o: ["4", "5", "6", "7"], a: 0, why: "D → B → C → A cuesta 1 + 2 + 1 = 4; D → B → A cuesta 5 y D → C → A cuesta 6." },
    { q: "Dijkstra desde A. Al terminar, ¿quién es el padre de B?", fig: G_DIJKSTRA(), o: ["A", "C", "D", "Nadie"], a: 1, why: "El mejor camino a B es A → C → B, así que su padre es C." },
    { q: "Dijkstra es un algoritmo de tipo…", o: ["Voraz (greedy)", "Divide y vencerás", "Fuerza bruta", "Aleatorio"], a: 0, why: "En cada paso toma la decisión que parece mejor en ese momento: el nodo más cercano." },
    { q: "Si todas las aristas pesan 1, Dijkstra encuentra las mismas distancias que…", o: ["DFS", "BFS", "Ninguno", "Floyd-Warshall pero más lento"], a: 1, why: "Con pesos iguales, la distancia es el número de aristas, que es lo que calcula BFS." },
    { q: "En Dijkstra, ¿cuántas veces se procesa cada nodo como «válido» (no entrada vieja)?", o: ["Ninguna", "Una vez", "Una vez por vecino", "Tantas como aristas tenga"], a: 1, why: "Cuando sale con su distancia mínima queda fijado; las demás entradas suyas se ignoran." }
  ] },

{ id: "padres", titulo: "Padres y entradas viejas", min: 6,
  objetivos: ["Reconstruir un camino con el diccionario de padres", "Entender por qué hay entradas repetidas en el heap", "Conocer la complejidad de Dijkstra"],
  bloques: [
    { h: "Reconstruir el camino" },
    { p: "Dijkstra calcula distancias, pero normalmente queremos el <b>camino</b>. Para eso cada vez que se mejora un nodo se guarda su <b>padre</b>: el nodo desde el que se llegó." },
    { code: "def reconstruir(padre, meta):\n    camino = []\n    nodo = meta\n    while nodo is not None:\n        camino.append(nodo)\n        nodo = padre[nodo]\n    return camino[::-1]    # se voltea: de origen a meta" },
    { p: "Se camina hacia atrás desde la meta hasta llegar al origen (cuyo padre es <code>None</code>) y se voltea la lista." },
    { h: "Entradas viejas" },
    { key: "<code>heapq</code> no permite cambiar la prioridad de un elemento que ya está adentro. Cuando un nodo mejora, se mete <b>otra</b> entrada con la nueva distancia. La vieja se queda, y cuando sale se detecta y se ignora con <code>if d &gt; dist[actual]: continue</code>. A esto se le llama <i>lazy deletion</i>." },
    { p: "Si al terminar <code>dist[meta]</code> sigue siendo infinito, no hay ningún camino del origen a la meta." },
    { h: "Complejidad" },
    { table: { head: ["Implementación", "Complejidad"], rows: [["Con heap binario (heapq)", "O((V + E) log V)"], ["Con arreglo y búsqueda lineal", "O(V²)"]] } }
  ],
  resumen: ["padre[v] = de dónde llegué a v", "Reconstruir: de la meta hacia atrás y voltear", "Entradas viejas: se ignoran al salir", "dist = ∞ al final → no hay camino"],
  preguntas: [
    { q: "Con este diccionario de padres, ¿cuál es el camino a D?", code: "padre = {'A': None, 'B': 'C', 'C': 'A', 'D': 'B'}", o: ["A → B → D", "A → C → B → D", "D → B → C → A", "A → C → D"], a: 1, why: "D viene de B, B viene de C, C viene de A. Volteado: A → C → B → D." },
    { q: "En el ejemplo de Dijkstra, B mejora de 4 a 3 y la entrada (4, 'B') se queda en el heap. ¿Qué pasa cuando sale?", o: ["Se vuelve a procesar B", "Se ignora porque 4 > dist[B] = 3", "Se produce un error", "Se actualiza dist[B] a 4"], a: 1, why: "La condición if d > dist[actual]: continue descarta entradas que ya no son la mejor distancia." },
    { q: "Al terminar Dijkstra, dist[meta] sigue siendo infinito. ¿Qué significa?", o: ["El camino es muy largo", "Hay un peso negativo", "No existe camino del origen a la meta", "Hay un error en el código"], a: 2, why: "Nunca se encontró una arista que llevara a la meta, así que nunca se actualizó." },
    { q: "¿Cuál es la complejidad de Dijkstra con heap binario?", o: ["O(V + E)", "O((V + E) log V)", "O(V³)", "O(E²)"], a: 1, why: "Cada arista puede provocar un heappush, y cada push o pop cuesta O(log V)." },
    { q: "Con este diccionario de padres, ¿cuál es el camino a Y?", code: "padre = {'S': None, 'X': 'S', 'Y': 'X', 'Z': 'S'}", o: ["S → Z → Y", "S → X → Y", "Y → X → S", "S → Y"], a: 1, why: "Y viene de X y X viene de S. Volteado: S → X → Y." },
    { q: "¿Por qué <code>reconstruir</code> voltea la lista al final?", o: ["Para ordenarla alfabéticamente", "Porque se arma desde la meta hacia el origen", "Para quitar repetidos", "No es necesario voltearla"], a: 1, why: "Se siguen los padres hacia atrás, así que la lista queda de la meta al origen." },
    { q: "¿Qué valor tiene padre[origen]?", o: ["0", "El mismo origen", "None", "La meta"], a: 2, why: "El origen no viene de ningún nodo; None marca dónde detenerse al reconstruir." },
    { q: "<i>Lazy deletion</i> en Dijkstra significa…", o: ["Borrar nodos del grafo", "Dejar entradas viejas en el heap y descartarlas cuando salen", "No usar heap", "Borrar el diccionario de padres"], a: 1, why: "Es más fácil que buscar y modificar la entrada vieja dentro del heap." },
    { q: "En el ejemplo de la clase de Dijkstra, ¿cuántas entradas de B llegaron a estar en el heap?", o: ["1", "2", "3", "0"], a: 1, why: "(4, 'B') al procesar A y (3, 'B') al procesar C." },
    { q: "Al terminar, un nodo no aparece en el diccionario de padres. Eso significa que…", o: ["Es el origen", "Nunca fue alcanzado desde el origen", "Es la meta", "Tiene peso negativo"], a: 1, why: "Solo se guarda padre cuando se encuentra un camino hacia el nodo." },
    { q: "La versión de Dijkstra con arreglo, O(V²), conviene cuando…", o: ["El grafo tiene muy pocas aristas", "El grafo es muy denso (E cercano a V²)", "Hay pesos negativos", "Nunca conviene"], a: 1, why: "Si E ≈ V², O((V + E) log V) es peor que O(V²)." }
  ] }
]},

/* =====================================================================
   NIVEL 4 · BÚSQUEDA INFORMADA
   ===================================================================== */
{ id: "n4", titulo: "Búsqueda informada", dificultad: 4,
  desc: "Usar información extra sobre la meta para buscar más rápido: heurísticas y A*.",
  clases: [

{ id: "heuristica", titulo: "Heurísticas", min: 7,
  objetivos: ["Calcular distancia Manhattan y euclidiana", "Saber qué es una heurística admisible", "Relacionar h = 0 con Dijkstra"],
  bloques: [
    { h: "La idea" },
    { p: "Dijkstra explora en todas direcciones por igual, aunque la meta esté claramente hacia un lado. Una <b>heurística</b> h(n) es una <b>estimación</b> de cuánto falta para llegar desde n hasta la meta." },
    { h: "Heurísticas comunes" },
    { p: "Las más comunes cuando los nodos tienen coordenadas:" },
    { table: { head: ["Heurística", "Fórmula", "Cuándo usarla"], rows: [
      ["Manhattan", "|x₁ − x₂| + |y₁ − y₂|", "Cuadrícula, solo 4 direcciones"],
      ["Euclidiana", "√((x₁ − x₂)² + (y₁ − y₂)²)", "Movimiento libre, línea recta"],
      ["Cero", "h(n) = 0", "Sin información (equivale a Dijkstra)"] ] } },
    { h: "Admisibilidad" },
    { key: "Una heurística es <b>admisible</b> si <b>nunca sobreestima</b> el costo real que falta. La línea recta es admisible en un mapa: ningún camino por calles puede ser más corto que la línea recta." },
    { p: "Ejemplo: de (1, 1) a (4, 5). Manhattan = 3 + 4 = 7. Euclidiana = √(9 + 16) = 5." },
    { p: "Entre dos heurísticas admisibles, la que da valores más altos (más cercanos al costo real) guía mejor y hace que se exploren menos nodos." }
  ],
  resumen: ["h(n) estima lo que falta", "Manhattan: cuadrícula", "Euclidiana: línea recta", "Admisible: nunca sobreestima", "h = 0 → Dijkstra"],
  preguntas: [
    { q: "En una cuadrícula sin diagonales, ¿cuál es la distancia Manhattan de (1, 1) a (4, 5)?", o: ["5", "7", "12", "25"], a: 1, why: "|4 − 1| + |5 − 1| = 3 + 4 = 7." },
    { q: "¿Y la distancia euclidiana entre esos mismos puntos?", o: ["5", "7", "√7", "25"], a: 0, why: "√(3² + 4²) = √25 = 5." },
    { q: "Una heurística admisible es la que…", o: ["Siempre es exacta", "Nunca sobreestima el costo real que falta", "Siempre vale 0", "Es más grande que el costo real"], a: 1, why: "Puede quedarse corta, pero nunca prometer más de lo que realmente falta." },
    { q: "Si h(n) = 0 para todos los nodos, A* se comporta igual que…", o: ["BFS", "DFS", "Dijkstra", "Bellman-Ford"], a: 2, why: "f = g + 0 = g, que es exactamente la prioridad que usa Dijkstra." },
    { q: "¿Cuál es la distancia Manhattan de (0, 0) a (3, −2)?", o: ["1", "5", "√13", "6"], a: 1, why: "|3 − 0| + |−2 − 0| = 3 + 2 = 5." },
    { q: "¿Cuál es la distancia euclidiana de (0, 0) a (6, 8)?", o: ["14", "10", "48", "100"], a: 1, why: "√(36 + 64) = √100 = 10." },
    { q: "Cuadrícula con movimiento en 4 direcciones y costo 1 por paso. ¿Qué heurística es admisible y guía mejor?", o: ["Siempre 0", "Manhattan", "Manhattan × 2", "Número de nodos del grafo"], a: 1, why: "Manhattan es exactamente el mínimo de pasos sin obstáculos, nunca más. Multiplicarla por 2 sobreestima." },
    { q: "Desde n faltan realmente 10 unidades para llegar. ¿Cuál de estos valores de h(n) NO es admisible?", o: ["0", "7", "10", "12"], a: 3, why: "12 es mayor que el costo real: sobreestima." },
    { q: "h1 y h2 son admisibles y h2(n) ≥ h1(n) para todo n. ¿Cuál conviene usar en A*?", o: ["h1", "h2", "Da exactamente igual", "Ninguna"], a: 1, why: "h2 está más cerca del costo real, así que guía mejor y se exploran menos nodos." },
    { q: "¿Por qué la distancia en línea recta es admisible en un mapa de calles?", o: ["Porque es fácil de calcular", "Porque ningún camino por calles puede ser más corto que la línea recta", "Porque siempre es 0", "Porque las calles son rectas"], a: 1, why: "La línea recta es la distancia mínima posible entre dos puntos." }
  ] },

{ id: "astar", titulo: "A* · Dijkstra con brújula", min: 9,
  objetivos: ["Calcular f = g + h", "Elegir el siguiente nodo de la lista abierta", "Comparar A* con Dijkstra"],
  bloques: [
    { h: "La idea" },
    { p: "A* (A estrella) fue publicado en 1968 por Hart, Nilsson y Raphael. Es Dijkstra con una brújula: en lugar de ordenar por la distancia recorrida, ordena por" },
    { key: "<b>f(n) = g(n) + h(n)</b><br>g(n): costo real desde el origen hasta n · h(n): estimación de n a la meta · f(n): costo estimado total del camino que pasa por n" },
    { h: "Ejemplo resuelto" },
    { fig: { w: 360, h: 180, n: [[40,90,"S",null,"h=5"],[180,30,"A",null,"h=5"],[180,150,"B",null,"h=2"],[320,90,"G",null,"h=0"]], e: [[0,1,3],[0,2,4],[1,3,7],[2,3,3]] }, cap: "Origen S, meta G. Debajo de cada nodo, su heurística." },
    { table: { head: ["Paso", "Sale", "Lista abierta después (f = g + h)"], rows: [
      ["1", "S (f = 0 + 5)", "B: 4 + 2 = 6 · A: 3 + 5 = 8"],
      ["2", "B (f = 6)", "G: 7 + 0 = 7 · A: 8"],
      ["3", "G (f = 7)", "¡meta! Camino S → B → G, costo 7"] ] } },
    { p: "A* nunca exploró A: su f = 8 era peor que llegar a la meta con 7. Dijkstra sí lo habría explorado, porque g(A) = 3 es menor que g(G) = 7." },
    { h: "En código" },
    { code: "def a_estrella(grafo, inicio, meta, h):\n    g = {n: float('inf') for n in grafo}\n    g[inicio] = 0\n    padre = {inicio: None}\n    abierta = [(h(inicio), inicio)]\n    cerrada = set()\n    while abierta:\n        f, actual = heapq.heappop(abierta)\n        if actual in cerrada:\n            continue\n        if actual == meta:\n            return g[meta], padre\n        cerrada.add(actual)\n        for vecino, peso in grafo[actual]:\n            nueva_g = g[actual] + peso\n            if nueva_g < g[vecino]:\n                g[vecino] = nueva_g\n                padre[vecino] = actual\n                heapq.heappush(abierta, (nueva_g + h(vecino), vecino))\n    return float('inf'), padre" },
    { h: "A* contra Dijkstra" },
    { p: "Con una heurística admisible, A* encuentra el <b>mismo camino óptimo</b> que Dijkstra, pero normalmente explorando <b>muchos menos nodos</b>. Si h sobreestima, puede ir más rápido pero ya no garantiza el óptimo." },
    { try: "astar" }
  ],
  resumen: ["f = g + h", "Sale el de menor f", "Óptimo con h admisible", "Explora menos que Dijkstra"],
  preguntas: [
    { q: "Un nodo tiene g = 6 y h = 4. ¿Cuánto vale f?", o: ["2", "10", "24", "6"], a: 1, why: "f = g + h = 6 + 4 = 10." },
    { q: "La lista abierta tiene B (g = 2, h = 7), C (g = 5, h = 2) y D (g = 4, h = 6). ¿Cuál sale primero?", o: ["B", "C", "D", "Empate entre B y C"], a: 1, why: "f(B) = 9, f(C) = 7, f(D) = 10. Sale el menor: C." },
    { q: "Con una heurística admisible, comparado con Dijkstra, A*…", o: ["Encuentra un camino más caro pero más rápido", "Encuentra el mismo costo óptimo explorando normalmente menos nodos", "Siempre explora más nodos", "Solo funciona sin pesos"], a: 1, why: "La heurística lo orienta hacia la meta sin sacrificar el óptimo." },
    { q: "¿Qué puede pasar si la heurística sobreestima?", o: ["Nada, sigue siendo óptimo", "A* puede devolver un camino que no es el más barato", "A* se vuelve BFS", "El programa no termina"], a: 1, why: "Al sobreestimar, A* puede descartar el camino correcto creyendo que es peor de lo que es." },
    { q: "En el ejemplo de la clase, después de expandir S, ¿cuánto vale f(A)?", fig: { w: 360, h: 180, n: [[40,90,"S",null,"h=5"],[180,30,"A",null,"h=5"],[180,150,"B",null,"h=2"],[320,90,"G",null,"h=0"]], e: [[0,1,3],[0,2,4],[1,3,7],[2,3,3]] }, o: ["5", "6", "8", "10"], a: 2, why: "g(A) = 3 y h(A) = 5, así que f(A) = 8." },
    { q: "En A*, g(n) representa…", o: ["La estimación de lo que falta", "El costo real desde el origen hasta n", "El número de vecinos de n", "El costo total del grafo"], a: 1, why: "g es lo que ya se gastó; h es lo que se estima que falta." },
    { q: "En ese ejemplo, ¿por qué A* nunca exploró el nodo A?", o: ["Porque A no tiene vecinos", "Porque su f = 8 era mayor que el costo 7 con el que se alcanzó la meta", "Porque A estaba en la lista cerrada", "Por error del algoritmo"], a: 1, why: "La meta salió con f = 7 antes de que tocara el turno de A." },
    { q: "La lista cerrada de A* contiene…", o: ["Los nodos que faltan por descubrir", "Los nodos ya explorados", "Solo la meta", "Los nodos con h = 0"], a: 1, why: "Son los nodos que ya salieron de la lista abierta y se expandieron." },
    { q: "Con una heurística admisible, ¿cuánto vale h(meta)?", o: ["0", "1", "Infinito", "Depende del grafo"], a: 0, why: "Desde la meta falta 0, y una heurística admisible no puede dar más que eso." },
    { q: "Usas h = (línea recta) × 3, que sobreestima. ¿Qué esperas de A*?", o: ["Que sea más lento y óptimo", "Que suela explorar menos nodos pero pueda no dar el camino óptimo", "Que deje de funcionar", "Que se comporte como BFS"], a: 1, why: "Inflar h lo hace más ambicioso hacia la meta, a costa de perder la garantía de óptimo." }
  ] },

{ id: "elegir", titulo: "¿Qué algoritmo uso?", min: 6,
  objetivos: ["Elegir el algoritmo correcto según el problema", "Conocer alternativas para casos especiales", "Saber qué usan las apps de rutas reales"],
  bloques: [
    { h: "Guía de decisión" },
    { p: "Ya conoces cuatro algoritmos. En un problema real la pregunta es cuál usar." },
    { table: { head: ["Situación", "Algoritmo"], rows: [
      ["Todas las aristas cuestan lo mismo, quiero menos pasos", "BFS"],
      ["Detectar ciclos, orden topológico, explorar todo", "DFS"],
      ["Pesos ≥ 0, sin información de la meta", "Dijkstra"],
      ["Pesos ≥ 0 y tengo coordenadas o una buena estimación", "A*"],
      ["Hay pesos negativos", "Bellman-Ford, O(V · E)"],
      ["Necesito la distancia entre todos los pares", "Floyd-Warshall, O(V³)"] ] } },
    { h: "En el mundo real" },
    { key: "Las apps de mapas parten de Dijkstra y A*, pero con millones de cruces eso sería lento. Por eso <b>preprocesan</b> el mapa (por ejemplo con <i>jerarquías de contracción</i>) para responder rutas en milisegundos, y usan el <b>tiempo</b> con tráfico como peso." },
    { p: "Para practicar, abre la comparativa del visualizador: corre los cuatro sobre el mismo mapa y fíjate cuántos nodos explora cada uno." },
    { try: "astar" }
  ],
  resumen: ["Sin pesos → BFS", "Estructura del grafo → DFS", "Pesos ≥ 0 → Dijkstra", "Pesos + coordenadas → A*", "Pesos negativos → Bellman-Ford"],
  preguntas: [
    { q: "Un laberinto donde cada paso cuesta lo mismo. Quieres la salida con menos pasos.", o: ["BFS", "DFS", "Bellman-Ford", "Floyd-Warshall"], a: 0, why: "Si todas las aristas pesan igual, el camino con menos aristas es el más barato, y eso garantiza BFS." },
    { q: "Un GPS con kilómetros entre cruces y las coordenadas de cada cruce.", o: ["BFS", "DFS", "A*", "Bellman-Ford"], a: 2, why: "Hay pesos no negativos y coordenadas para una heurística de línea recta." },
    { q: "Un grafo de transacciones con algunos pesos negativos (reembolsos).", o: ["Dijkstra", "A*", "Bellman-Ford", "BFS"], a: 2, why: "Dijkstra y A* no son confiables con pesos negativos; Bellman-Ford sí los maneja." },
    { q: "Quieres saber si un conjunto de tareas tiene dependencias circulares.", o: ["DFS", "Dijkstra", "A*", "BFS con pesos"], a: 0, why: "Detectar ciclos en un grafo dirigido es una aplicación clásica de DFS." },
    { q: "Quieres los grados de separación entre dos usuarios de una red social.", o: ["BFS", "Dijkstra", "A*", "Bellman-Ford"], a: 0, why: "Cada amistad vale 1, así que lo que importa es el número mínimo de aristas." },
    { q: "Necesitas una tabla con la distancia entre TODAS las parejas de 200 ciudades.", o: ["BFS", "Floyd-Warshall", "DFS", "A*"], a: 1, why: "Floyd-Warshall calcula todas las parejas en O(V³), práctico para pocos cientos de nodos." },
    { q: "Un robot conoce su posición y la del objetivo en un mapa con obstáculos.", o: ["DFS", "A*", "BFS sin pesos", "Floyd-Warshall"], a: 1, why: "Hay coordenadas para una heurística admisible, el escenario ideal de A*." },
    { q: "Ruta más barata en una red de vuelos con precios ≥ 0 y sin coordenadas útiles.", o: ["Dijkstra", "DFS", "BFS", "A* con h exagerada"], a: 0, why: "Pesos no negativos y sin una buena heurística: Dijkstra." },
    { q: "Quieres generar un laberinto aleatorio recorriendo celdas.", o: ["DFS", "Dijkstra", "A*", "Floyd-Warshall"], a: 0, why: "El DFS aleatorio crea pasillos largos y es la técnica clásica para generar laberintos." },
    { q: "¿Cuál es la complejidad de Bellman-Ford?", o: ["O(V + E)", "O(V · E)", "O(log V)", "O(V)"], a: 1, why: "Relaja todas las aristas V − 1 veces." },
    { q: "¿Por qué las apps de mapas no corren Dijkstra puro sobre todo el mapa en cada consulta?", o: ["Porque Dijkstra no funciona con calles", "Porque sería demasiado lento con millones de cruces, así que preprocesan el mapa", "Porque usan DFS", "Porque no tienen los pesos"], a: 1, why: "Técnicas como las jerarquías de contracción preparan el mapa para responder en milisegundos." }
  ] }
]}
],

/* ---------- evaluación ---------- */
porIntento: 5,      // preguntas al azar por intento en cada clase
minimoClase: 4,     // aciertos necesarios para aprobar una clase

/* ---------- reto final y reconocimiento ---------- */
reto: { titulo: "Reto final", preguntas: 15, minimo: 12,
  desc: "15 preguntas al azar de todo el curso. Necesitas 12 correctas para obtener tu reconocimiento." },
reconocimiento: { titulo: "Aprendizaje básico de grafos",
  texto: "por completar la ruta de 12 clases en 4 niveles (Fundamentos, Recorridos, Caminos con peso y Búsqueda informada) y aprobar el reto final de HowttaGraph." }
};
