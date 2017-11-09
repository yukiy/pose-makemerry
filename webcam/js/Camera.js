var Camera = function(){
	this.playbackVideo;
	this.localStream = null;
	this.recorder =  null;
	this.blobUrl = null;
	this.msr = null;
	this.chunkDuration = 1000;
	this.videoDuration = 4000;
	this.countIntv;
	
	this.localVideo = document.getElementById("local_video");
	this.playbackVideo = document.getElementById("playback_video");

	this.countdownDivId = "#recordingtime";
}



Camera.prototype.getMediaDeviceAvailable = function()
{
	navigator.mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia) ? {
		getUserMedia: function(c) {
			return new Promise(function(y, n) {
				(navigator.mozGetUserMedia || navigator.webkitGetUserMedia).call(navigator, c, y, n);
			});
		}
	} : null);

	if (!navigator.mediaDevices) {
		console.log("getUserMedia() not supported.");
	}

}


Camera.prototype.startCamera = function()
{
	const that = this;
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
	.then(function (stream) { // success
		that.localStream = stream;
		that.localVideo.src = window.URL.createObjectURL(that.localStream);
	})
	.catch(function (error) { // error
		console.error('mediaDevice.getUserMedia() error:', error);
		return;
	});
}


Camera.prototype.startRecording = function()
{
	if(this.localStream == null){
		console.log("start before rec.");
		return;
	}

	const that = this;

	this.countdown(3, function()
	{
		console.log("start recording.");

		let chunks = [];
		that.msr = new MediaRecorder(that.localStream);

		that.msr.ondataavailable = function (e) 
		{
			chunks.push(e.data);
			if(chunks.length == Math.ceil(that.videoDuration/that.chunkDuration)) {
				that.msr.stop();
			}
		};

		that.msr.onstop = function(e)
		{
			console.log("stop");
			that.playRecordedChunks(chunks);

			const blob = new Blob(chunks, { type: "video/webm" });

			const reader = new FileReader();
			reader.readAsDataURL(blob); 
			reader.onloadend = function()
			{
				const formData = new FormData();
				let base64 = reader.result;
				base64 = base64.split(',')[1];

				const filename = Date.now();
				formData.append('filename', filename);
				formData.append('blob', base64);

				that.upload('analyze.php', formData, function (data) {
					console.log(data);
					const res = $.parseJSON(data);
					console.log(res);
					onAnalyzeEnd(res);
				});
			}	
			clearInterval(that.countIntv);
		};

		that.msr.start(that.chunkDuration);

		let count = 0;
		$(that.countdownDivId).html(count); 
		that.countIntv = setInterval( function(){
			count++;
			$(that.countdownDivId).html(count); 
		}, 1000);

	});
}

Camera.prototype.stopRecording = function() {
	this.msr.stop();
	clearInterval(this.countIntv);
}


Camera.prototype.countdown = function(duration, callback)
{
	console.log("count down start.");
	const that = this;

	let count = 0;
	const cntDwnIntv = setInterval(function(){
		//console.log(duration-count);
		$(that.countdownDivId).html(duration - count); 
		count++;
		if(count > duration){
			clearInterval(cntDwnIntv);
			callback();
		}
	}, 1000);
}


Camera.prototype.handleFiles = function(files)
{
	if(!(window.File && window.FileReader && window.FileList && window.Blob)){
	 console.log("File API not fully supported.");
	 return;
	}

	const that = this;
	const file = files[0];
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onloadend = function() {
		const formData = new FormData();

		let base64 = reader.result;
		base64 = base64.split(',')[1];

		const filename = file.name;

		formData.append('filename', filename);
		formData.append('blob', base64);

		that.upload('analyze.php', formData, function (data) {
			console.log(data);
			const res = $.parseJSON(data);
			onAnalyzeEnd(res);
		});
	}
}


Camera.prototype.upload = function(url, data, callback) {
	var request = new XMLHttpRequest();
	request.open('POST', url, true);
	request.onload = function(e) { };
	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			callback(request.responseText);
		}
	};
	// request.upload.onprogress = function(e) {
	// 	if (e.lengthComputable) {
	// 		progressBar.value = (e.loaded / e.total) * 100;
	// 	}
	// };

	request.send(data);
}

Camera.prototype.playRecordedChunks = function (chunks) {
	const videoBlob = new Blob(chunks, { type: "video/webm" });
	const url = window.URL.createObjectURL(videoBlob);
	this.playRecorded(url);
}

Camera.prototype.playRecordedBlob = function(blob) {
	const url = window.URL.createObjectURL(blob);
	this.playRecorded(url);
}

Camera.prototype.playRecorded = function(url){
	if (this.playbackVideo.src) {
		// window.URL.revokeObjectURL(playbackVideo.src); // 解放
		// playbackVideo.src = null;
		this.playbackVideo.play();
	}
	this.playbackVideo.src = url;
	this.playbackVideo.loop = true;
	this.playbackVideo.play();	
}

Camera.prototype.download = function(){//unused
	const anchor = document.getElementById('download_link');
	anchor.download = 'recorded.webm'; // ファイル名
	anchor.href = this.playbackVideo.src;
}
