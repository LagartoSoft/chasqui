# Documentación

Cada archivo cumple una función y no repite a otro:

| Archivo             | Para quién                                                             |
| ------------------- | ---------------------------------------------------------------------- |
| `README.md`         | Quien usa la app o la compila por primera vez                          |
| `AGENTS.md`         | Quien va a modificarla, sea persona o agente. `CLAUDE.md` es un enlace |
| `docs/conventions/` | Las reglas, una por tema                                               |

El formato es automático: `bun run format`. Biome se ocupa del código y Prettier solo de los `.md`,
a 100 columnas.

**No se pisan, y no por convención sino por configuración**: `.prettierignore` ignora todo y vuelve
a incluir únicamente `*.md`, así que Prettier no puede tocar un `.ts` ni aunque se lo pidan. Si
alguna vez los dos discuten por un archivo, el error está ahí.

Biome no formatea markdown todavía; el día que lo haga, Prettier sale.

Ni documentos de decisiones ni planeación: para eso está el historial de git.
