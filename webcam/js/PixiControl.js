
var PixiControl = function()
{
	this.renderer;
	this.stage;
	this.width;
	this.height;

	this.ctx;

	this.bgVideoTexture;
	this.bgVideoSource;

	//this.setupStage(width, height, elId);
	//this.background = this.createBackground();

	//this.graphicsList = [];
	//this.graphics = this.createGraphics();

	this.traceCirclePoints = [];
	this.traceLinePoints = [];

}


PixiControl.prototype.setupStage = function(width, height, elId)
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

// PixiControl.prototype.drawdVideo = function(video, frameNum)
// {
// 	this.bgVideoTexture = PIXI.Texture.fromVideo(video.src);
// 	this.bgVideoSource = this.bgVideoTexture.baseTexture.source;
// 	this.bgVideoSource.currentTime = time;
// 	this.bgVideoSource.loop = true;
// 	this.background = new PIXI.Sprite(bgVideoTexture);
// 	this.background.position.set(0, 0);
// 	this.background.width = this.width;
// 	this.background.height = this.height;
// 	this.stage.addChild(this.background);
// }

PixiControl.prototype.createBackground = function()
{
	let background = new PIXI.Sprite();
	background.position.set(0, 0);
	background.width = this.width;
	background.height = this.height;
	this.stage.addChild(background);
	return background;
}


PixiControl.prototype.copyCanvasAsBackground = function(canvas)
{
	let canvasTexture = PIXI.Texture.fromCanvas(canvas);
	this.background.texture = canvasTexture;
	this.background.texture.update();
}






PixiControl.prototype.addFilter = function(target, options)
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





PixiControl.prototype.getOffset = function(imgMode, width, height)
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


PixiControl.prototype.setOffset = function(sprite, imgMode)
{
	if(imgMode == "CENTER"){
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
	}
	if(imgMode == "BOTTOM"){
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 1.0;
	}
	if(imgMode == "TOP"){
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0;
	}
}

PixiControl.prototype.getAngleFromKeypoints = function(keypoints, partsId1, mode)
{
	let partsId2;
	if(partsId1 == 0) partsId2 = 1;
	if(partsId1 == 1) partsId2 = 1;
	if(partsId1 == 2) partsId2 = 1;
	if(partsId1 == 3) partsId2 = 2;
	if(partsId1 == 4) partsId2 = 3;

	if(partsId1 == 5) partsId2 = 1;
	if(partsId1 == 6) partsId2 = 5;
	if(partsId1 == 7) partsId2 = 6;

	if(partsId1 == 8) partsId2 = 1;
	if(partsId1 == 9) partsId2 = 8;
	if(partsId1 == 10) partsId2 = 9;

	if(partsId1 == 11) partsId2 = 1;
	if(partsId1 == 12) partsId2 = 11;
	if(partsId1 == 13) partsId2 = 12;

	const p1 = partsId1*3;
	const x1 = keypoints[p1];
	const y1 = keypoints[p1+1];
	const p2 = partsId2*3;
	const x2 = keypoints[p2];
	const y2 = keypoints[p2+1];

	const vec1 = { x:x2, y:y2 };
	const vec2 = { x:x1, y:y1 };
	return this.getAngle(vec1, vec2, mode);
}


PixiControl.prototype.getAngle = function(p1, p2, mode="RADIANS")
{
	if(mode == "RADIANS"){
		return Math.atan2(p2.y-p1.y, p2.x-p1.x) + (90*Math.PI/180);
	}

	if(mode == "DEGREES"){
		return  Math.atan2(p2.y-p1.y, p2.x-p1.x) * 180 / Math.PI + (90*Math.PI/180);
	}
	return;
}

	
