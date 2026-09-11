# Trabajar en chasqui

Mapa de ciclovías del Perú para Android. **Sin backend**: los 2320 tramos viajan dentro del APK.

```sh
bun install
bun run format    # biome en el código, prettier en los .md
bun run check     # lint + tipos. Tiene que pasar antes de dar algo por terminado
```

## Dónde vive cada cosa

```
app/          las dos pantallas. Solo componen: no calculan nada
components/   lo que se ve. Un archivo por pieza
lib/          los hooks y los datos. Acá pasa todo lo que piensa
assets/       solo lo que viaja dentro del APK: la red, la fuente y el icono
docs/         convenciones e imágenes del README. No entra en la app
scripts/      apk.sh
```

## Lo que no es obvio

- **No hay servidor y es a propósito.** La red ciclista es un archivo, no un endpoint. Si algo
  parece necesitar un backend, primero preguntá.
- **`android/` se genera con `bun run prebuild`.** No se edita a mano: lo que haya que cambiar va en
  `app.json`, y la carpeta está fuera de git.
- **No hay tests.** No agregues un framework sin hablarlo.
- **El APK sale de `bun run apk`** a `build/`, fechado. `version` en `app.json` y `versionCode` se
  suben juntos, o Android no lo toma como actualización.
- **Actualizar la red ciclista** es reemplazar `assets/cycleways.json` y recompilar. No hay otra
  forma.
- **Va firmado con la clave de depuración de Expo.** Sirve para probar y para nada más.
- **La app corre en teléfonos sin servicios de Google.** Nada puede depender de ellos.
- **Hay valores puestos a ojo que solo se afinan pedaleando**, no en el escritorio. Cambiarlos sin
  probarlos en la calle no es una mejora:

| Dónde             | Qué                         | Qué pasa si se mueve                              |
| ----------------- | --------------------------- | ------------------------------------------------- |
| `lib/geo.ts`      | `HEADING_SMOOTHING` `0.2`   | Más, el cono tiembla; menos, va con retraso       |
| `lib/camera.ts`   | `MIN_BEARING_DELTA_DEG` `3` | Menos, el mapa gira sin parar                     |
| `lib/camera.ts`   | `LOOK_AHEAD_DP` `100`       | Cuánta calle ves por delante                      |
| `lib/location.ts` | `COURSE_MIN_KMH` `6`        | Desde qué velocidad se corrige la brújula         |
| `lib/heading.ts`  | `OFFSET_SMOOTHING` `0.05`   | Cuánto tarda la brújula en aprender su desviación |

## Cómo se cambia algo

- **Arreglá lo que se reportó y nada más.** Si el arreglo obliga a tocar otra cosa que funciona,
  decilo en vez de meterlo callado.
- **Un cambio de ubicación o brújula tiene que andar con servicios de Google y sin ellos.** No se
  comportan igual: sin Google el GPS llega limpio y la brújula se descalibra; con Google entran
  además lecturas de wifi, imprecisas y sin velocidad. Lo que arregla un caso puede romper el otro.
- **`bun run check` tiene que pasar** antes de dar algo por terminado.

## Las convenciones

|                                            |                                             |
| ------------------------------------------ | ------------------------------------------- |
| [Commits](docs/conventions/commits.md)     | Formato, tipos y scopes                     |
| [Código](docs/conventions/code.md)         | Cómo se reparte y cuándo se comenta         |
| [Diseño](docs/conventions/design.md)       | Tipografía, color y el contexto de uso      |
| [Plataforma](docs/conventions/platform.md) | Trampas de React Native, Android y MapLibre |
| [Documentación](docs/conventions/docs.md)  | Qué archivo cumple qué función              |
