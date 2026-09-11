# chasqui

Mapa de ciclovías del Perú para Android. Te muestra dónde están las vías ciclistas, dónde estás
vos, hacia dónde mirás y a cuánto vas.

Los chasquis llevaban mensajes corriendo por la red de caminos incas. Esta app hace lo mismo con
la red de ciclovías: te dice por dónde se puede.

**Funciona en cualquier Android, con servicios de Google o sin ellos.** Es la diferencia con la
mayoría: la ubicación sale del proveedor del sistema y no del de Google, así que un Huawei
posterior a 2019 la usa igual.

## Qué hace

- **La red ciclista del Perú entera**, 2320 tramos, en tres colores: vía propia en verde continuo,
  carril pintado en verde punteado, compartida con autos en ámbar punteado.
- **Dónde estás**, con el círculo de precisión del GPS.
- **Hacia dónde mirás**, con un cono que sigue la brújula.
- **Un botón** que hace que el mapa te siga y gire para que arriba sea siempre hacia donde vas.
- **Velocímetro** en km/h.
- **Recorridos**: empezás, pedaleás, terminás, y te muestra distancia, tiempo y media.
- **La pantalla no se apaga**, porque el teléfono va en el manubrio.

## Qué no hace, a propósito

- **No tiene servidor.** La red ciclista viaja dentro del APK: son 66 KB. No hay API que se caiga,
  ni base de datos, ni nada que pagar.
- No calcula rutas de A a B. Eso necesita un motor de ruteo, y un motor de ruteo necesita servidor.
- No guarda los recorridos. El resumen se ve una vez y se va; no hay historial ni cuentas.
- **El recorrido solo se mide con la app abierta.** La ubicación de MapLibre es de primer plano:
  si bloqueás la pantalla o salís de la app, la distancia deja de sumar. Medir con la pantalla
  apagada necesita el permiso de ubicación «todo el tiempo», y eso todavía no está.
- No busca lugares por nombre.
- No funciona en iOS.

**El mapa de fondo sí necesita señal.** Las ciclovías no: ya están en el teléfono.

## Correrlo

Hace falta [Bun](https://bun.sh) y el SDK de Android.

```sh
bun install
bun run prebuild        # genera android/, una sola vez
bun run android         # build de desarrollo, con Metro
```

Para el APK que se instala y anda solo:

```sh
bun run apk
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

Antes de subir nada:

```sh
bun run check           # biome + tsc
```

## De dónde salen los datos

`assets/cycleways.json` es una foto de la red ciclista de OpenStreetMap, sacada del extracto de
Perú de Geofabrik y clasificada en tres tipos. Las coordenadas van redondeadas a cinco decimales,
que es alrededor de un metro.

Actualizarla es reemplazar ese archivo y compilar un APK nuevo. No hay forma de actualizarla sin
recompilar, y es a propósito: es el precio de no tener servidor.

Los datos son de OpenStreetMap y sus colaboradores, bajo [ODbL](https://opendatacommons.org/licenses/odbl/).

## Diseño

Toma el lenguaje de [lagartosoft.org](https://lagartosoft.org): **Geist**, superficies
monocromas, bordes de un píxel y esquinas de 2 a 6 píxeles. Nada de sombras y nada de pastillas
redondeadas.

La interfaz no tiene ningún color de acento a propósito: **el único color en pantalla es la red
ciclista**, que es el dato. Los valores viven en `lib/theme.ts` porque MapLibre necesita
literales.

Los iconos son Feather, de `@expo/vector-icons`: trazo de dos píxeles y nada más.

## Stack

Bun · Expo Router · MapLibre Native · NativeWind 5 sobre Tailwind 4 · Geist · Feather · Biome.

Sin backend, sin base de datos, sin cliente HTTP, sin librería de estado. No hacen falta.

## Pendiente

- Elegir licencia del repositorio.
- Icono de la app.
- Firmar el APK con un keystore propio. Hoy va con la clave de depuración de Expo, así que sirve
  para probarlo y para nada más: un APK firmado con otra clave no se instala encima del anterior.
