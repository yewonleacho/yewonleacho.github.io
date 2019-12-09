function Obstacle(img, x, y, s, speed, type) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.s = s;
	this.speed = speed;
	this.type = type;
}

Obstacle.prototype.update = function() {
	this.y += this.speed;
};

Obstacle.prototype.draw = function() {
	image(this.img, this.x, this.y, this.s, this.s);
};

