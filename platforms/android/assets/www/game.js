var game;

var ballDistance = 160;
var rotationSpeed = 4;
var angleRange = [25, 155];
var visibleTargets = 7;
var bgColors = [0x62bd18, 0xffbb00, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];

window.onload = function() {	
	game = new Phaser.Game(640, 960, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.start("PlayGame");
}

var playGame = function(game){};

playGame.prototype = {
     preload: function(){
          game.load.image("firstball", "firstball.png");
          game.load.image("secondball", "secondball.png");
          game.load.image("target", "target.png");
          game.load.image("arm", "arm.png");
          game.scale.pageAlignHorizontally = true;
          game.scale.pageAlignVertically = true;
          game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     },
     create: function(){
          var randx = this.rnd.between(100, 500);
          var randy = this.rnd.between(100, 900);
          this.arm = game.add.sprite(randx, randy, "arm");
          this.arm.anchor.set(0, 0.5);
          this.balls = [
               game.add.sprite(randx, randy, "firstball"),
               game.add.sprite(randx, randy, "secondball")                   
          ]
          this.targetArray = [];
          this.steps = 0;
          this.rotatingDirection = game.rnd.between(0, 1);
          this.destroy = false;
          this.tintColor = bgColors[game.rnd.between(0, bgColors.length - 1)];
          this.targetGroup = game.add.group();
          this.balls[0].anchor.set(0.5);
          this.balls[1].anchor.set(0.5);
          this.rotationAngle = 0;
          this.rotatingBall = 1;
          var target = game.add.sprite(0, 0, "target");
          target.anchor.set(0.5);
          target.x = this.balls[0].x;
          target.y = this.balls[0].y;
          /*target.x = this.rnd.between(100, 900);
          target.y = this.rnd.between(100, 900);*/
          this.targetGroup.add(target);   
          this.targetArray.push(target);
          game.input.onDown.add(this.changeBall, this);
          for(var i = 0; i < visibleTargets; i++){
               this.addTarget(); 
          }

     },
     update: function(){
          this.rotationAngle = (this.rotationAngle + rotationSpeed * (this.rotatingBall * 2 - 1)) % 360;
          this.arm.angle = this.rotationAngle + 90;
          this.balls[this.rotatingBall].x = this.balls[1 - this.rotatingBall].x - ballDistance * Math.sin(Phaser.Math.degToRad(this.rotationAngle));
          this.balls[this.rotatingBall].y = this.balls[1 - this.rotatingBall].y + ballDistance * Math.cos(Phaser.Math.degToRad(this.rotationAngle));                    
     },
     changeBall:function(){
          this.arm.position = this.balls[this.rotatingBall].position
          this.rotatingBall = 1 - this.rotatingBall;
          this.rotationAngle = this.balls[1 - this.rotatingBall].position.angle(this.balls[this.rotatingBall].position, true) - 90;

          this.destroy = false;
          var distanceFromTarget = this.balls[this.rotatingBall].position.distance(this.targetArray[1].position);
          if(distanceFromTarget < 20){
               this.rotatingDirection = game.rnd.between(0, 1);
               var detroyTween = game.add.tween(this.targetArray[0]).to({
                    alpha: 0
               }, 500, Phaser.Easing.Cubic.In, true);
               detroyTween.onComplete.add(function(e){
                    e.destroy();
               })
               this.targetArray.shift();
               this.arm.position = this.balls[this.rotatingBall].position;
               this.rotatingBall = 1 - this.rotatingBall;
               this.rotationAngle = this.balls[1 - this.rotatingBall].position.angle(this.balls[this.rotatingBall].position, true) - 90;
               this.arm.angle = this.rotationAngle + 90; 
               /*for(var i = 0; i < this.targetArray.length; i++){
                    this.targetArray[i].alpha += 1 / 7;  
               }      
               this.addTarget();*/
          }
     },
     addTarget: function(){
          this.steps++;
          startX = this.targetArray[this.targetArray.length - 1].x;
          startY = this.targetArray[this.targetArray.length - 1].y;          
          var target = game.add.sprite(0, 0, "target");
          //var randomAngle = game.rnd.between(angleRange[0] + 90, angleRange[1] + 90);
          target.anchor.set(0.5);
          /*target.x = startX + ballDistance * Math.sin(Phaser.Math.degToRad(randomAngle));
          target.y = startY + ballDistance * Math.cos(Phaser.Math.degToRad(randomAngle));*/
          target.x = this.rnd.between(100, 500);
          target.y = this.rnd.between(100, 900);
          target.alpha = 1 - this.targetArray.length * (1 / 7);
          var style = {
               font: "bold 32px Arial",
               fill: "#" + this.tintColor.toString(16),
               align: "center"
          };
          var text = game.add.text(0, 0, this.steps.toString(), style);
          text.anchor.set(0.5);
          target.addChild(text);
          this.targetGroup.add(target);   
          this.targetArray.push(target);      
     }
}