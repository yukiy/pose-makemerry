var SpriteManager = function(px, list)
{
	this.px = px;
	this.isImageLoaded = false;

	this.createSprites(list);
}


SpriteManager.prototype.createSprites = function(list)
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
			that.px.stage.addChild(sprite);
		}
		console.log(that);
		PIXI.loader.reset();
	})
} 


SpriteManager.prototype.createSprite = function(name, imgsrc, x=0, y=0, width=50, height=50, anchorX=0.5, anchorY=0.5, rotation=0)
{
	var sprite = new PIXI.Sprite( PIXI.loader.resources[imgsrc].texture );
	sprite.position.set(x, y);
	sprite.width = width;
	sprite.height = height;
	sprite.anchor.x = anchorX;
	sprite.anchor.y = anchorY;
	sprite.rotation = rotation;

	//const name = imgsrc.substr(imgsrc.lastIndexOf('/')+1);
	this[name] = new SpriteEffects(this.px, sprite);
	return sprite;
}




/*=========================================================================================================================*/

var SpriteEffects = function(px, sprite)
{
	this.px = px;
	this.sprite = sprite;
}


//SpriteEffects.prototype.drawSpriteOnParts = function(keypoints, partsName, sprite, width, height, plusAngle=0)
SpriteEffects.prototype.drawSpriteOnParts = function(keypoints, partsName, width, height, plusAngle=0)
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
	this.px.renderer.render(this.px.stage);	
}


//SpriteEffects.prototype.updateSprite = function(keypoints, partsId, sprite, width, height, imgMode, plusAngle=0)
SpriteEffects.prototype.updateSprite = function(keypoints, partsId, width, height, imgMode, plusAngle=0)
{
	//if(this.isImagesLoaded == false) return;

	if (keypoints.length > 0)
	{
		const p = partsId*3;
		const x = keypoints[p];
		const y = keypoints[p+1];

		if(x!=0 && y!=0){
			this.px.setOffset(this.sprite, imgMode);
			this.sprite.position.set(x*this.px.width, y*this.px.height);
			//console.log(x);
			this.sprite.width = width;
			this.sprite.height = height;
			this.sprite.rotation = this.px.getAngleFromKeypoints(keypoints, partsId) + (plusAngle*Math.PI/180);			
		}
	}	
}
