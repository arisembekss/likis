BasicGame = {
    //orientated: false;
    
};

BasicGame.menuGame = function(game){
	this.logo;
};

BasicGame.menuGame.prototype = {

	preload: function(){
		this.load.image('bg', 'img/firstball.png');

		this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	},
	create: function(){
		this.stage.backgroundColor = "ffbb00";
		this.logo = this.add.button(this.world.centerX, this.world.centerY, 'bg', this.startGame, this,'buttonOver', 'buttonOut', 'buttonOver');
		this.logo.anchor.setTo(0.5, 0.5);
	},
	update: function(){

	},
	startGame: function(){
		this.state.start("PlayGame");
	}

}

