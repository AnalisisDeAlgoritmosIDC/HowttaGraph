/* HowttaGraph · equipo LEARN&TUDY
 * Código en Python de cada algoritmo con su explicación línea por línea,
 * y los generadores que graban cada paso de BFS, DFS, Dijkstra y A*.
 */
"use strict";
/* ---------- código + explicaciones ---------- */
const CODE = {
bfs: { fn:"bfs()", title:"BFS · Búsqueda en anchura", ds:"Cola (FIFO)", col:"nivel", lines:[
 ["", "from collections import deque", "Importamos <code>deque</code>, una cola doble eficiente: sacar del frente con <code>popleft()</code> cuesta O(1), mientras que <code>list.pop(0)</code> cuesta O(n)."],
 ["", "", ""],
 ["", "def bfs(grafo, inicio, meta):", "Recibe el grafo como lista de adyacencia (cada nodo con su lista de vecinos), el nodo de origen y el de destino."],
 ["init", "    cola = deque([inicio])", "La frontera arranca solo con el origen. BFS siempre atiende primero al que llegó antes: primero en entrar, primero en salir."],
 ["init", "    visitado = {inicio}", "Conjunto de nodos ya descubiertos. Se marca al <b>meter</b> a la cola, no al sacar, para no encolar el mismo nodo dos veces."],
 ["init", "    padre = {inicio: None}", "Diccionario que guarda de dónde vino cada nodo. El origen no tiene padre."],
 ["loop", "    while cola:", "Mientras quede alguien en la frontera, seguimos explorando. Si se vacía sin encontrar la meta, no hay camino."],
 ["pop", "        actual = cola.popleft()", "Sacamos el nodo más antiguo de la cola. Por eso BFS avanza en capas: primero todos los nodos a 1 arista, luego los de 2, etc."],
 ["check", "        if actual == meta:", "¿Llegamos? Como exploramos por capas, la primera vez que sacamos la meta es por el camino con <b>menos aristas</b>."],
 ["found", "            return reconstruir(padre, meta)", "Seguimos los padres desde la meta hasta el origen y volteamos la lista para obtener el camino."],
 ["for", "        for vecino in grafo[actual]:", "Revisamos cada vecino del nodo actual. BFS ignora los pesos: solo le importa si hay conexión."],
 ["if", "            if vecino not in visitado:", "Si ya lo habíamos descubierto, lo saltamos. Esto evita ciclos infinitos y trabajo repetido."],
 ["push", "                visitado.add(vecino)", "Lo marcamos como descubierto."],
 ["push", "                padre[vecino] = actual", "Anotamos que llegamos a él desde el nodo actual."],
 ["push", "                cola.append(vecino)", "Lo formamos al final de la cola; se explorará cuando le toque."],
 ["none", "    return None", "La cola se vació y nunca vimos la meta: el destino no es alcanzable desde el origen."],
]},
dfs: { fn:"dfs()", title:"DFS · Búsqueda en profundidad", ds:"Pila (LIFO)", col:"orden", lines:[
 ["", "def dfs(grafo, inicio, meta):", "DFS se mete lo más hondo posible por un camino antes de regresar. Esta es la versión iterativa con una pila explícita."],
 ["init", "    pila = [inicio]", "Usamos una lista de Python como pila: <code>append</code> mete arriba y <code>pop()</code> saca de arriba. Último en entrar, primero en salir."],
 ["init", "    visitado = set()", "Aquí se marca un nodo al <b>sacarlo</b> de la pila, porque un nodo puede quedar apilado varias veces."],
 ["init", "    padre = {inicio: None}", "De dónde vino cada nodo, para reconstruir el camino al final."],
 ["loop", "    while pila:", "Seguimos mientras haya nodos pendientes en la pila."],
 ["pop", "        actual = pila.pop()", "Sacamos el que está hasta arriba: el último que metimos. Esto hace que DFS siga profundizando por la rama más reciente."],
 ["skip", "        if actual in visitado: continue", "Si ya lo exploramos por otra rama, lo descartamos y pasamos al siguiente."],
 ["mark", "        visitado.add(actual)", "Ahora sí lo marcamos como explorado."],
 ["check", "        if actual == meta:", "¿Es la meta? DFS se detiene en cuanto la encuentra, pero ese camino <b>no</b> tiene por qué ser el más corto."],
 ["found", "            return reconstruir(padre, meta)", "Reconstruimos el camino siguiendo los padres."],
 ["for", "        for vecino in reversed(grafo[actual]):", "Recorremos los vecinos al revés para que, al apilarlos, el primero en orden alfabético quede arriba y se visite primero."],
 ["if", "            if vecino not in visitado:", "Solo apilamos vecinos que no hemos explorado."],
 ["push", "                padre[vecino] = actual", "Anotamos el padre. Si el vecino se vuelve a apilar después, el padre se sobrescribe con el más reciente, que es justo el que se sacará primero."],
 ["push", "                pila.append(vecino)", "Lo ponemos arriba de la pila."],
 ["none", "    return None", "Se vació la pila sin encontrar la meta: no hay camino."],
]},
dijkstra: { fn:"dijkstra()", title:"Dijkstra · Camino más barato", ds:"Cola de prioridad (min-heap)", col:"dist", lines:[
 ["", "import heapq", "<code>heapq</code> implementa un min-heap: siempre deja el elemento más pequeño al frente. Sacarlo o meter uno cuesta O(log n)."],
 ["", "", ""],
 ["", "def dijkstra(grafo, inicio, meta):", "Encuentra el camino de menor costo total cuando todos los pesos son ≥ 0. Cada vecino viene como par (vecino, peso)."],
 ["init", "    dist = {n: float('inf') for n in grafo}", "Al inicio no conocemos ninguna distancia, así que todas valen infinito."],
 ["init", "    dist[inicio] = 0", "Llegar al origen desde el origen cuesta 0."],
 ["init", "    padre = {inicio: None}", "Guardaremos de dónde viene el mejor camino conocido a cada nodo."],
 ["push0", "    pq = [(0, inicio)]", "La cola de prioridad guarda tuplas (distancia, nodo). Python compara primero la distancia, así que el más cercano sale primero."],
 ["loop", "    while pq:", "Mientras haya candidatos en la cola, seguimos."],
 ["pop", "        d, actual = heapq.heappop(pq)", "Sacamos el nodo con la menor distancia acumulada. Idea clave: como no hay pesos negativos, ya nadie podrá llegar a él más barato."],
 ["stale", "        if d > dist[actual]: continue", "Puede haber entradas viejas en la cola (de antes de que mejoráramos la distancia). Si esta no coincide con la mejor conocida, la ignoramos."],
 ["check", "        if actual == meta:", "Si el nodo que sacamos es la meta, su distancia ya es definitiva y mínima."],
 ["found", "            return reconstruir(padre, meta)", "Reconstruimos el camino con los padres."],
 ["for", "        for vecino, peso in grafo[actual]:", "Revisamos cada calle que sale del nodo actual, con su peso."],
 ["calc", "            nueva = d + peso", "Costo de llegar al vecino pasando por el nodo actual."],
 ["cmp", "            if nueva < dist[vecino]:", "<b>Relajación:</b> ¿este camino es mejor que el mejor que conocíamos? Si no, no hacemos nada."],
 ["push", "                dist[vecino] = nueva", "Encontramos un camino más barato: actualizamos la distancia."],
 ["push", "                padre[vecino] = actual", "Y recordamos que ese camino pasa por el nodo actual."],
 ["push", "                heapq.heappush(pq, (nueva, vecino))", "Metemos al vecino a la cola con su nueva prioridad. La entrada vieja, si existía, se queda pero será ignorada después."],
 ["none", "    return None", "La cola se vació sin llegar a la meta: no es alcanzable."],
]},
astar: { fn:"a_estrella()", title:"A* · Dijkstra con brújula", ds:"Lista abierta (min-heap por f)", col:"g", lines:[
 ["", "import heapq", "Igual que Dijkstra, usamos un min-heap, pero ordenado por <code>f</code> en lugar de por distancia."],
 ["", "", ""],
 ["", "def a_estrella(grafo, inicio, meta, h):", "<code>h(n, meta)</code> es la heurística: una estimación de cuánto falta. Aquí es la distancia en línea recta, que nunca sobreestima."],
 ["init", "    g = {n: float('inf') for n in grafo}", "<code>g[n]</code> es el costo real conocido desde el origen hasta n. Empieza en infinito."],
 ["init", "    g[inicio] = 0", "El origen cuesta 0."],
 ["init", "    padre = {inicio: None}", "Padres para reconstruir el camino."],
 ["push0", "    abierta = [(h(inicio, meta), inicio)]", "La lista abierta es la frontera. Su prioridad es <code>f = g + h</code>; para el origen f = 0 + h(origen)."],
 ["init", "    cerrada = set()", "Nodos ya explorados de forma definitiva."],
 ["loop", "    while abierta:", "Mientras haya candidatos, seguimos."],
 ["pop", "        f, actual = heapq.heappop(abierta)", "Sacamos el nodo con menor <code>f</code>: el que parece estar en el camino más prometedor, sumando lo que ya cuesta y lo que se estima que falta."],
 ["stale", "        if actual in cerrada: continue", "Si ya fue explorado, esta entrada es repetida y la descartamos."],
 ["check", "        if actual == meta:", "Con una heurística admisible, la primera vez que sacamos la meta el camino es óptimo."],
 ["found", "            return reconstruir(padre, meta)", "Reconstruimos el camino."],
 ["close", "        cerrada.add(actual)", "Marcamos el nodo como explorado."],
 ["for", "        for vecino, peso in grafo[actual]:", "Revisamos cada vecino."],
 ["calc", "            nueva_g = g[actual] + peso", "Costo real de llegar al vecino pasando por aquí."],
 ["cmp", "            if nueva_g < g[vecino]:", "¿Mejora lo que conocíamos? Es la misma relajación que en Dijkstra."],
 ["push", "                g[vecino] = nueva_g", "Actualizamos el costo real."],
 ["push", "                padre[vecino] = actual", "Guardamos el padre."],
 ["push", "                f = nueva_g + h(vecino, meta)", "Calculamos la prioridad: costo real + estimación restante. Esta suma es lo que hace que A* \"apunte\" hacia la meta."],
 ["push", "                heapq.heappush(abierta, (f, vecino))", "Lo metemos a la lista abierta."],
 ["none", "    return None", "No hay camino."],
]}
};
const ALGOS = [
  {id:"bfs", name:"BFS", sub:"anchura"},
  {id:"dfs", name:"DFS", sub:"profundidad"},
  {id:"dijkstra", name:"Dijkstra", sub:"costo mínimo"},
  {id:"astar", name:"A*", sub:"heurística"},
];

/* ---------- generadores de pasos ---------- */
function pathFrom(padre, goal){ const p=[]; let n=goal; while(n!==null && n!==undefined){ p.push(n); n=padre[n]; } return p.reverse(); }
function pathCost(p){ let c=0; for(let i=1;i<p.length;i++) c+=G.edges[edgeIndex(p[i-1],p[i])].w; return c; }

function run(algo, s, goal){
  const N = G.nodes.length, steps = [];
  const val = Array(N).fill(Infinity), padre = {}; padre[s]=null;
  const closed = new Set(), seen = new Set([s]);
  let frontier = [], cur = null, path = null, changed = null, order = 0;
  const H = algo==="astar" ? G.nodes.map((_,i)=>hOf(i,goal)) : null;
  const snap = (key, msg, edge=null) => {
    steps.push({key, msg, cur, edge, changed,
      frontier: frontier.map(x=>({...x})), closed:[...closed], seen:[...seen],
      val: val.slice(), padre: {...padre}, path: path ? path.slice() : null});
    changed = null;
  };
  const finish = () => {
    path = pathFrom(padre, goal);
    const c = pathCost(path);
    const txt = path.map(L).join(" → ");
    let extra = "";
    if(algo==="bfs") extra = ` Tiene ${path.length-1} aristas, el mínimo posible; con pesos su costo real es ${c}.`;
    else if(algo==="dfs") extra = ` Costo ${c} con ${path.length-1} aristas. DFS no busca el más corto, solo uno que funcione.`;
    else extra = ` Costo total ${c}: es el camino más barato.`;
    cur = goal;
    snap("found", `¡Meta encontrada! Camino: ${txt}.${extra}`);
    return {steps, path, cost:c, explored: closed.size};
  };

  if(algo==="bfs"){
    val[s]=0; frontier=[{n:s,k:null}];
    snap("init", `Empezamos en ${L(s)}: entra a la cola, se marca como visitado y no tiene padre.`);
    while(frontier.length){
      const it = frontier.shift(); cur = it.n; closed.add(cur);
      snap("pop", `Sacamos ${L(cur)} del frente de la cola (nivel ${val[cur]}). Es el que llevaba más tiempo esperando.`);
      if(cur===goal) return finish();
      for(const nb of G.adj[cur]){
        const ei = nb.e;
        if(!seen.has(nb.to)){
          seen.add(nb.to); padre[nb.to]=cur; val[nb.to]=val[cur]+1; frontier.push({n:nb.to,k:null}); changed=nb.to;
          snap("push", `${L(nb.to)} es nuevo: lo marcamos como visitado, su padre es ${L(cur)} y se forma al final de la cola (nivel ${val[nb.to]}).`, ei);
        } else {
          snap("if", `${L(nb.to)} ya había sido visitado; lo ignoramos.`, ei);
        }
      }
    }
    cur=null; snap("none","La cola se vació: no hay camino."); return {steps,path:null,cost:null,explored:closed.size};
  }

  if(algo==="dfs"){
    frontier=[{n:s,k:null}];
    snap("init", `Ponemos ${L(s)} en la pila. Nada está explorado todavía.`);
    while(frontier.length){
      const it = frontier.pop(); cur = it.n;
      snap("pop", `Sacamos ${L(cur)} de arriba de la pila: el último que entró.`);
      if(closed.has(cur)){ snap("skip", `${L(cur)} ya estaba explorado; lo descartamos.`); continue; }
      closed.add(cur); seen.add(cur); val[cur]=++order; changed=cur;
      snap("mark", `Marcamos ${L(cur)} como explorado (es el #${order} en visitarse).`);
      if(cur===goal) return finish();
      const nbs = G.adj[cur].slice().reverse();
      for(const nb of nbs){
        if(!closed.has(nb.to)){
          padre[nb.to]=cur; seen.add(nb.to); frontier.push({n:nb.to,k:null});
          snap("push", `${L(nb.to)} no está explorado: va arriba de la pila con padre ${L(cur)}.`, nb.e);
        } else snap("if", `${L(nb.to)} ya fue explorado; no lo apilamos.`, nb.e);
      }
    }
    cur=null; snap("none","La pila se vació: no hay camino."); return {steps,path:null,cost:null,explored:closed.size};
  }

  // dijkstra / astar
  const isA = algo==="astar";
  val[s]=0;
  snap("init", isA
    ? `Todas las g valen ∞ excepto el origen ${L(s)}, que vale 0. La heurística h es la distancia en línea recta a ${L(goal)}.`
    : `Todas las distancias empiezan en ∞ excepto el origen ${L(s)}, que vale 0.`);
  frontier=[{n:s,k:isA?H[s]:0}];
  snap("push0", isA ? `Metemos ${L(s)} a la lista abierta con f = 0 + ${fmt(H[s])} = ${fmt(H[s])}.` : `Metemos (0, ${L(s)}) a la cola de prioridad.`);
  const sortF = () => frontier.sort((a,b)=>a.k-b.k || a.n-b.n);
  while(frontier.length){
    sortF(); const it = frontier.shift(); cur = it.n;
    snap("pop", isA
      ? `Sacamos ${L(cur)} con f = ${fmt(it.k)} (g = ${fmt(val[cur])}, h = ${fmt(H[cur])}): el más prometedor de la lista.`
      : `Sacamos ${L(cur)} con distancia ${fmt(it.k)}: el más cercano al origen de toda la cola.`);
    const stale = isA ? closed.has(cur) : it.k > val[cur];
    if(stale){ snap("stale", isA ? `${L(cur)} ya estaba en la lista cerrada: entrada repetida, la ignoramos.` : `Entrada vieja: ya conocemos una distancia mejor a ${L(cur)} (${val[cur]}). La ignoramos.`); continue; }
    if(!isA) closed.add(cur);
    if(cur===goal){ closed.add(cur); return finish(); }
    if(isA){ closed.add(cur); snap("close", `${L(cur)} pasa a la lista cerrada.`); }
    for(const nb of G.adj[cur]){
      const nueva = val[cur] + nb.w, old = val[nb.to];
      snap("calc", `Calle ${L(cur)}→${L(nb.to)}: ${val[cur]} + ${nb.w} = ${nueva}.`, nb.e);
      if(nueva < old){
        val[nb.to]=nueva; padre[nb.to]=cur; seen.add(nb.to); changed=nb.to;
        const k = isA ? Math.round((nueva + H[nb.to])*10)/10 : nueva;
        frontier.push({n:nb.to,k});
        snap("push", isA
          ? `${nueva} < ${fmt(old)}: mejora. g(${L(nb.to)}) = ${nueva}, f = ${nueva} + ${fmt(H[nb.to])} = ${fmt(k)}. Entra a la lista abierta.`
          : `${nueva} < ${fmt(old)}: ¡mejora! dist(${L(nb.to)}) = ${nueva}, padre = ${L(cur)}, y entra a la cola.`, nb.e);
      } else {
        snap("cmp", `${nueva} no es menor que ${fmt(old)}: ese camino no mejora, ${L(nb.to)} se queda igual.`, nb.e);
      }
    }
  }
  cur=null; snap("none","La cola se vació: no hay camino."); return {steps,path:null,cost:null,explored:closed.size};
}

