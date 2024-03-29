class Ball {
    x = canvas.width / 2;
    y = canvas.height / 2;
    side = 15;

    speed = 500;
    acceleration = 100;

    direction = {
        x: 0,
        y: 0
    }

    constructor() {
        if(!multiplayer) {
            this.speed *= (difficulty / 2);
            this.acceleration *= difficulty;
        }
    }

	draw() {
		ctx.fillStyle = getTheme(theme, false);
		ctx.fillRect(
			this.x - this.side/2,
			this.y - this.side/2,
			this.side,
			this.side
		);

        if(debug) {
            ctx.strokeStyle = "red";
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.direction.x * 2000, this.y + this.direction.y * 2000);
            ctx.stroke();
        }
	}

    update() {
        // begin
        if(this.direction.x == 0 && this.direction.y == 0) {
            let baseAngle = (nextBall ? 0 : 180) - 45;

            if(multiplayer)
                baseAngle = (Math.round(Math.random()) * 180) - 45;
            
            this.direction.x = Math.cos(rad(baseAngle + Math.random() * 90));
            this.direction.y = Math.sin(rad(baseAngle + Math.random() * 90));
        }

        // move
        this.speed += this.acceleration * (deltaTime / 1000);
        this.x += this.direction.x * this.speed * (deltaTime / 1000);
        this.y += this.direction.y * this.speed * (deltaTime / 1000);

        // upper wall collision
        if(this.y - this.side / 2 <= 0) {
            this.direction.y *= -1;
            this.y = this.side / 2;
            
			playNote(247, 20);
        }

        // lower wall collision
        if(this.y + this.side / 2 >= canvas.height) {
            this.direction.y *= -1;
            this.y = canvas.height - this.side / 2;
            
			playNote(247, 20);
        }

        // left score collision
        if(this.x - this.side / 2 <= 0) {
            score.right++;
            nextBall = true;
            reset();
            
			playNote(170, 500);
        }

        // right score collision
        if(this.x + this.side / 2 >= canvas.width) {
            score.left++;
            nextBall = false;
            reset();
            
			playNote(170, 500);
        }

        // left paddle collision
        if(this.x + this.side / 2 >= leftPaddle.x - leftPaddle.width / 2 &&
            this.x - this.side / 2 <= leftPaddle.x + leftPaddle.width / 2 &&
            this.y + this.side / 2 >= leftPaddle.y - leftPaddle.height / 2 &&
            this.y - this.side / 2 <= leftPaddle.y + leftPaddle.height / 2) {
            
            let angle = rad((this.y - leftPaddle.y) / (leftPaddle.height / 2) * 45);
            
            this.direction.x = Math.cos(angle);
            this.direction.y = Math.sin(angle);

            this.x = (leftPaddle.x + leftPaddle.width / 2) + this.side / 2;
            
			playNote(500, 20);
        }
        
        // right paddle collision
        if(this.x + this.side / 2 >= rightPaddle.x - rightPaddle.width / 2 &&
            this.x - this.side / 2 <= rightPaddle.x + rightPaddle.width / 2 &&
            this.y + this.side / 2 >= rightPaddle.y - rightPaddle.height / 2 &&
            this.y - this.side / 2 <= rightPaddle.y + rightPaddle.height / 2) {
            
            let angle = rad((this.y - rightPaddle.y) / (rightPaddle.height / 2) * -45 + 180);
            
            this.direction.x = Math.cos(angle);
            this.direction.y = Math.sin(angle);

            this.x = (rightPaddle.x - rightPaddle.width / 2) - this.side / 2;
            
			playNote(500, 20);
        }
    }
}