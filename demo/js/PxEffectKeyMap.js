var PxEffectKeyMap = function(pxView)
{
	this.pxView = pxView;
	const that = this;

	this.effects = {
		q : {
			enable : false,
			part : "headOverlay",
			effect : function(keypoints){
				// let bodyLen = pxView.calc.getBodyLength(keypoints);
				// if(bodyLen == undefined) bodyLen = 0.5;
				// const size = bodyLen * pxView.height * 0.2;
				const size = $("#effectBox #headSize").val() * pxView.height;
				pxSprites.heartEyesHead.drawSpriteOnParts(keypoints, "HEAD", size, size);
				pxSprites.heartEyesHead.sprite.visible = true;
			},
			off : function(){
				pxSprites.heartEyesHead.sprite.visible = false;
			}
		},
		w : {
			enable : false,
			part : "headOverlay",
			effect : function(keypoints){
				// let bodyLen = pxView.calc.getBodyLength(keypoints);
				// if(bodyLen == undefined) bodyLen = 0.5;
				// const size = bodyLen * pxView.height * 0.2;
				const size = $("#effectBox #headSize").val() * pxView.height;
				pxSprites.smileHead.drawSpriteOnParts(keypoints, "HEAD", size, size);
				pxSprites.smileHead.sprite.visible = true;
			},
			off : function(){
				pxSprites.smileHead.sprite.visible = false;
			}
		},
		a : {
			enable : false,
			part : "handsOverlay",
			effect : function(keypoints){
				const size = $("#effectBox #handsSize").val() * pxView.height;
				pxSprites.mickeyHandRight.drawSpriteOnParts(keypoints, "RIGHT_HAND", size, size);
				pxSprites.mickeyHandRight.sprite.visible = true;
				pxSprites.mickeyHandLeft.drawSpriteOnParts(keypoints, "LEFT_HAND", size, size);
				pxSprites.mickeyHandLeft.sprite.visible = true;
			},
			off : function(){
				pxSprites.mickeyHandRight.sprite.visible = false;
				pxSprites.mickeyHandLeft.sprite.visible = false;
			}
		},
		s : {
			enable : false,
			part : "handsOverlay",
			effect : function(keypoints){
				const size = $("#effectBox #handsSize").val() * pxView.height;
				pxSprites.catHandRight.drawSpriteOnParts(keypoints, "RIGHT_HAND", size, size);
				pxSprites.catHandRight.sprite.visible = true;
				pxSprites.catHandLeft.drawSpriteOnParts(keypoints, "LEFT_HAND", size, size);
				pxSprites.catHandLeft.sprite.visible = true;
			},
			off : function(){
				pxSprites.catHandRight.sprite.visible = false;
				pxSprites.catHandLeft.sprite.visible = false;
			}
		},
		z: {
			enable : false,
			part : "handsEffect",
			effect : function(keypoints){
				const option = {
					color: 0xff0099,
					alpha: 0.8,
					lineWidth: 3, 
					length: 50
				};
				leftHandGraphics.drawTraceLine(keypoints, 7, option);
				rightHandGraphics.drawTraceLine(keypoints, 4, option);
				boneGraphics.drawBones(keypoints, 8);
			},
			off : function(keypoints){
				const option = { alpha: 0 };
				leftHandGraphics.drawTraceLine(keypoints, 7, option);
				rightHandGraphics.drawTraceLine(keypoints, 4, option);
			}
		},
		x: {
			enable : false,
			part : "handsEffect",
			effect : function(keypoints){
				const option = {
					color: 0xffffaa,
					alpha: 0.5, 
					radius: 20, 
					length: 30,
					imgMode: "CENTER"
				}
				leftHandGraphics.drawTraceCircle(keypoints, 7, option);
				rightHandGraphics.drawTraceCircle(keypoints, 4, option);
			},
			off : function(keypoints){
				const option = { alpha: 0 };
				leftHandGraphics.drawTraceCircle(keypoints, 7, option);
				rightHandGraphics.drawTraceCircle(keypoints, 4, option);
			}
		}
	}
}

