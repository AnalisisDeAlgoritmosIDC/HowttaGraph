/* HowttaGraph · equipo LEARN&TUDY
 * portada.js — integrantes del equipo y animación del grafo de la portada.
 */
"use strict";

/* ---------- integrantes (edita aquí) ---------- */
const INTEGRANTES = [
  { nombre: "Carlos Adrian Ramirez Gutiérrez", rol: "Visualizador y motor de la ruta de aprendizaje" },
  { nombre: "Isaac Saldivar Zaldivar", rol: "Algoritmos y contenido de las clases" },
  { nombre: "Daniel Padilla Echeverria", rol: "Portada, diseño de la ruta y documentación" },
];

const team = document.getElementById("team");
const coloresAv = ["--accent", "--st-closed", "--st-path", "--goal", "--st-cur"];
team.innerHTML = INTEGRANTES.map((p, i) => {
  const ini = p.nombre.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return `<li><span class="av" style="background:var(${coloresAv[i % coloresAv.length]})">${ini}</span>
    <span class="who"><b>${p.nombre}</b><span>${p.rol}</span></span></li>`;
}).join("");

/* ---------- animación: BFS que se expande y luego marca el camino ---------- */
const cv = document.getElementById("demo");
const ctx = cv.getContext("2d");
const W = 560, H = 420;
const dpr = Math.min(window.devicePixelRatio || 1, 2);
cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);

const N = [[60,70],[190,50],[330,80],[470,55],[95,200],[230,180],[360,210],[500,190],[60,340],[200,330],[340,350],[490,330]];
const E = [[0,1],[1,2],[2,3],[0,4],[1,5],[2,6],[3,7],[4,5],[5,6],[6,7],[4,8],[5,9],[6,10],[7,11],[8,9],[9,10],[10,11],[1,4],[6,11],[2,5]];
const ORIG = 0, META = 11;
const adj = N.map(() => []);
E.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
adj.forEach(l => l.sort((x, y) => x - y));

// grabamos los eventos de un BFS real para animarlos
function bfsEventos() {
  const ev = [], padre = { [ORIG]: null }, cola = [ORIG], vis = new Set([ORIG]);
  ev.push({ t: "front", n: ORIG });
  while (cola.length) {
    const u = cola.shift();
    ev.push({ t: "closed", n: u });
    if (u === META) break;
    for (const v of adj[u]) if (!vis.has(v)) { vis.add(v); padre[v] = u; cola.push(v); ev.push({ t: "front", n: v, from: u }); }
  }
  const camino = []; for (let n = META; n !== null; n = padre[n]) camino.unshift(n);
  return { ev, camino };
}
const { ev, camino } = bfsEventos();

const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
let ultimo = [0, 0];
function draw(k, pathK) {
  ultimo = [k, pathK];
  const c = { ink: css("--ink"), edge: css("--edge"), tree: css("--tree"), idle: css("--st-idle"), front: css("--st-front"),
    closed: css("--st-closed"), path: css("--st-path"), accent: css("--accent"), goal: css("--goal") };
  const est = N.map(() => "idle"), arbol = [];
  for (let i = 0; i < k; i++) { const e = ev[i]; est[e.n] = e.t; if (e.from !== undefined) arbol.push([e.from, e.n]); }
  const enCamino = new Set(camino.slice(0, pathK));
  ctx.clearRect(0, 0, W, H);
  ctx.lineCap = "round";
  const linea = (a, b, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(...N[a]); ctx.lineTo(...N[b]); ctx.stroke(); };
  E.forEach(([a, b]) => linea(a, b, c.edge, 2.5));
  arbol.forEach(([a, b]) => linea(a, b, c.tree, 4));
  for (let i = 1; i < pathK && i < camino.length; i++) linea(camino[i - 1], camino[i], c.path, 8);
  N.forEach(([x, y], i) => {
    if (i === ORIG || i === META) {
      ctx.strokeStyle = i === ORIG ? c.accent : c.goal; ctx.lineWidth = 3.5;
      ctx.setLineDash(i === META ? [6, 4] : []); ctx.beginPath(); ctx.arc(x, y, 27, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.fillStyle = enCamino.has(i) ? c.path : c[est[i]];
    ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(x, y, 20, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = (est[i] === "idle" || est[i] === "front") && !enCamino.has(i) ? c.ink : "#FFFFFF";
    ctx.font = "600 16px 'Source Sans 3', system-ui, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("ABCDEFGHIJKL"[i], x, y + 1);
  });
}

const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (quieto) draw(ev.length, camino.length);
else {
  let k = 0, p = 0;
  const paso = () => {
    if (k < ev.length) { k++; draw(k, 0); setTimeout(paso, 380); }
    else if (p < camino.length) { p++; draw(k, p); setTimeout(paso, 260); }
    else setTimeout(() => { k = 0; p = 0; draw(0, 0); setTimeout(paso, 700); }, 2600);
  };
  draw(0, 0); setTimeout(paso, 500);
}
// redibuja si cambia el tema claro/oscuro
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => draw(...ultimo));
