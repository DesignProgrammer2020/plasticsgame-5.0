'use strict';

let state = 'title';
let cnv;
let points = 0;

let w = 600;
let h = 600;

let trash = [];
let player;

let playerImg;
let trashImg;

//spritesheets and animations
let playerSS;
let trashSS;
let playerJSON;
let trashJSON;
let playerAnimation = [];
let trashAnimation = [];
let earthDayImage = null;

//images of animals
let array = [];
let endangered = [];

//butterfly drawings in the beginning
let butterflies = [];
let turtles = [];

let button;
let randomIndex;
let animating = false;
let img;
let imageCounter = 0;

let firstTime = true;
let final = false;

let strokeWidth = 0;
let noiseOffset = 0;

let textArray;
let newYork;
let currentEndangered;


function preload() {
  //for level 1: picking up trash

  // //spritesheets
  playerSS = loadImage('assets/collector.png');
  playerJSON = loadJSON('assets/collector.json');
  trashSS = loadImage('assets/bottle.png');
  trashJSON = loadJSON('assets/bottle.json');

  for (let i = 0; i <= 10; i++) {
    endangered[i] = loadImage(`pictures/endangered_${i}.jpg`);
  }

  //for level 2: drawingMachine
  //upload newYork font
  newYork = loadFont('font/NewYork.ttf');
}

let yoff = 0.0; // 2nd dimension of perlin noise

function setup() {
  //for level 1: picking up trash
  var url = 'https://api.giphy.com/v1/gifs/search?&api_key=nqDlsVpOUw2qbCA0kd9jn43RdX07aU7Q&q=environment';
  loadJSON(url, gotData);

  cnv = createCanvas(w, h);
  textFont('monospace');

  let playerFrames = playerJSON.frames;

  for (let i = 0; i < playerFrames.length; i++) {
    let pos = playerFrames[i].frame;
    let img = playerSS.get(pos.x, pos.y, pos.w, pos.h);
    playerAnimation.push(img);
  }

  player = new Player();
  player.display();

  let trashFrames = trashJSON.frames;

  for (let i = 0; i < trashFrames.length; i++) {
    let pos = trashFrames[i].frame;
    let img = trashSS.get(pos.x, pos.y, pos.w, pos.h);
    trashAnimation.push(img);
  }

  trash.push(new Trash());


  //for level 2: drawing machine
  pixelDensity(1);
  drawPixels();
  strokeWeight(3);
  noFill();
  imageMode(CENTER);
  frameRate(12);

  textFont(newYork);
  textSize(40);

  //click the button
  button = createButton("Click to see");
  //button = select("#randButton");
  button.mousePressed(buttonPressed);
  button.class("randomizerButton");

  //create 12 butterflies at random locations
  for (let i = 0; i < 11; i++) {
    butterflies[i] = new Butterflies(random(0, windowWidth), random(0, windowHeight));
  }

  //create 6 turtles at random locations
  for (let i=0; i<=5; i++){
    turtles[i] = new Turtles (random(0, windowWidth),random(0, windowHeight));
  }
}

function gotData(giphy) {
  //for displaying multiple copies of the chosen image
  earthDayImage = loadImage(giphy.data[3].images.original.url);
}

function draw() {

  //for level 1: picking up plastic
  switch (state) {
    case 'title':
      title();
      cnv.mouseClicked(titleMouseClicked);
      break;

    case 'level 1':
      level1();
      cnv.mouseClicked(level1MouseClicked);
      break;

    case 'you win':
      youWin();
      cnv.mouseClicked(youWinMouseClicked);
      break;

    default:
      break;
  }

  //for level 2: drawing drawingMachine
  if (firstTime) {
    drawPixels();

    for (i = 0; i < butterflies.length; i++) {
      butterflies[i].display();
      butterflies[i].move();
    }

    //stylize the text
    fill(50, 0, 40);
    noStroke();
    textArray = newYork.textToPoints('Repopulate endangered animals!', width * 0.15, height * 0.4, 78, {
      sampleFactor: 0.3
    });

    for (let i = 0; i < textArray.length; i++) {
      ellipse(textArray[i].x, textArray[i].y, 2, 2);
    }

    fill(0);
    noStroke();
    textSize(24);
    text("Drag to trace. Hit 's' to save. Hit 'c' to redraw.", 0.15 * width, 0.6 * height);
  }

  if (animating == true && endangered.length > 0) {
    clear();
    drawPixels();  //multicolored background

    //upload images of endangered species
    imageCounter +=1
    imageCounter %= endangered.length;
    image(endangered[imageCounter], width / 2, height / 2);
  }

  if (mouseIsPressed) {
    firstTime = false;

    strokeWeight(strokeWidth);
    noiseOffset += 0.15;
    strokeWidth = noise(noiseOffset) * 15;

    stroke(map(mouseY, 0, windowHeight, 0, 255, true));

    array.push([mouseX, mouseY]);
    drawAnimal();
  }

  if (final) {    //last frame
    drawPixels();

    for (i = 0; i < turtles.length; i++) {
      turtles[i].display();
      turtles[i].move();
    }

    fill(0, 0, 150);
    noStroke();
    textArray = newYork.textToPoints('Protect endangered animals!', width * 0.15, height * 0.4, 78, {
      sampleFactor: 0.3
    });

    for (let i = 0; i < textArray.length; i++) {
      ellipse(textArray[i].x, textArray[i].y, 2, 2);
    }
  }
}

function drawTrees() {
  //add trees to the background
  //let trees remain in same position for every game

  //tree 1
  push();
  //brown triangle for trunk
  noStroke();
  fill(150, 100, 50);
  triangle(50, 200, 35, 320, 65, 320);
  //green circle for canopy
  fill(0, 120, 0);
  circle(50, 200, 100);
  pop();

  //tree 2
  push();
  translate(150, 0);
  //brown triangle for trunk
  noStroke();
  fill(150, 100, 50);
  triangle(50, 200, 35, 320, 65, 320);
  //green circle for canopy
  fill(0, 120, 0);
  circle(50, 200, 100);
  pop();

  //tree 3
  push();
  translate(300, 0);
  //brown triangle for trunk
  noStroke();
  fill(150, 100, 50);
  triangle(50, 200, 35, 320, 65, 320);
  //green circle for canopy
  fill(0, 120, 0);
  circle(50, 200, 100);
  pop();

  //tree 4
  push();
  translate(450, 0);
  //brown triangle for trunk
  noStroke();
  fill(150, 100, 50);
  triangle(50, 200, 35, 320, 65, 320);
  //green circle for canopy
  fill(0, 120, 0);
  circle(50, 200, 100);
  pop();
}


function drawCreek() {
  //yellow-green background for grass
  background(100, 240, 0);

  //brown rectangle for mud
  fill(206, 154, 113);

  curveVertex();
  beginShape();
  vertex(0, height*0.8);
  vertex(width*0.2, height*0.75);
  vertex(width*0.5, height*0.8);
  vertex(width*0.8, height*0.75);
  vertex(width, height*0.8);
  // vertex(width, height);
  // vertex(0, height);
  endShape(CLOSE);

  rectMode(CENTER);
  rect(width * 0.5, height * 0.9, width, height * 0.2);

  drawTrees();

  push();
  //transparent cyan waves for water
  fill(170, 295, 330, 80);
  noStroke();

  //make the waves move
  //draw a polygon with wave points
  beginShape();

  let xoff = 0;

  // Iterate over horizontal pixels
  for (let x = 0; x <= width; x += 5) {

    // Calculate a y value according to noise, map

    //2D Noise
    let y = map(noise(xoff, yoff), 0, 1, height * 0.95, height);
    vertex(x, y);
    // Increment x dimension for noise
    xoff += 0.03;
  }

  // increment y dimension for noise
  yoff += 0.03;
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);

  pop();
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    player.direction = 'left';
  } else if (keyCode == RIGHT_ARROW) {
    player.direction = 'right';
  } else if (keyCode == UP_ARROW) {
    player.direction = 'up';
  } else if (keyCode == DOWN_ARROW) {
    player.direction = 'down';
  } else if (key = ' ') {
    player.direction = 'still';
  }
}


function title() {
  push();
  //Happy Earth Day gif
  if (earthDayImage != null) {
    imageMode(CENTER);
    image(earthDayImage, width / 2, height / 2);
  }
  //bold gold text to contrast with light blue image
  fill(200, 175, 0);
  textStyle(BOLD);

  textSize(36);
  textAlign(CENTER);
  text('Collect the Trash', width / 2, height * 0.18);

  textSize(24);
  text('to help keep the creek clean', width / 2, height * 0.85);
  pop();
}

function titleMouseClicked() {
  state = 'level 1';
}

function level1() {
  // background(200, 200, 0);
  drawCreek();

  if (random(1) <= 0.01) {
    trash.push(new Trash());
  }

  player.display();
  player.move();

  //iterating through trash array to display and move them
  for (let i = 0; i < trash.length; i++) {
    trash[i].display();
    trash[i].move();
  }

  //using forEach loop
  // trash.forEach(function(trash){
  //   trash.display();
  //   trash.move();
  // })

  // //using for of loop
  // for(let trash of trash){
  //   trash.display();
  //   trash.move();
  // }

  //check for collision; if there is one, slice that trash out; increase points
  //need to iterate backwards through array

  for (let i = trash.length - 1; i >= 0; i--) {

    if (dist(player.x, player.y, trash[i].x, trash[i].y) <= (player.r + trash[i].r) / 2) {
      points++;
      trash.splice(i, 1);
    }
  }

  push();
  textSize(36);
  fill(0);
  noStroke();
  text(`points: ${points}`, width / 4, height * 0.15);

  if (points >= 10) {
    state = 'you win';
  }
}

function level1MouseClicked() {}

function youWin() {
  background(230, 210, 80);

  noStroke();
  fill(180, 150, 60);
  square(random(0, width), random(0, height), random(25, 75));
  fill(150);
  square(random(0, width), random(0, height), random(25, 75));

  textSize(36);
  fill(150, 120, 40);
  text('You win!', width / 2, height * 0.3);
  textSize(24);
  textAlign(CENTER);
  text('Thank you for picking up litter.', width / 2, height * 0.4);
  text('Now click for drawing fun.', width / 2, height * 0.5);
}

function youWinMouseClicked() {
  //don't let youWin drawing go beneath beginning image
  clear();
  state = 'level 2';
  points = 0;
}

function level2() {
  //drawing machine
  randomizer();
  buttonPressed();
  keyTyped();
  drawAnimal();
  mousePressed();
  drawPixels();
}

function level1MouseClicked() {}

function youWinAgain() {
  background(230, 210, 80);

  noStroke();
  fill(180, 150, 60);
  square(random(0, width), random(0, height), random(25, 75));
  fill(150);
  square(random(0, width), random(0, height), random(25, 75));

  textSize(36);
  fill(150, 120, 40);
  text('You win!', width / 2, height * 0.3);
  textSize(24);
  textAlign(CENTER);
  text('Thank you for repopulating animals', width / 2, height * 0.4);
}

function youWinAgainMouseClicked() {
  //don't let youWin drawing go beneath beginning image
  clear();
  state = 'title';
  points = 0;
}


function randomizer() {   //randomize preloaded images
  animating = false;
  if (endangered[0]) {
    clear();
    drawPixels();

    randomIndexEndangered = int(random(endangered.length));
    currentEndangered = endangered[randomIndexEndangered];
    image(endangered[randomIndexEndangered], width * 0.5, height * 0.5);

    endangered.splice([randomIndexEndangered], 1);

  } else {
    final = true
    drawPixels();
  }
}

function buttonPressed() {
  animating = true;
  setTimeout(randomizer, 1000);
}

function keyTyped() {
  if (key === 's') { //save image
    saveCanvas('drawing', 'png');
  } else if (key==='c'){
    clear();
    array = [];
    drawPixels();
    image(currentEndangered, width / 2, height / 2);
  }

}

function drawAnimal() {
  beginShape(); //draw image in curvilinear lines
  //lines with different shades of blue
  noFill();
  stroke(random(0, 20), random(70, 120), 255);

  for (let i = 0; i < array.length; i++) {
    curveVertex(array[i][0], array[i][1]);
  }
  endShape();

  //draw the same image at a smaller scale
  push();
  translate(0.35 * width, 0.3 * height);
  beginShape();
  //lines with different shades of red
  stroke(255, random(90, 140), random(90, 140));
  scale(0.75);
  for (let i = 0; i < array.length; i++) {
    curveVertex(array[i][0], array[i][1]);
  }

  endShape();
  pop();

  //draw another image at a smaller scale
  push();
  translate(0.6 * width, 0.35 * height);
  beginShape();
  //lines with different shades of green
  stroke(random(40, 90), 170, random(40, 90));
  scale(0.5);
  for (let i = 0; i < array.length; i++) {
    curveVertex(array[i][0], array[i][1]);
  }

  endShape();
  pop();

  //draw another image at a smaller scale
  push();
  translate(-0.12 * width, 0.15 * height);
  beginShape();
  //lines with different shades of dark brown
  stroke(random(40, 170), random(20, 100), random(0, 50));
  scale(0.85);
  for (let i = 0; i < array.length; i++) {
    curveVertex(array[i][0], array[i][1]);
  }
  endShape();
  pop();

  //draw another image at a smaller scale
  push();
  translate(-0.18 * width, 0.25 * height);
  beginShape();
  //lines with different shades of tan
  stroke(random(120, 240), random(110, 230), random(70, 100));
  scale(0.65);
  for (let i = 0; i < array.length; i++) {
    curveVertex(array[i][0], array[i][1]);
  }
  endShape();
  pop();

}

function mousePressed() {
  array = [];
}

function drawPixels() {
  //draw background with pixels
  loadPixels();
  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      let index = (i + j * width) * 4;
      pixels[index + 0] = i / 4;
      pixels[index + 1] = j / 2;
      pixels[index + 2] = i / 2;
      pixels[index + 3] = 255;
    }
  }
  updatePixels();
}
