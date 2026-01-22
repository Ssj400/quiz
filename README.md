# Quiz de Selección Múltiple (ligero)

Proyecto mínimo con HTML, CSS y JavaScript puro para un quiz de selección múltiple.

Archivos:
- `index.html` - Interfaz del quiz
- `style.css` - Estilos simples
- `script.js` - Lógica del quiz (carga `questions.json`)
- `questions.json` - Preguntas editables (array de objetos)

Formato de `questions.json`:
[
  {
    "text": "Texto de la pregunta",
    "choices": ["Opción A", "Opción B", "Opción C", "Opción D"],
    "answer": 0  # índice (0-based) de la opción correcta
  }
]

Cómo ejecutar:

1. Servir la carpeta con un servidor estático (recomendado):

   ```bash
   python3 -m http.server 8000
   ```

   y abrir `http://localhost:8000` en tu navegador.

2. Alternativa (menos recomendable): abrir `index.html` directamente con `file://` — algunos navegadores bloquean la carga de `questions.json` por seguridad.

Cómo modificar preguntas:
- Edita `questions.json`. Añade/quita objetos o cambia `text`, `choices` y `answer`.
- Refresca la página para ver los cambios.

Soporte por rutas/temas:

- Puedes cargar un conjunto de preguntas por tema usando `?topic=<tema>` o `#<tema>` o visitando `/tema` (si el servidor soporta reescrituras). Ejemplos:
  - `/?topic=economy` o `/#economy` cargará `questions-economy.json` si existe.
  - `/?topic=math` cargará `questions-math.json`.

- Para entornos estáticos simples (sin reescrituras), en este proyecto hay páginas de redirección listas para `/economy` y `/math` que apuntan a `/?topic=...`.

Cómo añadir más temas:
- Crea un archivo `questions-<tema>.json` con el mismo formato que `questions.json`.
- (Opcional) añade una carpeta `<tema>/index.html` que redirija a `/?topic=<tema>` si quieres permitir visitar `/ <tema>` directamente en servidores estáticos.

Licencia: libre para modificar y usar. ¡Disfruta y personaliza las preguntas!