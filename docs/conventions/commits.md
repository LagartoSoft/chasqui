# Commits

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
