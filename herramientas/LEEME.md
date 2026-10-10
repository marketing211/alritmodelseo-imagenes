# Cómo se generan las imágenes

1. `cd herramientas && npm install`
2. Escribe `../AAAA-MM-DD/contenido.json` (lunes de la semana) con las claves `p1`, `p2`, `p3` (carruseles 1080x1350) y `h1` (historia 1080x1920).
3. `node generar.js ../AAAA-MM-DD/contenido.json /tmp/salida` y convierte los PNG a JPG (calidad 82) dentro de `../AAAA-MM-DD/`.

Tipos de diapositiva: `cover` (k, h, s), `text` (h, b), `num` (n, h, b), `list` (h, i[]), `stats` (h, i[[cifra, etiqueta]]), `cta` (h, b), `story` (h, b).
En `h` se puede usar `<em>` para destacar en teal y `<b>` en `b` para la palabra clave en ámbar.
Ver `2026-10-12/contenido.json` como ejemplo.
