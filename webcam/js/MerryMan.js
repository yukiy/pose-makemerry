var MerryMan = function(id, w, h, targetArea){
	this.el = this.createCanvas(id, w, h, targetArea);
	this.draw = new Draw(id);
	this.json;
	this.interval;
	this.frameCount = 0;
	this.length;
}

MerryMan.prototype.getJson = function(url)
{
	const that = this;
	$.getJSON(url, function(res){
		console.log(res);
		that.json = res;
		that.length = res.frame.length;
		that.start();
	})
}

MerryMan.prototype.getCurrentFrame = function()
{
	return this.frameCount % this.length;
}

MerryMan.prototype.createCanvas = function(id, w, h, targetId)
{
	let target = document.getElementById(targetId);
	let canvas = document.createElement("canvas");
	canvas.id = id;
	canvas.width = w;
	canvas.height = h;
	target.appendChild(canvas);
	return canvas;
}


MerryMan.prototype.start = function()
{
	const that = this;
	this.interval = setInterval(function(){
		that.animate();
		that.frameCount++;
	}, 1000/30);
}


MerryMan.prototype.animate = function()
{
	this.draw.clear();
	let json = this.json.frame[this.getCurrentFrame()];
	this.draw.drawBones(json);
}
