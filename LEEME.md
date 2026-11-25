# Purina · rediseño de landing — LEEME

Propuesta de rediseño para purina.com.gt. Dirección: **"El tablero que alimenta"**: el cuadro a cuadros del logo ordena los productos, abre la página y vuelve en el cierre.

## Cómo verla
Las animaciones necesitan un servidor local (abrir el archivo directo también funciona, pero las fotos de purina.com.gt necesitan internet).

```
python -m http.server 5173
```
Luego abre http://localhost:5173

## Estructura
```
index.html              la landing
direccion-de-arte.html  hoja de muestra (no se publica)
css/styles.css          estilos y tokens
js/main.js              animaciones y funciones
vendor/                 GSAP 3.13.0 (ScrollTrigger, SplitText) y Lenis 1.3.11
```

## Secciones
1. Intro firma: el tablero se arma cuadro por cuadro, "PURINA" sube y el rojo se abre en 3 cortinas. Se salta con un toque o una tecla y nunca dura más de 6 s.
2. Portada: "Se nota en cada salto" y un tablero de 3x3 con productos reales.
3. Perros y gatos no comen igual: la frase se enciende palabra por palabra con el scroll.
4. Marcas: 10 marcas reales con filtro Perro/Gato y carril que se arrastra.
5. **Encuentra su alimento** (la parte interactiva): especie + edad + necesidad → línea sugerida, proteína mínima AAFCO y días de cambio.
6. Etapas de vida: fotos que se acercan con el scroll.
7. Cambio en 7 días: en escritorio la sección se queda fija y la barra avanza con el scroll; en celular avanza al bajar. Tocar un día también cambia la barra.
8. Nunca en su plato: 4 cartas que se voltean.
9. Preguntas frecuentes: acordeón accesible.
10. Cierre: PURINA gigante, botón y un tablero que se puede arrastrar.

## Valores técnicos
- Colores: rojo #E81C24, rojo profundo #B8141B, casi negro #1B1414, crema #FFF7EF, crema 2 #F6EADF, blanco.
- Contraste: blanco sobre #E81C24 = 4.54:1 (pasa AA).
- Letra: Archivo (Google Fonts, variable), titulares con ancho 76 % y grosor 900.
- Curvas: entradas power3.out / cubic-bezier(.25,1,.5,1); cortinas power3.inOut; piezas pequeñas back.out(1.4).
- Duración base 0.9 s, desfase 0.08 s, recorrido 28 px.
- Con "Reducir movimiento" no hay intro ni desplazamientos; sin JavaScript todo se ve completo.

## De dónde salió cada dato (consultado el 23 de noviembre de 2026)
- Rojo, productos, marcas, fotos y descripciones: purina.com.gt.
- Proteína mínima: perfiles AAFCO citados por la FDA y AAFCO. Los valores 22.5 % (cachorro) y 26 % (gato adulto) están confirmados; 18 % (perro adulto) y 30 % (gatito) salen de tablas AAFCO anteriores.
- Cambio de alimento en 7 días (10 si es sensible): AAHA y Purina.
- Alimentos tóxicos: ASPCA.

## Por validar (lo decidí yo)
- Archivo en lugar de Antenna, la letra oficial de Purina, que es de pago.
- El logo es una versión que dibujé yo; hay que cambiarlo por el SVG oficial.
- El crema #FFF7EF como color de apoyo.
- Las fotos y empaques se cargan directo desde purina.com.gt. Para producción hay que pedirlas a la marca y guardarlas en `img/`.
- Las descripciones cortas de Excellent, Felix, Beneful, Fancy Feast, Alpo, Dentalife y ONE las escribí yo: confírmalas con la marca.
- Las sugerencias del buscador para "cachorro" y "mayor" se quedan a nivel de marca (Dog Chow/Pro Plan, ONE/Pro Plan) porque no confirmé los productos exactos.
- El titular, "Se nota en cada salto", es mío.
- La palabra resaltada en bloque rojo del video de referencia se quitó en la revisión final: un solo color en los titulares se lee más limpio.

## Pendientes antes de publicar
- [ ] `img/og-imagen.jpg` (1200 x 630) y `img/apple-touch-icon.png` (180 px).
- [ ] Logo oficial en SVG.
- [ ] Contacto oficial (WhatsApp o línea de atención) si se quiere en el cierre.
- [ ] Confirmar los valores AAFCO de 18 % y 30 % con la edición vigente.
- [ ] Al editar CSS o JS, subir el `?v=` en index.html.
