var PxView = function(elId, width, height)
{
	this.renderer;
	this.stage;
	this.width;
	this.height;

	this.background;
	this.bgVideoTexture;
	this.bgVideoSource;

	this.setupStage(elId, width, height);

	this.traceCirclePoints = [];
	this.traceLinePoints = [];

	this.calc = new PoseCalculator();
}


PxView.prototype.setupStage = function(elId, width, height)
{
	this.width = width;
	this.height = height;
	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer(
		width, height,
		{antialias: true, transparent: false, resolution: 1, preserveDrawingBuffer: false}
	);
	document.getElementById(elId).appendChild(this.renderer.view);
	this.renderer.autoResize = true;
	this.renderer.resize(width, height);
	this.background = this.createBackground();
}


PxView.prototype.createBackground = function()
{
	let background = new PIXI.Sprite();
	background.position.set(0, 0);
	background.width = this.width;
	background.height = this.height;
	this.stage.addChild(background);
	return background;
}


PxView.prototype.copyCanvasAsBackground = function(canvasEl)
{
	const canvasTexture = PIXI.Texture.fromCanvas(canvasEl);
	this.background.texture = canvasTexture;
	this.background.texture.update();
}

PxView.prototype.drawVideoAsBackground = function(videoEl)
{
	const videoTexture = PIXI.Texture.fromVideo(videoEl);
	this.background.texture = videoTexture;
	this.background.texture.update();
	// var video = videoTexture.baseTexture.source;
	// video.currentTime = 0;
}

PxView.prototype.addFilter = function(target, options)
{
	let filter;

	if(options.filter = "BlurFilter"){
		filter = new PIXI.filters.BlurFilter();
		filter.blur = options.blur;
		filter.quality = options.quality;
	}

	if(options.filter = "GlowFilter"){
//		filter = new PIXI.filters.GlowFilter(15, 2, 1, 0xff9999, 0.5);
//		filter.blur = options.blur;
//		filter.quality = options.quality;
	}
	
	target.filters = [filter];
}



PxView.prototype.getOffset = function(imgMode, width, height)
{
	let offset = {x:0, y:0};
	if(imgMode == "CENTER"){
		offset.x = width/2;
		offset.y = height/2;
	}
	if(imgMode == "BOTTOM"){
		offset.x = width/2;
		offset.y = height;
	}
	if(imgMode == "TOP"){
		offset.x = width/2;
		offset.y = 0;
	}
	return offset;
}



	
