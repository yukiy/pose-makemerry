var cam;


function onAnalyzeEnd(res){
	const name = res.filename;
	let jsonarr = [];
	for(let i=0; i<120; i++){
		const url = "./json/"+name+"/"+name+"_"+zeroPadding(i,12)+"_keypoints.json";
		$.getJSON(url, function(res){
			jsonarr.push(res);
		})
	}
	console.log(jsonarr);
}

function zeroPadding(num, digit){
	let zeroStr = "";
	for(let i=0;i<digit;i++){
		zeroStr += "0";
	}
	let numDigit = String(num).length;
	return zeroStr.slice(numDigit) + num;
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
		cam.handleFiles(this.files);
	});
}


$(function(){
	 cam = new Camera();
	 setEvent();
})
