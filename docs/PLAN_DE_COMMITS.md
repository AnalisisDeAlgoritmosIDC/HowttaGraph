# Plan de commits · HowttaGraph

Reparto del trabajo del equipo LEARN&TUDY para que cada integrante suba sus propios archivos con su propio usuario de git.

| Integrante | Archivos | Commits |
|---|---|---|
| **Carlos** Adrian Ramirez Gutiérrez | `README.md`, `.gitignore`, `css/base.css`, `js/grafo.js`, `grafos.html`, `js/visualizador.js` | 5 |
| **Isaac** Saldivar Zaldivar | `js/algoritmos.js`, `css/grafos.css`, `docs/ALGORITMOS.md`, `docs/PLAN_DE_COMMITS.md` | 4 |
| **Daniel** Padilla Echeverria | `index.html`, `css/portada.css`, `js/portada.js`, `docs/MANUAL.md`, `docs/DOCUMENTACION.md` | 5 |

---

## 0. Preparación (una sola vez)

**Carlos** crea el repositorio `howttagraph` en GitHub (vacío, sin README) y agrega a Isaac y Daniel en *Settings → Collaborators*.

**Cada integrante**, en su computadora:

```bash
git clone https://github.com/USUARIO/howttagraph.git
cd howttagraph

# que el commit salga con TU nombre y TU correo de GitHub
git config user.name "Tu Nombre"
git config user.email "tu-correo-de-github@ejemplo.com"
```

Cada quien descarga el zip del proyecto completo y **solo copia a su carpeta los archivos que le tocan**, respetando las subcarpetas (`css/`, `js/`, `docs/`).

> **Regla de oro:** antes de cada commit, `git pull`. Después de cada commit, `git push`.

---

## 1. Ronda 1 · Base del proyecto (Carlos)

```bash
git pull
git add README.md .gitignore
git commit -m "chore: estructura inicial del proyecto y README"
git add css/base.css
git commit -m "feat(estilos): paleta de colores, tipografías y tema oscuro"
git add js/grafo.js
git commit -m "feat(grafo): generación del mapa con pesos y lista de adyacencia"
git push
```

## 2. Ronda 2 · Algoritmos (Isaac)

```bash
git pull
git add js/algoritmos.js
git commit -m "feat(algoritmos): BFS, DFS, Dijkstra y A* con código Python explicado"
git add css/grafos.css
git commit -m "feat(estilos): estilos del visualizador, código, tablas y comparativa"
git push
```

## 3. Ronda 3 · Visualizador (Carlos)

```bash
git pull
git add grafos.html
git commit -m "feat(visualizador): maqueta de la página del visualizador"
git add js/visualizador.js
git commit -m "feat(visualizador): dibujo del grafo, controles paso a paso, tabla y comparativa"
git push
```

Aquí `grafos.html` ya funciona completo.

## 4. Ronda 4 · Portada (Daniel)

```bash
git pull
git add index.html
git commit -m "feat(portada): página de presentación de HowttaGraph"
git add css/portada.css
git commit -m "feat(portada): estilos de la portada"
git add js/portada.js
git commit -m "feat(portada): animación de BFS e integrantes del equipo"
git push
```

## 5. Ronda 5 · Documentación (Isaac y Daniel)

**Isaac:**

```bash
git pull
git add docs/ALGORITMOS.md
git commit -m "docs: teoría, complejidad y comparación de los algoritmos"
git add docs/PLAN_DE_COMMITS.md
git commit -m "docs: plan de trabajo y reparto de commits"
git push
```

**Daniel** (después de que Isaac haga push):

```bash
git pull
git add docs/MANUAL.md
git commit -m "docs: manual de usuario"
git add docs/DOCUMENTACION.md
git commit -m "docs: documentación técnica"
git push
```

---

## Verificar

```bash
git log --oneline --format="%h %an  %s"
```

Deben aparecer los 14 commits con el nombre de cada quien. En GitHub se ve en *Insights → Contributors*.

## Si algo sale mal

| Error | Solución |
|---|---|
| `rejected ... fetch first` al hacer push | Alguien subió antes. Haz `git pull` y vuelve a hacer `git push` |
| El commit salió con otro nombre | Revisa `git config user.name` y `git config user.email` dentro de la carpeta del repo |
| Se me olvidó un archivo en el commit | `git add archivo` y `git commit --amend --no-edit` (solo si todavía no hiciste push) |
| GitHub no me deja hacer push | Acepta la invitación de colaborador que llegó a tu correo |
