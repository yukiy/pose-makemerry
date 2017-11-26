var PxEffectKeyMap = function()
{
	const that = this;

	this.effects = {
		w : {
			enable : true,
			effect : function(keypoints){
				const size = 50;
				pxSprites.smileHead.drawSpriteOnParts(keypoints, "HEAD", size, size);
				pxSprites.smileHead.sprite.visible = true;
			},
			off : function(){
				pxSprites.smileHead.sprite.visible = false;
			}
		},
		a : {
			enable : true,
			effect : function(keypoints){
				const size = 50;
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
		s: {
			enable : true,
			effect : function(keypoints){
				const option = {
					color: 0xff0099,
					alpha: 0.8,
					lineWidth: 3, 
					length: 50
				};
				rightHandGraphics.drawTraceLine(keypoints, 4, option);
			},
			off : function(keypoints){
				const option = { alpha: 0 };
				rightHandGraphics.drawTraceLine(keypoints, 4, option);
			}
		},
		g: {
			enable : true,
			effect : function(keypoints){
				const option = {
					color: 0xffffaa,
					alpha: 0.5, 
					radius: 10, 
					length: 20,
					imgMode: "BOTTOM"
				}
				leftHandGraphics.drawTraceCircle(keypoints, 7, option);
			},
			off : function(keypoints){
				const option = { alpha: 0 };
				leftHandGraphics.drawTraceCircle(keypoints, 7, option);
			}
		}
	}
}

