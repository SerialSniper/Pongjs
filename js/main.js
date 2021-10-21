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

var multiplayer = false;
var difficulty = 1;
var debug = false;

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
	$(".title").delay(500).animateAuto("width", 1000, function() {
		$(".animatable").delay(200).animateAuto("height", 800);
	});

	playNote(1, 1);

	canvas = document.getElementById("mainCanvas");
	ctx = canvas.getContext("2d");
	
	resize();
	reset();

	lastTick = Date.now();
	setTimeout(tick);

	setInterval(function() {
		if(!multiplayer)
			leftPaddle.update();
	}, 10);

	setInterval(function() {
		fps = countedFrames;
		countedFrames = 0;
	}, 1000);

	$("#sp").on("click", function() {
		multiplayer = false;

		$(".animatable").unAuto();
		$("#main-button-wrapper").addClass("hidden");
		$("#difficulty-button-wrapper").removeClass("hidden");
		$(".animatable").animateAuto("height", 700);

		$("#difficulty-button-wrapper > .button").each(function(index) {
			$(this).on("click", function() {
				difficulty = index + 1;
				start();
			});
		});
	});

	$("#mp").on("click", function() {
		multiplayer = true;

		$("#controls-tutorial-wrapper")
			.removeClass("hidden")
			.animate({ opacity: "100%" }, 500, function() {
				$(this).removeClass("transparent");
			});

		start();
	});
});

function start() {
	$("#mainCanvas").animate({ opacity: "100%" }, 500);
	$(".animatable").animate({ opacity: "0%" }, 500, function() {
		$(".animatable").css({ display: "none" });
	});

	canPlay = true;

	reset();
}

function tick() {
	if(score.left == 10 || score.right == 10) {
		canPlay = false;

		$("#mainCanvas").addClass("blur");

		if(multiplayer) {
			if(score.left == 10) {
				$("#left").addClass("visible");
				$("#left").animate({ opacity: "100%" }, 500);
			} else if(score.right == 10) {
				$("#right").addClass("visible");
				$("#right").animate({ opacity: "100%" }, 500);
			}
		} else {
			if(score.left == 10) {
				$("#lost").addClass("visible");
				$("#lost").animate({ opacity: "100%" }, 500);
			} else if(score.right == 10) {
				$("#won").addClass("visible");
				$("#won").animate({ opacity: "100%" }, 500);
			}
		}
	}

	if(begunLeft && !$("#controls-tutorial-left").hasClass("hidden")) {
		$("#controls-tutorial-left").animate({ opacity: "0%" }, 500, function() {
			$(this).addClass("hidden");
		});
	}

	if(begunRight && !$("#controls-tutorial-right").hasClass("hidden")) {
		$("#controls-tutorial-right").animate({ opacity: "0%" }, 500, function() {
			$(this).addClass("hidden");
		});
	}

	update();
	
	countedFrames++;
	
	let renderStart = Date.now();
	render();
	renderTime = Date.now() - renderStart;
	
	setTimeout(tick);
}

function update() {
	if(!canPlay)
		return;

	if(multiplayer)
		leftPaddle.update();
	
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
	leftPaddle = multiplayer ? new Paddle("left") : new PaddleAI("left");
	rightPaddle = new Paddle("right");
	ball = new Ball();

	up = false;
	down = false;
	leftUp = false;
	leftDown = false;
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

	ctx.lineWidth = 1;
	ctx.setLineDash([]);
}

function drawInfo() {
	var now = Date.now();
	deltaTime = now - lastTick;
	lastTick = now;
	
	let margin = 5;

	drawText("grey", "Montserrat", "", 20, [
		`Render Time: ${renderTime === undefined ? 0 : renderTime}ms`,
		`FPS: ${fps} / ${Math.round(1000 / deltaTime)}`,
		`Tick: ${deltaTime}ms`
	], [10, 10], ["left", "bottom"], margin);

	if(multiplayer)
		return;

	ctx.textAlign = "right";
	ctx.fillText("Difficulty", canvas.width - margin, (20 + margin) * 1);
	ctx.fillStyle = ["blue", "lime", "red", "magenta"][difficulty - 1];
	ctx.fillText($("#difficulty-button-wrapper > .button").eq(difficulty - 1).text().replaceAll(/\s/g,''), canvas.width - margin, (20 + margin) * 2);
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
	switch(event.which) {
		case 38:
			begun = true;
			begunRight = true;
			up = true;
			break;
			
		case 40:
			begun = true;
			begunRight = true;
			down = true;
			break;

		case 87:
			if(!multiplayer) return;
			begun = true;
			begunLeft = true;
			leftUp = true;
			break;

		case 83:
			if(!multiplayer) return;
			begun = true;
			begunLeft = true;
			leftDown = true;
			break;
	}

	if(event.which >= 48 && event.which <= 58) {
		theme = event.key;
	}
});

$(window).on("keyup", function(event) {
	switch(event.which) {
		case 38:
			up = false;
			break;
			
		case 40:
			down = false;
			break;

		case 87:
			if(!multiplayer) return;
			leftUp = false;
			break;

		case 83:
			if(!multiplayer) return;
			leftDown = false;
			break;
	}
});

$(window).on("mousemove", function(event) {
	mouseX = event.pageX;
	mouseY = event.pageY;
});

$(window).on("mousedown", function(event) {
	if(multiplayer)
		return;

	begun = true;
	mouseDown = true;
});

$(window).on("mouseup", function(event) {
	if(multiplayer)
		return;
	
	mouseDown = false;
});

window.addEventListener("touchmove", function(event) {
	if(multiplayer)
		return;
	
	mouseX = event.touches[0].pageX;
	mouseY = event.touches[0].pageY;
}, false);

window.addEventListener("touchstart", function(event) {
	if(multiplayer)
		return;

	mouseX = event.touches[0].pageX;
	mouseY = event.touches[0].pageY;

	begun = true;
	mouseDown = true;
}, false);

window.addEventListener("touchend", function(event) {
	if(multiplayer)
		return;

	mouseDown = false;
}, false);

jQuery.fn.unAuto = function() {
	this.width(this.width());
	this.height(this.height());
}

jQuery.fn.animateAuto = function(prop, speed, callback) {
    var elem, height, width;

    return this.each(function(i, el) {
        el = jQuery(el);
		elem = el.clone().css({"height": "auto", "width": "auto"}).appendTo(el.parent());

        height = elem.css("height");
        width = elem.css("width");
        elem.remove();
		
		function autoize() {
			el.css({
				"width": "auto",
				"height": "auto"
			});

			if(callback != undefined)
				callback();
		}
        
        if(prop === "height")
            el.animate({"height": height}, speed, autoize);
		else if(prop === "width")
            el.animate({"width": width}, speed, autoize);
		else if(prop === "both")
            el.animate({"width": width, "height": height}, speed, autoize);
    });  
}