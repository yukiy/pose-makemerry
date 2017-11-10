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

		//right arm
		this.drawLine(keypoints, 1, 2, col);
		this.drawLine(keypoints, 2, 3, col);
		this.drawLine(keypoints, 3, 4, col);
		//left arm
		this.drawLine(keypoints, 1, 5, col);
		this.drawLine(keypoints, 5, 6, col);
		this.drawLine(keypoints, 6, 7, col);
		//body
		this.drawLine(keypoints, 1, 8, col);
		this.drawLine(keypoints, 1, 11, col);
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
		this.ctx.lineWidtht = 6;

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

