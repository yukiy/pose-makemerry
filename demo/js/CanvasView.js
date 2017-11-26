var CanvasView = function(targetId, width, height)
{
//	this.id = id;
	this.canvas = this.setupCanvas (targetId, width, height);
	this.context = this.canvas.getContext("2d");
	this.width = width;
	this.height = height;
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.background = "TRANSPARENT";

	

	this.effect = new CanvasEffects(this);
}

CanvasView.prototype.setupCanvas = function(targetId, w, h)
{
	let target = document.getElementById(targetId);
	let canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	target.appendChild(canvas);
	return canvas;
}


// CanvasView.prototype.getWidth = function(){
// 	return $("#"+this.id).width();
// }
// CanvasView.prototype.getHeight = function(){
// 	return $("#"+this.id).height();
// }

CanvasView.prototype.clear = function()
{
	this.context.clearRect(0, 0, this.width, this.height);
}

CanvasView.prototype.drawBackground = function(col)
{
	this.context.fillStyle = col;
	this.context.rect(0, 0, this.width, this.height);
	this.context.fill();
}

CanvasView.prototype.drawVideo = function(video)
{
	//this.context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, this.getWidth(), this.getHeight());
	this.context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, this.width, this.height);
}



