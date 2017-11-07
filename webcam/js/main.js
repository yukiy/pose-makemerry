let playbackVideo;
let localVideo;
let localStream;
let recorder =  null;
let blobUrl = null;
let msr;
let duration = 3000;

// start local video
function startVideo() 
{
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(function (stream) { // success
		localStream = stream;
		localVideo.src = window.URL.createObjectURL(localStream);
	})
	.catch(function (error) { // error
		console.error('mediaDevice.getUserMedia() error:', error);
		return;
	});
}


function startRecording() 
{
	navigator.getUserMedia({ video: true, audio: false }, onMediaSuccess, onMediaError);

	function onMediaSuccess(stream) {
		localStream = stream;
		localVideo.src = window.URL.createObjectURL(localStream);
		let chunks = [];

		// if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
		//   options.mimeType =  'video/webm; codecs=vp9'};
		// }

		// const options = {
		// 	videoBitsPerSecond : 512000, // 512kbits / sec
		// 	mimeType : 'video/webm;codecs=vp9'
		// };

		// recorder = new MediaRecorder(stream, options);

		// recorder.ondataavailable = function(evt) {
		// 	chunks.push(evt.data);
		// };

		// recorder.onstop = function(evt) {
		// 	recorder = null;
		// 	playRecorded(chunks);
		// 	let formData = new FormData();
		// 	formData.append('filename', 'test.webm');
		// 	formData.append('chunks', chunks);
		// 	console.log(formData);
		// 	upload('upload.php', formData, function (data) {
		// 		console.log(data);
		// 	});
		// 	// let videoBlob = new Blob(chunks, { type: "video/webm" });
		// 	// upload('upload.php', videoBlob, function(data){
		// 	// 	console.log(data);
		// 	// });
		// };

		// recorder.start(1000); // 1000ms 毎に録画データを区切る


	    msr = new MediaStreamRecorder(stream);
    	msr.mimeType = 'video/webm';

		msr.ondataavailable = function (blob) {

			var reader = new FileReader();
			reader.readAsDataURL(blob); 
			reader.onloadend = function() {
				base64 = reader.result;
				base64 = base64.split(',')[1];

				let formData = new FormData();
				formData.append('filename', 'test.webm');
				formData.append('blob', base64);

				upload('upload.php', formData, function (data) {
					console.log(data);
				});
				msr.stop();
				playRecordedBlob(blob);

			}
		};


		// msr.ondataavailable = function(evt) {
		// 	chunks.push(evt);
		// };

		// msr.onstop = function(evt) {
		// 	playRecorded(chunks);
		// 	let formData = new FormData();
		// 	formData.append('filename', 'test.webm');
		// 	formData.append('blob', chunks);
		// 	upload('upload.php', formData, function (data) {
		// 		console.log(data);
		// 	});
		// 	// let videoBlob = new Blob(chunks, { type: "video/webm" });
		// 	// upload('upload.php', videoBlob, function(data){
		// 	// 	console.log(data);
		// 	// });
		// };

		msr.start(duration);
	}

	function onMediaError(error){
		console.error('mediaDevice.getUserMedia() error:', error);
		return;
	}
}
 


function upload(url, data, callback) {
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.onload = function(e) { };
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			callback(location.href + request.responseText);
		}
	};
	// Listen to the upload progress.
	// var progressBar = document.querySelector('progress');
	// request.upload.onprogress = function(e) {
	// 	if (e.lengthComputable) {
	// 		progressBar.value = (e.loaded / e.total) * 100;
	// 		progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
	// 	}
	// };

	request.send(data);
}


function stopRecording() {
	msr.stop();
}

function playRecordedChunks(chunks) {
	const videoBlob = new Blob(chunks, { type: "video/webm" });
	blobUrl = window.URL.createObjectURL(videoBlob);

	if (playbackVideo.src) {
		// window.URL.revokeObjectURL(playbackVideo.src); // 解放
		// playbackVideo.src = null;
		playbackVideo.play();
	}
	playbackVideo.src = blobUrl;
	playbackVideo.play();
}

function playRecordedBlob(blob) {
	blobUrl = window.URL.createObjectURL(blob);

	if (playbackVideo.src) {
		// window.URL.revokeObjectURL(playbackVideo.src); // 解放
		// playbackVideo.src = null;
		playbackVideo.play();
	}
	playbackVideo.src = blobUrl;
	playbackVideo.play();
}



function download(){
	const anchor = document.getElementById('download_link');
	anchor.download = 'recorded.webm'; // ファイル名
	anchor.href = blobUrl; // createObjecURL()で生成したURL
}

$(function(){
	playbackVideo = document.getElementById('playback_video');
	localVideo = document.getElementById('local_video');
})

