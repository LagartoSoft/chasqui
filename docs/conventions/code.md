# Código

**El código se lee solo.** Los nombres y los tipos son la documentación; el comentario es la
excepción.

Orden de preferencia: **tipos > nombres > extraer una función > comentario.**

Identificadores, archivos y commits en inglés. Comentarios y todo texto que ve el usuario, en
español.

## Cómo se reparte

- **`lib/` no importa de `components/`.** Va en un solo sentido.
- **Un hook por tema**: `location`, `heading`, `speed`, `trip`, `camera`. Si un hook empieza a hacer
  dos cosas, son dos hooks.
- **`app/` y `components/` no calculan.** Componen lo que `lib/` ya resolvió.
- **No se exporta lo que nadie importa.**
- Antes de escribir un panel oscuro, mirá `components/panel.tsx`: ya existe.

## Comentarios

Solo para lo que el código **no puede** decir: una trampa de la plataforma, el porqué de un número
puesto a ojo, una decisión que sorprendería.

- **Una sola línea, siempre.** Si no entra, el problema es el código: ponele otro nombre o partilo.
- **Nunca parafrasees la línea de abajo.**
- **En presente y como regla**, no como relato. Qué hace y por qué, nunca qué pasó antes.
- Sin prefijos ni etiquetas: la frase se explica sola.

```ts
// ❌ parafrasea
// Suma la distancia
setDistanceM((total) => total + step);

// ✅ dice lo que el código no puede
// Peor precisión que esta se descarta: el primer fix suele ser el de tu casa.
const MAX_ACCURACY_M = 20;
```

**Dónde sí**: en `lib/`, donde viven las manías del GPS, del magnetómetro y de MapLibre; y en
cualquier constante exportada, con su unidad.

**Dónde no**: `app/` y `components/`. Si una pantalla necesita que le cuenten qué hace, lo que
necesita es otro nombre. La excepción es una trampa de la plataforma, que se anota donde está.
