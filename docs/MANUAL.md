# Manual de usuario · HowttaGraph

Equipo LEARN&TUDY

## 1. Abrir la página

Abre `index.html` en cualquier navegador moderno (Chrome, Edge, Firefox o Safari). No se necesita instalar nada.

## 2. Portada

En la portada encontrarás:

- **Empezar a aprender**: abre la ruta de aprendizaje por niveles.
- **Ir al visualizador**: abre la herramienta para ver los algoritmos paso a paso.
- **Tarjetas de algoritmos**: cada una abre el visualizador con ese algoritmo ya seleccionado.
- **Cómo se usa** y **Equipo**.

## 3. Ruta de aprendizaje

Entra con **Empezar a aprender** en la portada o con **Aprender** en la barra superior.

### 3.0 Tu nombre

La primera vez que entras, HowttaGraph te pide tu **nombre completo** (obligatorio, al menos nombre y un apellido) y tu **escuela** (opcional). Así aparecerán en tu reconocimiento. Puedes corregirlos cuando quieras dando clic en tu nombre o avatar, arriba a la derecha (**Mi perfil**). Antes del reto final también se te muestra a nombre de quién se emitirá.

### 3.1 La ruta

- Arriba ves tu avance (porcentaje, XP, estrellas) y una tarjeta con la clase que te toca y el botón **Continuar**.
- Hay 4 niveles, cada uno con su color y dificultad: Básico, Intermedio, Avanzado y Experto.
- En cada clase: ✓ significa aprobada (con sus estrellas), **Empezar** es la que te toca y el candado indica que está bloqueada.

### 3.2 Una clase

1. A la izquierda está el **contenido del curso** para saltar entre clases (en celular, tócalo para desplegarlo).
2. Lee los **objetivos** y usa **En esta clase** para ir a cualquier sección.
3. Lee la explicación. Los recuadros **Idea clave** resumen lo más importante y los bloques de código tienen botón **Copiar**.
4. En las clases de algoritmos, la **práctica guiada** abre el visualizador.
5. Revisa el **Repaso rápido** y presiona **Comenzar evaluación**.

### 3.3 Las preguntas

- Elige una opción con el mouse o con las teclas **1 a 4**.
- Verás si acertaste y la explicación de la respuesta correcta.
- Son 5 preguntas al azar de un banco de 10 a 12. Para aprobar necesitas 4.
- Si apruebas, se desbloquea la siguiente clase y ganas XP y estrellas (3 si sacas 5 de 5).
- Al terminar puedes abrir **Revisar las preguntas que fallaste** para ver la respuesta correcta y su explicación.
- Si no apruebas, presiona **Intentar con otras preguntas**: saldrán preguntas distintas y en otro orden.

### 3.4 Reto final y reconocimiento

Se desbloquea al completar las 12 clases. Son 15 preguntas al azar de todo el curso y necesitas 12. Si fallas, te dice qué clases repasar.

Al aprobarlo obtienes tu **Reconocimiento de Aprendizaje básico de grafos**. Escribe tu nombre y presiona **Descargar como imagen (PNG)**. El reconocimiento incluye la fecha, tu calificación y un folio.

### 3.5 Actividades

Después del reconocimiento se abren 6 actividades en **Actividades** (menú lateral). En cada una el grafo cambia al presionar **Otro grafo**:

- **Ordena el recorrido BFS / DFS:** haz clic en los nodos en el orden de visita. Puedes activar la ayuda para ver la cola o la pila.
- **Calcula las distancias:** escribe la distancia mínima a cada nodo y presiona **Comprobar**.
- **Encuentra el camino más barato:** haz clic en nodos vecinos desde el origen hasta el destino; clic en el último para deshacer.
- **¿Quién sale de la lista abierta?:** elige el nodo con menor f = g + h en 5 rondas.
- **Ronda relámpago:** contesta todas las preguntas que puedas en 60 segundos.

### 3.6 Navegación

- **Menú lateral:** Escritorio, Clases (y cada nivel), Reto final, Reconocimiento, Actividades, Visualizador y Portada. En celular se abre con el botón ☰.
- **Buscador:** escribe un tema (por ejemplo "heap") para encontrar la clase.
- **Escritorio:** cambia entre **Tablero** (columnas por nivel) y **Lista**.

### 3.7 Opciones

- **Modo libre:** desbloquea todas las clases y el reto (útil para presentar).
- **Reiniciar progreso:** borra tu avance. Pide confirmación.

Tu progreso se guarda solo en el navegador que estás usando.

## 4. El visualizador

### 4.1 Elegir algoritmo

Arriba hay cuatro botones: **BFS, DFS, Dijkstra y A\***. Al cambiar de algoritmo, la ejecución empieza desde el paso 1.

### 4.2 El mapa

- Los círculos son los nodos (cruces) y las líneas son las aristas (calles).
- El número en cada calle es su **peso** (costo). En BFS y DFS los pesos se ven tenues porque esos algoritmos no los usan.
- El nodo con aro azul es el **origen** y el de aro morado punteado es el **destino**.
- Debajo de cada nodo aparece su valor: nivel (BFS), orden de visita (DFS), distancia `d` (Dijkstra) o `f`/`h` (A\*).

**Cambiar origen o destino:** elige *Origen* o *Destino* en el selector "Clic en un nodo fija" y da clic en el nodo.

**Nuevo grafo:** genera otro mapa con conexiones y pesos distintos.

### 4.3 Colores

| Color | Significado |
|---|---|
| Blanco | Sin descubrir |
| Ámbar | En la frontera (esperando turno) |
| Rojo | Nodo actual |
| Verde azulado | Explorado |
| Magenta | Camino final |

La calle que se está revisando se pinta de rojo y las calles por las que se descubrió cada nodo, de gris oscuro.

### 4.4 Controles

| Botón | Tecla | Acción |
|---|---|---|
| ⏮ | `Inicio` | Ir al primer paso |
| ◀ Paso | `←` | Paso anterior |
| ▶ Reproducir | `espacio` | Reproducir o pausar |
| Paso ▶ | `→` | Paso siguiente |
| ⏭ | `Fin` | Ir al resultado |
| Velocidad | | Ajusta qué tan rápido avanza la reproducción |
| Barra de pasos | | Arrastra para saltar a cualquier paso |

### 4.5 Qué está pasando

Debajo de los controles se describe en palabras el paso actual, junto con el número de nodos explorados, los que están en la frontera y, al final, el costo del camino.

### 4.6 Código en Python

- La línea que se ejecuta se resalta con una barra ámbar.
- Debajo aparece la explicación de esa línea.
- Da clic en cualquier línea para fijar su explicación; vuelve a dar clic para soltarla.

### 4.7 Estructura de datos

Muestra el contenido de la cola, pila o cola de prioridad. El elemento con borde es el que **sale primero**. En Dijkstra y A\* las entradas tachadas son viejas y se van a ignorar.

### 4.8 Tabla de nodos

Para cada nodo muestra su valor, su padre y su estado. La fila resaltada en ámbar es la que cambió en este paso.

### 4.9 Bitácora

Lista de todos los pasos anteriores, para repasar lo que ha hecho el algoritmo.

### 4.10 Comparativa

Ejecuta los cuatro algoritmos sobre el mapa actual y muestra cuántos nodos exploró cada uno, el costo y el número de aristas del camino, y si es óptimo. Se actualiza al cambiar el origen, el destino o el grafo.

### 4.11 Teoría y glosario

Al final de la página hay un resumen de cada algoritmo (idea, estructura, complejidad, usos) y un glosario de conceptos.

## 5. Actividades sugeridas para estudiar

1. Corre BFS y Dijkstra con el mismo origen y destino. ¿Por qué BFS a veces elige un camino más caro?
2. Compara cuántos nodos explora Dijkstra contra A\*. Pon el destino cerca del origen y luego lejos. ¿Cuándo ahorra más A\*?
3. En Dijkstra, busca un paso donde una entrada de la cola aparezca tachada y explica por qué.
4. Corre DFS en tres grafos nuevos. ¿El camino que encuentra es siempre el mismo tipo de camino?
5. Antes de avanzar, predice qué nodo va a salir de la cola. Luego verifica.

## 6. Problemas comunes

| Problema | Solución |
|---|---|
| Las letras se ven con otra fuente | Sin internet no cargan las fuentes de Google; la página funciona igual |
| No pasa nada al presionar las flechas | Da clic en una zona vacía de la página para quitar el foco de la barra de velocidad |
| Quiero empezar de nuevo | Presiona ⏮ o cambia de algoritmo |
| Perdí mi progreso de la ruta | El avance se guarda por navegador; en otro navegador, en modo incógnito o tras borrar datos del sitio empieza de cero |
