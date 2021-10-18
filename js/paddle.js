const offset = 50;

var up = false;
var down = false;

class Paddle {
	x;
	y = canvas.height / 2;
	width = 15;
	height = 70;
    rightSide;

    speed = 1000; // px/s
    queue = new Array(5).fill(this.y);
	
	constructor(rightSide) {
        this.rightSide = rightSide;

		if(rightSide == false)
			this.x = offset;
		if(rightSide == true)
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
        if(this.rightSide) {
            if(up) this.y -= this.speed * (deltaTime / 1000);
            if(down) this.y += this.speed * (deltaTime / 1000);
        } else {
            this.y = this.queue.shift();
            this.queue.push(ball.y);
        }
        
        if(this.y + this.height / 2 >= canvas.height)
            this.y = canvas.height - this.height / 2;

        if(this.y - this.height / 2 <= 0)
            this.y = this.height / 2;
    }
}