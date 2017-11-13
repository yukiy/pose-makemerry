var Effect = function(d)
{
	this.cvs = d.cvs;
	this.ctx = d.ctx;
	this.width = d.width;
	this.height = d.height;

	this.ctx.lineWidth = 5;
	this.traceLinePoints = [];
	this.traceCirclePoints = [];

	noise.seed(Math.random());
}

Effect.prototype.drawBones = function(keypoints)
{
	let col = "rgb(0,0,0)";

	//head
	this.drawLine(keypoints, 0, 14, col);
	this.drawLine(keypoints, 14, 16, col);
	this.drawLine(keypoints, 0, 15, col);
	this.drawLine(keypoints, 15, 17, col);
	this.drawLine(keypoints, 0, 1, col);

	col = "rgb(255,0,0)"
	//right arm
	this.drawLine(keypoints, 1, 2, col);
	this.drawLine(keypoints, 2, 3, col);
	this.drawLine(keypoints, 3, 4, col);
	//left arm
	this.drawLine(keypoints, 1, 5, col);
	this.drawLine(keypoints, 5, 6, col);
	this.drawLine(keypoints, 6, 7, col);

	col = "rgb(0,255,0)"
	//body
	this.drawLine(keypoints, 1, 8, col);
	this.drawLine(keypoints, 1, 11, col);

	col = "rgb(0,0,255)"
	//right leg
	this.drawLine(keypoints, 8, 9, col);
	this.drawLine(keypoints, 9, 10, col);
	//left leg
	this.drawLine(keypoints, 11, 12, col);
	this.drawLine(keypoints, 12, 13, col);
}


Effect.prototype.drawLine = function(keypoints, partsId1, partsId2, col)
{
	if (keypoints.length > 0)
	{
		const p1 = partsId1*3;
		const p2 = partsId2*3;
		const x1 = keypoints[p1];
		const y1 = keypoints[p1+1];
		const c1 = keypoints[p1+2];
		const x2 = keypoints[p2];
		const y2 = keypoints[p2+1];
		const c2 = keypoints[p2+2];
	
		this.ctx.strokeStyle = col;
		this.ctx.lineWidth = 5;

		if (x1>0 && y1>0 && x2>0 && y2>0) {
			this.ctx.beginPath();
			this.ctx.moveTo(x1*this.cvs.width, y1*this.cvs.height);
			this.ctx.lineTo(x2*this.cvs.width, y2*this.cvs.height);
			this.ctx.closePath();
			this.ctx.stroke();
		}
		if (x1==0 || y1==0 || x2==0 || y2==0) {
		//println(count);
		}
	}
}


Effect.prototype.drawHead = function(keypoints, imgsrc, width, height)
{
	this.drawImage(keypoints, 0, imgsrc, width, height);
}

Effect.prototype.drawImage = function(keypoints, partsId, imgsrc, width, height)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
		const c = keypoints[p+2];
	
		if (x>0 && y>0 && x>0 && y>0) {
			const img = new Image();
			img.src = imgsrc;
			img.width = 30;
			img.height = 30;

//			this.ctx.translate(x*this.width-img.width/2, y*this.height-img.height/2);
//			this.ctx.rotate(angleInRadians);
//			this.ctx.drawImage(image, -width / 2, -height / 2, width, height);
//			this.ctx.rotate(-angleInRadians);
//			this.ctx.translate(-x, -y);

			this.ctx.drawImage(img, x*this.width-img.width/2, y*this.height-img.height/2, img.width, img.height);
		}
	}
}


Effect.prototype.drawTraceLine = function(keypoints, partsId, options)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
		const c = keypoints[p+2];
	
		if (x>0 && y>0) {

			this.ctx.strokeStyle = options.color;
			this.ctx.lineWidth = options.lineWidth;
		
			this.ctx.shadowBlur = 10;
			this.ctx.shadowColor = "black";

			this.traceLinePoints.push({x:x, y:y});

			this.ctx.beginPath();
			if(this.traceLinePoints.length > 2){
				this.ctx.beginPath();
				for(let i=0; i<this.traceLinePoints.length; i++){
					let p = this.traceLinePoints[i];
					this.ctx.lineTo(p.x*this.width, p.y*this.height);
				}
				this.ctx.stroke();
				if(this.traceLinePoints.length > options.length){
					this.traceLinePoints.shift();
				}
			}else{
				let p = this.traceLinePoints[0];
				this.ctx.moveTo(p.x*this.width, p.y*this.height);
			}
		}
		else {
		//println(count);
		}
	}
}


Effect.prototype.drawTraceCircle = function(keypoints, partsId, options)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
		const c = keypoints[p+2];
	
		if (x>0 && y>0) {

			this.ctx.fillStyle = options.color;
		
			this.ctx.shadowBlur = 50;
			this.ctx.shadowColor = options.color;
			this.traceCirclePoints.push({x:x, y:y});

			let radius = options.radius;
			let radiusDec = 0.9;

			if(this.traceCirclePoints.length > 2){
				for(let i=0; i<this.traceCirclePoints.length; i++){
					let p = this.traceCirclePoints[i];
					//radius *= radiusDec;
					radius =options.radius;
					radius *= Math.pow(radiusDec, (this.traceCirclePoints.length-1-i));
					this.drawCircle(p.x*this.width,p.y*this.height, radius, options)

					//---random circles
					const parlin = noise.simplex2(globalFrameCount%50, globalFrameCount%50)*0.0;
					const rRadius = Math.random()*radius/3;
					const rX = (p.x+parlin) *this.width;
					const rY = (p.y+parlin) *this.height;
					const options2 = {
					//	color : "rgba("+Math.floor(parlin*255)+","+Math.floor(parlin*255)+","+Math.floor(parlin*255)+","+Math.random()+")"
					}
					this.drawCircle(rX, rY, radius, options);
				}
				
				if(this.traceCirclePoints.length > options.length){
					this.traceCirclePoints.shift();
				}
			}else{
				let p = this.traceCirclePoints[0];
				this.ctx.beginPath();
				this.ctx.arc(p.x*this.width,p.y*this.height,radius,0,Math.PI*2,true);
				this.ctx.fill();
			}
		}
		else {
		//println(count);
		}
	}
}

Effect.prototype.drawCircle = function(x, y, r, options){
	this.ctx.fillStyle = options.color;
	this.ctx.shadowColor = options.color;
	this.ctx.shadowBlur = options.shadowBlur;

	this.ctx.beginPath();
	this.ctx.arc(x, y, r, 0, Math.PI*2, true);
	this.ctx.fill();
}

Effect.prototype.traceNeighborLine = function(keypoints, partsId, options)
{
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
		const c = keypoints[p+2];
	
		if (x>0 && y>0) {
			this.ctx.lineJoin = "round";
			this.ctx.lineCap = "round";
			this.ctx.strokeStyle = options.color;
			this.ctx.lineWidth = options.lineWidth;
		
			this.ctx.shadowBlur = 0;
			this.ctx.shadowColor = "black";

			this.traceLinePoints.push({x:x, y:y});

			if(this.traceLinePoints.length > 2){
				let p = this.traceLinePoints;
				this.ctx.beginPath();
				this.ctx.moveTo(p[p.length-2].x*this.width, p[p.length-2].y*this.height);
				this.ctx.lineTo(p[p.length-1].x*this.width, p[p.length-1].y*this.height);
				this.ctx.stroke();

				for (var i=0; i<p.length; i++) {
					let dx = p[i].x*this.width 　- p[p.length-1].x*this.width;
					let dy = p[i].y*this.height - p[p.length-1].y*this.height;
					let d = dx * dx + dy * dy;

					if (d < 1000) {
						this.ctx.beginPath();
						this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
						this.ctx.moveTo( p[p.length-1].x*this.width + (dx * 0.2), p[p.length-1].y*this.height + (dy * 0.2));
						this.ctx.lineTo( p[i].x*this.width 　　　　　　　　- (dx * 0.2), p[i].y*this.height　　　　　　　　　- (dy * 0.2));
						this.ctx.stroke();
					}
				}
				if(this.traceLinePoints.length > options.length){
					this.traceLinePoints.shift();
				}
			}else{
				let p = this.traceLinePoints[0];
				this.ctx.moveTo(p.x*this.width, p.y*this.height);
			}
		}
	}
}
