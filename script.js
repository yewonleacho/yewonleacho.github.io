let player;
let mouse;
let keys = [];
let scene;
let scl;

let opacity, opacityIncrement;

let playerImg;

let spawnPoints = [];
let obstacleTypes = [];
let obstacles = [];
let effect = [];

let level, ground, groundTime;
var god, life, donna, pizza, skull, tom, bomb;
let dissappearSpeed, appearSpeed;
let fr, interval, counter;
let score, levels;

var endingTimer;
var timerBeginTime;
var timeSetToTimer;
var timeOver = false;
var timerIsRunning = false;

function preload() {
	god = loadImage("resources/god.png");
	donna = loadImage("resources/donna.png");
	heart = loadImage("resources/life.png");
	playerImg = loadImage("resources/tom.png");
	pizza = loadImage("resources/pizza.png");
	skull = loadImage("resources/poison.png");
	bomb = loadImage("resources/bomb.png");

	ground = loadImage("resources/background.png");
	groundTime = loadImage("resources/red.png");

	themeSong = loadSound("resources/parksandrectheme.mp3");
	earnScore = loadSound("resources/treatyoself.mp3");
	loseScore = loadSound("resources/moneyplease.mp3");
	
	// pixelFont = loadFont("resources/Endless_Boss_Battle.ttf");

}

function setup() {
	createCanvas(800, 800);

	themeSong.play();

	scl = 50;
	player = new Player(300, 750, scl, 5);

	opacity = 0;
	opacityIncrement = 10;

	dissappearSpeed = 30;
	appearSpeed = 70;

	levels = 1;


	/* Obstacle Types */
	// img, [x], [y], [s], speed, type
	obstacleTypes.push([pizza, 5, "treat"]);
	obstacleTypes.push([skull, 5, "poison"]);

	/* Obstacles */
	for (let i = 0; i < width; i += scl) {
		spawnPoints.push(i);
	}

	fr = 60;
	interval = 0.5;
	counter = 0;
	obstacleAmmount = 5;

	let o = random(obstacleTypes);
	obstacles.push(new Obstacle(o[0], 100, -100, scl, o[1], o[2])); // img, [x], [y], s, speed, type

	score = 0;

	scene = "menu";

	background(0, 0, 0, 0);

	angleMode(DEGREES);
	textAlign(CENTER, CENTER);
}

/* Input */
function keyPressed() {
	keys[keyCode] = true;
	if (key == "S"){
		scene = "game";
	}
	if (key == "H"){
		scene = "help";
	}
	if (key == "Q"){
		scene = "menu";
	}
	if (key == "T"){
		scene = "time attack";
		timerIsRunning = true;
		
		/// Set our "begin time" to the current clock time
		timerBeginTime = millis();
		/// We will have a 10 second timer
		timeSetToTimer = 10000;
		/// Create our actual Timeout timer
		endingTimer = setTimeout(endTimer, timeSetToTimer);
	}
}
function keyReleased() {
	keys[keyCode] = false;
}

/* Functions */
function spawnObstacles(ammount) {
	for (let i = 1; i <= ammount; i ++) {
		let o = random(obstacleTypes);
		let possiblePoints = spawnPoints.slice();
		let x = random(possiblePoints);
		obstacles.push(new Obstacle(o[0], x, -scl, scl, o[1], o[2])); // img, [x], [y], [s], speed, type
	}
}



function overlay() {
	fill(255, 255, 255, opacity);
	noStroke();
	rect(0, 0, width, height);
}

/* Scenes */
function menu() {
	image(ground, 0, 0);
	// textFont(pixelFont);

	textSize(20);
	fill(39, 112, 230);
	text("THE SHIN ADVENTURE", width / 2, height / 3);
	text("(1987, Atari)", width / 2, height * 0.36);
	
	textSize(20);
	text("Press 'H' to see the help menu.", width / 2, height * 0.8);
	text("Press 'S' to play Regular Game mode.", width / 2, height * 0.85);
	text("Press 'T' to play Time Attack mode.", width / 2, height * 0.9);


}

function help(){
	image(ground, 0, 0);

	fill(39, 112, 230);
	textSize(15);
	text("Press 'Q' to go back to Main Menu.", 125, 30);

	textSize(20);
	text("In regular game mode, if you touch deadly potion, you lose one life.", width / 2, height * 0.3);
	text("You have ten lives.", width / 2, height * 0.35);
	text("If you touch pizza, you earn 10 points.", width / 2, height * 0.4);
	text("Earn as many as you can before the game is over.", width / 2, height * 0.45);

	text("In time attack mode, you have 100 seconds to play game.", width / 2, height * 0.6);
	text("Instead of losing life, your score will be taken off ", width / 2, height * 0.65);
	text("by 10 points if you touch the deadly potion.", width / 2, height * 0.7);

	textSize(40);
	fill(253, 163, 208);
	text("GOOD LUCK!", width / 2, height * 0.85);


}

function gameOver() {
	image(ground, 0, 0);

	fill(39, 112, 230);
	textSize(15);
	text("Press 'Q' to go back to Main Menu.", width / 2, 700);

	strokeWeight(7);
	stroke(92, 113, 216);
	strokeJoin(ROUND);
	fill(92, 113, 216);
	textSize(80);
	text("GAME OVER", width / 2, height / 5);

	noStroke();
	textSize(30);
	text("Your Score: " + score, width / 2, height / 2);
	text("You got to Level " + levels, width / 2, height * 0.6);


}

function game() {
	image(ground, 0, 0);

	for (let i = obstacles.length - 1; i >= 0; i --) {
		let o = obstacles[i];

		o.draw();
		o.update();

		if (player.collide(o)) {
			if (o.type == "treat"){
				score += 10;
				effect.push([1, o.x, o.y, true]);
				earnScore.play();
			}
			else if (o.type == "poison"){
				player.health--;	
				loseScore.play();
			}
			obstacles.splice(i, 1);

		}

		if (o.y > height + 20) {
			obstacles.splice(i, 1);
		}
	}

	player.draw();
	player.update();

	if (frameCount % (fr * interval) === 0) {
		spawnObstacles(1);
	}



	fill(51, 10, 4);
	noStroke();
	textSize(30);
	textAlign(LEFT, CENTER);
	text("Life: ", 25, 50);
	for (let x = 0; x < player.health; x++){
		image(heart, x * 30 + 85, 35, 30, 30);
	}
	text("Score: " + score, 25, 100);
	text("Level: " + levels, 25, 150);
	textAlign(CENTER, CENTER);

	strokeWeight(3);
	stroke(0);
	noFill();

	fill(255, 0, 0);


	for (let i = effect.length - 1; i >= 0; i --) {
		image(donna, effect[i][1], effect[i][2], 30, 50);

		if (effect[i][3]) {
			effect[i][0] += appearSpeed;
		} else {
			effect[i][0] -= dissappearSpeed;
		}

		if (effect[i][0] <= 0) {
			effect.splice(i, 1);
		} else if (effect[i][0] >= 255) {
			effect[i][3] = false;
		}
	}


	if (player.health <= 0) {
		opacity = 255;
		scene = "game over";
	}


	counter ++;
}

function timeAttack(){
	image(groundTime, 0, 0);
	
	/// Subtract the time we STARTED the timer from our current clock time.
	var timeElapsed = millis() - timerBeginTime;
	/// Subtract the time ELAPSED from how long the timer SHOULD RUN
	/// and round it for our display.
	var timeRemainingRounded = Math.ceil((timeSetToTimer - timeElapsed) * 0.001);
	
	if (timerIsRunning) {
		/// Main behavior based on if the timer is finished.
		if (timeOver != true) {
			fill(0);
			text("Time remaining: " + timeRemainingRounded, 700, 20);
		}
		else {	
			scene = "game over";
		}
	}

	image(bomb, 650, 30, 100, 100);


	for (let i = obstacles.length - 1; i >= 0; i --) {
		let o = obstacles[i];

		o.draw();
		o.update();

		if (player.collide(o)) {
			// if (soundOption) {
			// 	hit.play();
			// }
			if (o.type == "treat"){
				score += 10;
				effect.push([1, o.x, o.y, true]);
			}
			else if (o.type == "poison"){
				score -= 15;	
			}
			obstacles.splice(i, 1);
		}

		if (o.y > height + 20) {
			obstacles.splice(i, 1);
		}
	}

	player.draw();
	player.update();

	if (frameCount % (fr * interval) === 0) {
		spawnObstacles(1);
	}

	fill(51, 10, 4);
	noStroke();
	textSize(20);
	textAlign(LEFT, CENTER);

	text("Score: " + score, 25, 100);
	text("Level: " + levels, 25, 125);
	textAlign(CENTER, CENTER);

	strokeWeight(3);
	stroke(0);
	noFill();

	fill(255, 0, 0);


	for (let i = effect.length - 1; i >= 0; i --) {
		image(donna, effect[i][1], effect[i][2], 30, 50);

		if (effect[i][3]) {
			effect[i][0] += appearSpeed;
		} else {
			effect[i][0] -= dissappearSpeed;
		}

		if (effect[i][0] <= 0) {
			effect.splice(i, 1);
		} else if (effect[i][0] >= 255) {
			effect[i][3] = false;
		}
	}

}

function endTimer() {
	/// Our game is over, flip the boolean.
	timeOver = true;
}


/* Loop */
function draw() {
	mouse = ARROW;

	switch (scene) {
		case "menu":
			menu();
			break;
		case "help":
			help();
			break;
		case "game":
			game();
			break;
		case "time attack":
			timeAttack();
			break;
		case "game over":
			gameOver();
			break;
	}

	overlay();
	if (opacity > 0) {
		opacity -= opacityIncrement;
	}

}

