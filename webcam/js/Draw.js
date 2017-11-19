var Draw = function(id)
{
	this.cvs = document.getElementById(id);
	this.id = id;
	this.width = this.getWidth();
	this.height = this.getHeight();
	this.cvs.width = this.width;
	this.cvs.height = this.height;
	this.ctx = this.cvs.getContext("2d");
	this.background = "TRANSPARENT";

	this.people = [];
	this.effect = new Effect(this);
}

Draw.prototype.getWidth = function(){
	return $("#"+this.id).width();
}
Draw.prototype.getHeight = function(){
	return $("#"+this.id).height();
}

Draw.prototype.clear = function()
{
	this.ctx.clearRect(0, 0, this.width, this.height);
}

Draw.prototype.drawBackground = function(col)
{
	this.ctx.fillStyle = col;
	this.ctx.rect(0, 0, this.width, this.height);
	this.ctx.fill();
}

Draw.prototype.drawVideo = function(video)
{
	this.ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, this.getWidth(), this.getHeight());
}

Draw.prototype.setPeople = function(people){
	this.people = people;
}



