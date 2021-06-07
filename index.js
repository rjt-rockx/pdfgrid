const PDFDocument = require("pdfkit");

const format = { start: { x: 24.945, y: 235.275 }, maxWidth: 11, maxHeight: 10 };
const drawPixels = (pixelCount, gridsToGenerate = 1, verticalSymmetry = () => true, horizontalSymmetry = () => false) => {
	for (let gridCount = 0; gridCount < gridsToGenerate; gridCount++) {
		let grid = new PDFDocument({ autoFirstPage: false });
		grid.pipe(require("fs").createWriteStream(`./${pixelCount}/grid_${gridCount + 1}.pdf`));
		grid.addPage({
			layout: "portrait",
			size: "A3"
		});
		grid.rect(format.start.x, format.start.y, format.maxWidth * 72, format.maxHeight * 72).stroke('#000');
		const drawPixel = (x, y) => grid.rect(format.start.x + (x * 72), format.start.y + (y * 72), 72, 72).fill('#000');
		const randomCoords = () => Math.floor(Math.random() * format.maxWidth) + "/" + Math.floor(Math.random() * format.maxHeight);
		let generatedCoords = [], previousCoords;
		let coords = Array(pixelCount).fill(0).map(_ => {
			let randomC, nextIsRandom = false;
			while (generatedCoords.includes(randomC) || !randomC) {
				const symmetries = { vertical: verticalSymmetry(), horizontal: horizontalSymmetry() };
				let randomSymmetry = symmetries.vertical === true && symmetries.horizontal === true;
				randomSymmetry = randomSymmetry ? Math.random() > 0.5 : false;
				if (randomSymmetry) {
					if (symmetries.horizontal && previousCoords && !nextIsRandom) {
						let c = previousCoords.split("/").map(x => Number(x));
						c[0] = format.maxWidth - c[0] - 1;
						randomC = c.join("/");
						nextIsRandom = true;
						continue;
					}
					if (symmetries.vertical && previousCoords && !nextIsRandom) {
						let c = previousCoords.split("/").map(x => Number(x));
						c[1] = format.maxHeight - c[1] - 1;
						randomC = c.join("/");
						nextIsRandom = true;
						continue;
					}
				}
				else if (!randomSymmetry) {
					if (symmetries.vertical && previousCoords && !nextIsRandom) {
						let c = previousCoords.split("/").map(x => Number(x));
						c[1] = format.maxHeight - c[1] - 1;
						randomC = c.join("/");
						nextIsRandom = true;
						continue;
					}
					if (symmetries.horizontal && previousCoords && !nextIsRandom) {
						let c = previousCoords.split("/").map(x => Number(x));
						c[0] = format.maxWidth - c[0] - 1;
						randomC = c.join("/");
						nextIsRandom = true;
						continue;
					}
				}
				if (!previousCoords || nextIsRandom) {
					randomC = randomCoords();
					nextIsRandom = false;
					continue;
				}
				console.log(`PreviousCoords: ${previousCoords}, Symmetries: ${JSON.stringify(symmetries)}, RandomCoords: ${randomC}`);
				console.log(`generatedCoords: ${JSON.stringify(generatedCoords)}`);
			}
			generatedCoords.push(randomC);
			previousCoords = randomC;
			return randomC.split("/").map(x => Number(x));
		});
		for (const [x, y] of coords)
			drawPixel(x, y);
		grid.end();
	}
};

drawPixels(10, 5, () => true, () => true);