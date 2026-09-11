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
- Sin prefijos ni etiquetas: la frase se explica sola.

```ts
// ❌ parafrasea
// Suma la distancia
setDistanceM((total) => total + step)

// ✅ dice lo que el código no puede
// Peor precisión que esta se descarta: el primer fix suele ser el de tu casa.
const MAX_ACCURACY_M = 20
```

**Dónde sí**: `lib/location.ts`, `lib/heading.ts` y `lib/trip.ts`, donde viven las manías del GPS
y del magnetómetro; `lib/camera.ts` y `lib/map.ts`, donde viven las de MapLibre; y cualquier
constante exportada, con su unidad.

**Dónde no**: `app/` y `components/`. Si una pantalla necesita que le cuenten qué hace, lo que
necesita es otro nombre. La excepción es una trampa de la plataforma, que se anota donde está.

## Diseño

Lo de [lagartosoft.org](https://lagartosoft.org): Geist, superficies monocromas, bordes de un
píxel, esquinas de 2 a 6. Nada de sombras ni de pastillas redondeadas.

**El verde se gasta en tres sitios**: la red ciclista, la acción principal y lo que está activo.
Nada más. Repartido por la interfaz dejaría de significar «ciclovía».

## Antes de subir

```sh
bun run check
```

Biome y `tsc`. No hay tests; si eso cambia, se agrega acá.
