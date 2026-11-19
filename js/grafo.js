/* HowttaGraph · equipo LEARN&TUDY
 * Generación del grafo (nodos, aristas con peso, lista de adyacencia) y utilidades.
 */
"use strict";
const $ = s => document.querySelector(s);
const NS = "http://www.w3.org/2000/svg";
const LABELS = "ABCDEFGHIJKLMNO";
const L = i => LABELS[i];


/* ---------- grafo ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
let G = null;
function genGraph(seed){
  const R = mulberry32(seed), C = 5, RW = 3, nodes = [], edges = [];
  for(let r=0;r<RW;r++) for(let c=0;c<C;c++)
    nodes.push({x: 90 + c*160 + (R()-.5)*70, y: 85 + r*165 + (R()-.5)*55});
  const id = (r,c) => r*C+c;
  const add = (a,b) => {
    const d = Math.hypot(nodes[a].x-nodes[b].x, nodes[a].y-nodes[b].y);
    const extra = R() < .35 ? 1 + Math.floor(R()*3) : 0;
    edges.push({a,b,w: Math.ceil(d/40) + extra});
  };
  for(let r=0;r<RW;r++) for(let c=0;c<C;c++){
    if(c<C-1) add(id(r,c), id(r,c+1));
    if(r<RW-1 && (c===0 || R()<.7)) add(id(r,c), id(r+1,c));
    if(r<RW-1 && c<C-1 && R()<.45){ if(R()<.5) add(id(r,c), id(r+1,c+1)); else add(id(r,c+1), id(r+1,c)); }
  }
  const adj = nodes.map(()=>[]);
  edges.forEach((e,i)=>{ adj[e.a].push({to:e.b,w:e.w,e:i}); adj[e.b].push({to:e.a,w:e.w,e:i}); });
  adj.forEach(list=>list.sort((p,q)=>p.to-q.to));
  return {nodes, edges, adj};
}
const edgeIndex = (a,b) => { const f = G.adj[a].find(x=>x.to===b); return f ? f.e : -1; };
const hOf = (n,goal) => Math.floor(Math.hypot(G.nodes[n].x-G.nodes[goal].x, G.nodes[n].y-G.nodes[goal].y)/40*10)/10;
const fmt = v => v===Infinity ? "∞" : (Number.isInteger(v) ? String(v) : v.toFixed(1));

