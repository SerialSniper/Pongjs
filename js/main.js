var canvas, ctx;
var canPlay = false;
var begun = false;
var lastTick;
var renderTime;
var deltaTime;
var fps = 0;
var countedFrames = 0;

var leftPaddle;
var rightPaddle;
var ball;

var themes = [
	[ 255, 255, 255 ],
	[ 255,   0,   0 ],
	[ 255, 128,   0 ],
	[ 255, 255,   0 ],
	[   0, 255,   0 ],
	[   0, 255, 170 ],
	[   0, 255, 255 ],
	[   0,   0, 255 ],
	[ 255,   0, 255 ],
	[ 255, 128, 128 ],
];

function getTheme(index, dark) {
	if(index < 0 || index > 9)
		return undefined;

	return `rgba(${themes[index].join(", ")}, ${dark ? 0.5 : 1})`;
}

var theme = 0;

var score = {
	left: 0,
	right: 0
}

var nextBall = true;

$(document).ready(function() {
	playNote(1, 1);

	canvas = document.getElementById("mainCanvas");
	ctx = canvas.getContext("2d");
	
	resize();
	reset();

	lastTick = Date.now();
	setTimeout(tick);

	setInterval(function() {
		leftPaddle.update();
	}, 10);

	setInterval(function() {
		fps = countedFrames;
		countedFrames = 0;
	}, 1000);

	setTimeout(function() {
		canPlay = true;
	}, 2000);
});

function tick() {
	update();
	
	countedFrames++;
	
	let renderStart = Date.now();
	render();
	renderTime = Date.now() - renderStart;
	
	setTimeout(tick);
}

function update() {
	rightPaddle.update();

	if(begun)
		ball.update();
}

function render() {
	clearScreen();
	drawNet();
	drawScore();
	drawInfo();

	leftPaddle.draw();
	rightPaddle.draw();
	ball.draw();
}

function reset() {
	leftPaddle = new Paddle(false);
	rightPaddle = new Paddle(true);
	ball = new Ball();

	up = false;
	down = false;
	mouseDown = false;

	begun = false;
}

function clearScreen() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
	ctx.fillStyle = getTheme(theme, true);
	ctx.textAlign = "center";
	ctx.font = `bold ${canvas.width / 15}px Montserrat`;
	ctx.fillText(score.left, (canvas.width / 2) - 200, 200);
	ctx.fillText(score.right, (canvas.width / 2) + 200, 200);
}

function drawNet() {
	ctx.strokeStyle = getTheme(theme, true);
	ctx.lineWidth = 3;
	ctx.setLineDash([
		canvas.height / 5 / 20 * 3,
		canvas.height / 5 / 20 * 2
	]);
	ctx.beginPath();
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.stroke();
}

function drawInfo() {
	var now = Date.now();
	deltaTime = now - lastTick;
	lastTick = now;

	drawText("grey", "Montserrat", "", 20, [
		`Render Time: ${renderTime === undefined ? 0 : renderTime}ms`,
		`FPS: ${fps} / ${Math.round(1000 / deltaTime)}`,
		`Tick: ${deltaTime}ms`
	], [10, 10], ["left", "bottom"], 5);
}

function drawText(color, font, fontStyle, fontSize, text, position, align, margin) {
	ctx.fillStyle = color;
	ctx.textAlign = align[0];
	ctx.font = `${fontStyle} ${fontSize}px ${font}`;

	let offset = (align[1] == "bottom" ? fontSize : 0);

	for(let i = 0; i < text.length; i++)
		ctx.fillText(text[i], position[0], position[1] + offset + (fontSize + margin) * i);
}

function resize() {
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

function rad(deg) {
	return deg * (Math.PI / 180);
}

$(window).on("keydown", function(event) {
	if(!canPlay) return;

	switch(event.which) {
		case 38:
			begun = true;
			up = true;
			break;
			
		case 40:
			begun = true;
			down = true;
			break;
	}

	if(event.which >= 48 && event.which <= 58) {
		theme = event.key;
	}
});

$(window).on("keyup", function(event) {
	if(!canPlay) return;

	switch(event.which) {
		case 38:
			up = false;
			break;
			
		case 40:
			down = false;
			break;
	}
});

$(window).on("mousemove", function(event) {
	mouseX = event.pageX;
	mouseY = event.pageY;
});

$(window).on("mousedown", function(event) {
	if(!canPlay) return;

	begun = true;
	mouseDown = true;
});

$(window).on("mouseup", function(event) {
	if(!canPlay) return;
	
	mouseDown = false;
});