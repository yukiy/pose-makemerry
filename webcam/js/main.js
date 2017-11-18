let cam;
let canvas;
let effect;
const quickTest = true;

const isPostToServer = false;
const isAngleJson = false;

const useTestFilename = true;
const testFilename = "test";
const testFileLength = 119;

let globalFrameCount = 0;

//---サーバーでの処理が終わるとこれが呼ばれる
function onAnalyzeEnd(res)
{
	if(isAngleJson){
		console.log(res);
		draw(res.frame);
	}
	else{
		const name = res.filename;
		const length = res.length;
		let jsonarr = [];

		//---forloopだと順番がぐちゃぐちゃになるので順番にリクエスト
		let countfile = 0;
		var get = function(i){
			const url = "./json/"+name+"/original/"+name+"_"+zeroPadding(i,12)+"_keypoints.json";
			$.getJSON(url, function(res){
				//if(res && res.people && res.people[0]) console.log(res.people[0]);
				res.filename = name+"_"+zeroPadding(i,12)+"_keypoints.json";
				jsonarr.push(res);
				countfile++;
				if(countfile < length){
					get(countfile);
				}
			})		
		}
		get(countfile);
		draw(jsonarr);
	}
}


function draw(jsonarr)
{
	setInterval(function()
	{
		const video = cam.playbackVideo;
		const frameNum = cam.getCurrentFrame(video);
		const json = jsonarr[frameNum];
		//canvas.drawVideo(video);
		canvas.drawBackground("rgb(100,100,100)");
		effect.drawVideo(video);

		if(json && json.people && json.people.length > 0){
			const people = json.people;
			canvas.setPeople(people);
			effect.setPeople(people);
			for (let i=0; i<canvas.people.length; i++){
	    		const keypoints = canvas.people[i].pose_keypoints;
	    		const confidence = canvas.effect.getAverageValues(keypoints).averageConfidence;
	    		if(confidence < 0.5) return

				canvas.effect.drawBones(keypoints);
				//effect.effect.drawBones(keypoints);

				effect.effect.drawImageOnParts(keypoints, "HEAD", "./img/stamps/emojismile.png", 30, 30);
				effect.effect.drawImageOnParts(keypoints, "LEFT_HAND", "./img/stamps/mickeyglobe_rotate.png", 30, 30);
				effect.effect.drawImageOnParts(keypoints, "RIGHT_HAND", "./img/stamps/mickeyglobe_rotate.png", 30, 30);


				let option = {
					color:"rgba(255,0,180, 0.8)", 
					lineWidth:1, 
					length:50
				};
				effect.effect.drawTraceLine(keypoints, 4, option);

				// effect.effect.traceNeighborLine(keypoints, 4, {
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
				effect.effect.drawTraceCircle(keypoints, 7, option);
			}
		}
		globalFrameCount++;
	},1000/30);
}

//---0001234みたいに0で桁を合わせる用関数
function zeroPadding(num, digit)
{
	let zeroStr = "";
	for(let i=0;i<digit;i++){
		zeroStr += "0";
	}
	const numDigit = String(num).length;
	return zeroStr.slice(numDigit) + num;
}


//---カメラを使わず、ファイルを選んで直接アップロードするとき
function uploadFile(files)
{
	if(!(window.File && window.FileReader && window.FileList && window.Blob)){
	 console.log("File API not fully supported.");
	 return;
	}

	const file = files[0];
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function() {

		cam.playRecordedBlob(file);
		cam.playbackVideo.volume = 0;

		const formData = new FormData();

		let base64 = reader.result;
		base64 = base64.split(',')[1];

		const filename = file.name;

		formData.append('filename', filename);
		formData.append('blob', base64);

		post('analyze.php', formData, function (data) {
			console.log("analyze end.");
			onAnalyzeEnd($.parseJSON(data));
		});
	}
}


//---POSTする関数、ただし、isPostToServerがfalseのときは、POSTしないでサンプルデータを返す
function post(url, data, callback)
{
	if(isPostToServer){
		var request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.onload = function(e) { };
		request.onreadystatechange = function () {
			if (request.readyState == 4 && request.status == 200) {
				callback(request.responseText);
			}
		};
		// request.post.onprogress = function(e) {
		// 	if (e.lengthComputable) {
		// 		progressBar.value = (e.loaded / e.total) * 100;
		// 	}
		// };

		request.send(data);
	}else{
		callback('{"filename":"'+testFilename+'","length":120}');
	}
}


function setEvent()
{
	$("#start_btn").click(function(){
		cam.startCamera();
	});

	$("#rec_btn").click(function(){
		cam.startRecording();
	});

	$("#recstop_btn").click(function(){
		cam.stopRecording();
	});

	$("#upload_file").on("change", function(){
		uploadFile(this.files);
	});

	//---Cameraでのレコーディングが終わるとこれが呼ばれる
	cam.onRecordEnd = function(blob)
	{
		console.log("record end.");
		const reader = new FileReader();
		reader.readAsDataURL(blob);
		$(".lives").hide();
		$(".recs").show();
		reader.onloadend = function()
		{
			const formData = new FormData();
			let base64 = reader.result;
			base64 = base64.split(',')[1];

			let filename;
			if(useTestFilename){
				filename = testFilename;				
			}
			else{
				filename = Date.now();
			}
			formData.append('filename', filename);
			formData.append('blob', base64);

			post('analyze.php', formData, function (data) {
				console.log("analyze end.");
				console.log(data);
				onAnalyzeEnd($.parseJSON(data));
			});				
		}
	}
}


function createCanvas(id, w, h, targetId)
{
	let target = document.getElementById(targetId);
	let canvas = document.createElement("canvas");
	canvas.id = id;
	canvas.width = w;
	canvas.height = h;
	target.appendChild(canvas);
}


$(function()
{
	$(".recs").hide();
	cam = new Camera();

	createCanvas("canvas", 320, 240, "resultViewTd");
	canvas = new Draw("canvas");

	createCanvas("effect", 320, 240, "effectViewTd");
	effect = new Draw("effect");

	setEvent();

	if(quickTest){
		$(".lives").hide();
		$(".recs").show();
		cam.playRecordedUrl("./movies_mp4/"+testFilename+".mp4");
		cam.playbackVideo.volume = 0;
		if(isAngleJson){
			$.getJSON("./json/"+testFilename+"/"+testFilename+"_angle.json", function(res){
				onAnalyzeEnd(res);
			})
		}else{
			onAnalyzeEnd($.parseJSON('{"filename":"'+testFilename+'","length":'+testFileLength+'}'));			
		}


		// $.ajax({
		// 	url:"./json/"+testFilename+"/"+testFilename+"_angle.json",
		// 	type: "get",
		// 	success: function(res){
		// 		console.log(res);
		// 		onAnalyzeEnd($.parseJSON(res));
		// 		//console.log($.parseJSON(res));
		// 	},
		// 	error: function(e){
		// 		console.log(e);
		// 	}
		// })

	}

	pixitest();

})

function pixitest(){
	let stage;
	let rendere;

	const filenameArr = [
		"img/stamps/poop_Emoji.png",
		"img/stamps/Dog_Emoji.png",
		"img/stamps/Cat_Emoji.png"
	]
	
	function setup(){
		stage = new PIXI.Container();
		renderer = PIXI.autoDetectRenderer(
			256, 256,
			{antialias: false, transparent: false, resolution: 1, preserveDrawingBuffer: false}
		);
		document.body.appendChild(renderer.view);
		renderer.autoResize = true;
		renderer.resize(128, 128);
	}

	function imageLoad(filenameArr){
		PIXI.loader
			.add()
			.load(function(){
				draw();
			});
	}

	function createSprite(imgsrc, width, height){
		var sprite = new PIXI.Sprite(
			PIXI.loader.resources[imgsrc].texture
		);
		sprite.position.set((0, 0));
		sprite.width = width;
		sprite.height = height;
		sprite.anchor.x = 0.5;
		sprite.anchor.y = 0.5;
		sprite.rotation = 0;
		stage.addChild(sprite);
		return sprite;
	}

	function updateSprite(keypoints, partsId, sprite, plusAngle=0)
	{
		if (keypoints.length > 0)
		{
			const p = partsId*3;
			const x = keypoints[p];
			const y = keypoints[p+1];
			sprite.position.set((x*this.width, y*this.height));
			sprite.rotation = this.getAnngleFromKeypoints(keypoints, partsId) + (plusAngle*Math.PI/180));
		}
	}


	setup();
	imageLoad(filenameArr);
	let sprite = createSprite("img/stamps/poop_Emoji.png", 30, 30);
	updateSprite(keypoints, partsId, sprite);
	renderer.render(stage);
}

let merrymen = [];
function test ()
{
	for(let i=0; i<5; i++){
		let merryman = new MerryMan("cvs"+i, 160, 120, "canvasArea"); 
		merrymen.push(merryman);
	}
	//merrymen[0].getJson("./json/test/test_angle.json");
	merrymen[1].getJson("./json/test1/test1_angle.json");
	merrymen[2].getJson("./json/test2/test2_angle.json");
}

