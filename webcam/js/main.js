let cam;
let canvas;
let effect;
let px;

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
	const video = cam.playbackVideo;

	setInterval(function()
	{
		const frameNum = cam.getCurrentFrame(video);
		const json = jsonarr[frameNum];
		//canvas.drawVideo(video);
		canvas.drawBackground("rgb(100,100,100)");
		effect.drawVideo(video);

		//---copy video on another canvas as a texture
		px.copyCanvasAsBackground(effect.cvs);

		if(json && json.people && json.people.length > 0){
			const people = json.people;
			canvas.setPeople(people);
			effect.setPeople(people);

			for (let i=0; i<canvas.people.length; i++){
	    		const keypoints = canvas.people[i].pose_keypoints;
	    		const confidence = canvas.effect.getAverageValues(keypoints).averageConfidence;
	    		if(confidence < 0.5) return

				canvas.effect.drawBones(keypoints, 5);
				//effect.effect.drawBones(keypoints, 5);
				px.drawBones(keypoints, 5);


				effect.effect.drawTraceLine(keypoints, 4, {
					color:"rgba(255,0,180, 0.4)", 
					lineWidth:10, 
					length:30
				});
				//effect.effect.drawBones(keypoints);

				effect.effect.drawImageOnParts(keypoints, "HEAD", 		"./img/stamps/emojismile.png", 30, 30);
				effect.effect.drawImageOnParts(keypoints, "LEFT_HAND",  "./img/stamps/mickeyglobe_rotate.png", 30, 30);
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

				if(Object.keys(px.sprites).length > 0){
					px.drawSpriteOnParts(keypoints, "HEAD", 	  px.sprites["smile_head"], 30, 30);
					px.drawSpriteOnParts(keypoints, "LEFT_HAND",  px.sprites["mickeyhand_left"], 30, 30);
					px.drawSpriteOnParts(keypoints, "RIGHT_HAND", px.sprites["mickeyhand_right"], 30, 30);
					px.addFilter(px.sprites["smile_head"], {filter:"BlurFilter", blur:0.3, quality:4});
				}

				option = {
					color: 0xff0099,
					alpha: 0.8,
					lineWidth:3, 
					length:50
				};
				px.drawTraceLine(keypoints, 4, option);

				option = {
					color: 0xffffaa,
					alpha: 0.5, 
					radius: 10, 
					length: 20,
					imgMode: "BOTTOM"
				}
				px.drawTraceCircle(keypoints, 7, option);

				//wip to try extra-filter
				//px.addFilter(px.graphics, {filter:"GlowFilter", blur:3, quality:4});


			}
		}

		px.renderer.render(px.stage);
		px.graphics.clear();
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


function createSprites(){

	const list = {
		"mickeyhand_left" 	: "img/stamps/mickeyglobe_rotate.png",
		"mickeyhand_right" 	: "img/stamps/mickeyglobe_rotate.png",
		"smile_head" 		: "img/stamps/emojismile.png"
	};

	px.createSprites(list);
}


$(function()
{

	$(".recs").hide();
	cam = new Camera();

	createCanvas("canvas", 320, 240, "resultViewTd");
	canvas = new Draw("canvas");

	createCanvas("effect", 320, 240, "effectViewTd");
	effect = new Draw("effect");


	px = new PixiControl(320, 240, "effectViewTd2");
	createSprites();

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

	//pixitest();

})



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

