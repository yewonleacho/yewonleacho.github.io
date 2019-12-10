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

let level, background, background1, background2;
var god, life, donna, pizza, skull, tom, bomb;
let dissappearSpeed, appearSpeed;
let fr, interval, counter;
let numTreat, score, levels;

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

	background = loadImage("resources/background.jpg");
	background1 = loadImage("resources/background1.png");
	background2 = loadImage("resources/background2.png");

	themeSong = loadSound("resources/parksandrectheme.mp3");
	earnScore = loadSound("resources/treatyoself.mp3");
	loseScore = loadSound("resources/moneyplease.mp3");

 	pixelFont = loadFont("resources/Endless Boss Battle.ttf");
}

function setup() {
	createCanvas(800, 800);

	themeSong.setVolume(0.2);
	themeSong.loop();

	scl = 50;
	player = new Player(300, 750, scl, 5);
	flyingGod = new God(width / 2, 50, 80, 3);

	opacity = 0;
	opacityIncrement = 10;

	dissappearSpeed = 30;
	appearSpeed = 70;

	levels = 1;

	numTreat = 0;


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

	// background(0, 0, 0, 0);

	angleMode(DEGREES);
	textAlign(CENTER, CENTER);
}

/* Input */
function keyPressed() {
	keys[keyCode] = true;

	if (key == "P" || key == "p"){
		themeSong.setVolume(0.2);
		themeSong.loop();
	}
	if (key == "S" || key == "s"){
		scene = "game";
	}
	if (key == "H" || key == "h"){
		scene = "help";
	}
	if (key == "Q" || key == "q"){
		scene = "menu";
	}
	if (key == "T" || key == "t"){
		scene = "time attack";
		timerIsRunning = true;
		
		/// Set our "begin time" to the current clock time
		timerBeginTime = millis();
		/// We will have a 10 second timer
		timeSetToTimer = 60000;
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
	image(background, 0, 0, 800, 800);

	textFont(pixelFont);

	fill(39, 112, 230);

	textSize(15);
	text("Press 'P' to play background music.", 140, 30);

	textSize(60);
	text("THE SHIN", width / 2, height / 3);
	text("ADVENTURE", width / 2, height * 0.42);
	
	textSize(25);
	text("Press 'H' to see the help menu.", width / 2, height * 0.8);
	text("Press 'S' to play Regular Game mode.", width / 2, height * 0.85);
	text("Press 'T' to play Time Attack mode.", width / 2, height * 0.9);


}

function help(){
	image(background, 0, 0, 800, 800);

	fill(39, 112, 230);
	textSize(15);
	text("Press 'Q' to go back to Main Menu.", 140, 30);

	textSize(20);
	text("In regular game mode, if you touch deadly potion, you lose one life.", width / 2, height * 0.3);
	text("You have three lives.", width / 2, height * 0.35);
	text("If you touch pizza, you earn 10 points.", width / 2, height * 0.4);
	text("Earn as many as you can before the game is over.", width / 2, height * 0.45);

	text("In time attack mode, you have 100 seconds to play game.", width / 2, height * 0.6);
	text("Instead of losing life, your score will be taken off ", width / 2, height * 0.65);
	text("by 15 points if you touch the deadly potion.", width / 2, height * 0.7);

	textSize(55);
	fill(253, 163, 208);
	text("GOOD LUCK!", width / 2, height * 0.85);


}

function gameOver() {
	image(background, 0, 0, 800, 800);

	fill(92, 113, 216);
	textSize(100);
	text("GAME OVER", width / 2, height / 5);

	noStroke();
	textSize(30);
	text("Your Score: " + score, width / 2, height / 2);
	text("You got to Level " + levels, width / 2, height * 0.55);


}

function timeIsOver() {
	image(background, 0, 0, 800, 800);

	fill(92, 113, 216);
	textSize(100);
	text("TIME OVER", width / 2, height / 5);

	noStroke();
	textSize(30);
	text("Your Score: " + score, width / 2, height / 2);
	text("You got to Level " + levels, width / 2, height * 0.55);
}

function game() {
	image(background1, 0, 0, 800, 800);

	flyingGod.draw();
	flyingGod.update();

	for (let i = obstacles.length - 1; i >= 0; i --) {
		let o = obstacles[i];

		o.draw();
		o.update();

		if (player.collide(o)) {
			if (o.type == "treat"){
				score += 10;
				numTreat++;
				effect.push([1, o.x, o.y, true]);
				earnScore.play();
			}
			else if (o.type == "poison"){
				player.health--;	
				loseScore.setVolume(0.1);
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
		image(heart, x * 30 + 100, 37, 30, 30);
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

	switch(numTreat){
		case 5:
			levels = 2;
			break;
		case 10:
			levels = 3;
			break;
		case 20:
			levels = 4;
			break;
		case 35:
			levels = 5;
			break;
		case 50:
			levels = 6;
			break;
		case 75:
			levels = 7;
			break;
		case 100:
			levels = 8;
			break;
		case 150:
			levels = 9;
			break;
		case 200:
			levels = 10;
			break;
	}

	counter ++;
}

function timeAttack(){
	image(background2, 0, 0, 800, 800);
	
	/// Subtract the time we STARTED the timer from our current clock time.
	var timeElapsed = millis() - timerBeginTime;
	/// Subtract the time ELAPSED from how long the timer SHOULD RUN
	/// and round it for our display.
	var timeRemainingRounded = Math.ceil((timeSetToTimer - timeElapsed) * 0.001);
	
	if (timerIsRunning) {
		/// Main behavior based on if the timer is finished.
		if (timeOver != true) {
			fill(0);
			text("Time remaining: " + timeRemainingRounded, 650, 30);
		}
		else {	
			scene = "time over";
		}
	}

	image(bomb, 650, 30, 100, 100);


	for (let i = obstacles.length - 1; i >= 0; i --) {
		let o = obstacles[i];

		o.draw();
		o.update();

		if (player.collide(o)) {
			if (o.type == "treat"){
				score += 10;
				numTreat++;
				effect.push([1, o.x, o.y, true]);
				earnScore.play();
			}
			else if (o.type == "poison"){
				score -= 15;
				loseScore.setVolume(0.1);
				loseScore.play();	
			}
			obstacles.splice(i, 1);
		}

		if (o.y > height + 20) {
			obstacles.splice(i, 1);
		}
	}

	flyingGod.draw();
	flyingGod.update();

	player.draw();
	player.update();

	if (frameCount % (fr * interval) === 0) {
		spawnObstacles(1);
	}

	fill(51, 10, 4);
	noStroke();
	textSize(30);
	textAlign(LEFT, CENTER);

	text("Score: " + score, 25, 50);
	text("Level: " + levels, 25, 100);
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


	switch(numTreat){
		case 5:
			levels = 2;
			break;
		case 10:
			levels = 3;
			break;
		case 20:
			levels = 4;
			break;
		case 35:
			levels = 5;
			break;
		case 50:
			levels = 6;
			break;
		case 75:
			levels = 7;
			break;
		case 100:
			levels = 8;
			break;
		case 150:
			levels = 9;
			break;
		case 200:
			levels = 10;
			break;
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
		case "time over":
			timeIsOver();
			break;
	}

	overlay();
	if (opacity > 0) {
		opacity -= opacityIncrement;
	}

}

