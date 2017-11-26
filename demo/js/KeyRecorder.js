var KeyRecorder = function()
{
	this.keyb = new Input.Keybord();

	this.addKeyList = ["a", "s", "d"];
	for(let i=0; i<this.addKeyList.length; i++){
		this.keyb.add(this.addKeyList[i]);
	}

	/*
	head still
	hand still
	foot still
	hand effect
	*/

	this.isDeleteMode = false;
	this.setShiftListenner(document);

	this.totalFrameNum = 120;
	this.keyStatusHistory;

	this.tempOnStartFrame;
	this.tempOnEndFrame;
	this.tempOffStartFrame;
	this.tempOffEndFrame;

	this.setup();

}


KeyRecorder.prototype.setup = function()
{
	this.keyStatusHistory = new Array(this.totalFrameNum);
	for(let i=0; i<this.totalFrameNum; i++){
		this.keyStatusHistory[i] = new Array(127);
		for(let j=0; j<127; j++){
			this.keyStatusHistory[i][j] = false;
		}
	}
}


KeyRecorder.prototype.isOnNow = function(key)
{
	let keyCode;
	(typeof key == "string") ? keyCode = key.charCodeAt(0) : keyCode = key;

	//---needed to be refer the last frame for a real time preview
	if(globalCurrentFrame == 0){
		return this.keyStatusHistory[globalCurrentFrame][keyCode];
	}
	else{
		return this.keyStatusHistory[globalCurrentFrame-1][keyCode];		
	}
}


KeyRecorder.prototype.isOn = function(frame, key)
{
	let keyCode;
	(typeof key == "string") ? keyCode = key.charCodeAt(0) : keyCode = key;
	return this.keyStatusHistory[frame][keyCode];
}


KeyRecorder.prototype.recordKeyOn = function(key)
{
	let keyCode;
	(typeof key == "string") ? keyCode = key.charCodeAt(0) : keyCode = key;
	this.keyStatusHistory[globalCurrentFrame][keyCode] = true;
}


KeyRecorder.prototype.recordKeyOff = function(key)
{
	let keyCode;
	(typeof key == "string") ? keyCode = key.charCodeAt(0) : keyCode = key;
	this.keyStatusHistory[globalCurrentFrame][keyCode] = false;
}


KeyRecorder.prototype.updateKeys = function()
{
	const that = this;

	this.keyb.update();

	for(let i=0; i<this.addKeyList.length; i++){
		const char  = this.addKeyList[i]
		if(this.keyb.is_key_on(char)){
			if(this.isDeleteMode){
				this.recordKeyOff(char);
			}else{
				this.recordKeyOn(char);
			}
		}
	}
}


KeyRecorder.prototype.setShiftListenner = function(elId)
{
	const that = this;
	$(elId).bind("keydown", function(e){
		if(e.shiftKey){
			that.isDeleteMode = true;
		}
	});

	$(elId).bind("keyup", function(e){
		if(!e.shiftKey){
			that.isDeleteMode = false;
		}
	});
}

