const offset = 50;

var begunLeft = false;
var begunRight = false;

var up = false;
var down = false;
var leftUp = false;
var leftDown = false;

var mouseX = undefined;
var mouseY = undefined;
var mouseDown = false;

class Paddle {
	x;
	y = canvas.height / 2;
	width = 15;
	height = 70;
	side;
    speed = 1000;
	
	constructor(side) {
        this.side = side;

		if(side == "left")
			this.x = offset;
		if(side == "right")
			this.x = canvas.width - offset;
	}
	
	draw() {
		ctx.fillStyle = getTheme(theme, false);
		ctx.fillRect(
			this.x - this.width/2,
			this.y - this.height/2,
			this.width,
			this.height
		);
	}

    update() {
		if(mouseDown && !multiplayer) {
			if(mouseY < rightPaddle.y)
				this.y -= this.speed * (deltaTime / 1000);
			if(mouseY > rightPaddle.y)
				this.y += this.speed * (deltaTime / 1000);
		}
		
		if(this.side == "right") {
			if(up) this.y -= this.speed * (deltaTime / 1000);
			if(down) this.y += this.speed * (deltaTime / 1000);
		} else if(this.side == "left") {
			if(leftUp) this.y -= this.speed * (deltaTime / 1000);
			if(leftDown) this.y += this.speed * (deltaTime / 1000);
		}
		
		this.collide();
    }

	collide() {
        if(this.y + this.height / 2 >= canvas.height)
            this.y = canvas.height - this.height / 2;

        if(this.y - this.height / 2 <= 0)
            this.y = this.height / 2;
	}
}

class PaddleAI extends Paddle {
    queue = new Array(Number.parseInt(10 / difficulty)).fill(this.y);
	
	update() {
		this.y = this.queue.shift();
		this.queue.push(ball.y);
		
		this.collide();
	}
}