# Convenciones

Esto es todo lo que hay. Ni documentos de decisiones ni planeación: la idea del repo es lo
contrario.

## Commits

Conventional Commits, **en inglés**, imperativo y en minúscula: `add`, no `added`.

- **Máximo 72 caracteres.** `git log --oneline` corta el resto.
- **Un commit, un cambio.** Si el subject necesita un «and», son dos commits.
- **Cuerpo solo si el porqué no está en el subject.** Casi nunca hace falta.
- **Nada de trailers de coautoría.** Si tu agente de IA los pone por defecto, desactivalos.

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva que se nota al usar la app |
| `fix` | Corrige algo roto |
| `perf` | Mismo comportamiento, más rápido o más liviano |
| `refactor` | Mismo comportamiento, mejor código |
| `style` | Solo apariencia o formato |
| `docs` | Solo documentación |
| `chore` | Dependencias, configuración, build |

Scopes: `map` · `location` · `compass` · `trip`. Omitilo si el cambio es transversal.

## Código

**El código se lee solo.** Los nombres y los tipos son la documentación; el comentario es la
excepción.

Orden de preferencia: **tipos > nombres > extraer una función > comentario.**

Identificadores, archivos y commits en inglés. Comentarios y todo texto que ve el usuario, en
español.

### Comentarios

Solo para lo que el código **no puede** decir: una trampa de Android, el porqué de un número
puesto a ojo, una decisión que sorprendería.

- **Una sola línea, siempre.** Si no entra, el problema es el código: ponele otro nombre o partilo.
- **Nunca parafrasees la línea de abajo.**
- **En presente y como regla**, no como relato. Qué hace y por qué, nunca qué pasó antes.
- Sin prefijos ni etiquetas: la frase se explica sola.

```ts
// ❌ parafrasea
// Suma la distancia
setDistanceM((total) => total + step)

// ✅ dice lo que el código no puede
// Peor precisión que esta se descarta: el primer fix suele ser el de tu casa.
const MAX_ACCURACY_M = 20
```

**Dónde sí**: en `lib/`, donde viven las manías del GPS, del magnetómetro y de MapLibre; y en
cualquier constante exportada, con su unidad.

**Dónde no**: `app/` y `components/`. Si una pantalla necesita que le cuenten qué hace, lo que
necesita es otro nombre. La excepción es una trampa de la plataforma, que se anota donde está.

## Dónde vive cada cosa

```
app/          las dos pantallas. Solo componen: no calculan nada
components/   lo que se ve. Un archivo por pieza
lib/          los hooks y los datos. Acá pasa todo lo que piensa
assets/       solo lo que viaja dentro del APK: la red, la fuente y el icono
docs/         imágenes del README. No entran en la app
scripts/      apk.sh
```

Tres reglas que mantienen eso en pie:

- **`lib/` no importa de `components/`.** Va en un solo sentido.
- **Un hook por tema**: `location`, `heading`, `speed`, `trip`, `camera`. Si un hook empieza a
  hacer dos cosas, son dos hooks.
- **Ningún color suelto en un componente.** Los de la interfaz salen de `lib/theme.ts` y los del
  mapa de `lib/map.ts`. Están como literales y no como clases de Tailwind porque MapLibre no
  entiende clases.

Antes de escribir un panel oscuro, mirá `components/panel.tsx`: ya existe.

## Reglas de la plataforma

Comportamientos de React Native, de Android y de MapLibre que no se deducen leyendo el código.
Se respetan siempre:

- **Posicionar con estilos explícitos**, no con clases lógicas de Tailwind. `inset-x-0` es
  `inset-inline`, React Native no la soporta y NativeWind la descarta sin avisar. Usá `left`,
  `right`, `top`, `bottom`.
- **Un gesto del mapa es `userInteraction && !animated`.** En Android `userInteraction` también
  vale `true` para las animaciones que lanza la propia app.
- **De dos lecturas de ubicación gana la más precisa, no la más nueva.** El motor pide a `gps` y
  a `network` a la vez, y las de `network` traen cientos de metros de error.
- **El `0` de Android en velocidad y rumbo significa «no tengo el dato»**, no cero. Hay que
  distinguirlo por otro camino.
- **Los colores del mapa van como literales**, no como clases: MapLibre no entiende Tailwind.
- **Leé el código de una función de librería antes de confiar en ella.** Si su contrato no está
  claro, no entra.

## Diseño

Lo de [lagartosoft.org](https://lagartosoft.org): Geist, superficies monocromas, bordes de un
píxel, esquinas de 2 a 6. Nada de sombras ni de pastillas redondeadas.

**El verde se gasta en tres sitios**: la red ciclista, la acción principal y lo que está activo.
Nada más. Repartido por la interfaz dejaría de significar «ciclovía».

## Los `.md`

`AGENTS.md` y `CLAUDE.md` son enlaces a este archivo: los agentes de IA leen esos nombres y así
no hay dos versiones de las mismas reglas.

Biome todavía no formatea markdown, así que va a mano: **100 columnas**, `-` para las listas, y
una línea en blanco entre bloques. No se agrega otra herramienta solo para esto.

## Antes de subir

```sh
bun run check
```

Biome y `tsc`. No hay tests; si eso cambia, se agrega acá.
