/* HowttaGraph · equipo LEARN&TUDY
 * Interfaz: dibujo del grafo en SVG, controles de reproducción, código resaltado,
 * tabla de nodos, comparativa y teoría.
 */
"use strict";
/* ---------- estado ---------- */
let algo = "bfs", seed = 7, start = 0, goal = 14, clickMode = "start";
let R = null, idx = 0, timer = null, pinned = null;

/* ---------- SVG ---------- */
const svg = $("#graph");
let elE = [], elW = [], elN = [], hLine, hLabel;
function el(tag, attrs, parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }
function buildSVG(){
  svg.innerHTML = "";
  const gE = el("g",{},svg), gH = el("g",{},svg), gW = el("g",{},svg), gN = el("g",{},svg);
  elE = G.edges.map(e => el("line",{x1:G.nodes[e.a].x,y1:G.nodes[e.a].y,x2:G.nodes[e.b].x,y2:G.nodes[e.b].y,class:"e-line"},gE));
  hLine = el("line",{class:"hline"},gH); hLabel = el("text",{class:"hlabel"},gH);
  elW = G.edges.map(e => {
    const mx=(G.nodes[e.a].x+G.nodes[e.b].x)/2, my=(G.nodes[e.a].y+G.nodes[e.b].y)/2;
    const g = el("g",{class:"e-w"},gW);
    el("rect",{x:mx-12,y:my-10,width:24,height:20,rx:5},g);
    const t = el("text",{x:mx,y:my+1,"text-anchor":"middle","dominant-baseline":"central"},g); t.textContent=e.w;
    return g;
  });
  elN = G.nodes.map((n,i) => {
    const g = el("g",{class:"n",transform:`translate(${n.x},${n.y})`,tabindex:"0",role:"button","aria-label":`Nodo ${L(i)}`},gN);
    el("circle",{class:"ring",r:29},g);
    el("circle",{class:"body",r:22},g);
    const t = el("text",{class:"lbl"},g); t.textContent=L(i);
    const tag = el("g",{class:"tag",transform:"translate(0,40)"},g);
    el("rect",{x:-30,y:-10,width:60,height:20,rx:5},tag); el("text",{},tag);
    const fl = el("text",{class:"flag",y:-36},g);
    g.addEventListener("click",()=>pickNode(i));
    g.addEventListener("keydown",ev=>{ if(ev.key==="Enter"||ev.key===" "){ev.preventDefault();ev.stopPropagation();pickNode(i);} });
    return {g, tag, flag: fl};
  });
}
function pickNode(i){
  if(clickMode==="start"){ if(i===goal) goal=start; start=i; }
  else { if(i===start) start=goal; goal=i; }
  recompute();
}

/* ---------- render ---------- */
function renderCode(){
  const c = CODE[algo];
  $("#codeTitle").textContent = c.fn;
  const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const kw = /\b(def|while|for|if|in|not|return|import|from|continue|None|set|reversed)\b/g;
  $("#code").innerHTML = c.lines.map((ln,i) => {
    let t = esc(ln[1]).replace(/('[^']*')/g,'<span class="st">$1</span>').replace(kw,'<span class="kw">$1</span>');
    return `<div class="code-line" data-i="${i}" tabindex="${ln[1]?0:-1}"><span class="no">${i+1}</span><span>${t||" "}</span></div>`;
  }).join("");
  $("#code").querySelectorAll(".code-line").forEach(d => {
    const go = () => { const i=+d.dataset.i; if(!c.lines[i][2]) return; pinned = pinned===i ? null : i; renderStep(); };
    d.addEventListener("click", go);
    d.addEventListener("keydown", ev => { if(ev.key==="Enter"){ ev.preventDefault(); go(); } });
  });
}
function linesFor(key){ return CODE[algo].lines.map((l,i)=>l[0]===key?i:-1).filter(i=>i>=0); }

function renderStep(){
  const st = R.steps[idx], c = CODE[algo];
  // código
  const on = new Set(linesFor(st.key));
  if(st.key==="init" && algo==="dijkstra"){} // all init lines
  $("#code").querySelectorAll(".code-line").forEach(d => {
    const i=+d.dataset.i; d.classList.toggle("on", on.has(i)); d.classList.toggle("pin", pinned===i);
  });
  const showI = pinned!==null ? pinned : [...on][0];
  if(showI!==undefined){
    const ln = c.lines[showI];
    const range = pinned!==null ? `Línea ${showI+1} (fijada)` : (on.size>1 ? `Líneas ${[...on][0]+1}–${[...on][on.size-1]+1}` : `Línea ${showI+1}`);
    $("#explHead").textContent = range;
    $("#expl").innerHTML = pinned!==null ? ln[2] : [...on].map(i=>c.lines[i][2]).filter(Boolean).join(" ");
  }
  const onEl = $("#code").querySelector(".code-line.on");
  if(onEl){ const pre=$("#code"); const top=onEl.offsetTop - pre.offsetTop; if(top < pre.scrollTop || top > pre.scrollTop+pre.clientHeight-30) pre.scrollTop = top-60; }

  // grafo
  const fset = new Set(st.frontier.map(x=>x.n)), cset = new Set(st.closed), sset = new Set(st.seen);
  const pset = new Set(st.path||[]);
  const pathEdges = new Set(); if(st.path) for(let i=1;i<st.path.length;i++) pathEdges.add(edgeIndex(st.path[i-1],st.path[i]));
  const treeEdges = new Set(); for(const k in st.padre){ const p=st.padre[k]; if(p!==null) treeEdges.add(edgeIndex(+k,p)); }
  elE.forEach((e,i)=>{ e.setAttribute("class","e-line"+(pathEdges.has(i)?" path":i===st.edge?" exam":treeEdges.has(i)?" tree":"")); });
  elW.forEach((w,i)=>w.setAttribute("class","e-w"+(i===st.edge?" exam":"")));
  svg.classList.toggle("weights-off", algo==="bfs"||algo==="dfs");
  const H = algo==="astar" ? G.nodes.map((_,i)=>hOf(i,goal)) : null;
  elN.forEach((o,i)=>{
    let cls="n";
    if(pset.has(i)) cls+=" path"; else if(st.cur===i) cls+=" cur"; else if(cset.has(i)) cls+=" closed"; else if(fset.has(i)) cls+=" front"; else if(sset.has(i)) cls+=" seen";
    o.g.setAttribute("class",cls);
    const ring=o.g.querySelector(".ring"); ring.setAttribute("class","ring"+(i===start?" start":i===goal?" goal":"")); ring.style.display=(i===start||i===goal)?"":"none";
    o.flag.textContent = i===start?"ORIGEN":i===goal?"DESTINO":"";
    o.flag.setAttribute("fill", i===start?"var(--accent)":"var(--goal)");
    let tag = "";
    const v = st.val[i];
    if(algo==="bfs") tag = v===Infinity?"":`nivel ${v}`;
    else if(algo==="dfs") tag = v===Infinity?"":`#${v}`;
    else if(algo==="dijkstra") tag = `d=${fmt(v)}`;
    else tag = v===Infinity ? `h=${fmt(H[i])}` : `f=${fmt(Math.round((v+H[i])*10)/10)}`;
    o.tag.style.display = tag?"":"none";
    o.tag.querySelector("text").textContent = tag;
    const w = Math.max(44, tag.length*7.4+12); const r=o.tag.querySelector("rect"); r.setAttribute("x",-w/2); r.setAttribute("width",w);
  });
  // línea heurística
  if(algo==="astar" && st.cur!==null && st.cur!==goal && !st.path){
    const a=G.nodes[st.cur], b=G.nodes[goal];
    hLine.setAttribute("x1",a.x);hLine.setAttribute("y1",a.y);hLine.setAttribute("x2",b.x);hLine.setAttribute("y2",b.y);
    hLabel.setAttribute("x",(a.x+b.x)/2+8);hLabel.setAttribute("y",(a.y+b.y)/2-10);hLabel.textContent=`h(${L(st.cur)}) = ${fmt(H[st.cur])}`;
    hLine.style.display=hLabel.style.display="";
  } else hLine.style.display=hLabel.style.display="none";

  // narrativa
  $("#msg").textContent = st.msg;
  const cost = st.path ? pathCost(st.path) : null;
  $("#stats").innerHTML = `<span>Explorados <b>${st.closed.length}</b> / ${G.nodes.length}</span><span>En frontera <b>${st.frontier.length}</b></span>` + (cost!==null?`<span>Costo del camino <b>${cost}</b></span><span>Aristas <b>${st.path.length-1}</b></span>`:"");
  $("#scrub").value = idx; $("#stepNo").textContent = `${idx+1} / ${R.steps.length}`;
  $("#bPrev").disabled = $("#bReset").disabled = idx===0;
  $("#bNext").disabled = $("#bEnd").disabled = idx===R.steps.length-1;

  // estructura
  $("#dsTitle").textContent = c.ds;
  let items = st.frontier.slice();
  const isPQ = algo==="dijkstra"||algo==="astar";
  if(isPQ) items.sort((a,b)=>a.k-b.k||a.n-b.n);
  let html = "";
  if(!items.length) html = `<span class="empty">Vacía</span>`;
  else {
    const disp = algo==="dfs" ? items.slice().reverse() : items;
    html = disp.map((x,j)=>{
      const stale = isPQ && (algo==="astar" ? cset.has(x.n) : x.k > st.val[x.n]);
      const lbl = isPQ ? `(${fmt(x.k)}, ${L(x.n)})` : L(x.n);
      return `<span class="chip${stale?" stale":""}${j===0?" next":""}">${lbl}</span>`;
    }).join("");
  }
  $("#chips").innerHTML = html;
  $("#dsNote").innerHTML = algo==="bfs" ? "El de la izquierda (con borde) es el <b>frente</b>: sale primero. Los nuevos entran por la derecha."
    : algo==="dfs" ? "El de la izquierda (con borde) es el <b>tope</b> de la pila: sale primero. Los nuevos se ponen encima."
    : algo==="dijkstra" ? "Ordenada por distancia: la de la izquierda sale primero. Las tachadas son entradas viejas que se ignorarán."
    : "Ordenada por f = g + h: la de la izquierda sale primero. Las tachadas ya están en la lista cerrada.";

  // tabla
  const cols = algo==="astar" ? ["Nodo","g","h","f","Padre","Estado"] : ["Nodo", algo==="dijkstra"?"Distancia":algo==="bfs"?"Nivel":"Orden", "Padre","Estado"];
  let t = `<thead><tr>${cols.map(x=>`<th>${x}</th>`).join("")}</tr></thead><tbody>`;
  G.nodes.forEach((_,i)=>{
    const v = st.val[i];
    let state="", pc="";
    if(pset.has(i)){state="camino";pc="path";} else if(st.cur===i){state="actual";pc="cur";} else if(cset.has(i)){state="explorado";pc="closed";} else if(fset.has(i)){state="frontera";pc="front";} else if(sset.has(i)){state="descubierto";}
    const p = st.padre[i]; const pad = p===undefined||p===null ? "—" : L(p);
    const vd = (algo==="bfs"||algo==="dfs") && v===Infinity ? "—" : fmt(v);
    const rowCls = st.changed===i ? "changed" : st.cur===i && !st.path ? "iscur" : "";
    t += `<tr class="${rowCls}"><td class="n-cell">${L(i)}${i===start?" ·origen":i===goal?" ·destino":""}</td><td>${vd}</td>`;
    if(algo==="astar") t += `<td>${fmt(H[i])}</td><td>${v===Infinity?"∞":fmt(Math.round((v+H[i])*10)/10)}</td>`;
    t += `<td>${pad}</td><td>${state?`<span class="pill ${pc}">${state}</span>`:""}</td></tr>`;
  });
  $("#tbl").innerHTML = t+"</tbody>";

  // bitácora
  const from = Math.max(0, idx-40);
  $("#log").setAttribute("start", from+1);
  $("#log").innerHTML = R.steps.slice(from, idx+1).map((s,j)=>`<li class="${from+j===idx?"now":""}">${s.msg}</li>`).join("");
  $("#log").scrollTop = $("#log").scrollHeight;
}

function renderCompare(){
  const res = ALGOS.map(a => ({a, r: run(a.id, start, goal)}));
  const best = res.find(x=>x.a.id==="dijkstra").r.cost;
  const maxE = Math.max(...res.map(x=>x.r.explored));
  let h = `<div class="cmp-row head"><span>Algoritmo</span><span>Nodos explorados</span><span>Costo</span><span>Aristas</span><span>¿Óptimo?</span></div>`;
  h += res.map(({a,r}) => {
    const opt = r.cost===best;
    return `<div class="cmp-row"><span class="name">${a.name}</span>
      <span class="bar-cell" style="display:flex;gap:10px;align-items:center"><span class="bar" style="flex:1"><i style="width:${r.explored/maxE*100}%"></i></span><span class="num">${r.explored}</span></span>
      <span class="num" data-l="Costo">${r.cost ?? "—"}</span>
      <span class="num" data-l="Aristas">${r.path ? r.path.length-1 : "—"}</span>
      <span data-l="Óptimo" class="${opt?"ok":"bad"}">${opt?"Sí":"No"}</span></div>`;
  }).join("");
  $("#cmp").innerHTML = h;
}

function recompute(){
  detener();
  R = run(algo, start, goal); idx = 0; pinned = null;
  $("#scrub").max = R.steps.length-1;
  renderStep(); renderCompare();
}
function setAlgo(a){
  algo=a;
  try{ if(location.hash.slice(1)!==a) history.replaceState(null,"","#"+a); }catch(_){}
  document.querySelectorAll("#algos button").forEach(b=>b.setAttribute("aria-pressed", b.dataset.a===a));
  $("#algoEyebrow").textContent = "Algoritmo activo"; $("#algoTitle").textContent = CODE[a].title;
  renderCode(); recompute();
}

/* ---------- reproducción ---------- */
const delay = () => 1500 - ($("#speed").value-1)*150;
function detener(){ if(timer){ clearTimeout(timer); timer=null; } $("#bPlay").textContent="▶ Reproducir"; }
function tick(){ if(idx < R.steps.length-1){ idx++; renderStep(); timer=setTimeout(tick, delay()); } else detener(); }
function play(){ if(timer){ detener(); return; } if(idx===R.steps.length-1){ idx=0; renderStep(); } $("#bPlay").textContent="❚❚ Pausa"; timer=setTimeout(tick, delay()); }
const go = i => { detener(); idx=Math.max(0,Math.min(R.steps.length-1,i)); renderStep(); };

/* ---------- teoría ---------- */
const THEORY = [
  {n:"BFS", full:"Breadth-First Search · búsqueda en anchura", ds:"Cola FIFO", idea:"Explora en ondas, como una gota en el agua: primero todos los vecinos del origen, luego los vecinos de esos, y así. No mira los pesos.", cx:"O(V + E)", opt:"Sí, pero en número de aristas. Si las calles pesan distinto, puede elegir una ruta corta en pasos y cara en costo.", uso:"Grados de separación en redes sociales, laberintos donde cada paso cuesta lo mismo, saltos mínimos en una red."},
  {n:"DFS", full:"Depth-First Search · búsqueda en profundidad", ds:"Pila LIFO (o recursión)", idea:"Se mete por un camino hasta el fondo y solo regresa cuando ya no puede avanzar. Encuentra a la meta, pero no necesariamente por la ruta corta.", cx:"O(V + E)", opt:"No. El camino depende del orden en que se revisan los vecinos.", uso:"Detectar ciclos, orden topológico de tareas, componentes conectadas, resolver y generar laberintos."},
  {n:"Dijkstra", full:"Edsger W. Dijkstra, 1956", ds:"Cola de prioridad por distancia", idea:"Siempre expande el nodo más cercano al origen que aún no está fijo. Cuando lo saca de la cola, su distancia ya es definitiva.", formula:"dist[v] = min(dist[v], dist[u] + peso(u, v))", cx:"O((V + E) log V) con heap", opt:"Sí, siempre que no haya pesos negativos.", uso:"Navegadores GPS (como base), protocolos de ruteo de internet como OSPF, redes de transporte."},
  {n:"A*", full:"Hart, Nilsson y Raphael, 1968", ds:"Cola de prioridad por f", idea:"Es Dijkstra con una brújula: además de lo que ya costó llegar (g), suma una estimación de lo que falta (h). Así explora primero hacia donde está la meta.", formula:"f(n) = g(n) + h(n)", cx:"O((V + E) log V) en el peor caso; en la práctica explora mucho menos que Dijkstra", opt:"Sí, si h es admisible (nunca sobreestima lo que falta).", uso:"Pathfinding en videojuegos, robots, apps de mapas que conocen las coordenadas de cada punto."},
];
$("#theory").innerHTML = THEORY.map(t=>`<article class="card th-card">
  <div class="row"><h3>${t.n}</h3><span class="ds">${t.ds}</span></div>
  <span class="eyebrow">${t.full}</span>
  <p>${t.idea}</p>
  ${t.formula?`<div class="formula">${t.formula}</div>`:""}
  <dl><dt>Complejidad</dt><dd>${t.cx}</dd><dt>¿Óptimo?</dt><dd>${t.opt}</dd><dt>Se usa en</dt><dd>${t.uso}</dd></dl>
</article>`).join("");

/* ---------- eventos ---------- */
$("#algos").innerHTML = ALGOS.map(a=>`<button data-a="${a.id}" aria-pressed="false">${a.name}<small>${a.sub}</small></button>`).join("");
$("#algos").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>setAlgo(b.dataset.a)));
$("#bPlay").addEventListener("click", play);
$("#bNext").addEventListener("click", ()=>go(idx+1));
$("#bPrev").addEventListener("click", ()=>go(idx-1));
$("#bReset").addEventListener("click", ()=>go(0));
$("#bEnd").addEventListener("click", ()=>go(R.steps.length-1));
$("#scrub").addEventListener("input", e=>go(+e.target.value));
$("#modeStart").addEventListener("click",()=>{clickMode="start";$("#modeStart").setAttribute("aria-pressed","true");$("#modeGoal").setAttribute("aria-pressed","false");});
$("#modeGoal").addEventListener("click",()=>{clickMode="goal";$("#modeGoal").setAttribute("aria-pressed","true");$("#modeStart").setAttribute("aria-pressed","false");});
$("#newGraph").addEventListener("click",()=>{ seed = Math.floor(Math.random()*1e9); G=genGraph(seed); buildSVG(); recompute(); });
document.addEventListener("keydown", e=>{
  if(e.target.closest("input,select,textarea")) return;
  if(e.key==="ArrowRight"){e.preventDefault();go(idx+1);}
  else if(e.key==="ArrowLeft"){e.preventDefault();go(idx-1);}
  else if(e.key===" " && !e.target.closest("button,.n,.code-line")){e.preventDefault();play();}
  else if(e.key==="Home"){e.preventDefault();go(0);}
  else if(e.key==="End"){e.preventDefault();go(R.steps.length-1);}
});

/* ---------- arranque ----------
 * grafos.html#bfs, #dfs, #dijkstra o #astar abre directo ese algoritmo (los usa la portada). */
const desdeHash = () => { const h = location.hash.slice(1); return ALGOS.some(a=>a.id===h) ? h : null; };
window.addEventListener("hashchange", () => { const h = desdeHash(); if(h && h!==algo) setAlgo(h); });

G = genGraph(seed); buildSVG();
const inicial = desdeHash();
setAlgo(inicial || "dijkstra");
if(!inicial){ idx = Math.min(14, R.steps.length-1); renderStep(); }
