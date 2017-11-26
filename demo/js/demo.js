/*-------------------------------*/
const frameRate = 30;

const quickTest = true;

const isPostToServer = false;

const useTestFilename = true;
const testFilename = "test";
const testFileLength = 119;

const isAngleJson = false;
/*-------------------------------*/

let cam;
let keyb;
let rec;
let globalFrameCount = 0;
let globalCurrentFrame = 0;


//---サーバーでの処理が終わるとこれが呼ばれる
function onAnalyzeEnd(res)
{
	const name = res.filename;
	const length = res.length;
	let jsonarr = [];

	//---forloopだと順番がぐちゃぐちゃになるので順番にリクエスト
	var getAllJson = function(i, callback){
		const url = "./json/"+name+"/original/"+name+"_"+zeroPadding(i,12)+"_keypoints.json";
		$.getJSON(url, function(res){
			//if(res && res.people && res.people[0]) console.log(res.people[0]);
			res.filename = name+"_"+zeroPadding(i,12)+"_keypoints.json";
			jsonarr.push(res);
			countfile++;
			if(countfile < length){
				getAllJson(countfile, callback);
			}else{
				callback();
			}
		})
	}

	let countfile = 0;
	getAllJson(countfile, function()
	{
		rec = new KeyRecorder();

		pxSetup();
		canvasSetup();

		setInterval(function()
		{
			globalCurrentFrame = cam.getCurrentFrame(cam.playbackVideo);

			rec.updateKeys();

			const json = jsonarr[globalCurrentFrame];
			if(json && json.people && json.people.length > 0)
			{
				pxDraw(json);
				canvasDraw(json);
			}

			//rec.recordKeyStatus();
			var printTrueFalse = function(bool){
				return (bool) ? 1 : 0;
			}
			$("#aStatus").html( printTrueFalse(rec.isOn(globalCurrentFrame, "a")) );
			$("#sStatus").html( printTrueFalse(rec.isOn(globalCurrentFrame, "s")) );
			$("#dStatus").html( printTrueFalse(rec.isOn(globalCurrentFrame, "d")) );
			$("#frameNo").html(globalCurrentFrame);

			globalFrameCount++;

		}, 1000/frameRate);
	});
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
	}
	else{
		callback('{"filename":"'+testFilename+'","length":120}');
	}
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

		const filename = file.name;

		const formData = new FormData();
		let base64 = reader.result;
		base64 = base64.split(',')[1];

		formData.append('filename', filename);
		formData.append('blob', base64);

		post('analyze.php', formData, function (data) {
			console.log("analyze end.");
			onAnalyzeEnd($.parseJSON(data));
		});
	}
}


//---Cameraでのレコーディングが終わるとこれが呼ばれる
function onRecordEnd(blob)
{
	if(!(window.File && window.FileReader && window.FileList && window.Blob)){
		console.log("File API not fully supported.");
		return;
	}

	$(".lives").hide();
	$(".recs").show();

	const reader = new FileReader();
	reader.readAsDataURL(blob);
	reader.onloadend = function()
	{
		let filename;
		if(useTestFilename){
			filename = testFilename;
		}
		else{
			filename = Date.now();
		}

		const formData = new FormData();
		let base64 = reader.result;
		base64 = base64.split(',')[1];

		formData.append('filename', filename);
		formData.append('blob', base64);

		post('analyze.php', formData, function (data) {
			console.log("analyze end.");
			onAnalyzeEnd($.parseJSON(data));
		});
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

	$("#deleteMode").change(function(){
		if($("#deleteMode").prop('checked')){
			rec.isDeleteMode = true;
		}else{
			rec.isDeleteMode = false;			
		}
	})
}


$(function() {
	$(".recs").hide();
	cam = new Camera();
	cam.onRecordEnd = onRecordEnd;

	setEvent();

	if(quickTest)
	{	
		$(".lives").hide();
		$(".recs").show();
		cam.playRecordedUrl("./movies_mp4/"+testFilename+".mp4");
		cam.playbackVideo.volume = 0;
		const res = $.parseJSON('{"filename":"'+testFilename+'","length":'+testFileLength+'}');
		onAnalyzeEnd(res);
	}

})

