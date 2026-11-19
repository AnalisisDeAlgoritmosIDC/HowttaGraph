/* HowttaGraph · equipo LEARN&TUDY
 * shell.js — barra superior y menú lateral compartidos (aprender.html y grafos.html):
 * abre/cierra el menú en celular, marca la sección activa y muestra nombre, XP, estrellas y avance
 * leyendo el progreso guardado en el navegador.
 */
"use strict";
(function () {
  const KEY = "howttagraph-progreso-v1", TOTAL_CLASES = 12;
  const q = s => document.querySelector(s);

  function leer() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; } }

  function refrescar() {
    const p = leer(), done = p.done || {};
    const hechas = Object.keys(done).length;
    const estrellas = Object.values(done).reduce((s, d) => s + (d.stars || 0), 0);
    const pct = Math.round(hechas / TOTAL_CLASES * 100);
    const nombre = (p.nombre || "").trim();
    q("#shXp").textContent = (p.xp || 0) + " XP";
    q("#shStars").textContent = estrellas;
    q("#shCount").textContent = hechas + "/" + TOTAL_CLASES;
    q("#shPct").textContent = pct + "%";
    q("#shBar").style.width = pct + "%";
    q("#shName").textContent = nombre ? nombre.split(/\s+/)[0] : "estudiante";
    q("#shAvatar").textContent = nombre ? nombre.split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase() : "HG";
  }

  function marcarActivo(clave) {
    document.querySelectorAll("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === clave));
  }

  const abrir = v => { document.body.classList.toggle("nav-open", v); q("#navToggle").setAttribute("aria-expanded", v); };
  q("#navToggle").addEventListener("click", () => abrir(!document.body.classList.contains("nav-open")));
  q("#backdrop").addEventListener("click", () => abrir(false));
  q("#sidebar").addEventListener("click", e => { if (e.target.closest("a")) abrir(false); });

  window.HG_SHELL = { refrescar, marcarActivo };
  refrescar();
})();
