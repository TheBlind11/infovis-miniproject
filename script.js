/* 

=======================================================
Crea un file json con dei dati multivariati: ci sono 10 data-cases e ogni data-case ha quattro variabili quantitative i cui valori sono tutti positivi. 
In base a questi dati disegna 10 omini nell'area di disegno (è sufficiente la silhouette, ogni omino corrisponde ad un data-case). 
La prima variabile determina la lunghezza delle gambe degli omini, la seconda variabile la lunghezza delle braccia, la terza variabile la dimensione della testa, e così via. 
Facendo click con il pulsante sinistro su una caratteristica di un omino, tutti gli omini si dispongono in orizzontale nell'ordine corrispondente ai valori crescenti della variabile 
associata alla caratteristica cliccata. Fai in modo che i cambi di posizione degli omini avvengano con un'animazione fluida. Usa le scale d3.js per mappare l'intervallo dei valori 
delle variabili (che deve poter essere arbitrario) sull'intervallo dei valori delle coordinate, che dipende dalla tua interfaccia.
=======================================================

*/

let xScale = d3.scaleLinear();
let yScale = d3.scaleLinear();
let sizeScale = d3.scaleLinear();

const xDomain = [0, 1000];
const yDomain = [0, 800];
xScale.domain(xDomain);
yScale.domain(yDomain);
sizeScale.domain([0, Math.min(xDomain[1], yDomain[1])]);

function drawHead(svg, x, y, stickman) {
    // Draw the head
	svg.append("circle")
    	.attr("cx", x)
	    .attr("cy", y)
	    .attr("r", sizeScale(stickman.headRadius))
	    .attr("stroke", stickman.strokeColor)
	    .attr("stroke-width", stickman.strokeWidth)
	    .attr("fill", "none");
}

function drawBust(svg, x, y, stickman) {
	// Draw the body
	svg.append("line")
    	.attr("x1", x)
    	.attr("y1", y + sizeScale(stickman.headRadius))
    	.attr("x2", x)
    	.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
    	.attr("stroke", stickman.strokeColor)
    	.attr("stroke-width", stickman.strokeWidth);
}

function drawArms(svg, x, y, stickman) {
	// Draw the left arm
	svg.append("line")
    	.attr("x1", x)
	    .attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4)
	    .attr("x2", x - sizeScale(stickman.armLength) / 2)
	    .attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4 + sizeScale(stickman.armLength) / 2)
	    .attr("stroke", stickman.strokeColor)
	    .attr("stroke-width", stickman.strokeWidth);

	// Draw the right arm
	svg.append("line")
	    .attr("x1", x)
	    .attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4)
	    .attr("x2", x + sizeScale(stickman.armLength) / 2)
	    .attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4 + sizeScale(stickman.armLength) / 2)
	    .attr("stroke", stickman.strokeColor)
	    .attr("stroke-width", stickman.strokeWidth);
}

function drawLegs(svg, x, y, stickman) {
	// Draw the left leg
	svg.append("line")
	    .attr("x1", x)
	    .attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
	    .attr("x2", x - sizeScale(stickman.legLength) / 2)
	    .attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) + sizeScale(stickman.legLength))
	    .attr("stroke", stickman.strokeColor)
	    .attr("stroke-width", stickman.strokeWidth);

	// Draw the right leg
	svg.append("line")
	    .attr("x1", x)
	    .attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
	    .attr("x2", x + sizeScale(stickman.legLength) / 2)
	    .attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) + sizeScale(stickman.legLength))
	    .attr("stroke", stickman.strokeColor)
	    .attr("stroke-width", stickman.strokeWidth);
}

function drawStickman(svg, x, y, stickman) {
	drawHead(svg, x, y, stickman);
	drawBust(svg, x, y, stickman);
	drawArms(svg, x, y, stickman);
	drawLegs(svg, x, y, stickman);
}

function fillBoard(svgBoard, data) {
    data.forEach(function(d) {
    	// Generate random positions within the SVG bounds
    	let x = Math.random() * (svgBoard.attr("width") - 40) + 20; // 20 padding on each side
    	console.log(svgBoard.width);
    	let y = Math.random() * (svgBoard.attr("height") - 100) + 50; // 50 padding on top and bottom
    	
    	// Add default stroke properties to each stickman
        d.strokeColor = 'black';
        d.strokeWidth = 2;
        
        // Draw the stickman at the random position
        drawStickman(svgBoard, x, y, d);
    });
}

d3.json("data.json")
    .then(function(data) {
        const boardHeight = Math.floor(0.8*window.screen.height);
        const boardWidth = Math.floor(0.8*window.screen.width);

        let svgBoard = d3.select("#svg-board");
        svgBoard.attr("width", boardWidth);
        svgBoard.attr("height", boardHeight);

        xScale.range([0, boardWidth]);
        yScale.range([boardHeight, 0]);
        sizeScale.range([0, Math.min(xDomain[1], yDomain[1])]);

        fillBoard(svgBoard, data);
    })
    .catch(error => console.log(error));



