var Draw = function()
{
	this.cvs = document.getElementById("canvas");
	this.width = this.getWidth();
	this.height = this.getHeight();
	this.cvs.width = this.width;
	this.cvs.height = this.height;
	this.ctx = this.cvs.getContext("2d");
}

Draw.prototype.getWidth = function(){
	return $("#canvas").width();
}
Draw.prototype.getHeight = function(){
	return $("#canvas").height();
}

Draw.prototype.drawVideo = function()
{
	const that = this;
	setInterval(function(){
		let video = cam.playbackVideo;
		that.ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, that.getWidth(), that.getHeight());
	},1000/30);
}

