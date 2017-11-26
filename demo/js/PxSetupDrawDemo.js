let pxView;
let pxEffectMap;
let boneGraphics;
let leftHandGraphics;
let rightHandGraphics;
let pxSprites;


function pxSetup()
{
	pxView = new PxView("effectViewTd2", 320, 240);
	//pxView.setupStage("effectViewTd2", 320, 240);

	boneGraphics 		= new PxGraphicEffects(pxView);
	leftHandGraphics 	= new PxGraphicEffects(pxView);
	rightHandGraphics	= new PxGraphicEffects(pxView);

	const list = {
		"mickeyHandLeft" 	: "img/stamps/mickeyglobe_rotate.png",
		"mickeyHandRight" 	: "img/stamps/mickeyglobe_rotate.png",
		"smileHead" 		: "img/stamps/emojismile.png"
	};
	pxSprites = new PxSpriteManager(pxView, list);

	pxEffectMap = new PxEffectKeyMap();

}


function pxDraw(json)
{
	if(globalCurrentFrame == 0){
		boneGraphics.init();
		leftHandGraphics.init();
		rightHandGraphics.init();					
	}

	pxView.drawVideoAsBackground(cam.playbackVideo);

	const people = json.people;

	for (let i=0; i<people.length; i++){
		const keypoints = people[i].pose_keypoints;
		const confidence = pxView.calc.getAverageValues(keypoints).averageConfidence;
		if(confidence < 0.5) return

		//boneGraphics.drawBones(keypoints, 5);

		if(pxSprites.isImageLoaded == true ){
			for(key in pxEffectMap.effects){
				if(rec.isOnNow(key) == true){
					pxEffectMap.effects[key].effect(keypoints);
				}
				else{
					pxEffectMap.effects[key].off(keypoints);
				}
			}

			pxView.addFilter(pxSprites.smileHead.sprite, {filter:"BlurFilter", blur:0.5, quality:4});
		}

		//wip to try extra-filter
		//pxView.addFilter(pxView.graphics, {filter:"GlowFilter", blur:3, quality:4});
	}

	pxView.renderer.render(pxView.stage);
	boneGraphics.clear();
	leftHandGraphics.clear();
	rightHandGraphics.clear();
}


