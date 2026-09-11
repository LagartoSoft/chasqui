# Diseño

El lenguaje de [lagartosoft.org](https://lagartosoft.org): **Geist**, superficies monocromas,
bordes de un píxel, esquinas de 2 a 6. Nada de sombras ni de pastillas redondeadas.

## El color

**El verde se gasta en tres sitios**: la red ciclista, la acción principal y lo que está activo.
Nada más. Repartido por la interfaz dejaría de significar «ciclovía», que es el trabajo que tiene
que hacer en un mapa que se mira un segundo.

Los valores viven en `lib/theme.ts` (interfaz) y `lib/map.ts` (mapa). **Ningún color suelto en un
componente**, y como literales y no como clases: MapLibre no entiende Tailwind.

## El contexto manda

Se diseña para un teléfono al sol, a un brazo de distancia, tocado con guantes:

- **Área de toque mínima de 48 dp.**
- **Contraste mínimo de 4,5:1** contra la superficie de atrás. A diez píxeles, más.
- La velocidad es lo único que se lee de un vistazo: todo lo demás va por debajo en jerarquía.
