/*-------------------------------*/
const globalFrameRate = 30;

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

let capturer;
let isSetExport = false;
let isExporting = false;

let mainInterval;
let mainJsonArr = [];
let globalFrameCount = 0;
let globalCurrentFrame = 1;
let globalTotalFrame;
let startTime = getTime();




//---サーバーでの処理が終わるとこれが呼ばれる
function onAnalyzeEnd(res)
{
	const name = res.filename;
	const length = res.length;
	globalTotalFrame = length;
	

	//---forloopだと順番がぐちゃぐちゃになるので順番にリクエスト
	var getAllJson = function(i, callback){
		const url = "./json/"+name+"/original/"+name+"_"+zeroPadding(i,12)+"_keypoints.json";
		$.getJSON(url, function(res){
			//if(res && res.people && res.people[0]) console.log(res.people[0]);
			res.filename = name+"_"+zeroPadding(i,12)+"_keypoints.json";
			mainJsonArr.push(res);
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
		//canvasSetup();

		animate();
	});
}


function animate()
{
	requestAnimationFrame( animate );
	render();
	if(!isExporting){
		//---書き出し中以外は、時間ベースでフレームを送る
		globalCurrentFrame = Math.floor( ( getTime() - startTime ) / ( 1000.0 / globalFrameRate ) % globalTotalFrame );
	}
}

function render ()
{
	if(isSetExport && globalCurrentFrame == 1)
	{
		capturer = new CCapture({
			format: 'webm',
			framerate: 30,
			verbose: true
		});
		capturer.start();
		isExporting = true;
	}

	rec.updateKeys();

	const json = mainJsonArr[globalCurrentFrame];
	if(json && json.people && json.people.length > 0)
	{
		pxDraw(json);
		//canvasDraw(json);
	}

	if(isExporting)
	{
		if(globalCurrentFrame < globalTotalFrame){
			console.log("globalCurrentFrame : " +globalCurrentFrame + "/" + globalTotalFrame);
			capturer.capture(pxView.getCanvas());
		}
		else if(globalCurrentFrame >= globalTotalFrame){
			console.log("capture done.");
			capturer.stop();
			capturer.save();
			isSetExport = false;
			isExporting = false;
		}
		//---書き出し中以外は、フレーム数ベースでフレームを送る
		globalCurrentFrame++;
	}

	globalFrameCount++;
	if(globalCurrentFrame > globalTotalFrame){
		globalCurrentFrame = 1;
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
		cam.recordedVideo.volume = 0;

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

function exportVideo()
{
	let encoder = new Whammy.Video(frameRate);
	encoder.compile(function(output){
		var url = (window.webkitURL || window.URL).createObjectURL(output);

		const anchor = document.getElementById('download_link');
		anchor.download = 'recorded.webm'; // ファイル名
		anchor.href = url;
	})
}


function setEvent()
{
	$("#mobilePlay_btn").click(function(){
		cam.playRecordedUrl("./movies_mp4/"+testFilename+".mp4");
		cam.recordedVideo.volume = 0;
	});

	$("#start_btn").click(function(){
		cam.startCamera();
	});

	$("#rec_btn").click(function(){
		cam.startRecording();
	});

	$("#upload_btn").click(function(){
		$("#upload_file").click();
	})

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

	$("#effectBox input").change(function(){
		onEffects();
	});

	let isFirst = true;
	$("#export_btn").click(function(){
		isSetExport = true;
		// if(isFirst){
		// 	cam.recordedVideo.pause();
		// 	cam.recordedVideo.autoplay = false;
		// 	cam.recordedVideo.loop = false;
		// 	globalCurrentFrame = 0;
		// 	clearInterval(mainInterval);
		// 	isFirst = false;
		// }
		//exportVideo();
	});

	$("#qLabel").css("background-image", "url(./img/stamps/Heart_Eyes_Emoji.png)");
	$("#wLabel").css("background-image", "url(./img/stamps/emojismile.png)");
	$("#aLabel").css("background-image", "url(./img/stamps/hands_mglobe.png)");
	$("#sLabel").css("background-image", "url(./img/stamps/hands_cat.png)");

}


function onEffects(){
	let head = $('input[name=head]:checked').val();
	let hands = $('input[name=hands]:checked').val();
	let effects = $('input[name=effects]:checked').val();

	for(i in pxEffectKeyMap.effects){
		if(pxEffectKeyMap.effects[i].part == "headOverlay"){
			pxEffectKeyMap.effects[i].enable = false;
		}
	}
	pxEffectKeyMap.effects[head].enable = true;

	for(i in pxEffectKeyMap.effects){
		if(pxEffectKeyMap.effects[i].part == "handsOverlay"){
			pxEffectKeyMap.effects[i].enable = false;
		}
	}
	pxEffectKeyMap.effects[hands].enable = true;

	for(i in pxEffectKeyMap.effects){
		if(pxEffectKeyMap.effects[i].part == "handsEffect"){
			pxEffectKeyMap.effects[i].enable = false;
		}
	}
	pxEffectKeyMap.effects[effects].enable = true;

}


$(function() {
	initRequestAnimationFrame();
	
	cam = new Camera();
	cam.onRecordEnd = onRecordEnd;

	setEvent();

	if(quickTest)
	{	
		$("#live_video").hide();
		$("#recorded_video").hide();
		cam.playRecordedUrl("./movies_mp4/"+testFilename+".mp4");
		cam.recordedVideo.volume = 0;
		const res = $.parseJSON('{"filename":"'+testFilename+'","length":'+testFileLength+'}');
		onAnalyzeEnd(res);
	}

})

