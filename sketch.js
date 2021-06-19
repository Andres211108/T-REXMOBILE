var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloud, cloudsGroup, cloudImage;

var score;

var obstacus, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var gameOver, restart, gameoverImg, restartImg;

var jumpSound , checkPointSound, dieSound;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(width/2,height-20,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  invisibleGround = createSprite(width/2,height-10,width,10);
  invisibleGround.visible = false;
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group(); 
  
  trex.setCollider("rectangle", 0, 0, 100, trex.height);
  trex.setCollider("circle", 0, 0, 45);
  trex.debug = false;
  
  gameOver = createSprite(width/2,height/2 -50);
  gameOver.addImage(gameoverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
  
  console.log("Hello"+ 5)
  
  score = 0;
  
}

function draw() {
  background(200);
  
  text("score: "+ score, width-100, 50);
  
  if (touches.length > 0){
    gameState = PLAY;
  }
  
  if (gameState === PLAY){
    ground.velocityX = -(4+3*score/100);
    score = score + Math.round(getFrameRate()/60);
    
    if (ground.x < 0){
       ground.x = ground.width/2;
    }
    
    if(keyDown("up")&& trex.y >= height-50 || touches.length > 0) {
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
    }
      
    if(keyDown("space")&& trex.y >= height-50 || touches.length > 0) {
        trex.velocityY = -12;
        jumpSound.play();
        touches = [];
    }
    
    if(score > 0 && score %100 === 0){
       checkPointSound.play();
    }
  
    trex.velocityY = trex.velocityY + 0.8;
    
      //aparece las nubes
    spawnClouds();
  
    spawnobstacus();
    
    if (obstaclesGroup.isTouching(trex)){
       gameState = END;
        dieSound.play();
        //trex.velocityY = -12;
    }
  }
  
  else if (gameState === END){
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;
    gameOver.visible = true;
    restart.visible = true;
    
    trex.changeAnimation("collided", trex_collided);
  
    
    if(mousePressedOver(restart)){
    reset();
    }
  }
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-600,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,80));
    cloud.scale = 0.7;
    cloud.velocityX = -5;
    cloudsGroup.add (cloud);
   
    
    //asigna ciclo de vida a la variable
    cloud.lifetime = 200;
    
    //ajusta la profundidad
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    }
}

function spawnobstacus(){
  if (frameCount % 60 === 0) {
    obstacus = createSprite(width+20,height-35, 10, 40);
    
    //genera obstaculos aleatorios
    obstacus.velocityX = -(4+3*score/100);
    var rand = Math.round(random(1, 6));
    switch(rand){
      case 1: obstacus.addImage(obstacle1);
        break;
      case 2: obstacus.addImage(obstacle2);
        break;
      case 3: obstacus.addImage(obstacle3);
        break;
      case 4: obstacus.addImage(obstacle4);
        break;
      case 5: obstacus.addImage(obstacle5);
        break;
      case 6: obstacus.addImage(obstacle6);
        break;
        default: break; 
    }
    obstacus.scale = 0.5;
    obstacus.lifetime = 200;
    obstaclesGroup.add (obstacus);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
}