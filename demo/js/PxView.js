var PxView = function(elId, width, height)
{
	this.renderer;
	this.stage;
	this.width;
	this.height;

	this.background;

	this.bgVideoTexture;
	this.frameRate = globalFrameRate;
	if(this.frameRate == undefined) this.frameRate = 30;

	this.elId = elId;
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
		width, height,{
		antialias: true,
		transparent: false,
		resolution: 1,
		preserveDrawingBuffer: false
	});
	document.getElementById(elId).appendChild(this.renderer.view);
	this.renderer.autoResize = true;
	this.renderer.resize(width, height);
	this.background = this.createBackground();
}

PxView.prototype.getCanvas = function()
{
	return this.renderer.view;
}

PxView.prototype.getContext = function()
{
	return this.renderer.view.getContext("webgl");
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


PxView.prototype.updateBackgroundImage = function(frame, imgsrcdir)
{
	const filename = imgsrcdir + zeroPadding(frame, 4) + ".jpg";
	const imageTexture = PIXI.Texture.fromImage(filename);
	this.background.texture = imageTexture;
}


PxView.prototype.copyCanvasAsBackground = function(canvasEl)
{
	const canvasTexture = PIXI.Texture.fromCanvas(canvasEl);
	this.background.texture = canvasTexture;
	this.background.texture.update();
}

PxView.prototype.copyVideoAsBackground = function(videoEl)
{
	const videoTexture = PIXI.Texture.fromVideo(videoEl);
	this.background.texture = videoTexture;
	this.background.texture.update();
	// var video = videoTexture.baseTexture.source;
	// video.currentTime = 0;
}

PxView.prototype.setVideoAsBackground = function(videosrc)
{
	//var videoTexture = PIXI.VideoBaseTexture.fromUrl(videosrc);
	var videoTexture = PIXI.Texture.fromVideoUrl(videosrc);
	this.background.texture = videoTexture;
	this.bgVideoTexture = videoTexture.baseTexture.source;
}

PxView.prototype.updateBackgroundVideo = function()
{
	this.background.texture.update();
}

PxView.prototype.getBackgroundVideoCurrentTime = function()
{
	return this.bgVideoTexture.currentTimee;
}

PxView.prototype.getBackgroundVideoCurrentFrame = function()
{
	return Math.floor(this.bgVideoTexture.currentTime * this.frameRate);
}

PxView.prototype.setBackgroundVideoCurrentTime = function(time)
{
	this.bgVideoTexture.currentTime = time;
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



	
