# Manual de usuario · HowttaGraph

Equipo LEARN&TUDY

## 1. Abrir la página

Abre `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox o Safari). No se necesita instalar nada.

## 2. Portada

En la portada encontrarás:

- **Entrar al visualizador**: abre la herramienta principal.
- **Tarjetas de algoritmos**: cada una abre el visualizador con ese algoritmo ya seleccionado.
- **Cómo se usa** y **Equipo**.

## 3. El visualizador

### 3.1 Elegir algoritmo

Arriba hay cuatro botones: **BFS, DFS, Dijkstra y A\***. Al cambiar de algoritmo, la ejecución empieza desde el paso 1.

### 3.2 El mapa

- Los círculos son los nodos (cruces) y las líneas son las aristas (calles).
- El número en cada calle es su **peso** (costo). En BFS y DFS los pesos se ven tenues porque esos algoritmos no los usan.
- El nodo con aro azul es el **origen** y el de aro morado punteado es el **destino**.
- Debajo de cada nodo aparece su valor: nivel (BFS), orden de visita (DFS), distancia `d` (Dijkstra) o `f`/`h` (A\*).

**Cambiar origen o destino:** elige *Origen* o *Destino* en el selector "Clic en un nodo fija" y da clic en el nodo.

**Nuevo grafo:** genera otro mapa con conexiones y pesos distintos.

### 3.3 Colores

| Color | Significado |
|---|---|
| Blanco | Sin descubrir |
| Ámbar | En la frontera (esperando turno) |
| Rojo | Nodo actual |
| Verde azulado | Explorado |
| Magenta | Camino final |

La calle que se está revisando se pinta de rojo y las calles por las que se descubrió cada nodo, de gris oscuro.

### 3.4 Controles

| Botón | Tecla | Acción |
|---|---|---|
| ⏮ | `Inicio` | Ir al primer paso |
| ◀ Paso | `←` | Paso anterior |
| ▶ Reproducir | `espacio` | Reproducir o pausar |
| Paso ▶ | `→` | Paso siguiente |
| ⏭ | `Fin` | Ir al resultado |
| Velocidad | | Ajusta qué tan rápido avanza la reproducción |
| Barra de pasos | | Arrastra para saltar a cualquier paso |

### 3.5 Qué está pasando

Debajo de los controles se describe en palabras el paso actual, junto con el número de nodos explorados, los que están en la frontera y, al final, el costo del camino.

### 3.6 Código en Python

- La línea que se ejecuta se resalta con una barra ámbar.
- Debajo aparece la explicación de esa línea.
- Da clic en cualquier línea para fijar su explicación; vuelve a dar clic para soltarla.

### 3.7 Estructura de datos

Muestra el contenido de la cola, pila o cola de prioridad. El elemento con borde es el que **sale primero**. En Dijkstra y A\* las entradas tachadas son viejas y se van a ignorar.

### 3.8 Tabla de nodos

Para cada nodo muestra su valor, su padre y su estado. La fila resaltada en ámbar es la que cambió en este paso.

### 3.9 Bitácora

Lista de todos los pasos anteriores, para repasar lo que ha hecho el algoritmo.

### 3.10 Comparativa

Ejecuta los cuatro algoritmos sobre el mapa actual y muestra cuántos nodos exploró cada uno, el costo y el número de aristas del camino, y si es óptimo. Se actualiza al cambiar el origen, el destino o el grafo.

### 3.11 Teoría y glosario

Al final de la página hay un resumen de cada algoritmo (idea, estructura, complejidad, usos) y un glosario de conceptos.

## 4. Actividades sugeridas para estudiar

1. Corre BFS y Dijkstra con el mismo origen y destino. ¿Por qué BFS a veces elige un camino más caro?
2. Compara cuántos nodos explora Dijkstra contra A\*. Pon el destino cerca del origen y luego lejos. ¿Cuándo ahorra más A\*?
3. En Dijkstra, busca un paso donde una entrada de la cola aparezca tachada y explica por qué.
4. Corre DFS en tres grafos nuevos. ¿El camino que encuentra es siempre el mismo tipo de camino?
5. Antes de avanzar, predice qué nodo va a salir de la cola. Luego verifica.

## 5. Problemas comunes

| Problema | Solución |
|---|---|
| Las letras se ven con otra fuente | Sin internet no cargan las fuentes de Google; la página funciona igual |
| No pasa nada al presionar las flechas | Da clic en una zona vacía de la página para quitar el foco de la barra de velocidad |
| Quiero empezar de nuevo | Presiona ⏮ o cambia de algoritmo |
