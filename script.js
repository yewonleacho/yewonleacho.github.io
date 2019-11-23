var upHeld, downHeld, rightHeld, leftHeld;
var god, life, tom, donna, pizza, skull;
var themeSong, soundEffect;
var pixelFont;
var next;


function preload(){
	god = loadImage("resources/god.png");
	life = loadImage("resources/ife.png");
	tom = loadImage("resources/tom.png");
	donna = loadImage("resources/donna.png");
	pizza = loadImage("resources/pizza.png");
	skull = loadImage("resources/poison.png");

	soundFormats('mp3');
	themeSong = loadSound("resources/parksandrectheme.mp3");
	soundEffect = loadSound("resources/treatyoself.mp3");
	
	pixelFont = loadFont('resources/Endless_Boss_Battle.ttf');
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(194, 217, 252);
	
	themeSong.setVolume(0.8);
	themeSong.play();
	themeSong.loop();
	
	playerCharacter = new Player(500, 300);
}

function draw(){
	menuScreen();
	if (next == true){
		gameScreen();
	}
}

function mouseClicked(){
	soundEffect.setVolume(0.8);
	soundEffect.play();
}

function keyPressed() {
	if (key == "s"){ next = true; }
	if (key === "ArrowUp"){ upHeld = true; }
	if (key === "ArrowDown"){ downHeld = true; }
	if (key === "ArrowLeft"){ leftHeld = true; }
	if (key === "ArrowRight"){ rightHeld = true; }
}

function keyReleased() {
	if (key === "ArrowUp"){ upHeld = false; }
	if (key === "ArrowDown"){ downHeld = false; }
	if (key === "ArrowLeft"){ leftHeld = false; }
	if (key === "ArrowRight"){ rightHeld = false; }
}

function keyMovements() {
	if (upHeld) { playerCharacter.move(0,-playerCharacter.speed); }
	if (downHeld) { playerCharacter.move(0,playerCharacter.speed); }
	if (leftHeld) { playerCharacter.move(-playerCharacter.speed,0); }
	if (rightHeld) { playerCharacter.move(playerCharacter.speed,0); }
}

/////////////// MENU Screen ///////////////
function menuScreen(){
	textFont(pixelFont);
	textSize(100);
	fill(39, 112, 230);
	text("THE SHIN ADVENTURE", windowWidth / 4, windowHeight / 3);
	
	textSize(70);
	text("Press S to Start", windowWidth / 20 * 7, windowHeight / 5 * 4);
}

/////////////// GAME Screen //////////////
function gameScreen(){
	keyMovements();
	background(194, 217, 252);
	image(god, windowWidth / 2, 10);
	playerCharacter.display();
	
}

/////////////// PLAYER Class /////////////////
let Player = function(startX, startY) {
	this.position = createVector(startX, startY);
	this.displayPosition = createVector(startX, startY);
	this.direction = createVector(1,1);
	this.speed = 3;
	this.projectiles = [];
	
}

Player.prototype.display = function() {
	push();
	this.displayPosition = p5.Vector.lerp(this.position, this.displayPosition, 0.9);
	translate(this.displayPosition.x, this.displayPosition.y);
	image(donna, this.position.x, this.position.y);
	pop();
	
	for (var i = 0; i < this.projectiles.length; i++) {
		this.projectiles[i].move();
		this.projectiles[i].display();
	}
}

Player.prototype.move = function(xMove, yMove) {
	print("Moving... " + xMove + ", " + yMove);
	this.position.x += xMove;
	this.position.y += yMove;
	
	if (this.position.x < 0) { this.position.x = 0; }
	if (this.position.x > width) { this.position.x = width; }
	if (this.position.y < 0) { this.position.y = 0; }
	if (this.position.y > height) { this.position.y = height; }
}