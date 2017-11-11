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

Draw.prototype.drawBones = function(json)
{
//	console.log(json);
	if(!json || !json.people) return;
	const people = json.people;
	for (let i=0; i<people.length; i++) {
    	const person = people[i];
    	const keypoints = person.pose_keypoints;
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
}


Draw.prototype.drawLine = function(keypoints, partsId1, partsId2, col)
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
			this.ctx.moveTo(x1*this.width, y1*this.height);
			this.ctx.lineTo(x2*this.width, y2*this.height);
			this.ctx.closePath();
			this.ctx.stroke();
		}
		if (x1==0 || y1==0 || x2==0 || y2==0) {
		//println(count);
		}
	}
}


Draw.prototype.drawHead = function(json)
{
	if(!json || !json.people) return;
	const people = json.people;
	for (let i=0; i<people.length; i++) {
    	const person = people[i];
    	const keypoints = person.pose_keypoints;
		this.drawImage(keypoints, 0);
	}
}


Draw.prototype.drawImage = function(keypoints, partsId){
	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];
		const c = keypoints[p+2];
	
		if (x>0 && y>0 && x>0 && y>0) {
			const img = new Image();
			img.src = "./img/stamps/emojismile.png";
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


