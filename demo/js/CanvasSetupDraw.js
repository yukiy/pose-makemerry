let sfxView;

function canvasSetup()
{
	sfxView = new CanvasView("effectView", 320, 240);
}


function canvasDraw (json)
{
	sfxView.drawVideo(cam.playbackVideo);
	boneView.drawBackground("#aaaaaa");
	const people = json.people;

	for (let i=0; i<people.length; i++){
		const keypoints = people[i].pose_keypoints;
		const confidence = sfxView.effect.calc.getAverageValues(keypoints).averageConfidence;
		if(confidence < 0.5) return

		boneView.effect.drawBones(keypoints, 5);

		sfxView.effect.drawTraceLine(keypoints, 4, {
			color:"rgba(255,0,180, 0.4)", 
			lineWidth:10, 
			length:30
		});

		sfxView.effect.drawImageOnParts(keypoints, "HEAD", 		"./img/stamps/emojismile.png", 30, 30);
		sfxView.effect.drawImageOnParts(keypoints, "LEFT_HAND",  "./img/stamps/mickeyglobe_rotate.png", 30, 30);
		sfxView.effect.drawImageOnParts(keypoints, "RIGHT_HAND", "./img/stamps/mickeyglobe_rotate.png", 30, 30);

		let option = {
			color:"rgba(255,0,180, 0.8)", 
			lineWidth:1, 
			length:50
		};
		sfxView.effect.drawTraceLine(keypoints, 4, option);

		// sfxView.effect.traceNeighborLine(keypoints, 4, {
		// 	color:"rgba(255,0,180, 0.8)", 
		// 	lineWidth:1, 
		// 	length:50
		// });

		option = {
			color:"rgba(255,255,230, 0.5)", 
			radius: 10, 
			length: 20,
			imgMode: "BOTTOM"
		}
		sfxView.effect.drawTraceCircle(keypoints, 7, option);

	}
}

