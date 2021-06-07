# pdfgrid

Automate pixel art composition PDF generation

## Usage

Replace the last line of `index.js`, calling the `drawPixels` method as follows:

```js
const data = {
 pixelCount: 10, // number of pixels to draw
 gridsToGenerate: 1, // number of PDF grids to generate
 verticalSymmetry: () => true, // function to determine vertical symmetry
 horizontalSymmetry: () => false // function to determine horizontal symmetry
}

drawPixels(data.pixelCount, data.gridsToGenerate, data.verticalSymmetry, data.horizontalSymmetry);
```
