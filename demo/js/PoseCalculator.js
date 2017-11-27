var PoseCalculator = function(){
	
}


PoseCalculator.prototype.getAverageValues = function(keypoints)
{
	let sumX = 0;
	let sumY = 0;
	let sumC = 0;
	for (let i=0; i<18; i++) {
		const x = keypoints[i*3];
		const y = keypoints[i*3+1];
		const c = keypoints[i*3+2];
		sumX += x;
		sumY += y;
		sumC += c;
	}
	const aveX = sumX / 18;
	const aveY = sumY / 18;
	const aveC = sumC / 18;
	const ave = { averageConfidence : aveC, averageX : aveX, averageY : aveY };
	return ave;
}


PoseCalculator.prototype.getAngle = function(p1, p2, mode="RADIANS")
{
	if(mode == "RADIANS"){
		return Math.atan2(p2.y-p1.y, p2.x-p1.x) + (90*Math.PI/180);
	}

	if(mode == "DEGREES"){
		return  Math.atan2(p2.y-p1.y, p2.x-p1.x) * 180 / Math.PI + (90*Math.PI/180);
	}
	return;
}

PoseCalculator.prototype.getAngleFromKeypoints = function(keypoints, partsId1, mode)
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

PoseCalculator.prototype.getBodyLength = function(keypoints)
{
	const cThreshold = 0.3;
	let len;
	const x1 = keypoints[1]; //---base of neck
	const y1 = keypoints[1+1];
	const c1 = keypoints[1+2];
	const x2 = keypoints[8]; //---bese of right thigh
	const y2 = keypoints[8+1];
	const c2 = keypoints[8+2];
	const x3 = keypoints[11];//---base of left thigh
	const y3 = keypoints[11+1];
	const c3 = keypoints[11+2];
	const a = Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
	const b = Math.sqrt(Math.pow(x3-x1,2)+Math.pow(y3-y1,2));
	if(c1 > cThreshold && c2 > cThreshold && c3 > cThreshold){
		len = (a + b) /2;
	}else if(c1 > cThreshold && c2 < cThreshold && c3 > cThreshold){
		len = b;
	}else if(c1 > cThreshold && c2 > cThreshold && c3 < cThreshold){
		len = a;
	}
	return len;
}

