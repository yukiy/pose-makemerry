var GraphicEffects = function(px)
{
	this.px = px;
	this.graphics;
	this.create(px);

	this.traceLinePoints = [];
	this.traceCirclePoints = [];
}


GraphicEffects.prototype.create = function(px)
{
	this.graphics = new PIXI.Graphics();
	px.stage.addChild(this.graphics);
}


GraphicEffects.prototype.clear = function()
{
	this.graphics.clear();
}

GraphicEffects.prototype.init = function()
{
	this.graphics.clear();
	this.traceLinePoints = [];
	this.traceCirclePoints = [];
}
 

GraphicEffects.prototype.drawBones = function(keypoints, lineWidth)
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


//PixiControl.prototype.drawLine = function(keypoints, partsId1, partsId2, col, lineWidth, graphics = this.createGraphics())
GraphicEffects.prototype.drawLine = function(keypoints, partsId1, partsId2, col, lineWidth)
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
			this.graphics.moveTo(x1*this.px.width, y1*this.px.height);
			this.graphics.lineTo(x2*this.px.width, y2*this.px.height);
		}
	}
}


GraphicEffects.prototype.drawTraceLine = function(keypoints, partsId, options)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
	
		if (x>0 && y>0) {
			//this.graphicList[keypoints].lineStyle(options.lineWidth, options.color, options.alpha);
			this.graphics.lineStyle(options.lineWidth, options.color, options.alpha);

			this.traceLinePoints.push({x:x, y:y});

			if(this.traceLinePoints.length > 2){
				let p = this.traceLinePoints[0];
				this.graphics.moveTo(p.x*this.px.width, p.y*this.px.height);

				for(let i=0; i<this.traceLinePoints.length; i++){
					let p = this.traceLinePoints[i];
					this.graphics.lineTo(p.x*this.px.width, p.y*this.px.height);
				}
				if(this.traceLinePoints.length > options.length){
					this.traceLinePoints.shift();
				}
			}else{
				let p = this.traceLinePoints[0];
				this.graphics.moveTo(p.x*this.px.width, p.y*this.px.height);
			}
		}
		else {
		//println(count);
		}
	}
}


GraphicEffects.prototype.drawTraceCircle = function(keypoints, partsId, options)
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
					const offset = this.px.getOffset(options.imgMode, radius, radius);
					this.drawCircle(p.x*this.px.width-offset.x, p.y*this.px.height-offset.y, radius, options);

					//---random circles
					const parlin = noise.simplex2(globalFrameCount%50, globalFrameCount%50)*0.0;
					const rRadius = Math.random()*radius/3;
					const rX = (p.x+parlin) *this.px.width;
					const rY = (p.y+parlin) *this.px.height;
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
				this.drawCircle(p.x*this.px.width, p.y*this.px.height, radius,0,Math.PI*2,true);
			}
		}
		else {
		//println(count);
		}
	}
}


GraphicEffects.prototype.drawCircle = function(x, y, r, options)
{
	this.graphics.lineStyle(0);
	this.graphics.beginFill(options.color, options.alpha);
	this.graphics.drawCircle(x, y, r);
	this.graphics.endFill();
}

