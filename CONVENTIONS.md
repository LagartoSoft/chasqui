# Convenciones

Esto es todo lo que hay. No hay documentos de decisiones ni planeación: eso vive en el otro
repo, y acá la idea es lo contrario.

## Commits

Conventional Commits, **en inglés**.

```
type(scope): subject

cuerpo opcional, solo si el porqué no se deduce del subject
```

- **Imperativo, minúscula, sin punto final.** `add`, no `added` ni `adds`.
- **Máximo 72 caracteres** en el subject. `git log --oneline` corta el resto.
- **Un commit = un cambio.** Si el subject necesita un «and», son dos commits.
- **Nada de trailers de coautoría.** Ni `Co-Authored-By`, ni enlaces de sesión, ni firmas de
  herramientas. Si tu agente de IA los pone por defecto, desactivalos.

| Tipo | Cuándo |
|---|---|
| `feat` | Funcionalidad nueva que se nota al usar la app |
| `fix` | Corrige algo roto |
| `perf` | Mismo comportamiento, más rápido o más liviano |
| `refactor` | Mismo comportamiento, mejor código |
| `style` | Solo apariencia o formato |
| `docs` | Solo documentación |
| `chore` | Dependencias, configuración, build |

Scopes en uso: `map` · `location` · `compass` · `trip`. Omitilo si el cambio es transversal.

El cuerpo es para lo que el diff no dice. Este sirve porque explica una decisión que no se ve
en los archivos tocados:

```
perf: cut the apk in half by dropping emulator architectures

x86 and x86_64 native libs were 62 of the 138 MB and no real phone loads
them.
```

## Código

**El código se lee solo.** Los nombres y los tipos son la documentación. El comentario es la
excepción, no el acompañamiento.

Orden de preferencia: **tipos > nombres > extraer una función > comentario inline.**

| En inglés | En español |
|---|---|
| Identificadores, archivos, carpetas, commits | Comentarios |
| | Todo texto que ve el usuario |

### Comentarios

Solo para lo que el código **no puede** decir. Todo comentario inline empieza con un tag:

| Tag | Cuándo |
|---|---|
| `WHY` | Una decisión que sorprendería a quien lea |
| `!` | Un peligro que te va a morder |
| `PERF` | Una optimización, **con números** — sin números es una opinión |
| `TODO` | Un pendiente concreto |

- **Inline: máximo 2 líneas. Docblock: máximo 3.** Si necesitás cinco, el problema es el código.
- **Nunca parafrasees la línea de abajo.** Si el comentario dice lo mismo que el código, sobra.

```ts
// ❌ parafrasea
// Suma la distancia
setDistanceM((total) => total + step)

// ✅ dice lo que el código no puede
// ! En Android userInteraction también es true en nuestras animaciones:
// ! lo que las separa es animated (CameraChangeTracker.kt)
```

### Dónde sí conviene comentar

- **`lib/location.ts`, `lib/heading.ts`, `lib/trip.ts`** — las manías del GPS, del magnetómetro
  y de cada Android son justo lo que el código no puede explicar. Acá sí, y bastante.
- **`lib/camera.ts`, `lib/map.ts`** — las rarezas de MapLibre.
- **Constantes exportadas** — una línea con la unidad o el porqué del valor.

### Dónde no

- **`app/` y `components/`.** Si una pantalla necesita explicación, lo que necesita es otro
  nombre.

## Antes de subir

```sh
bun run check
```

Biome y `tsc`. No hay tests todavía; si eso cambia, se agrega acá.
