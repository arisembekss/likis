

var ballDistance = 160;
var rotationSpeed = 4;
var angleRange = [25, 155];
var visibleTargets = 7;
var bgColors = [0x62bd18, 0xffbb00, 0xff5300, 0xd21034, 0xff475c, 0x8f16b2];

var timer, timerEvent, text;

/*window.onload = function() {  
  game = new Phaser.Game(640, 960, Phaser.AUTO, "");
     game.state.add("PlayGame", playGame);
     game.state.add("MenuGame", menuGame);
     game.state.start("MenuGame");
}*/

BasicGame.playGame = function(game){};

BasicGame.playGame.prototype = {
     preload: function(){
          this.load.image("firstball", "firstball.png");
          this.load.image("secondball", "secondball.png");
          this.load.image("target", "target.png");
          this.load.image("arm", "arm.png");
          this.scale.pageAlignHorizontally = true;
          this.scale.pageAlignVertically = true;
          this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
     },
     create: function(){
          this.detik = 30;
          this.menit = 0;
          //this.curscore = 0;
          var randx = this.rnd.between(100, 500);
          var randy = this.rnd.between(150, 850);
          this.savedData = localStorage.getItem("circlepath")==null?{score:0}:JSON.parse(localStorage.getItem("circlepath"));
          var style = {
               font: "bold 64px Arial",
               fill: "#ffffff"
          };
          var textscore = this.add.text(0, 0, "Best score: "+this.savedData.score.toString(), style);
          this.txttimer=this.add.text(0, 900, 'timer', { font: "50px Arial", fill: "#ffffff"});
          
          this.arm = this.add.sprite(randx, randy, "arm");
          this.arm.anchor.set(0, 0.5);
          this.balls = [
               this.add.sprite(randx, randy, "firstball"),
               this.add.sprite(randx, randy, "secondball")                   
          ]
          this.targetArray = [];
          this.steps = 0;
          this.rotatingDirection = this.rnd.between(0, 1);
          this.destroy = false;
          this.tintColor = bgColors[this.rnd.between(0, bgColors.length - 1)];
          do{
               this.tintColor2 = bgColors[this.rnd.between(0, bgColors.length - 1)];     
          } while(this.tintColor == this.tintColor2)
          this.stage.backgroundColor = this.tintColor;
          this.targetGroup = this.add.group();
          this.balls[0].anchor.set(0.5);
          this.balls[0].tint = this.tintColor2;
          this.balls[1].anchor.set(0.5);
          this.balls[1].tint = this.tintColor2;
          this.rotationAngle = 0;
          this.rotatingBall = 1;
          var target = this.add.sprite(0, 0, "target");
          target.anchor.set(0.5);
          target.x = this.balls[0].x;
          target.y = this.balls[0].y;
          /*target.x = this.rnd.between(100, 900);
          target.y = this.rnd.between(100, 900);*/
          this.targetGroup.add(target);   
          this.targetArray.push(target);
          this.input.onDown.add(this.changeBall, this);
          for(var i = 0; i < visibleTargets; i++){
               this.addTarget(); 
          }
          //this.timerku=this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter(), this);
          this.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);
          timer = this.time.create();
        
        // Create a delayed event 1m and 30s from now
        timerEvent = timer.add(Phaser.Timer.MINUTE * this.menit + Phaser.Timer.SECOND * this.detik, this.endTimer, this);
        
        // Start the timer
        timer.start();
        //this.updateCounter();

     },
     update: function(){
          this.rotationAngle = (this.rotationAngle + rotationSpeed * (this.rotatingBall * 2 - 1)) % 360;
          this.arm.angle = this.rotationAngle + 90;
          this.balls[this.rotatingBall].x = this.balls[1 - this.rotatingBall].x - ballDistance * Math.sin(Phaser.Math.degToRad(this.rotationAngle));
          this.balls[this.rotatingBall].y = this.balls[1 - this.rotatingBall].y + ballDistance * Math.cos(Phaser.Math.degToRad(this.rotationAngle));                    
     },
     /*render: function () {
        // If our timer is running, show the time in a nicely formatted way, else show 'Done!'
        if (timer.running) {
            this.debug.text(this.formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
        }
        else {
            this.debug.text("Done!", 2, 14, "#0f0");
        }
    },*/
     changeBall:function(){
          
          //this.curscore++;
          this.arm.position = this.balls[this.rotatingBall].position
          this.rotatingBall = 1 - this.rotatingBall;
          this.rotationAngle = this.balls[1 - this.rotatingBall].position.angle(this.balls[this.rotatingBall].position, true) - 90;

          this.destroy = false;
          var distanceFromTarget = this.balls[this.rotatingBall].position.distance(this.targetArray[1].position);
          if(distanceFromTarget < 20){
               this.rotatingDirection = this.rnd.between(0, 1);
               var detroyTween = this.add.tween(this.targetArray[0]).to({
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
               this.stage.backgroundColor = bgColors[this.rnd.between(0, bgColors.length - 1)];
               for(var i = 0; i < this.targetArray.length; i++){
                    this.targetArray[i].alpha += 1 / 7;  
               }      
               this.addTarget();
               /*var stylecur = {
               font: "bold 32px Arial",
               fill: "#ffffff",
               align: "center"
               };
               var textcur = this.add.text(100, 900, "current score: "+this.steps.toString(), stylecur);*/
          }
            
     },
     addTarget: function(){
          this.steps++;
          startX = this.targetArray[this.targetArray.length - 1].x;
          startY = this.targetArray[this.targetArray.length - 1].y;          
          var target = this.add.sprite(0, 0, "target");
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
          var text = this.add.text(0, 0, this.steps.toString(), style);
          text.anchor.set(0.5);
          target.addChild(text);
          this.targetGroup.add(target);   
          this.targetArray.push(target);
          var stylecur = {
               font: "bold 32px Arial",
               fill: "#ffffff",
               align: "center"
          }; 
          //var textcur = this.add.text(100, 900, "current score: "+this.steps.toString(), stylecur);     
     },
     updateCounter: function(){
          this.detik--;
          this.txttimer.text = this.menit+' : '+this.detik;
          if(this.detik==0){   
               this.detik=60;
               this.menit--;
          }
          else if(this.menit<0 ){
               this.txttimer.text = '0 : 0';   
          } 
         /* var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        
        return minutes.substr(-2) + ":" + seconds.substr(-2); */
     },
     endTimer: function(){
          timer.stop();
          
          localStorage.setItem("circlepath",JSON.stringify({
               score: Math.max(this.savedData.score, this.steps - visibleTargets)
          }));
          this.input.onDown.remove(this.changeBall, this);
          this.saveRotationSpeed = 0;
          this.arm.destroy();
          //target.alpha = 0;
          this.targetGroup.removeChildren(0, 7);
          var gameOverTween = this.add.tween(this.balls[1 - this.rotatingBall]).to({
               alpha: 0
          }, 1000, Phaser.Easing.Cubic.Out, true);
          //textscore.text = "Best Score: "+score;
          var styleover = {
               font: "bold 64px Arial",
               fill: "#ffffff"
          };
          var textover = this.add.text(this.world.centerX, this.world.centerY + 64, "Game Over", styleover);
          textover.anchor.setTo(0.5, 0.5);
          textover.alpha = 0;
          this.btnAgain = this.add.button(this.world.centerX, this.world.centerY - 64, 'firstball', this.starGameAgain, this,'', '', '');
          this.btnAgain.anchor.setTo(0.5, 0.5);
          this.btnAgain.alpha = 0;
          var txtOverTween = this.add.tween(textover).to({
               alpha: 1
          }, 400, Phaser.Easing.Cubic.In, true);
          var btnOverTween = this.add.tween(this.btnAgain).to({
               alpha: 1
          }, 400, Phaser.Easing.Cubic.In, true);
     },
     starGameAgain: function(){
          this.state.start("playGame");
          this.detik = 30;
          this.menit = 2;
          timer.start();
     }
}