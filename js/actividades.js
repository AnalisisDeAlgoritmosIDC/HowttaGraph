/* HowttaGraph · equipo LEARN&TUDY
 * actividades.js — prácticas que se desbloquean después del reconocimiento.
 * Cada actividad genera un grafo AL AZAR, así que nunca se repite y no se puede memorizar.
 * Usa funciones de aprender.js (figura, ICON, P, guardar, migas, ...) que ya existen cuando se abre una actividad.
 */
"use strict";

window.ACTIVIDADES = [
  { id: "bfs", lv: 2, titulo: "Ordena el recorrido BFS", desc: "Haz clic en los nodos en el orden en que BFS los visita.", clase: 5 },
  { id: "dfs", lv: 2, titulo: "Ordena el recorrido DFS", desc: "Haz clic en los nodos en el orden en que DFS los visita.", clase: 6 },
  { id: "dijkstra", lv: 3, titulo: "Calcula las distancias", desc: "Llena la tabla de distancias mínimas que obtiene Dijkstra.", clase: 8 },
  { id: "camino", lv: 3, titulo: "Encuentra el camino más barato", desc: "Traza con clics la ruta de menor costo entre dos nodos.", clase: 9 },
  { id: "astar", lv: 4, titulo: "¿Quién sale de la lista abierta?", desc: "Calcula f = g + h y elige el nodo que A* expande.", clase: 11 },
  { id: "relampago", lv: 1, titulo: "Ronda relámpago", desc: "60 segundos para contestar todas las preguntas que puedas.", clase: null },
];
const actAbiertas = () => reconocido() || P.libre;

/* ---------- grafo aleatorio de 7 nodos (sin aristas que se crucen) ---------- */
const POS = [[50, 145], [170, 40], [170, 250], [300, 145], [430, 40], [430, 250], [550, 145]];
const CANDIDATAS = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [3, 5], [2, 5], [4, 5], [4, 6], [5, 6]];
const azar = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function grafoAleatorio() {
  const etiquetas = barajar("ABCDEFG".split(""));
  const padre = POS.map((_, i) => i), raiz = i => (padre[i] === i ? i : (padre[i] = raiz(padre[i])));
  const elegidas = [];
  for (const [a, b] of barajar(CANDIDATAS.slice())) {
    const ra = raiz(a), rb = raiz(b);
    if (ra !== rb) { padre[ra] = rb; elegidas.push([a, b]); }      // primero un árbol: garantiza que sea conexo
    else if (Math.random() < 0.45) elegidas.push([a, b]);          // luego algunas aristas extra para formar ciclos
  }
  const aristas = elegidas.map(([a, b]) => [a, b, azar(1, 9)]);
  const adj = POS.map(() => []);
  aristas.forEach(([a, b, w]) => { adj[a].push({ to: b, w }); adj[b].push({ to: a, w }); });
  adj.forEach(l => l.sort((x, y) => etiquetas[x.to].localeCompare(etiquetas[y.to])));   // vecinos en orden alfabético
  return { et: etiquetas, aristas, adj };
}
const dibujo = (g, estados = {}, tags = {}, pesos = true, eEst = {}) => ({
  w: 600, h: 290,
  n: POS.map(([x, y], i) => [x, y, g.et[i], estados[i], tags[i]]),
  e: g.aristas.map(([a, b, w], k) => [a, b, pesos ? w : null, eEst[k]]),
});
const aristaDe = (g, a, b) => g.aristas.findIndex(([x, y]) => (x === a && y === b) || (x === b && y === a));

/* ---------- algoritmos de referencia (para revisar al estudiante) ---------- */
function ordenBFS(g, s) {
  const orden = [], estructura = [], vis = new Set([s]), cola = [s];
  while (cola.length) {
    const u = cola.shift(); orden.push(u);
    for (const { to } of g.adj[u]) if (!vis.has(to)) { vis.add(to); cola.push(to); }
    estructura.push(cola.slice());           // cómo queda la cola después de procesar u
  }
  return { orden, estructura };
}
function ordenDFS(g, s) {
  const orden = [], estructura = [], vis = new Set(), pila = [];
  const visitar = u => {
    vis.add(u); pila.push(u); orden.push(u); estructura.push(pila.slice());
    for (const { to } of g.adj[u]) if (!vis.has(to)) visitar(to);
    pila.pop();
  };
  visitar(s);
  return { orden, estructura };
}
function dijkstra(g, s) {
  const dist = POS.map(() => Infinity), padre = POS.map(() => null), hecho = new Set();
  dist[s] = 0;
  while (hecho.size < POS.length) {
    let u = -1;
    POS.forEach((_, i) => { if (!hecho.has(i) && (u < 0 || dist[i] < dist[u])) u = i; });
    hecho.add(u);
    for (const { to, w } of g.adj[u]) if (dist[u] + w < dist[to]) { dist[to] = dist[u] + w; padre[to] = u; }
  }
  return { dist, padre };
}
const caminoDe = (padre, t) => { const c = []; for (let n = t; n !== null; n = padre[n]) c.unshift(n); return c; };

/* ---------- registrar resultado ---------- */
function registrar(id, puntos) {
  const prev = P.act[id], primera = !prev;
  P.act[id] = { best: Math.max(puntos, prev ? prev.best : 0), veces: (prev ? prev.veces : 0) + 1 };
  if (primera) P.xp += 30;
  guardar();
  return primera;
}
const unidad = id => (id === "relampago" ? "correctas" : "puntos");

/* ---------- vista: lista de actividades ---------- */
function vistaActividades() {
  migas([["Aprender", "#ruta"], ["Actividades"]]);
  const abiertas = actAbiertas();
  $("#view").innerHTML = `<section class="panel">
    <div class="panel-head"><span class="muted small">${ACTIVIDADES.filter(a => P.act[a.id]).length} de ${ACTIVIDADES.length} completadas</span><h2>Actividades</h2><span class="muted small">+30 XP la primera vez</span></div>
    ${abiertas ? "" : `<div class="act-lock">${ICON.lock}<p>Las actividades se desbloquean al obtener tu <b>reconocimiento</b>. Termina las clases y aprueba el reto final.</p><a class="btn small" href="#ruta">Ver mi avance</a></div>`}
    <div class="act-grid-list">${ACTIVIDADES.map(a => {
      const r = P.act[a.id], inner = `<span class="ac-ico lv${a.lv}">${a.id === "relampago" ? ICON.bolt : ICON.puzzle}</span>
        <span class="act-txt"><b>${a.titulo}</b><small>${a.desc}</small>
        <span class="act-meta">${a.clase ? `<span>Repasa: clase ${a.clase}</span>` : "<span>Todo el curso</span>"}${r ? `<span class="done">${ICON.check}Mejor: ${r.best} ${unidad(a.id)}</span>` : ""}</span></span>`;
      return abiertas ? `<a class="act-card lv${a.lv}" href="#actividad-${a.id}">${inner}</a>` : `<span class="act-card locked lv${a.lv}" aria-disabled="true">${inner}</span>`;
    }).join("")}</div></section>`;
}

/* ---------- vista: una actividad ---------- */
function vistaActividad(id) {
  const a = ACTIVIDADES.find(x => x.id === id);
  if (!a) { location.hash = "actividades"; return; }
  migas([["Aprender", "#ruta"], ["Actividades", "#actividades"], [a.titulo]]);
  if (!actAbiertas()) { $("#view").innerHTML = bloqueado(ICON.lock, "Actividades", "Todavía no", "Las actividades se desbloquean al obtener tu reconocimiento.", "#ruta", "Volver al escritorio"); return; }
  ({ bfs: actOrden, dfs: actOrden, dijkstra: actDistancias, camino: actCamino, astar: actAstar, relampago: actRelampago })[id](a);
}

function marco(a, cuerpo, lado) {
  return `<div class="act-layout lv${a.lv}">
    <section class="panel act-main"><div class="panel-head"><span class="chip lv${a.lv}">Actividad</span><h2>${a.titulo}</h2><span></span></div><div class="panel-body">${cuerpo}</div></section>
    <aside class="panel act-side">${lado}</aside></div>`;
}
const resultado = (ok, titulo, texto, primera) => `<div class="act-result ${ok ? "ok" : "fail"}"><b>${titulo}</b><p>${texto}${primera ? " · +30 XP por tu primera vez" : ""}</p></div>`;

/* ---------- 1 y 2: ordenar recorrido BFS / DFS ---------- */
function actOrden(a) {
  const esBFS = a.id === "bfs";
  let g, s, ref, k, errores, ayuda = false, terminado;
  const nuevo = () => { g = grafoAleatorio(); s = azar(0, 6); ref = esBFS ? ordenBFS(g, s) : ordenDFS(g, s); k = 0; errores = 0; terminado = false; pintar(); };
  const pintar = (malo = null) => {
    const est = {}, tags = { [s]: k ? undefined : "inicio" };
    ref.orden.slice(0, k).forEach((n, j) => { est[n] = "closed"; tags[n] = "#" + (j + 1); });
    if (malo !== null) est[malo] = "cur";
    const estr = k ? ref.estructura[k - 1] : [s];
    $("#view").innerHTML = marco(a,
      `<p class="act-instr">Empieza en <b>${g.et[s]}</b>. Haz clic en los nodos en el orden en que ${esBFS ? "BFS los saca de la cola" : "DFS los visita"}. Los vecinos se revisan en <b>orden alfabético</b>.</p>
       <div class="act-canvas">${figura(dibujo(g, est, tags, false), "clickable")}</div>
       <div id="msg">${terminado ? resultado(errores === 0, errores ? `Terminaste con ${errores} ${errores === 1 ? "error" : "errores"}` : "¡Perfecto, sin errores!", `Orden correcto: ${ref.orden.map(n => g.et[n]).join(" → ")}. Puntaje: ${Math.max(0, 100 - errores * 15)}`, terminado === "primera") : malo !== null ? `<p class="act-warn">Ese no es. ${esBFS ? "¿Quién está al frente de la cola?" : "¿Cuál es el primer vecino sin visitar, en orden alfabético?"}</p>` : ""}</div>`,
      `<span class="eyebrow">Progreso</span><b class="big">${k} / ${ref.orden.length}</b>
       <span class="eyebrow">Errores</span><b class="big ${errores ? "bad" : ""}">${errores}</b>
       <label class="switch"><input type="checkbox" id="ayuda" ${ayuda ? "checked" : ""}> <span>Mostrar ${esBFS ? "la cola" : "la pila de llamadas"}</span></label>
       ${ayuda ? `<div class="ds-box"><span class="eyebrow">${esBFS ? "Cola (el primero sale)" : "Pila (camino actual)"}</span><div class="chips">${estr.length ? estr.map(n => `<span class="dchip">${g.et[n]}</span>`).join("") : "<em>vacía</em>"}</div></div>` : ""}
       <button class="btn" id="nuevo" type="button">Otro grafo</button>
       <a class="btn ghost" href="#clase-${a.clase}">Repasar la clase ${a.clase}</a>`);
    $("#ayuda").addEventListener("change", e => { ayuda = e.target.checked; pintar(); });
    $("#nuevo").addEventListener("click", nuevo);
    $(".act-canvas svg").addEventListener("click", e => {
      const n = e.target.closest(".mf-n"); if (!n || terminado) return;
      const i = +n.dataset.i;
      if (ref.orden.slice(0, k).includes(i)) return;
      if (i === ref.orden[k]) {
        k++;
        if (k === ref.orden.length) terminado = registrar(a.id, Math.max(0, 100 - errores * 15)) ? "primera" : true;
        pintar();
      } else { errores++; pintar(i); }
    });
  };
  nuevo();
}

/* ---------- 3: tabla de distancias de Dijkstra ---------- */
function actDistancias(a) {
  let g, s, ref, revisado, primerPuntaje, mostrar;
  const nuevo = () => { g = grafoAleatorio(); s = azar(0, 6); ref = dijkstra(g, s); revisado = null; primerPuntaje = null; mostrar = false; pintar(); };
  const pintar = (valores = {}) => {
    const orden = POS.map((_, i) => i).filter(i => i !== s).sort((x, y) => g.et[x].localeCompare(g.et[y]));
    const eEst = {};
    if (mostrar) POS.forEach((_, i) => { if (ref.padre[i] !== null) eEst[aristaDe(g, i, ref.padre[i])] = "path"; });
    const tags = mostrar ? Object.fromEntries(POS.map((_, i) => [i, "d=" + ref.dist[i]])) : { [s]: "origen" };
    $("#view").innerHTML = marco(a,
      `<p class="act-instr">Calcula la distancia mínima desde <b>${g.et[s]}</b> hasta cada nodo, como lo haría Dijkstra. Escribe solo números.</p>
       <div class="act-canvas">${figura(dibujo(g, { [s]: "front" }, tags, true, eEst))}</div>
       <div id="msg">${revisado ? resultado(revisado.ok === orden.length, `${revisado.ok} de ${orden.length} correctas`, mostrar ? "Las aristas marcadas forman el árbol de caminos más cortos." : revisado.ok === orden.length ? `Puntaje: ${primerPuntaje}` : "Corrige las marcadas en rojo o pide la solución.", revisado.primera) : ""}</div>`,
      `<span class="eyebrow">Distancias desde ${g.et[s]}</span>
       <div class="dist-table">${orden.map(i => {
         const v = valores[i] ?? "", cls = revisado ? (revisado.bien[i] ? "ok" : "bad") : "";
         return `<label class="dist-row ${cls}"><b>${g.et[i]}</b><input type="number" inputmode="numeric" min="0" id="d${i}" value="${mostrar ? ref.dist[i] : v}" ${mostrar ? "disabled" : ""}></label>`;
       }).join("")}</div>
       <button class="btn" id="revisar" type="button" ${mostrar ? "disabled" : ""}>Comprobar</button>
       <button class="btn ghost" id="sol" type="button">Ver solución</button>
       <button class="btn ghost" id="nuevo" type="button">Otro grafo</button>`);
    $("#nuevo").addEventListener("click", nuevo);
    $("#sol").addEventListener("click", () => { mostrar = true; if (primerPuntaje === null) { primerPuntaje = 0; registrar(a.id, 0); } revisado = revisado || { ok: 0, bien: {} }; pintar(); });
    $("#revisar").addEventListener("click", () => {
      const vals = {}, bien = {}; let ok = 0;
      orden.forEach(i => { vals[i] = $("#d" + i).value; bien[i] = vals[i] !== "" && +vals[i] === ref.dist[i]; if (bien[i]) ok++; });
      let primera = false;
      if (primerPuntaje === null) { primerPuntaje = Math.round(ok / orden.length * 100); primera = registrar(a.id, primerPuntaje); }
      revisado = { ok, bien, primera };
      pintar(vals);
    });
  };
  nuevo();
}

/* ---------- 4: trazar el camino más barato ---------- */
function actCamino(a) {
  let g, s, t, ref, camino, fin;
  const nuevo = () => {
    g = grafoAleatorio();
    // origen y destino lo más lejos posible (en número de aristas)
    let mejor = [0, 6, -1];
    POS.forEach((_, i) => { const { orden } = ordenBFS(g, i); const nivel = {}; nivel[i] = 0;
      orden.forEach(u => g.adj[u].forEach(({ to }) => { if (nivel[to] === undefined) nivel[to] = nivel[u] + 1; }));
      POS.forEach((_, j) => { if (nivel[j] > mejor[2]) mejor = [i, j, nivel[j]]; }); });
    [s, t] = mejor; ref = dijkstra(g, s); camino = [s]; fin = null; pintar();
  };
  const costo = c => c.slice(1).reduce((acc, n, j) => acc + g.aristas[aristaDe(g, c[j], n)][2], 0);
  const pintar = (aviso = "") => {
    const est = {}, eEst = {};
    camino.forEach(n => (est[n] = "path"));
    camino.slice(1).forEach((n, j) => (eEst[aristaDe(g, camino[j], n)] = "path"));
    if (fin && fin.mostrar) caminoDe(ref.padre, t).slice(1).forEach((n, j, arr) => { const prev = j ? arr[j - 1] : s; eEst[aristaDe(g, prev, n)] = eEst[aristaDe(g, prev, n)] || "opt"; });
    if (!camino.includes(t)) est[t] = "front";
    const opt = ref.dist[t];
    $("#view").innerHTML = marco(a,
      `<p class="act-instr">Ve de <b>${g.et[s]}</b> a <b>${g.et[t]}</b> gastando lo menos posible. Haz clic en nodos vecinos para avanzar; clic en el último para regresar un paso.</p>
       <div class="act-canvas">${figura(dibujo(g, est, { [s]: "origen", [t]: "destino" }, true, eEst), "clickable")}</div>
       <div id="msg">${fin ? resultado(fin.costo === opt, fin.costo === opt ? "¡Es el camino más barato!" : `Tu camino cuesta ${fin.costo}; el óptimo cuesta ${opt}`, `Puntaje: ${fin.puntos}.${fin.mostrar ? ` Óptimo: ${caminoDe(ref.padre, t).map(n => g.et[n]).join(" → ")}` : ""}`, fin.primera) : aviso ? `<p class="act-warn">${aviso}</p>` : ""}</div>`,
      `<span class="eyebrow">Tu camino</span><b class="big path-txt">${camino.map(n => g.et[n]).join(" → ")}</b>
       <span class="eyebrow">Costo acumulado</span><b class="big">${costo(camino)}</b>
       ${fin && fin.costo !== opt && !fin.mostrar ? `<button class="btn ghost" id="ver" type="button">Ver el óptimo</button>` : ""}
       <button class="btn ghost" id="reset" type="button">Borrar camino</button>
       <button class="btn" id="nuevo" type="button">Otro grafo</button>
       <a class="btn ghost" href="#clase-${a.clase}">Repasar la clase ${a.clase}</a>`);
    $("#nuevo").addEventListener("click", nuevo);
    $("#reset").addEventListener("click", () => { camino = [s]; fin = null; pintar(); });
    if ($("#ver")) $("#ver").addEventListener("click", () => { fin.mostrar = true; pintar(); });
    $(".act-canvas svg").addEventListener("click", e => {
      const n = e.target.closest(".mf-n"); if (!n || fin) return;
      const i = +n.dataset.i, ult = camino[camino.length - 1];
      if (i === ult && camino.length > 1) { camino.pop(); pintar(); return; }
      if (camino.includes(i)) return pintar("Ese nodo ya está en tu camino.");
      if (aristaDe(g, ult, i) < 0) return pintar(`${g.et[i]} no es vecino de ${g.et[ult]}.`);
      camino.push(i);
      if (i === t) { const c = costo(camino), puntos = Math.round(opt / c * 100); fin = { costo: c, puntos, primera: registrar(a.id, puntos) }; }
      pintar();
    });
  };
  nuevo();
}

/* ---------- 5: A*, ¿quién sale de la lista abierta? ---------- */
function actAstar(a) {
  const RONDAS = 5;
  let ronda, aciertos, items, respondido, fin;
  const generar = () => {
    do {
      items = barajar("BCDEFGHJKM".split("")).slice(0, 4).map(n => ({ n, g: azar(2, 14), h: azar(0, 12) }));
      items.forEach(x => (x.f = x.g + x.h));
    } while (items.filter(x => x.f === Math.min(...items.map(y => y.f))).length > 1 ||
             items.reduce((m, x) => (x.g < m.g ? x : m)).f === Math.min(...items.map(y => y.f)) && Math.random() < 0.7);   // casi siempre, el de menor g NO es el bueno
    respondido = null;
  };
  const inicio = () => { ronda = 1; aciertos = 0; fin = null; generar(); pintar(); };
  const pintar = () => {
    const minF = Math.min(...items.map(x => x.f));
    $("#view").innerHTML = marco(a,
      fin ? resultado(fin.puntos >= 80, `${aciertos} de ${RONDAS} correctas`, `Puntaje: ${fin.puntos}.`, fin.primera) + `<button class="btn" id="otra" type="button">Jugar otra vez</button>` :
      `<p class="act-instr">Ronda ${ronda} de ${RONDAS}. Esta es la lista abierta de A*. ¿Qué nodo sale primero?</p>
       <div class="open-list">${items.map((x, j) => {
         const cls = respondido ? (x.f === minF ? "right" : j === respondido.j ? "wrong" : "") : "";
         return `<button class="open-item ${cls}" type="button" data-j="${j}" ${respondido ? "disabled" : ""}><b>${x.n}</b><span>g = ${x.g}</span><span>h = ${x.h}</span>${respondido ? `<em>f = ${x.f}</em>` : ""}</button>`;
       }).join("")}</div>
       ${respondido ? `<div class="act-result ${respondido.ok ? "ok" : "fail"}"><b>${respondido.ok ? "¡Correcto!" : "No."}</b><p>Sale el de menor f = g + h: ${items.find(x => x.f === minF).n} con f = ${minF}.</p></div><button class="btn" id="sig" type="button">${ronda < RONDAS ? "Siguiente ronda" : "Ver resultado"} →</button>` : ""}`,
      `<span class="eyebrow">Aciertos</span><b class="big">${aciertos} / ${RONDAS}</b>
       <p class="muted small">Recuerda: g es lo que ya costó llegar y h lo que se estima que falta. Elegir solo por g es Dijkstra; solo por h es búsqueda voraz.</p>
       <a class="btn ghost" href="#clase-${a.clase}">Repasar la clase ${a.clase}</a>`);
    if (fin) { $("#otra").addEventListener("click", inicio); return; }
    document.querySelectorAll(".open-item").forEach(b => b.addEventListener("click", () => {
      const j = +b.dataset.j, ok = items[j].f === minF;
      if (ok) aciertos++;
      respondido = { j, ok }; pintar();
    }));
    if ($("#sig")) $("#sig").addEventListener("click", () => {
      if (ronda < RONDAS) { ronda++; generar(); pintar(); }
      else { const puntos = aciertos * 20; fin = { puntos, primera: registrar(a.id, puntos) }; pintar(); }
    });
  };
  inicio();
}

/* ---------- 6: ronda relámpago ---------- */
function actRelampago(a) {
  const SEG = 60;
  let reloj = null;
  const inicio = () => {
    clearInterval(reloj);
    const r = P.act[a.id];
    $("#view").innerHTML = marco(a,
      `<p class="act-instr">Tienes ${SEG} segundos. Las preguntas salen al azar de todo el banco. Al responder pasas a la siguiente de inmediato.</p>
       <button class="btn" id="go" type="button">Empezar ${ICON.play}</button>`,
      `<span class="eyebrow">Tu mejor marca</span><b class="big">${r ? r.best : 0} correctas</b>`);
    $("#go").addEventListener("click", jugar);
  };
  const jugar = () => {
    const banco = barajar(CLASES.flatMap(c => c.preguntas.filter(q => !q.fig).map(q => ({ ...q }))));
    let qi = 0, ok = 0, mal = 0, fin = Date.now() + SEG * 1000;
    $("#view").innerHTML = marco(a, `<div class="timer"><i id="tbar"></i></div><div id="rq"></div>`,
      `<span class="eyebrow">Tiempo</span><b class="big" id="tseg">${SEG}</b><span class="eyebrow">Correctas</span><b class="big" id="tok">0</b><span class="eyebrow">Incorrectas</span><b class="big bad" id="tmal">0</b>`);
    const pregunta = () => {
      const q = banco[qi % banco.length];
      $("#rq").innerHTML = `<h3 class="qq">${q.q}</h3>${q.code ? `<div class="lcode"><pre><code>${resaltar(q.code)}</code></pre></div>` : ""}
        <div class="opts">${q.o.map((o, j) => `<button class="opt" type="button" data-o="${j}"><span class="ok-l">${"ABCD"[j]}</span><span>${o}</span></button>`).join("")}</div>`;
      document.querySelectorAll("#rq .opt").forEach(b => b.addEventListener("click", () => {
        if (+b.dataset.o === q.a) ok++; else mal++;
        $("#tok").textContent = ok; $("#tmal").textContent = mal;
        qi++; pregunta();
      }));
    };
    pregunta();
    reloj = setInterval(() => {
      const quedan = Math.max(0, fin - Date.now());
      if (!$("#tseg")) { clearInterval(reloj); return; }            // el usuario se fue a otra vista
      $("#tseg").textContent = Math.ceil(quedan / 1000);
      $("#tbar").style.width = (quedan / (SEG * 1000) * 100) + "%";
      if (quedan <= 0) {
        clearInterval(reloj);
        const primera = registrar(a.id, ok);
        $("#rq").innerHTML = resultado(ok >= 8, `¡Tiempo! ${ok} correctas y ${mal} incorrectas`, `Tu mejor marca: ${P.act[a.id].best}.`, primera) + `<button class="btn" id="otra" type="button">Jugar otra vez</button>`;
        $("#otra").addEventListener("click", inicio);
      }
    }, 200);
  };
  inicio();
}
