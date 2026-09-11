# Reglas de la plataforma

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
- **Leé el código de una función de librería antes de confiar en ella.** Si su contrato no está
  claro, no entra.
