var Recorder = function()
{
	const that = this;
	this.effectMap = {
		w : {
			isOn : function(){ return that.isOn(87) },
			effect : function(keypoints){
				sp.smileHead.drawSpriteOnParts(keypoints, "HEAD", 30, 30);
				sp.smileHead.sprite.visible = true;
			},
			off : function(){
				sp.smileHead.sprite.visible = false;
			}
		},
		a : {
			isOn : function(){return that.isOn(65) },
			effect : function(keypoints){
				sp.mickeyHandRight.drawSpriteOnParts(keypoints, "RIGHT_HAND", 30, 30);
				sp.mickeyHandRight.sprite.visible = true;
			},
			off : function(){
				sp.mickeyHandRight.sprite.visible = false;
			}
		},
		s : {
			isOn : function(){ return that.isOn(83) },
			effect : function(keypoints){
				sp.mickeyHandLeft.drawSpriteOnParts(keypoints, "LEFT_HAND",  30, 30);
				sp.mickeyHandLeft.sprite.visible = true;
			},
			off : function(){
				sp.mickeyHandLeft.sprite.visible = false;
			}
		},
		f: {
			isOn : function(){ return that.isOn(70) },
			effect : function(keypoints){
				const option = {
					color: 0xff0099,
					alpha: 0.8,
					lineWidth: 3, 
					length: 50
				};
				rightHandGraphics.drawTraceLine(keypoints, 4, option);
			},
			off : function(keypoints){
				const option = { alpha: 0 };
				rightHandGraphics.drawTraceLine(keypoints, 4, option);
			}
		},
		g: {
			isOn : function(){ return that.isOn(71) },
			effect : function(keypoints){
				const option = {
					color: 0xffffaa,
					alpha: 0.5, 
					radius: 10, 
					length: 20,
					imgMode: "BOTTOM"
				}
				leftHandGraphics.drawTraceCircle(keypoints, 7, option);
			},
			off : function(keypoints){
				const option = { alpha: 0 };
				leftHandGraphics.drawTraceCircle(keypoints, 7, option);
			}
		}


	}

	this.keyStatusHistory = [];
	this.keyStatus = [];

	this.setup(119);
}


Recorder.prototype.setup = function(frameNum)
{
	for(let i=0; i<127; i++){
		this.keyStatus[i] = false;
	}

	for(let i=0; i<frameNum; i++){
		this.keyStatusHistory.push(this.keyStatus);
	}
}


Recorder.prototype.update = function()
{
	this.keyStatusHistory[globalCurrentFrame] = this.keyStatus; 
}


Recorder.prototype.setKeyEvents = function(elId)
{
	const that = this;
	$(elId).bind("keydown", function(e){
		console.log(e.keyCode);
		that.keyStatus[e.keyCode] = true;
		that.update();
	})

	$(elId).bind("keyup", function(e){
		that.keyStatus[e.keyCode] = false;
		that.update();
	})
}


Recorder.prototype.isOn = function(keyCode)
{
	if(globalCurrentFrame == 0){
		return this.keyStatusHistory[globalCurrentFrame][keyCode];
	}
	else{
		return this.keyStatusHistory[globalCurrentFrame-1][keyCode];		
	}
}

