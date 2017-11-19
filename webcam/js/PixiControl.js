
var PixiControl = function(width, height, elId)
{
	this.renderer;
	this.stage;
	this.width = width;
	this.height = height;

	this.ctx;

	this.sprites = [];

	this.isImagesLoaded = true;

	this.sprites = {};

	this.bgVideoTexture;
	this.bgVideoSource;

	this.setupStage(width, height, elId);
	this.background = this.createBackground();

	//this.graphicsList = [];
	this.graphics = this.createGraphics();

	this.traceCirclePoints = [];
	this.traceLinePoints = [];

}


PixiControl.prototype.setupStage = function(width, height, elId)
{
	this.stage = new PIXI.Container();
	this.renderer = PIXI.autoDetectRenderer(
		width, height,
		{antialias: true, transparent: false, resolution: 1, preserveDrawingBuffer: false}
	);
	document.getElementById(elId).appendChild(this.renderer.view);
	this.renderer.autoResize = true;
	this.renderer.resize(width, height);

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


PixiControl.prototype.createGraphics = function()
{
	let graphics = new PIXI.Graphics();
	this.stage.addChild(graphics);
	return graphics;
}


PixiControl.prototype.copyCanvasAsBackground = function(canvas)
{
	let canvasTexture = PIXI.Texture.fromCanvas(canvas);
	this.background.texture = canvasTexture;
	this.background.texture.update();
}



PixiControl.prototype.createSprites = function(list)
{
	const that = this;
	let urls = [];
	for(let name in list){
		urls.push(list[name]);
	}

	//---remove same urls
	urls = Array.from(new Set(urls));

	//---load
	PIXI.loader.add(urls);
	PIXI.loader.load(function(){
		that.isImageLoaded = true;
		for(let name in list){
			const sprite = that.createSprite(name, list[name]);
			that.stage.addChild(sprite);
		}
		PIXI.loader.reset();
	})
} 

PixiControl.prototype.createSprite = function(name, imgsrc, x=0, y=0, width=50, height=50, anchorX=0.5, anchorY=0.5, rotation=0)
{
	var sprite = new PIXI.Sprite( PIXI.loader.resources[imgsrc].texture );
	sprite.position.set(x, y);
	sprite.width = width;
	sprite.height = height;
	sprite.anchor.x = anchorX;
	sprite.anchor.y = anchorY;
	sprite.rotation = rotation;

	//const name = imgsrc.substr(imgsrc.lastIndexOf('/')+1);
	this.sprites[name] = sprite;	
	return sprite;
}


PixiControl.prototype.drawSpriteOnParts = function(keypoints, partsName, sprite, width, height, plusAngle=0)
{
	if(this.isImagesLoaded == false) return;
	let partsId;
	let imgMode;

	if(partsName.toUpperCase() == "HEAD"){
		partsId = 0;
		imgMode = "CENTER"
	}
	if(partsName.toUpperCase() == "LEFT_HAND"){
		partsId = 7;
		imgMode = "BOTTOM"
	}
	if(partsName.toUpperCase() == "RIGHT_HAND"){
		partsId = 4;
		imgMode = "BOTTOM"
	}
	if(partsName.toUpperCase() == "LEFT_FOOT"){
		partsId = 13;
		imgMode = "CENTER"
	}
	if(partsName.toUpperCase() == "RIGHT_FOOT"){
		partsId = 10;
		imgMode = "CENTER"
	}

	this.updateSprite(keypoints, partsId, sprite, width, height, imgMode, plusAngle);
	this.renderer.render(this.stage);	
}


PixiControl.prototype.updateSprite = function(keypoints, partsId, sprite, width, height, imgMode, plusAngle=0)
{
	if(this.isImagesLoaded == false) return;

	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];

		if(x!=0 && y!=0){
			this.setOffset(sprite, imgMode);
			sprite.position.set(x*this.width, y*this.height);
			//console.log(x);
			sprite.width = width;
			sprite.height = height;
			sprite.rotation = this.getAngleFromKeypoints(keypoints, partsId) + (plusAngle*Math.PI/180);			
		}
	}	
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



PixiControl.prototype.drawBones = function(keypoints, lineWidth)
{
	let col = 0x000000;

	//head
	this.drawLine(keypoints, 0, 14, col, lineWidth);
	this.drawLine(keypoints, 14, 16, col, lineWidth);
	this.drawLine(keypoints, 0, 15, col, lineWidth);
	this.drawLine(keypoints, 15, 17, col, lineWidth);
	this.drawLine(keypoints, 0, 1, col, lineWidth);

	col = 0xff0000;
	//right arm
	this.drawLine(keypoints, 1, 2, col, lineWidth);
	this.drawLine(keypoints, 2, 3, col, lineWidth);
	this.drawLine(keypoints, 3, 4, col, lineWidth);
	//left arm
	this.drawLine(keypoints, 1, 5, col, lineWidth);
	this.drawLine(keypoints, 5, 6, col, lineWidth);
	this.drawLine(keypoints, 6, 7, col, lineWidth);

	col = 0x00ff00;
	//body
	this.drawLine(keypoints, 1, 8, col, lineWidth);
	this.drawLine(keypoints, 1, 11, col, lineWidth);

	col = 0x0000ff;
	//right leg
	this.drawLine(keypoints, 8, 9, col, lineWidth);
	this.drawLine(keypoints, 9, 10, col, lineWidth);
	//left leg
	this.drawLine(keypoints, 11, 12, col, lineWidth);
	this.drawLine(keypoints, 12, 13, col, lineWidth);
}



PixiControl.prototype.drawTraceLine = function(keypoints, partsId, options)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
	
		if (x>0 && y>0) {
			this.graphics.lineStyle(options.lineWidth, options.color, options.alpha);

			this.traceLinePoints.push({x:x, y:y});

			if(this.traceLinePoints.length > 2){
				for(let i=0; i<this.traceLinePoints.length; i++){
					let p = this.traceLinePoints[i];
					this.graphics.lineTo(p.x*this.width, p.y*this.height);
				}
				if(this.traceLinePoints.length > options.length){
					this.traceLinePoints.shift();
				}
			}else{
				let p = this.traceLinePoints[0];
				this.graphics.moveTo(p.x*this.width, p.y*this.height);
			}
		}
		else {
		//println(count);
		}
	}
}


//PixiControl.prototype.drawLine = function(keypoints, partsId1, partsId2, col, lineWidth, graphics = this.createGraphics())
PixiControl.prototype.drawLine = function(keypoints, partsId1, partsId2, col, lineWidth)
{
	if (keypoints.length > 0)
	{
		const p1 = partsId1*3;
		const p2 = partsId2*3;
		const x1 = keypoints[p1];
		const y1 = keypoints[p1+1];
		const x2 = keypoints[p2];
		const y2 = keypoints[p2+1];
	
		this.graphics.lineStyle(lineWidth, col, 1);

		if (x1>0 && y1>0 && x2>0 && y2>0) {
			this.graphics.moveTo(x1*this.width, y1*this.height);
			this.graphics.lineTo(x2*this.width, y2*this.height);
		}
	}
}

PixiControl.prototype.drawTraceCircle = function(keypoints, partsId, options)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
		const c = keypoints[p+2];
	
		if (x>0 && y>0) {

			this.traceCirclePoints.push({x:x, y:y});

			let radius = options.radius;
			let radiusDec = 0.9;

			if(this.traceCirclePoints.length > 2){
				for(let i=0; i<this.traceCirclePoints.length; i++){
					let p = this.traceCirclePoints[i];
					//radius *= radiusDec;
					radius =options.radius;
					radius *= Math.pow(radiusDec, (this.traceCirclePoints.length-1-i));
					const offset = this.getOffset(options.imgMode, radius, radius);
					this.drawCircle(p.x*this.width-offset.x, p.y*this.height-offset.y, radius, options);

					//---random circles
					const parlin = noise.simplex2(globalFrameCount%50, globalFrameCount%50)*0.0;
					const rRadius = Math.random()*radius/3;
					const rX = (p.x+parlin) *this.width;
					const rY = (p.y+parlin) *this.height;
					const options2 = {
					//	color : "rgba("+Math.floor(parlin*255)+","+Math.floor(parlin*255)+","+Math.floor(parlin*255)+","+Math.random()+")"
					}
					this.drawCircle(rX-offset.x, rY-offset.y, radius, options);
				}
				
				if(this.traceCirclePoints.length > options.length){
					this.traceCirclePoints.shift();
				}
			}else{
				let p = this.traceCirclePoints[0];
				this.drawCircle(p.x*this.width, p.y*this.height, radius,0,Math.PI*2,true);
			}
		}
		else {
		//println(count);
		}
	}
}


PixiControl.prototype.drawCircle = function(x, y, r, options)
{
	this.graphics.lineStyle(0);
	this.graphics.beginFill(options.color, options.alpha);
	this.graphics.drawCircle(x, y, r);
	this.graphics.endFill();
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

	
