# Algoritmos de búsqueda en grafos

Material de estudio de HowttaGraph · Equipo LEARN&TUDY

## Conceptos básicos

- **Grafo:** conjunto de nodos (vértices) unidos por aristas. En un mapa, los cruces son nodos y las calles son aristas.
- **Peso:** costo de recorrer una arista (distancia, tiempo, dinero).
- **Frontera:** nodos descubiertos que aún no se exploran.
- **Padre:** nodo desde el que llegamos a otro. Siguiendo los padres desde la meta hacia atrás se obtiene el camino.
- **Relajar una arista:** revisar si pasar por el nodo actual mejora la distancia conocida al vecino.
- **Heurística h(n):** estimación del costo que falta para llegar a la meta.
- **Admisible:** heurística que nunca sobreestima el costo real restante.

Notación: **V** = número de nodos, **E** = número de aristas.

---

## 1. BFS · Búsqueda en anchura

**Idea.** Explora por capas: primero todos los nodos a 1 arista del origen, luego los que están a 2, y así sucesivamente. No toma en cuenta los pesos.

**Estructura de datos.** Cola FIFO: el primero en entrar es el primero en salir.

```python
from collections import deque

def bfs(grafo, inicio, meta):
    cola = deque([inicio])
    visitado = {inicio}
    padre = {inicio: None}
    while cola:
        actual = cola.popleft()
        if actual == meta:
            return reconstruir(padre, meta)
        for vecino in grafo[actual]:
            if vecino not in visitado:
                visitado.add(vecino)
                padre[vecino] = actual
                cola.append(vecino)
    return None
```

**Detalle importante.** El nodo se marca como visitado al **meterlo** a la cola, no al sacarlo. Así nunca se encola dos veces.

| Complejidad | Óptimo |
|---|---|
| Tiempo O(V + E), memoria O(V) | Sí en número de aristas; no en costo si los pesos son distintos |

**Usos.** Grados de separación en redes sociales, laberintos donde cada paso cuesta lo mismo, número mínimo de saltos en una red.

---

## 2. DFS · Búsqueda en profundidad

**Idea.** Avanza lo más hondo posible por una rama y solo regresa cuando ya no puede seguir.

**Estructura de datos.** Pila LIFO: el último en entrar es el primero en salir (o la pila de llamadas si se hace recursivo).

```python
def dfs(grafo, inicio, meta):
    pila = [inicio]
    visitado = set()
    padre = {inicio: None}
    while pila:
        actual = pila.pop()
        if actual in visitado: continue
        visitado.add(actual)
        if actual == meta:
            return reconstruir(padre, meta)
        for vecino in reversed(grafo[actual]):
            if vecino not in visitado:
                padre[vecino] = actual
                pila.append(vecino)
    return None
```

**Detalle importante.** Aquí se marca al **sacar** de la pila, porque un nodo puede apilarse más de una vez. `reversed` hace que los vecinos se visiten en orden alfabético.

| Complejidad | Óptimo |
|---|---|
| Tiempo O(V + E), memoria O(V) | No. El camino depende del orden de los vecinos |

**Usos.** Detección de ciclos, orden topológico, componentes conectadas, generar y resolver laberintos.

---

## 3. Dijkstra

Propuesto por Edsger W. Dijkstra en 1956.

**Idea.** Siempre expande el nodo con la menor distancia acumulada desde el origen. Como no hay pesos negativos, cuando un nodo sale de la cola su distancia ya es definitiva.

**Estructura de datos.** Cola de prioridad (min-heap) ordenada por distancia.

**Relajación:**

```
si dist[u] + peso(u, v) < dist[v]:
    dist[v] = dist[u] + peso(u, v)
    padre[v] = u
```

```python
import heapq

def dijkstra(grafo, inicio, meta):
    dist = {n: float('inf') for n in grafo}
    dist[inicio] = 0
    padre = {inicio: None}
    pq = [(0, inicio)]
    while pq:
        d, actual = heapq.heappop(pq)
        if d > dist[actual]: continue
        if actual == meta:
            return reconstruir(padre, meta)
        for vecino, peso in grafo[actual]:
            nueva = d + peso
            if nueva < dist[vecino]:
                dist[vecino] = nueva
                padre[vecino] = actual
                heapq.heappush(pq, (nueva, vecino))
    return None
```

**Detalle importante.** `heapq` no permite cambiar la prioridad de un elemento, así que se mete una entrada nueva y la vieja se descarta con `if d > dist[actual]: continue`. En el visualizador esas entradas aparecen tachadas.

| Complejidad | Óptimo |
|---|---|
| O((V + E) log V) con heap binario | Sí, con pesos no negativos |

**Usos.** Base de los navegadores GPS, protocolos de ruteo como OSPF, redes de transporte.

---

## 4. A\* (A estrella)

Propuesto por Hart, Nilsson y Raphael en 1968.

**Idea.** Es Dijkstra con una brújula. Además del costo real recorrido `g(n)`, suma una estimación de lo que falta `h(n)`, y expande primero el nodo con menor:

```
f(n) = g(n) + h(n)
```

**Estructura de datos.** Lista abierta (min-heap por `f`) y lista cerrada (conjunto de explorados).

```python
import heapq

def a_estrella(grafo, inicio, meta, h):
    g = {n: float('inf') for n in grafo}
    g[inicio] = 0
    padre = {inicio: None}
    abierta = [(h(inicio, meta), inicio)]
    cerrada = set()
    while abierta:
        f, actual = heapq.heappop(abierta)
        if actual in cerrada: continue
        if actual == meta:
            return reconstruir(padre, meta)
        cerrada.add(actual)
        for vecino, peso in grafo[actual]:
            nueva_g = g[actual] + peso
            if nueva_g < g[vecino]:
                g[vecino] = nueva_g
                padre[vecino] = actual
                f = nueva_g + h(vecino, meta)
                heapq.heappush(abierta, (f, vecino))
    return None
```

**Heurística usada en HowttaGraph.** La distancia en línea recta hasta la meta, escalada igual que los pesos. Es admisible porque ningún camino puede ser más corto que la línea recta.

- Si `h(n) = 0` para todos los nodos, A\* se comporta exactamente como Dijkstra.
- Si `h` sobreestima, A\* puede ir más rápido pero ya no garantiza el óptimo.

| Complejidad | Óptimo |
|---|---|
| O((V + E) log V) en el peor caso; en la práctica explora mucho menos | Sí, si `h` es admisible |

**Usos.** Pathfinding en videojuegos, robótica, mapas donde se conocen las coordenadas.

---

## Reconstrucción del camino

Los cuatro algoritmos usan la misma función:

```python
def reconstruir(padre, meta):
    camino = []
    nodo = meta
    while nodo is not None:
        camino.append(nodo)
        nodo = padre[nodo]
    return camino[::-1]
```

## Comparación

| | BFS | DFS | Dijkstra | A\* |
|---|---|---|---|---|
| Estructura | Cola | Pila | Cola de prioridad | Cola de prioridad |
| Usa pesos | No | No | Sí | Sí |
| Usa heurística | No | No | No | Sí |
| Camino óptimo | En aristas | No | Sí | Sí (h admisible) |
| Tiempo | O(V + E) | O(V + E) | O((V + E) log V) | O((V + E) log V) |

### Resultado en el mapa inicial de HowttaGraph (origen A, destino O)

| Algoritmo | Nodos explorados | Costo | Aristas | Óptimo |
|---|---|---|---|---|
| BFS | 15 | 25 | 5 | No |
| DFS | 14 | 61 | 12 | No |
| Dijkstra | 15 | 24 | 5 | Sí |
| A\* | 10 | 24 | 5 | Sí |

**Conclusiones.**
- BFS encontró un camino con el mínimo de aristas, pero no el más barato, porque ignora los pesos.
- DFS encontró un camino válido pero muy caro: profundiza sin buscar el mejor.
- Dijkstra y A\* llegaron al mismo costo óptimo, pero A\* exploró un tercio menos de nodos gracias a la heurística.

## Referencias

- Cormen, T. H., Leiserson, C. E., Rivest, R. L. y Stein, C. *Introduction to Algorithms*, 4.ª ed. MIT Press, 2022. Capítulos 20 y 22.
- Dijkstra, E. W. "A note on two problems in connexion with graphs". *Numerische Mathematik*, 1, 269–271, 1959.
- Hart, P. E., Nilsson, N. J. y Raphael, B. "A Formal Basis for the Heuristic Determination of Minimum Cost Paths". *IEEE Transactions on Systems Science and Cybernetics*, 4(2), 100–107, 1968.
- Russell, S. y Norvig, P. *Artificial Intelligence: A Modern Approach*, 4.ª ed. Pearson, 2020. Capítulo 3.
