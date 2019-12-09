function God(x, y, s, speed) {
	this.x = x;
	this.y = y;
	this.is = s; // Initial size
	this.s = s;
	this.speed = speed;
}

God.prototype.update = function() {
	this.x += this.speed;

	if (this.x > width){ this.speed *= -1; }
	if (this.x < 0){ this.speed *= -1; }
};


God.prototype.draw = function() {
	imageMode(CENTER);
	image(god, this.x, this.y, this.s, this.s);
	imageMode(CORNER);
};

//done