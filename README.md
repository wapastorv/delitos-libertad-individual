# Delitos contra la Libertad Individual y Otras Garantías (Art. 165 a 204)

Presentación académica interactiva (HTML, CSS y JavaScript sin dependencias).

## Estructura

```
delitos-libertad-individual/
├── index.html          ← página principal (todas las diapositivas)
├── styles/
│   └── style.css       ← estilos, paleta y diseño responsivo
├── scripts/
│   ├── main.js         ← navegación (botones, teclado, gestos, contador)
│   └── menu.js         ← menú «Ir a…» con búsqueda
├── documents/          ← sentencias descargables en PDF
│   ├── sentencia-c-230-02.pdf   (contenido: Sentencia C-232 de 2002)
│   ├── sentencia-c-317-02.pdf
│   └── sentencia-c-143-15.pdf
├── images/
│   └── favicon.svg
└── README.md
```

## Uso

1. Descomprime la carpeta y abre `index.html` en el navegador (doble clic).
2. Navega con los botones **Anterior / Siguiente**, las flechas **← →** del teclado,
   o deslizando el dedo en el celular. **F** activa la pantalla completa.
   **M** (o el botón **Menú**) abre la lista de todas las diapositivas para saltar a cualquiera;
   se puede buscar por artículo, tema o sentencia. **Esc** la cierra.
   **M** (o el botón **Menú**) abre la lista de todas las diapositivas para saltar a cualquiera;
   se puede buscar por artículo, tema o sentencia. **Esc** la cierra.
3. Los botones **Descargar** de la sección de jurisprudencia descargan cada sentencia.

> Para que la descarga use el nombre definido en el atributo `download`, conviene abrir
> la presentación desde un servidor local (por ejemplo, la extensión *Live Server* de
> VS Code) o publicarla (GitHub Pages, Netlify). Abierta con doble clic, algunos
> navegadores abren el PDF en una pestaña en lugar de descargarlo.

## Editar la portada

Los datos de la portada (expositoras, docente, institución y fecha) están al inicio de
`index.html`, dentro de `<div class="cover__meta">`.

## Fuentes tipográficas

Se cargan desde Google Fonts (Spectral, Source Sans 3, IBM Plex Mono). Sin conexión,
la presentación usa fuentes del sistema equivalentes.
