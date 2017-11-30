let pxView;
let pxEffectMap;
let boneGraphics;
let leftHandGraphics;
let rightHandGraphics;
let pxSprites;
let pxEffectKeyMap;


function pxSetup()
{
	pxView = new PxView("effectView", 640, 480);
	//pxView.setupStage("effectViewTd2", 320, 240);

	boneGraphics 		= new PxGraphicEffects(pxView);
	leftHandGraphics 	= new PxGraphicEffects(pxView);
	rightHandGraphics	= new PxGraphicEffects(pxView);

	const list = {
		"mickeyHandLeft" 	: "img/stamps/hands_mglobe.png",
		"mickeyHandRight" 	: "img/stamps/hands_mglobe.png",
		"catHandLeft" 		: "img/stamps/hands_cat.png",
		"catHandRight" 		: "img/stamps/hands_cat.png",
		"smileHead" 		: "img/stamps/emojismile.png",
		"heartEyesHead" 	: "img/stamps/Heart_Eyes_Emoji.png"
	};
	pxSprites = new PxSpriteManager(pxView, list);

	pxEffectKeyMap = new PxEffectKeyMap(pxView);

	//pxView.setVideoAsBackground("./movies_mp4/"+testFilename+".mp4");
	//globalCurrentFrame = pxView.getBackgroundVideoCurrentFrame();
	//pxView.bgVideoTexture.loop = true;

	onEffects();
}


function pxDraw(json)
{
	if(globalCurrentFrame == 1){
		boneGraphics.init();
		leftHandGraphics.init();
		rightHandGraphics.init();					
	}

	boneGraphics.clear();
	leftHandGraphics.clear();
	rightHandGraphics.clear();

	//pxView.copyVideoAsBackground(cam.recordedVideo);
	//pxView.updateBackgroundVideo();
	pxView.updateBackgroundImage(globalCurrentFrame, "./movies_jpg/test/test_");

	const people = json.people;

	for (let i=0; i<people.length; i++){
		const keypoints = people[i].pose_keypoints;
		const confidence = pxView.calc.getAverageValues(keypoints).averageConfidence;
		if(confidence < 0.5) return

		//boneGraphics.drawBones(keypoints, 5);

		if(pxSprites.isImageLoaded == true ){
			for(key in pxEffectKeyMap.effects){
				if(pxEffectKeyMap.effects[key].enable){
					pxEffectKeyMap.effects[key].effect(keypoints);
				}
				else{
					pxEffectKeyMap.effects[key].off(keypoints);
				}
			}

			pxView.addFilter(pxSprites.smileHead.sprite, {filter:"BlurFilter", blur:0.5, quality:4});
		}

		//wip to try extra-filter
		//pxView.addFilter(pxView.graphics, {filter:"GlowFilter", blur:3, quality:4});
	}

	pxView.renderer.render(pxView.stage);

	// if(globalCurrentFrame == globalTotalFrame){
	// 	pxView.setBackgroundVideoCurrentTime(0);
	// 	globalCurrentFrame = 1;
	// }
}


