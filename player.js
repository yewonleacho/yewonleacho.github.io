function Player(x, y, s, speed) {
	this.x = x;
	this.y = y;
	this.is = s; // Initial size
	this.s = s;
	this.speed = speed;

	this.gravity = 0;

	this.health = 3;
}


Player.prototype.update = function() {
	if ((keys[LEFT_ARROW]) && this.x - this.s/2 >= this.speed) {
		this.x -= this.speed;
	} else if ((keys[RIGHT_ARROW]) && this.x + this.s/2 <= (width - this.speed)) {
		this.x += this.speed;
	}


	this.s += this.gravity;
	this.s = constrain(this.s, this.is, Infinity);
	this.gravity -= 0.1;
	this.gravity = constrain(this.gravity, -1, Infinity);
};

Player.prototype.collide = function(obj) {
	if (!(this.y - this.s/2 > obj.y + obj.s || obj.y > this.y + this.s/2)) {
		if (!(this.x - this.s/2 > obj.x + obj.s || obj.x > this.x + this.s/2)) {
			return true;
		}
	}

	return false;
};

Player.prototype.draw = function() {
	imageMode(CENTER);
	image(playerImg, this.x, this.y, this.s, 100);
	imageMode(CORNER);
};

//done
