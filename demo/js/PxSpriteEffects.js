var PxSpriteManager = function(pxView, list)
{
	this.pxView = pxView;
	this.isImageLoaded = false;

	this.createSprites(list);
}


PxSpriteManager.prototype.createSprites = function(list)
{
	const that = this;
	let urls = [];
	for(let name in list){
		urls.push(list[name]);
	}

	//---remove same urls
	urls = Array.from(new Set(urls));

	//---load
	PIXI.loader.add(urls);
	PIXI.loader.load(function(){
		that.isImageLoaded = true;
		for(let name in list){
			const sprite = that.createSprite(name, list[name]);
			that.pxView.stage.addChild(sprite);
		}
		PIXI.loader.reset();
	})
} 


PxSpriteManager.prototype.createSprite = function(name, imgsrc, x=0, y=0, width=50, height=50, anchorX=0.5, anchorY=0.5, rotation=0)
{
	var sprite = new PIXI.Sprite( PIXI.loader.resources[imgsrc].texture );
	sprite.position.set(x, y);
	sprite.width = width;
	sprite.height = height;
	sprite.anchor.x = anchorX;
	sprite.anchor.y = anchorY;
	sprite.rotation = rotation;

	//const name = imgsrc.substr(imgsrc.lastIndexOf('/')+1);
	this[name] = new PxSpriteEffects(this.pxView, sprite);
	return sprite;
}




/*=========================================================================================================================*/

var PxSpriteEffects = function(pxView, sprite)
{
	this.pxView = pxView;
	this.sprite = sprite;
}


PxSpriteEffects.prototype.drawSpriteOnParts = function(keypoints, partsName, width, height, plusAngle=0)
{
	//if(this.isImagesLoaded == false) return;
	let partsId;
	let imgMode;

	if(partsName.toUpperCase() == "HEAD"){
		partsId = 0;
		imgMode = "CENTER"
	}
	if(partsName.toUpperCase() == "LEFT_HAND"){
		partsId = 7;
		imgMode = "BOTTOM"
	}
	if(partsName.toUpperCase() == "RIGHT_HAND"){
		partsId = 4;
		imgMode = "BOTTOM"
	}
	if(partsName.toUpperCase() == "LEFT_FOOT"){
		partsId = 13;
		imgMode = "CENTER"
	}
	if(partsName.toUpperCase() == "RIGHT_FOOT"){
		partsId = 10;
		imgMode = "CENTER"
	}

	//this.updateSprite(keypoints, partsId, sprite, width, height, imgMode, plusAngle);
	this.updateSprite(keypoints, partsId, width, height, imgMode, plusAngle);
	this.pxView.renderer.render(this.pxView.stage);	
}


PxSpriteEffects.prototype.updateSprite = function(keypoints, partsId, width, height, imgMode, plusAngle=0)
{
	//if(this.isImagesLoaded == false) return;

	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];

		if(x!=0 && y!=0){
			this.setOffset(this.sprite, imgMode);
			this.sprite.position.set(x*this.pxView.width, y*this.pxView.height);
			//console.log(x);
			this.sprite.width = width;
			this.sprite.height = height;
			this.sprite.rotation = this.pxView.calc.getAngleFromKeypoints(keypoints, partsId) + (plusAngle*Math.PI/180);			
		}
	}	
}


PxSpriteEffects.prototype.setOffset = function(sprite, imgMode)
{
	if(imgMode == "CENTER"){
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
	}
	if(imgMode == "BOTTOM"){
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 1.0;
	}
	if(imgMode == "TOP"){
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0;
	}
}
