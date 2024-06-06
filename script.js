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
		.attr("id", stickman.id)
    	.attr("cx", x)
	    .attr("cy", y)
	    .attr("r", sizeScale(stickman.headRadius))
	    .attr("stroke", stickman.strokeColor)
	    .attr("stroke-width", stickman.strokeWidth)
	    .style("pointer-events", "all") // Make the entire circle clickable
	    .attr("fill", "none")
	    .on("click", function() {
            console.log('Head clicked');
			sortStickmen('headRadius');
        });
}

function drawBust(svg, x, y, stickman) {
	// Draw the body
	svg.append("line")
		.attr("id", stickman.id)
    	.attr("x1", x)
    	.attr("y1", y + sizeScale(stickman.headRadius))
    	.attr("x2", x)
    	.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
    	.attr("stroke", stickman.strokeColor)
    	.attr("stroke-width", stickman.strokeWidth)
    	.on("click", function() {
            console.log('Bust clicked');
			sortStickmen('bustLength');
        });
}

function drawArms(svg, x, y, stickman) {
	// Draw both arms using a loop
    const armOffsets = [-1, 1]; // Left arm and right arm multipliers for x position

	armOffsets.forEach(offset => {
		svg.append("line")
			.attr("id", stickman.id)
			.attr("x1", x)
			.attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4)
			.attr("x2", x + offset * sizeScale(stickman.armLength) / 2)
			.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4 + sizeScale(stickman.armLength) / 2)
			.attr("stroke", stickman.strokeColor)
			.attr("stroke-width", stickman.strokeWidth)
			.on("click", function() {
				console.log('Arms clicked');
				//sortStickmen('armLength');
			});
	});
}

function drawLegs(svg, x, y, stickman) {
	// Draw both legs using a loop
    const legOffsets = [-1, 1]; // Left leg and right leg multipliers for x position
	
	legOffsets.forEach(offset => {
		svg.append("line")
			.attr("id", stickman.id)
			.attr("x1", x)
			.attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
			.attr("x2", x + offset * sizeScale(stickman.legLength) / 2)
			.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) + sizeScale(stickman.legLength))
			.attr("stroke", stickman.strokeColor)
			.attr("stroke-width", stickman.strokeWidth)
			.on("click", function() {
				console.log('Legs clicked');
				//sortStickmen('legLength');
			});
	});
}

function drawStickman(svg, x, y, stickman) {
	drawHead(svg, x, y, stickman);
	drawBust(svg, x, y, stickman);
	drawArms(svg, x, y, stickman);
	drawLegs(svg, x, y, stickman);
}

function sortStickmen(attribute) {
    d3.json("data.json")
        .then(function(data) {
            // Sort the stickmen data based on the specified attribute
            data.sort((a, b) => a[attribute] - b[attribute]);

            // Clear the existing stickmen
            d3.selectAll("circle").remove();
            d3.selectAll("line").remove();

            // Re-render the stickmen in the sorted order
            fillBoard(d3.select("#svg-board"), data);
        })
        .catch(error => console.log(error));
}

function fillBoard(svgBoard, data) {

    const boardWidth = svgBoard.attr("width");
    const boardHeight = svgBoard.attr("height");

    const maxStickmanSize = d3.max(data, d => 
        sizeScale(d.headRadius + d.bustLength + d.legLength)
    );

    const xPadding = maxStickmanSize / 2;
    const baseYPosition = boardHeight - maxStickmanSize / 2; // Position the legs to touch the "ground"
    const spacing = (boardWidth - 2 * xPadding) / (data.length - 1);
    const yOffset = maxStickmanSize; // Adjust this value to move the stickmen up

    data.forEach((d, i) => {
        let x = xPadding + i * spacing;

        d.id = i;
        d.strokeColor = 'black';
        d.strokeWidth = 4;

        let y = baseYPosition - sizeScale(d.legLength) - sizeScale(d.bustLength) - sizeScale(d.headRadius) - yOffset;

        drawStickman(svgBoard, x, y, d);
    });
}

d3.json("data.json")
    .then(function(data) {
        const boardHeight = Math.floor(0.8*window.screen.height);
        const boardWidth = Math.floor(0.8*window.screen.width);

        let svgBoard = d3.select("#svg-board");
        svgBoard.attr("width", boardWidth)
        	.attr("height", boardHeight)
            .style("background-color", "lightgrey") // Add a background
            .style("border", "2px solid black"); // Add border

        // Aggiungiamo un rettangolo come sfondo per l'SVG
        svgBoard.append("rect")
            .attr("width", boardWidth)
            .attr("height", boardHeight)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 2);

        xScale.range([0, boardWidth]);
        yScale.range([boardHeight, 0]);
        sizeScale.range([0, Math.min(xDomain[1], yDomain[1])]);

        fillBoard(svgBoard, data);
    })
    .catch(error => console.log(error));



