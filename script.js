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


function drawHead(grp, x, y, stickman) {
    // Draw the head
	grp.append("circle")
		.attr("class", "head")
		.attr("stroke", stickman.strokeColor)
		.attr("stroke-width", stickman.strokeWidth)
		.attr("cx", x)
		.attr("cy", y)
		.attr("r", sizeScale(stickman.headRadius))
		.style("pointer-events", "all") // Make the entire circle clickable
		.attr("fill", "none")
		.on("click", function() {
			console.log('Head clicked');
			sortStickmen('headRadius');
		});
}

function drawBust(grp, x, y, stickman) {
	// Draw the body
	grp.append("line")
		.attr("class", "bust")
		.attr("stroke", stickman.strokeColor)
		.attr("stroke-width", stickman.strokeWidth)
		.attr("x1", x)
		.attr("y1", y + sizeScale(stickman.headRadius))
		.attr("x2", x)
		.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
		.on("click", function() {
			console.log('Bust clicked');
			sortStickmen('bustLength');
		});
}

function drawArms(grp, x, y, stickman) {
	// Draw both arms using a loop
    const armOffsets = [-1, 1]; // Left arm and right arm multipliers for x position
		armOffsets.forEach(offset => {
			grp.append("line")
				.attr("class", "arm")
				.attr("x1", x)
				.attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4)
				.attr("x2", x + offset * sizeScale(stickman.armLength) / 2)
				.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4 + sizeScale(stickman.armLength) / 2)
				.attr("stroke", stickman.strokeColor)
				.attr("stroke-width", stickman.strokeWidth)
				.on("click", function() {
					console.log('Arms clicked');
					sortStickmen('armLength');
				});
		});
}

function drawLegs(grp, x, y, stickman) {
	// Draw both legs using a loop
    const legOffsets = [-1, 1]; // Left leg and right leg multipliers for x position
	
	legOffsets.forEach(offset => {
		grp.append("line")
			.attr("class", "leg")
			.attr("x1", x)
			.attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
			.attr("x2", x + offset * sizeScale(stickman.legLength) / 2)
			.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) + sizeScale(stickman.legLength))
			.attr("stroke", stickman.strokeColor)
			.attr("stroke-width", stickman.strokeWidth)
			.on("click", function() {
				console.log('Legs clicked');
				sortStickmen('legLength');
			});
	});
}

function drawStickman(grp, x, y, stickman) {
	drawHead(grp, x, y, stickman);
	drawBust(grp, x, y, stickman);
	drawArms(grp, x, y, stickman);
	drawLegs(grp, x, y, stickman);
}

function updateHead(grp, x, y, stickman) {
	let head = grp.select(".head");
	head.transition()
		.duration(5000)
		.attr("cx", x)
		.attr("cy", y)
		.attr("r", sizeScale(stickman.headRadius));
}

function updateBust(grp, x, y, stickman) {
	let bust = grp.select(".bust");
	bust.transition()
		.duration(5000)
		.attr("x1", x)
		.attr("y1", y + sizeScale(stickman.headRadius))
		.attr("x2", x)
		.attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength));
}

function updateArms(grp, x, y, stickman) {
	grp.selectAll(".arm")
         .transition()
         .duration(5000)
         .attr("x1", x)
         .attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4)
         .attr("x2", (d, i) => x + [-1, 1][i] * sizeScale(stickman.armLength) / 2)
         .attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) / 4 + sizeScale(stickman.armLength) / 2);
}

function updateLegs(grp, x, y, stickman) {
	grp.selectAll(".leg")
         .transition()
         .duration(5000)
         .attr("x1", x)
         .attr("y1", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength))
         .attr("x2", (d, i) => x + [-1, 1][i] * sizeScale(stickman.legLength) / 2)
         .attr("y2", y + sizeScale(stickman.headRadius) + sizeScale(stickman.bustLength) + sizeScale(stickman.legLength));
}

function updateStickman(grp, x, y, stickman) {
	updateHead(grp, x, y, stickman);
	updateBust(grp, x, y, stickman);
	updateArms(grp, x, y, stickman);
	updateLegs(grp, x, y, stickman);
}

function sortStickmen(attribute) {

    // Sort the stickmen data based on the specified attribute
	d3.json("data.json").then(function(data) {
		data.sort((a, b) => a[attribute] - b[attribute]);

		const svgBoard = d3.select("#svg-board");
		const boardWidth = svgBoard.attr("width");
    	const boardHeight = svgBoard.attr("height");

		const maxStickmanSize = d3.max(data, d => 
			sizeScale(d.headRadius + d.bustLength + d.legLength)
		);

		const xPadding = maxStickmanSize / 2;
		const baseYPosition = boardHeight - maxStickmanSize / 2; // Position the legs to touch the "ground"
		const spacing = (boardWidth - 2 * xPadding) / (data.length - 1);
		const yOffset = maxStickmanSize; // Adjust this value to move the stickmen up

		d3.selectAll(".stickman")
			.data(data)
			.each(function(d, i) {
				let x = xPadding + i * spacing;
		
				let y = baseYPosition - sizeScale(d.legLength) - sizeScale(d.bustLength) - sizeScale(d.headRadius) - yOffset;
				updateStickman(d3.select(this), x, y, d);
			});
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

    let stickmen = svgBoard.selectAll(".stickman")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "stickman");

	stickmen.each(function(d, i) {
		let x = xPadding + i * spacing;

		d.strokeColor = 'black';
        d.strokeWidth = 4;

        let y = baseYPosition - sizeScale(d.legLength) - sizeScale(d.bustLength) - sizeScale(d.headRadius) - yOffset;
		
		let group = d3.select(this);
		drawStickman(group, x, y, d);
	})
}

d3.json("data.json")
    .then(function(data) {
        const boardHeight = Math.floor(0.8 * window.screen.height);
        const boardWidth = Math.floor(0.8 * window.screen.width);

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



