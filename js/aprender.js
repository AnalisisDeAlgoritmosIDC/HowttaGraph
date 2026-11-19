/* HowttaGraph · equipo LEARN&TUDY
 * aprender.js — la app de estudio: escritorio (tablero por niveles), lista de clases, clases, evaluaciones,
 * reto final y reconocimiento. Las actividades prácticas viven en actividades.js.
 * Lee el contenido de curso.js (variable global CURSO).
 *
 * Vistas (según el #hash de la URL):
 *   #ruta              escritorio: avance + tablero de niveles (por defecto)
 *   #clases            todas las clases en lista      #nivel-2   clases de un nivel
 *   #clase-5           la clase número 5
 *   #reto              reto final                      #reconocimiento
 *   #actividades       actividades prácticas           #actividad-bfs, #actividad-dijkstra, ...
 *   #perfil            nombre y escuela del estudiante (se pide la primera vez que entra)
 */
"use strict";

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- progreso (se guarda en el navegador) ---------- */
const KEY = "howttagraph-progreso-v1";
const vacio = () => ({ done: {}, xp: 0, libre: false, reto: null, nombre: "", escuela: "", act: {} });
function cargar() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    if (s && typeof s.done === "object") return { ...vacio(), ...s, act: s.act || {} };
  } catch (_) {}
  return vacio();
}
function guardar() { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (_) {} if (window.HG_SHELL) HG_SHELL.refrescar(); }
let P = cargar();

/* ---------- índice de clases ---------- */
const CLASES = [];
CURSO.niveles.forEach((nv, ni) => nv.clases.forEach((c, ci) => CLASES.push({ ...c, ni, ci, num: CLASES.length + 1 })));
const TOTAL = CLASES.length;
const POR_INTENTO = CURSO.porIntento, MIN_CLASE = CURSO.minimoClase;
const DIFICULTAD = ["Básico", "Intermedio", "Avanzado", "Experto"];
const ALGO_NOMBRE = { bfs: "BFS", dfs: "DFS", dijkstra: "Dijkstra", astar: "A*" };

const desbloqueada = i => P.libre || i === 0 || !!P.done[CLASES[i - 1].id];
const completadas = () => CLASES.filter(c => P.done[c.id]).length;
const estrellas = () => CLASES.reduce((s, c) => s + (P.done[c.id] ? P.done[c.id].stars : 0), 0);
const retoAbierto = () => P.libre || completadas() === TOTAL;
const reconocido = () => !!(P.reto && P.reto.aprobado);
const siguiente = () => CLASES.findIndex((c, i) => desbloqueada(i) && !P.done[c.id]);

/* ---------- íconos de línea ---------- */
const ICON = {
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="9.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor"/></svg>',
  bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>',
  award: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.8 13.5L7.5 21l4.5-2.3 4.5 2.3-1.3-7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  bulb: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v4l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  quiz: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.4M12 16.6v.1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  board: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="4" width="5" height="16" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="9.5" y="4" width="5" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="15.5" y="4" width="5" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  list: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="5" cy="6" r="1.3" fill="currentColor"/><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="5" cy="18" r="1.3" fill="currentColor"/></svg>',
  puzzle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4h4v3a2 2 0 1 0 4 0V4h2v6h-3a2 2 0 1 0 0 4h3v6h-6v-3a2 2 0 1 0-4 0v3H4v-6h3a2 2 0 1 0 0-4H4V4z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  chart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  code: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8l-4 4 4 4M16 8l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ---------- utilidades de dibujo ---------- */
function resaltar(codigo) {
  const kw = /\b(def|while|for|if|in|not|return|import|from|continue|None|is|float|set|True|False|print|list)\b/g;
  return codigo.split("\n").map(linea => {
    const k = linea.indexOf("#");
    const cod = k >= 0 ? linea.slice(0, k) : linea, com = k >= 0 ? linea.slice(k) : "";
    let h = esc(cod).replace(/'([^']*)'/g, "<span class=\"st\">'$1'</span>").replace(kw, '<span class="kw">$1</span>');
    if (com) h += `<span class="cm">${esc(com)}</span>`;
    return h;
  }).join("\n");
}

let figId = 0;
// dibuja un grafo pequeño en SVG. Cada nodo lleva data-i con su índice (lo usan las actividades para los clics)
function figura(f, extraClass = "") {
  const r = 18, id = "fa" + (figId++);
  const conTags = f.n.some(n => n[4]), pad = conTags ? 16 : 0;
  let s = `<svg class="mfig ${extraClass}" viewBox="0 ${-pad} ${f.w} ${f.h + pad * 2}" role="img" aria-label="Grafo">`;
  if (f.dir) s += `<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" class="mf-arrow"/></marker></defs>`;
  for (const [a, b, w, st] of f.e) {
    const [x1, y1] = f.n[a], [x2, y2] = f.n[b];
    let bx = x2, by = y2;
    if (f.dir) { const d = Math.hypot(x2 - x1, y2 - y1); bx = x2 - (x2 - x1) / d * (r + 3); by = y2 - (y2 - y1) / d * (r + 3); }
    s += `<line class="mf-e${st ? " " + st : ""}" x1="${x1}" y1="${y1}" x2="${bx}" y2="${by}"${f.dir ? ` marker-end="url(#${id})"` : ""}/>`;
    if (w !== undefined && w !== null) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      s += `<g class="mf-w"><rect x="${mx - 11}" y="${my - 10}" width="22" height="20" rx="6"/><text x="${mx}" y="${my + 1}">${w}</text></g>`;
    }
  }
  f.n.forEach(([x, y, lbl, st, tag], i) => {
    s += `<g class="mf-n${st ? " " + st : ""}" data-i="${i}"><circle cx="${x}" cy="${y}" r="${r}"/><text x="${x}" y="${y + 1}">${esc(lbl)}</text>`;
    // la etiqueta va arriba en los nodos de la mitad superior y abajo en los de la inferior, para no tapar aristas
    if (tag) s += `<text class="mf-tag" x="${x}" y="${y < f.h / 2 ? y - r - 9 : y + r + 14}">${esc(tag)}</text>`;
    s += `</g>`;
  });
  return s + "</svg>";
}

function bloque(b, i) {
  if (b.h) return `<h2 class="sec" id="sec-${i}">${b.h}</h2>`;
  if (b.p) return `<p>${b.p}</p>`;
  if (b.key) return `<aside class="key"><span class="key-ico">${ICON.bulb}</span><div><span class="eyebrow">Idea clave</span><p>${b.key}</p></div></aside>`;
  if (b.list) return `<ul class="blist">${b.list.map(x => `<li>${x}</li>`).join("")}</ul>`;
  if (b.code) return `<div class="lcode"><div class="lcode-bar"><span>${ICON.code} Python</span><button class="copy" type="button">Copiar</button></div><pre><code>${resaltar(b.code)}</code></pre></div>`;
  if (b.fig) return `<figure class="lfig">${figura(b.fig)}${b.cap ? `<figcaption>${b.cap}</figcaption>` : ""}</figure>`;
  if (b.table) return `<div class="tbl-wrap"><table class="ltable"><thead><tr>${b.table.head.map(h => `<th>${h}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  if (b.try) return `<a class="try" href="grafos.html#${b.try}"><span class="try-ico">${ICON.play}</span><span><span class="eyebrow">Práctica guiada</span><b>Mira ${ALGO_NOMBRE[b.try]} trabajar paso a paso en el visualizador</b></span><span class="try-go">Abrir →</span></a>`;
  return "";
}

const estrellasHTML = (n, total = 3) => `<span class="stars" aria-label="${n} de ${total} estrellas">${Array.from({ length: total }, (_, i) => `<i class="${i < n ? "on" : ""}">${ICON.star}</i>`).join("")}</span>`;
const chipNivel = ni => `<span class="chip lv${ni + 1}">Nivel ${ni + 1} · ${esc(CURSO.niveles[ni].titulo)}</span>`;
function anillo(pct, size = 64, stroke = 9) {
  const r = 46, c = 2 * Math.PI * r;
  return `<svg class="ring" viewBox="0 0 110 110" width="${size}" height="${size}" aria-hidden="true">
    <circle cx="55" cy="55" r="${r}" class="ring-bg" stroke-width="${stroke}"/>
    <circle cx="55" cy="55" r="${r}" class="ring-fg" stroke-width="${stroke}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}" transform="rotate(-90 55 55)"/>
    <text x="55" y="55">${pct}%</text></svg>`;
}
function migas(items) {
  $("#crumbs").innerHTML = items.map((it, k) => k === items.length - 1 ? `<b>${esc(it[0])}</b>` : `<a href="${it[1]}">${esc(it[0])}</a><span>›</span>`).join("");
}

/* ---------- estado de una clase (para tablero y lista) ---------- */
function estadoClase(i) {
  const c = CLASES[i], d = P.done[c.id], open = desbloqueada(i), sig = siguiente();
  return d ? "done" : !open ? "locked" : i === sig ? "next" : "open";
}
const ETIQUETA = { done: "Aprobada", next: "Siguiente", open: "Disponible", locked: "Bloqueada" };

/* ---------- vista: escritorio ---------- */
function vistaRuta() {
  migas([["Aprender", "#ruta"], ["Escritorio"]]);
  const c = completadas(), pct = Math.round(c / TOTAL * 100);
  const actHechas = (window.ACTIVIDADES || []).filter(a => P.act[a.id]).length, actTotal = (window.ACTIVIDADES || []).length;

  let html = `<section class="stats">
    <div class="stat panel">${anillo(pct)}<div><span class="eyebrow">Avance</span><b>${c} de ${TOTAL} clases</b></div></div>
    <div class="stat panel"><span class="stat-ico xp">${ICON.bolt}</span><div><span class="eyebrow">Experiencia</span><b>${P.xp} XP</b></div></div>
    <div class="stat panel"><span class="stat-ico st">${ICON.star}</span><div><span class="eyebrow">Estrellas</span><b>${estrellas()} de ${TOTAL * 3}</b></div></div>
    <div class="stat panel"><span class="stat-ico ac">${ICON.puzzle}</span><div><span class="eyebrow">Actividades</span><b>${actHechas} de ${actTotal}</b></div></div>
  </section>
  <section class="panel">
    <div class="panel-head">
      <span class="muted small">Ruta de aprendizaje</span>
      <h2>De qué es un grafo a A*</h2>
      <div class="view-switch" role="group" aria-label="Vista"><a href="#ruta" class="on" title="Tablero">${ICON.board}<span>Tablero</span></a><a href="#clases" title="Lista">${ICON.list}<span>Lista</span></a></div>
    </div>
    <div class="board">`;

  CURSO.niveles.forEach((nv, ni) => {
    const mias = CLASES.filter(x => x.ni === ni);
    const hechas = mias.filter(x => P.done[x.id]).length;
    html += `<section class="col lv${ni + 1}" aria-labelledby="col${ni}">
      <header class="col-head"><span id="col${ni}">Nivel ${ni + 1} · ${esc(nv.titulo)}</span><span class="col-count">${hechas}/${mias.length}</span></header>
      <p class="col-desc">${DIFICULTAD[nv.dificultad - 1]} · ${nv.desc}</p>
      <div class="cards">`;
    mias.forEach(cl => {
      const i = CLASES.indexOf(cl), st = estadoClase(i), d = P.done[cl.id];
      const ico = st === "done" ? ICON.check : st === "locked" ? ICON.lock : cl.num;
      const inner = `<span class="kc-ico">${ico}</span>
        <span class="kc-main"><b>${esc(cl.titulo)}</b>${d ? estrellasHTML(d.stars) : `<span class="kc-state ${st}">${ETIQUETA[st]}</span>`}
        <span class="kc-meta"><span title="Duración">${ICON.clock}${cl.min} min</span><span title="Preguntas">${ICON.quiz}${POR_INTENTO} de ${cl.preguntas.length}</span></span></span>`;
      html += st === "locked" ? `<span class="kcard locked" aria-disabled="true">${inner}</span>` : `<a class="kcard ${st}" href="#clase-${cl.num}">${inner}</a>`;
    });
    html += `</div></section>`;
  });
  html += `</div></section>`;

  // después del curso
  const ra = retoAbierto(), rc = reconocido();
  html += `<section class="after">
    <a class="after-card ${ra ? "" : "locked"}" href="#reto"><span class="ac-ico lv2">${ICON.chart}</span><span><span class="eyebrow">Paso 1 · Reto final</span><b>${CURSO.reto.preguntas} preguntas de todo el curso</b><small>${P.reto ? `Mejor resultado: ${P.reto.best} / ${CURSO.reto.preguntas}` : ra ? "Disponible" : `Se abre al completar las ${TOTAL} clases`}</small></span></a>
    <a class="after-card ${rc ? "" : "locked"}" href="#reconocimiento"><span class="ac-ico lv4">${ICON.award}</span><span><span class="eyebrow">Paso 2 · Reconocimiento</span><b>${esc(CURSO.reconocimiento.titulo)}</b><small>${rc ? "Obtenido · descárgalo con tu nombre" : "Se obtiene al aprobar el reto"}</small></span></a>
    <a class="after-card ${rc || P.libre ? "" : "locked"}" href="#actividades"><span class="ac-ico lv1">${ICON.puzzle}</span><span><span class="eyebrow">Paso 3 · Actividades</span><b>Practica con grafos al azar</b><small>${rc || P.libre ? `${actHechas} de ${actTotal} completadas` : "Se desbloquean con el reconocimiento"}</small></span></a>
  </section>
  <section class="settings">
    <label class="switch" for="libre"><input type="checkbox" id="libre" ${P.libre ? "checked" : ""}> <span>Modo libre: desbloquear todo (para presentar o para el profesor)</span></label>
    <div id="resetBox"><button class="btn ghost small" id="reset" type="button">Reiniciar progreso</button></div>
  </section>`;
  $("#view").innerHTML = html;

  $("#libre").addEventListener("change", e => { P.libre = e.target.checked; guardar(); route(); });
  $("#reset").addEventListener("click", () => {
    $("#resetBox").innerHTML = `<span class="confirm">¿Borrar todo tu avance? <button class="btn small danger" id="resetSi" type="button">Sí, borrar</button> <button class="btn ghost small" id="resetNo" type="button">Cancelar</button></span>`;
    $("#resetSi").addEventListener("click", () => { P = { ...vacio(), nombre: P.nombre }; guardar(); route(); });
    $("#resetNo").addEventListener("click", () => route());
  });
}

/* ---------- vista: lista de clases (todas o de un nivel) ---------- */
function vistaLista(nivel) {
  const nv = nivel !== null ? CURSO.niveles[nivel] : null;
  migas(nv ? [["Aprender", "#ruta"], ["Clases", "#clases"], [`Nivel ${nivel + 1} · ${nv.titulo}`]] : [["Aprender", "#ruta"], ["Clases"]]);
  const filas = CLASES.filter(c => nivel === null || c.ni === nivel);
  $("#view").innerHTML = `<section class="panel">
    <div class="panel-head">
      <span class="muted small">${nv ? `${DIFICULTAD[nv.dificultad - 1]} · ${filas.filter(c => P.done[c.id]).length} de ${filas.length} aprobadas` : `${completadas()} de ${TOTAL} aprobadas`}</span>
      <h2>${nv ? `Nivel ${nivel + 1} · ${esc(nv.titulo)}` : "Todas las clases"}</h2>
      <div class="view-switch" role="group" aria-label="Vista"><a href="#ruta" title="Tablero">${ICON.board}<span>Tablero</span></a><a href="#clases" class="${nv ? "" : "on"}" title="Lista">${ICON.list}<span>Lista</span></a></div>
    </div>
    ${nv ? `<p class="list-desc">${nv.desc}</p>` : ""}
    <div class="tbl-scroll"><table class="list">
      <thead><tr><th>#</th><th>Clase</th><th>Nivel</th><th>Duración</th><th>Banco</th><th>Estado</th><th></th></tr></thead>
      <tbody>${filas.map(c => {
        const i = CLASES.indexOf(c), st = estadoClase(i), d = P.done[c.id];
        return `<tr class="${st}"><td class="num">${c.num}</td><td><b>${esc(c.titulo)}</b><small>${esc(c.objetivos[0])}</small></td>
          <td>${chipNivel(c.ni)}</td><td>${c.min} min</td><td>${c.preguntas.length} preguntas</td>
          <td>${d ? estrellasHTML(d.stars) : `<span class="kc-state ${st}">${ETIQUETA[st]}</span>`}</td>
          <td>${st === "locked" ? `<span class="lock-ico">${ICON.lock}</span>` : `<a class="btn small ${st === "next" ? "" : "ghost"}" href="#clase-${c.num}">${d ? "Repasar" : "Abrir"}</a>`}</td></tr>`;
      }).join("")}</tbody></table></div>
  </section>`;
}

/* ---------- vista: clase ---------- */
function vistaClase(i) {
  const c = CLASES[i];
  if (!c) { location.hash = "ruta"; return; }
  const nv = CURSO.niveles[c.ni];
  migas([["Aprender", "#ruta"], [`Nivel ${c.ni + 1} · ${nv.titulo}`, `#nivel-${c.ni + 1}`], [c.titulo]]);
  if (!desbloqueada(i)) {
    $("#view").innerHTML = bloqueado(ICON.lock, `Clase ${c.num}`, c.titulo, `Esta clase se desbloquea cuando apruebes <b>${esc(CLASES[i - 1].titulo)}</b>.`, `#clase-${i}`, "Ir a la clase anterior");
    return;
  }
  const d = P.done[c.id], prev = CLASES[i - 1], sig = CLASES[i + 1];
  const secciones = c.bloques.map((b, k) => b.h ? { k, t: b.h } : null).filter(Boolean);
  const delNivel = CLASES.filter(x => x.ni === c.ni);
  $("#view").innerHTML = `<div class="lesson-grid lv${c.ni + 1}">
    <article class="panel lesson">
      <header class="lesson-head">
        ${chipNivel(c.ni)}
        <h1>${esc(c.titulo)}</h1>
        <p class="meta"><span>${ICON.clock}${c.min} min de lectura</span><span>${ICON.quiz}Evaluación de ${POR_INTENTO} preguntas</span><span>${ICON.chart}${DIFICULTAD[nv.dificultad - 1]}</span>${d ? estrellasHTML(d.stars) : ""}</p>
        <nav class="tabs" aria-label="En esta clase">${secciones.map(s => `<a href="#sec-${s.k}" data-sec="sec-${s.k}">${s.t}</a>`).join("")}<a href="#repaso" data-sec="repaso">Repaso</a><a href="#evaluacion" data-sec="evaluacion">Evaluación</a></nav>
      </header>
      <div class="lesson-body">${c.bloques.map(bloque).join("")}</div>
      <section class="recap" id="repaso"><span class="eyebrow">Repaso rápido</span><ul>${c.resumen.map(o => `<li>${ICON.check}<span>${o}</span></li>`).join("")}</ul></section>
      <section class="quiz" id="evaluacion"></section>
      <nav class="pager">
        ${prev ? `<a href="#clase-${prev.num}" class="pg prev"><span class="eyebrow">← Anterior</span><b>${esc(prev.titulo)}</b></a>` : "<span></span>"}
        ${sig ? (desbloqueada(i + 1) ? `<a href="#clase-${sig.num}" class="pg next"><span class="eyebrow">Siguiente →</span><b>${esc(sig.titulo)}</b></a>` : `<span class="pg next locked"><span class="eyebrow">Siguiente · aprueba la evaluación</span><b>${esc(sig.titulo)}</b></span>`)
          : `<a href="#reto" class="pg next"><span class="eyebrow">Siguiente →</span><b>Reto final</b></a>`}
      </nav>
    </article>
    <aside class="side">
      <div class="panel side-card"><span class="eyebrow">Al terminar podrás</span><ul class="goals">${c.objetivos.map(o => `<li>${ICON.check}<span>${o}</span></li>`).join("")}</ul></div>
      <div class="panel side-card"><span class="eyebrow">Nivel ${c.ni + 1} · ${esc(nv.titulo)}</span>
        <ol class="mini">${delNivel.map(x => { const k = CLASES.indexOf(x), st = k === i ? "cur" : estadoClase(k);
          return `<li>${st === "locked" ? `<span class="mini-i locked">${ICON.lock}<span>${esc(x.titulo)}</span></span>` : `<a class="mini-i ${st}" href="#clase-${x.num}"><i>${st === "done" ? ICON.check : x.num}</i><span>${esc(x.titulo)}</span></a>`}</li>`; }).join("")}</ol></div>
      <a class="btn full" href="#evaluacion" data-sec="evaluacion">Ir a la evaluación</a>
    </aside></div>`;

  document.querySelectorAll("[data-sec]").forEach(a => a.addEventListener("click", e => { e.preventDefault(); document.getElementById(a.dataset.sec).scrollIntoView({ behavior: "smooth", block: "start" }); }));
  document.querySelectorAll(".copy").forEach(b => b.addEventListener("click", () => {
    const code = b.closest(".lcode").querySelector("code"), ok = () => { b.textContent = "Copiado"; setTimeout(() => (b.textContent = "Copiar"), 1500); };
    const sel = () => { const r = document.createRange(); r.selectNodeContents(code); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Seleccionado"; };
    try { navigator.clipboard.writeText(code.innerText).then(ok, sel); } catch (_) { sel(); }
  }));

  const inicio = () => {
    $("#evaluacion").innerHTML = `<div class="quiz-start">
      <span class="qs-ico">${ICON.quiz}</span>
      <div><span class="eyebrow">Evaluación</span><h2>¿Ya lo dominas?</h2>
      <p>${POR_INTENTO} preguntas al azar de un banco de ${c.preguntas.length}. Necesitas ${MIN_CLASE} correctas. Cada intento trae preguntas distintas.</p></div>
      <button class="btn" id="go" type="button">${d ? "Volver a evaluarme" : "Comenzar"} ${ICON.play}</button></div>`;
    $("#go").addEventListener("click", () => {
      const sel = barajar(c.preguntas.map(q => ({ ...q }))).slice(0, POR_INTENTO);
      cuestionario($("#evaluacion"), sel, res => resultadoClase(i, res, inicio));
    });
  };
  inicio();
}

function bloqueado(ico, eyebrow, titulo, texto, href, boton) {
  return `<section class="panel blocked"><span class="lock-big">${ico}</span><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(titulo)}</h1><p>${texto}</p><a class="btn" href="${href}">${boton} →</a></section>`;
}

function resultadoClase(i, res, reiniciar) {
  const c = CLASES[i], n = res.total, k = res.aciertos;
  const aprobada = k >= MIN_CLASE;
  const st = k === n ? 3 : 2;
  let ganado = 0, primera = false;
  if (aprobada) {
    const prev = P.done[c.id];
    primera = !prev;
    ganado = Math.max(0, k - (prev ? prev.score : 0)) * 10 + (primera ? 20 : 0);
    P.done[c.id] = { stars: Math.max(st, prev ? prev.stars : 0), score: Math.max(k, prev ? prev.score : 0), total: n };
    P.xp += ganado; guardar();
  }
  const sig = CLASES[i + 1];
  const finNivel = aprobada && (!sig || sig.ni !== c.ni) && CLASES.filter(x => x.ni === c.ni).every(x => P.done[x.id]);
  $("#evaluacion").innerHTML = `<div class="result ${aprobada ? "ok" : "fail"}">
    ${anillo(Math.round(k / n * 100), 92, 10)}
    <div class="res-txt">
      <span class="eyebrow">${aprobada ? (finNivel ? `¡Nivel ${c.ni + 1} completado!` : "Clase aprobada") : "Todavía no"}</span>
      <h2>${k} de ${n} correctas</h2>
      ${aprobada ? `<div class="big-stars">${estrellasHTML(st)}</div><p>${ganado ? `+${ganado} XP${primera ? " (incluye 20 de bono por aprobar la clase)" : ""}` : "Ya tenías este puntaje; no se suma XP."}</p>`
        : `<p>Necesitas ${MIN_CLASE} de ${n}. Revisa el repaso y vuelve a intentarlo: saldrán otras preguntas.</p>`}
      ${res.fallos.length ? `<details class="review"><summary>Revisar ${res.fallos.length === 1 ? "la pregunta que fallaste" : `las ${res.fallos.length} preguntas que fallaste`}</summary><ul>${res.fallos.map(q => `<li><b>${q.q}</b><span>Respuesta: ${q.o[q.a]}</span><small>${q.why}</small></li>`).join("")}</ul></details>` : ""}
      <div class="result-btns">
        ${aprobada ? (sig ? `<a class="btn" href="#clase-${sig.num}">Siguiente clase →</a>` : `<a class="btn" href="#reto">Ir al reto final →</a>`) : ""}
        <button class="btn ${aprobada ? "ghost" : ""}" id="again" type="button">Intentar con otras preguntas</button>
        <a class="btn ghost" href="#ruta">Escritorio</a>
      </div></div></div>`;
  $("#again").addEventListener("click", reiniciar);
  $("#evaluacion").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- cuestionario (lo usan las clases y el reto) ---------- */
let teclas = null;
document.addEventListener("keydown", e => { if (teclas && !e.target.closest("input,textarea")) teclas(e); });

function barajar(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function cuestionario(cont, preguntas, alTerminar) {
  let qi = 0, aciertos = 0;
  const fallos = [];
  const pintar = () => {
    const q = preguntas[qi];
    const fijo = q.o.length <= 2 || q.o.some(o => /anteriores|Empate/.test(o));
    const orden = fijo ? q.o.map((_, i) => i) : barajar(q.o.map((_, i) => i));
    cont.innerHTML = `<div class="qcard">
      <div class="qtop"><span class="eyebrow">${q.origen ? esc(q.origen) + " · " : ""}Pregunta ${qi + 1} de ${preguntas.length}</span><span class="qscore">${aciertos} correctas</span></div>
      <div class="qbar"><i style="width:${qi / preguntas.length * 100}%"></i></div>
      <h3 class="qq">${q.q}</h3>
      ${q.fig ? `<figure class="lfig small">${figura(q.fig)}</figure>` : ""}
      ${q.code ? `<div class="lcode"><pre><code>${resaltar(q.code)}</code></pre></div>` : ""}
      <div class="opts" role="group" aria-label="Opciones">${orden.map((oi, j) => `<button class="opt" type="button" data-o="${oi}"><span class="ok-l">${"ABCD"[j]}</span><span>${q.o[oi]}</span></button>`).join("")}</div>
      <div class="fb" id="fb" hidden></div>
      <p class="qhint">Atajo: teclas 1 a ${orden.length} para responder y Enter para continuar.</p>
    </div>`;
    const botones = [...cont.querySelectorAll(".opt")];
    let respondida = false;
    const responder = btn => {
      if (respondida) return; respondida = true;
      const bien = +btn.dataset.o === q.a;
      if (bien) aciertos++; else fallos.push(q);
      botones.forEach(b => { b.disabled = true; if (+b.dataset.o === q.a) b.classList.add("right"); });
      if (!bien) btn.classList.add("wrong");
      cont.querySelector(".qscore").textContent = `${aciertos} correctas`;
      const ultimo = qi === preguntas.length - 1;
      const fb = cont.querySelector("#fb");
      fb.hidden = false; fb.className = "fb " + (bien ? "ok" : "no");
      fb.innerHTML = `<div><b>${bien ? "¡Correcto!" : "No es correcta. La respuesta buena está marcada en verde."}</b><p>${q.why}</p></div>
        <button class="btn" id="nextQ" type="button">${ultimo ? "Ver resultado" : "Siguiente"} →</button>`;
      const avanzar = () => { if (ultimo) { teclas = null; alTerminar({ aciertos, total: preguntas.length, fallos }); } else { qi++; pintar(); cont.scrollIntoView({ block: "start" }); } };
      cont.querySelector("#nextQ").addEventListener("click", avanzar);
      cont.querySelector("#nextQ").focus({ preventScroll: true });
      teclas = e => { if (e.key === "Enter" && e.target.id !== "nextQ") { e.preventDefault(); avanzar(); } };
    };
    botones.forEach(b => b.addEventListener("click", () => responder(b)));
    teclas = e => { const n = parseInt(e.key, 10); if (n >= 1 && n <= botones.length) { e.preventDefault(); responder(botones[n - 1]); } };
  };
  pintar();
  cont.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- vista: reto final ---------- */
function vistaReto() {
  migas([["Aprender", "#ruta"], ["Reto final"]]);
  if (!retoAbierto()) {
    $("#view").innerHTML = bloqueado(ICON.lock, "Reto final", "Todavía no", `Completa las ${TOTAL} clases para presentar el reto. Llevas ${completadas()}.`, "#ruta", "Volver al escritorio");
    return;
  }
  const R = CURSO.reto, banco = CLASES.reduce((s, c) => s + c.preguntas.length, 0);
  const inicio = () => {
    $("#view").innerHTML = `<section class="panel narrow"><div class="panel-body"><section class="quiz" id="evaluacion"><div class="quiz-start">
        <span class="qs-ico lv2">${ICON.chart}</span>
        <div><span class="eyebrow">Evaluación de todo el curso</span><h2>${R.titulo}</h2>
        <p>${R.preguntas} preguntas al azar de un banco de ${banco}. Necesitas ${R.minimo} correctas para obtener tu reconocimiento de <b>${CURSO.reconocimiento.titulo}</b>.</p>
        <p class="who">Se emitirá a nombre de <b>${esc(P.nombre)}</b>${P.escuela ? ` · ${esc(P.escuela)}` : ""}. <a href="#perfil">¿No es correcto?</a></p></div>
        <button class="btn" id="go" type="button">Comenzar ${ICON.play}</button></div></section></div></section>`;
    $("#go").addEventListener("click", () => {
      const todas = CLASES.flatMap(c => c.preguntas.map(q => ({ ...q, origen: c.titulo, claseNum: c.num })));
      cuestionario($("#evaluacion"), barajar(todas).slice(0, R.preguntas), res => resultadoReto(res, inicio));
    });
  };
  inicio();
}

function resultadoReto(res, reiniciar) {
  const R = CURSO.reto, ok = res.aciertos >= R.minimo;
  const antes = P.reto || {};
  P.reto = { ...antes, best: Math.max(res.aciertos, antes.best || 0) };
  if (ok && !antes.aprobado) {
    P.reto.aprobado = true;
    P.reto.fecha = new Date().toISOString();
    P.reto.aciertos = res.aciertos;
    P.reto.folio = "HG-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    P.xp += 100;
  } else if (ok) P.reto.aciertos = Math.max(res.aciertos, antes.aciertos || 0);
  guardar();
  const repasar = [...new Map(res.fallos.map(q => [q.claseNum, q.origen])).entries()].sort((a, b) => a[0] - b[0]);
  $("#evaluacion").innerHTML = `<div class="result ${ok ? "ok" : "fail"}">
    ${anillo(Math.round(res.aciertos / res.total * 100), 92, 10)}
    <div class="res-txt">
    <span class="eyebrow">${ok ? "¡Aprobaste el reto final!" : "Casi lo logras"}</span>
    <h2>${res.aciertos} de ${res.total}</h2>
    ${ok ? `<p>${antes.aprobado ? "Ya tenías tu reconocimiento." : "Ganaste 100 XP, tu reconocimiento y desbloqueaste las actividades."}</p>` : `<p>Necesitas ${R.minimo}. Te conviene repasar estas clases:</p>`}
    ${!ok && repasar.length ? `<ul class="to-review">${repasar.map(([n, t]) => `<li><a href="#clase-${n}">Clase ${n} · ${esc(t)}</a></li>`).join("")}</ul>` : ""}
    <div class="result-btns">${ok ? `<a class="btn" href="#reconocimiento">Ver mi reconocimiento</a><a class="btn ghost" href="#actividades">Ir a actividades</a>` : ""}
      <button class="btn ${ok ? "ghost" : ""}" id="again" type="button">Intentar con otras preguntas</button></div>
  </div></div>`;
  $("#again").addEventListener("click", reiniciar);
}

/* ---------- vista: reconocimiento ---------- */
const fechaLarga = iso => new Date(iso).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

function vistaReconocimiento() {
  migas([["Aprender", "#ruta"], ["Reconocimiento"]]);
  if (!reconocido()) {
    $("#view").innerHTML = bloqueado(ICON.award, "Reconocimiento", "Aún no lo obtienes", `Completa las ${TOTAL} clases y aprueba el reto final con al menos ${CURSO.reto.minimo} de ${CURSO.reto.preguntas}.`, "#ruta", "Volver al escritorio");
    return;
  }
  const R = P.reto;
  $("#view").innerHTML = `<div class="cert-page">
      <div class="panel cert-form">
        <span class="eyebrow">Tu reconocimiento</span><h2>¡Felicidades!</h2>
        <p class="muted">Este reconocimiento se otorga a:</p>
        <p class="cert-owner"><b>${esc(P.nombre)}</b>${P.escuela ? `<span>${esc(P.escuela)}</span>` : ""}</p>
        <a class="btn ghost small" href="#perfil">Corregir mis datos</a>
        <button class="btn" id="descargar" type="button">Descargar como imagen (PNG)</button>
        <p class="muted small" id="dlmsg">La imagen se genera en tu navegador.</p>
        <a class="next-step" href="#actividades"><span class="ac-ico lv1">${ICON.puzzle}</span><span><b>Sigue practicando</b><small>Ya puedes entrar a las actividades</small></span></a>
      </div>
      <div class="cert" id="cert">
        <div class="cert-in">
          <div class="cert-top"><span class="brand"><span class="brand-mark" aria-hidden="true"></span><span>Howtta<b>Graph</b></span></span><span class="eyebrow">Folio ${esc(R.folio)}</span></div>
          <span class="eyebrow cert-kind">Reconocimiento de aprendizaje</span>
          <h2 class="cert-title">${esc(CURSO.reconocimiento.titulo)}</h2>
          <span class="cert-to">Se otorga a</span>
          <p class="cert-name" id="certName">${esc(P.nombre)}</p>
          ${P.escuela ? `<span class="cert-school">${esc(P.escuela)}</span>` : ""}
          <p class="cert-text">${esc(CURSO.reconocimiento.texto)}</p>
          <div class="cert-foot">
            <div><span class="eyebrow">Fecha</span><b>${fechaLarga(R.fecha)}</b></div>
            <div><span class="eyebrow">Reto final</span><b>${R.aciertos} / ${CURSO.reto.preguntas}</b></div>
            <div><span class="eyebrow">Otorgado por</span><b>Equipo LEARN&amp;TUDY</b></div>
          </div>
        </div>
      </div>
    </div>`;
  $("#descargar").addEventListener("click", descargarReconocimiento);
}

// dibuja el reconocimiento en un canvas de 2000 × 1414 (hoja A4 horizontal) y lo descarga como PNG
async function descargarReconocimiento() {
  const R = P.reto, W = 2000, H = 1414;
  try { await document.fonts.load("500 60px Lora"); await document.fonts.load("400 40px \"Source Sans 3\""); } catch (_) {}
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  const F = (w, s) => `${w} ${s}px "Source Sans 3", "Segoe UI", system-ui, sans-serif`;
  const S = (w, s) => `${w} ${s}px Lora, Georgia, serif`;   // serif para título y nombre
  const LV = ["#6FAA5E", "#D99A45", "#4F97C4", "#9178C2"];
  x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, W, H);
  x.strokeStyle = "#ECECE9"; x.lineWidth = 4; x.strokeRect(60, 60, W - 120, H - 120);
  LV.forEach((c, i) => { x.fillStyle = c; x.fillRect(60 + i * (W - 120) / 4, 60, (W - 120) / 4, 16); });
  x.strokeStyle = LV[0]; x.lineWidth = 7; x.beginPath(); x.arc(170, 200, 21, 0, 7); x.stroke();
  x.fillStyle = LV[3]; x.beginPath(); x.arc(195, 226, 10, 0, 7); x.fill();
  x.textBaseline = "middle"; x.textAlign = "left";
  x.fillStyle = "#2F3437"; x.font = S(500, 44); x.fillText("Howtta", 225, 202);
  const wH = x.measureText("Howtta").width; x.fillStyle = "#3D6E9E"; x.font = S(600, 44); x.fillText("Graph", 225 + wH, 202);
  x.textAlign = "right"; x.fillStyle = "#8C9196"; x.font = F(500, 28); x.fillText("FOLIO " + R.folio, W - 150, 202);
  x.textAlign = "center"; x.fillStyle = "#8C9196"; x.font = F(500, 30); x.fillText("RECONOCIMIENTO DE APRENDIZAJE", W / 2, 400);
  x.fillStyle = "#2F3437"; x.font = S(500, 92); x.fillText(CURSO.reconocimiento.titulo, W / 2, 510);
  x.fillStyle = "#8C9196"; x.font = F(400, 34); x.fillText("Se otorga a", W / 2, 640);
  x.fillStyle = "#3D6E9E"; x.font = S(500, 82); x.fillText(P.nombre || "Estudiante de HowttaGraph", W / 2, 740);
  x.strokeStyle = "#ECECE9"; x.lineWidth = 3; x.beginPath(); x.moveTo(W / 2 - 520, 810); x.lineTo(W / 2 + 520, 810); x.stroke();
  const extra = P.escuela ? 50 : 0;
  if (P.escuela) { x.fillStyle = "#8C9196"; x.font = F(400, 32); x.fillText(P.escuela, W / 2, 855); }
  x.fillStyle = "#4C5257"; x.font = F(400, 36);
  const palabras = CURSO.reconocimiento.texto.split(" "); let linea = ""; const lineas = [];
  for (const p of palabras) { const t = linea ? linea + " " + p : p; if (x.measureText(t).width > 1400) { lineas.push(linea); linea = p; } else linea = t; }
  lineas.push(linea); lineas.forEach((l, k) => x.fillText(l, W / 2, 880 + extra + k * 54));
  [["FECHA", fechaLarga(R.fecha)], ["RETO FINAL", `${R.aciertos} / ${CURSO.reto.preguntas}`], ["OTORGADO POR", "Equipo LEARN&TUDY"]].forEach(([a, b], k) => {
    const cx = W / 2 + (k - 1) * 520; x.fillStyle = "#8C9196"; x.font = F(500, 24); x.fillText(a, cx, 1170); x.fillStyle = "#2F3437"; x.font = F(600, 36); x.fillText(b, cx, 1220);
  });
  cv.toBlob(blob => {
    if (!blob) { $("#dlmsg").textContent = "No se pudo generar la imagen."; return; }
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = "reconocimiento-howttagraph.png"; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    $("#dlmsg").textContent = "Listo. Si no se descargó, revisa los permisos de descarga de tu navegador.";
  }, "image/png");
}

/* ---------- vista: bienvenida y perfil del estudiante ---------- */
// La primera vez que alguien entra se le pide su nombre: es el que aparecerá en su reconocimiento.
function formularioPerfil(bienvenida) {
  return `<form class="panel profile" id="perfilForm" novalidate>
    ${bienvenida ? `<span class="brand-mark big" aria-hidden="true"></span>
      <span class="eyebrow">Bienvenido a HowttaGraph</span><h1>Antes de empezar, ¿cómo te llamas?</h1>
      <p class="muted">Tu nombre aparecerá en tu <b>Reconocimiento de ${esc(CURSO.reconocimiento.titulo)}</b> al terminar el curso. Escríbelo como quieres que se lea.</p>`
    : `<span class="eyebrow">Mi perfil</span><h1>Tus datos</h1>
      <p class="muted">${reconocido() ? "Tu reconocimiento ya fue emitido; si corriges tu nombre, se actualiza al instante." : "Así aparecerás en tu reconocimiento."}</p>`}
    <label class="lbl" for="pNombre">Nombre completo <span class="req">obligatorio</span></label>
    <input id="pNombre" type="text" maxlength="60" autocomplete="name" placeholder="Ej. Ana Sofía López Pérez" value="${esc(P.nombre)}" required>
    <small class="err" id="errNombre" hidden>Escribe al menos tu nombre y un apellido.</small>
    <label class="lbl" for="pEscuela">Escuela o institución <span class="opt-tag">opcional</span></label>
    <input id="pEscuela" type="text" maxlength="80" autocomplete="organization" placeholder="Ej. Universidad de Guadalajara, CUCEI" value="${esc(P.escuela || "")}">
    <div class="preview-name"><span class="eyebrow">Así se verá en tu reconocimiento</span><b id="pvNombre">${esc(P.nombre) || "Tu nombre"}</b><span id="pvEscuela">${esc(P.escuela || "")}</span></div>
    <button class="btn" type="submit">${bienvenida ? "Empezar a aprender" : "Guardar cambios"}</button>
    <p class="muted small">Tus datos se guardan solo en este navegador.</p>
  </form>`;
}
function vistaPerfil(bienvenida) {
  migas(bienvenida ? [["Bienvenida"]] : [["Aprender", "#ruta"], ["Mi perfil"]]);
  $("#view").innerHTML = `<div class="profile-wrap">${formularioPerfil(bienvenida)}</div>`;
  const n = $("#pNombre"), e = $("#pEscuela");
  const vista = () => { $("#pvNombre").textContent = n.value.trim() || "Tu nombre"; $("#pvEscuela").textContent = e.value.trim(); };
  n.addEventListener("input", () => { vista(); $("#errNombre").hidden = true; n.classList.remove("invalid"); });
  e.addEventListener("input", vista);
  $("#perfilForm").addEventListener("submit", ev => {
    ev.preventDefault();
    const nombre = n.value.trim().replace(/\s+/g, " ");
    if (nombre.split(" ").length < 2 || nombre.length < 5) { $("#errNombre").hidden = false; n.classList.add("invalid"); n.focus(); return; }
    P.nombre = nombre; P.escuela = e.value.trim().replace(/\s+/g, " ");
    if (!P.registro) P.registro = new Date().toISOString();
    guardar();
    if (bienvenida) route(); else location.hash = reconocido() ? "reconocimiento" : "ruta";
  });
  if (bienvenida) n.focus();
}

/* ---------- buscador ---------- */
const sinAcentos = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const INDICE = CLASES.map(c => ({ c, txt: sinAcentos([c.titulo, ...c.objetivos, ...c.resumen, ...c.bloques.filter(b => b.h).map(b => b.h)].join(" ").replace(/<[^>]+>/g, "")) }));
function buscar(q) {
  const box = $("#searchResults"), t = sinAcentos(q.trim());
  if (t.length < 2) { box.hidden = true; return; }
  const res = INDICE.filter(x => t.split(/\s+/).every(w => x.txt.includes(w))).slice(0, 6);
  box.innerHTML = res.length ? res.map(({ c }) => {
    const i = CLASES.indexOf(c), st = estadoClase(i);
    return `<a href="${st === "locked" ? "#ruta" : `#clase-${c.num}`}" class="sr lv${c.ni + 1}"><i></i><span><b>${esc(c.titulo)}</b><small>Nivel ${c.ni + 1} · ${ETIQUETA[st]}</small></span></a>`;
  }).join("") : `<p class="sr-empty">Sin resultados para “${esc(q)}”.</p>`;
  box.hidden = false;
}
$("#buscar").addEventListener("input", e => buscar(e.target.value));
$("#buscar").addEventListener("focus", e => buscar(e.target.value));
$("#buscar").addEventListener("keydown", e => { if (e.key === "Escape") { e.target.value = ""; $("#searchResults").hidden = true; } });
document.addEventListener("click", e => { if (!e.target.closest(".search")) $("#searchResults").hidden = true; });
$("#searchResults").addEventListener("click", () => { $("#searchResults").hidden = true; $("#buscar").value = ""; });

/* ---------- navegación ---------- */
function route() {
  teclas = null;
  const h = location.hash.slice(1) || "ruta";
  let m, nav = h;
  if (!P.nombre) { vistaPerfil(true); HG_SHELL.marcarActivo(""); HG_SHELL.refrescar(); window.scrollTo(0, 0); return; }
  if ((m = h.match(/^clase-(\d+)$/))) { vistaClase(+m[1] - 1); nav = "nivel-" + ((CLASES[+m[1] - 1] || CLASES[0]).ni + 1); }
  else if ((m = h.match(/^nivel-([1-4])$/))) vistaLista(+m[1] - 1);
  else if (h === "clases") vistaLista(null);
  else if (h === "reto") vistaReto();
  else if (h === "reconocimiento") vistaReconocimiento();
  else if (h === "actividades") vistaActividades();
  else if (h === "perfil") vistaPerfil(false);
  else if ((m = h.match(/^actividad-([a-z]+)$/))) { vistaActividad(m[1]); nav = "actividades"; }
  else { vistaRuta(); nav = "ruta"; }
  HG_SHELL.marcarActivo(nav);
  const sig = siguiente();
  $("#quick").href = sig >= 0 ? `#clase-${sig + 1}` : reconocido() ? "#actividades" : "#reto";
  $("#quick span").textContent = sig >= 0 ? `Continuar: ${CLASES[sig].titulo}` : reconocido() ? "Ir a actividades" : "Presentar reto final";
  HG_SHELL.refrescar();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
route();
