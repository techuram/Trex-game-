var trex, trex_running;
var ground;
var invisibleGround;
var clouds;
var rand;
var PLAY = 1;
var gameState = PLAY;
var END = 0;
var score = 0;

function preload(){
  trex_running = loadAnimation("Images/trex1.png", "Images/trex3.png", "Images/trex4.png");
  trex_collided = loadAnimation("Images/trex_collided.png");
  ground_img = loadImage("Images/ground2.png");
  cloud_img = loadImage("Images/cloud.png");
  obstacle1_img = loadImage("Images/obstacle1.png");
  obstacle2_img = loadImage("Images/obstacle2.png");
  obstacle3_img = loadImage("Images/obstacle3.png");
  obstacle4_img = loadImage("Images/obstacle4.png");
  obstacle5_img = loadImage("Images/obstacle5.png");
  obstacle6_img = loadImage("Images/obstacle6.png");
  gameOver_img = loadImage("Images/gameOver.png");
  restart_img = loadImage("Images/restart.png");
  checkpoint = loadSound("checkpoint (1).mp3");
  jump = loadSound("jump (1).mp3");
  die = loadSound("die.mp3");
}

function setup(){
  createCanvas(windowWidth, windowHeight);
  edges = createEdgeSprites();

  //create a trex sprite
  trex = createSprite(50, height - 90, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = false;
  trex.setCollider("circle", 0, 0, 25);

  //Create Ground Sprite
  ground = createSprite(width/2, height-30, width, 10);
  ground.addImage("ground", ground_img);
  ground.velocityX = -5;
  ground.x = ground.width / 2;

  //Create Invisible Ground
  invisibleGround = createSprite(width/2, height-10, width, 10);
  invisibleGround.visible = false;

  //Creating Groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //GameOver Sprite
  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOver_img);
  gameOver.visible = false;
  gameOver.scale = 0.7;

  //Restart Sprite
  restart = createSprite(300, 130);
  restart.addImage(restart_img);
  restart.visible = false;
  restart.scale = 0.5;
}

function draw() { 

  background(180);
  text("Score: " +  score, 500, 50);
  console.log(score);

//Creating Play State
  if (gameState === PLAY) 
  {
    //Defining Score
    if (frameCount % 30 === 0) {
      score= score + 1
    }
  

    //Making trex jump when space is presed
    if ((keyDown("space") || touches.length > 0) && trex.y >= height - 50) 
    {
      trex.velocityY = -10;
      jump.play();
      touches = [];
    }

  

    //Giving Gravity to trex
    trex.velocityY = trex.velocityY + 0.8

    //Infinite ground
    if (ground.x < 0) 
    {
      ground.x = ground.width / 2
    }

    //Spawning Clouds & Obstacles 
    spawnObstacles();
    spawnClouds();

    if (score > 0 && score % 100 === 0) {
      checkpoint.play();
    }

    //Ending Game Condition
    if (obstaclesGroup.isTouching(trex)) 
    {
      gameState = END;
      //trex.velocityY = -10
      die.play();
    }

  }
  
  //Creating End State
  else if (gameState === END) 
  {
    
    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);

    trex.changeAnimation("collided", trex_collided);

    
    
    gameOver.visible = true;
    restart.visible = true;
  }

  trex.collide(invisibleGround);
  if (mousePressedOver(restart)) {
    reset();


  }
  drawSprites();
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  restart.visible = false;
  gameOver.visible = false;
  trex.changeAnimation("running", trex_running);
  ground.velocityX = -5;
  score = 0
}

function spawnClouds() {
  if (frameCount % 60 === 0) 
  {
    clouds = createSprite(600, 100, 20, 20);
    clouds.addImage("clouds", cloud_img);

    clouds.scale = 0.8;
    clouds.y = Math.round(random(30, height - 150))
    
    clouds.velocityX = -5;
    clouds.depth = trex.depth - 1
    trex.depth = trex.depth + 1
    console.log(trex.depth);
    console.log(clouds.depth);
    clouds.lifetime = 120;

    cloudsGroup.add(clouds);
  }

}

function spawnObstacles() {
  if (frameCount % 90 === 0) {
    obstacle = createSprite(600, height - 50, 10, 40);
    obstacle.velocityX = -(7 + 3 * score/100)
    obstacle.lifetime = 300;
    rand = Math.round(random(1, 6))
    switch(rand) {
      case 1: obstacle.addImage(obstacle1_img)
      break;
      case 2: obstacle.addImage(obstacle2_img)
      break;
      case 3: obstacle.addImage(obstacle3_img)
      break;
      case 4: obstacle.addImage(obstacle4_img)
      break;
      case 5: obstacle.addImage(obstacle5_img)
      break;
      case 6: obstacle.addImage(obstacle6_img)
      break;
      default : break
    }
    obstacle.scale = 0.5;

    obstaclesGroup.add(obstacle);
  
  }
}

