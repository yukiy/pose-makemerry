let cam;
let canvas;
const isPostToServer = 1;
const useTestFilename = 1;
const testFilename = "test3";
const testFileLength = 120;
const quickTest = 0;

//---サーバーでの処理が終わるとこれが呼ばれる
function onAnalyzeEnd(res)
{
/*
	const name = res.filename;
	const length = res.length;
	let jsonarr = [];

	//---forloopだと順番がぐちゃぐちゃになるので順番にリクエスト
	let countfile = 0;
	var get = function(i){
		const url = "./json/"+name+"/"+name+"_"+zeroPadding(i,12)+"_keypoints.json";
		$.getJSON(url, function(res){
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
*/

	console.log(res);
	draw(res.frame);
}


function draw(jsonarr)
{
	setInterval(function(){
		const video = cam.playbackVideo;
		const frameNum = cam.getCurrentFrame(video);
		const json = jsonarr[frameNum];
		canvas.drawVideo(video);
		canvas.drawBones(json);
		/*----------------
		ここに描画関係を書いていくn
		--------------------*/

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
	cam = new Camera();

	createCanvas("canvas", 320, 240, "previewArea");
	canvas = new Draw("canvas");
	setEvent();

	if(quickTest){
		cam.playRecordedUrl("./movies_mp4/"+testFilename+".mp4");
		cam.playbackVideo.volume = 0;
		onAnalyzeEnd($.parseJSON('{"filename":"'+testFilename+'","length":'+testFileLength+'}'));
	}

	//test();

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