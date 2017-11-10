var Camera = function()
{
	this.frameRate = 30;
	this.videoDuration = 4000;
	this.chunkDuration = 1000;

	this.localStream = null;
	this.recorder =  null;
	this.blobUrl = null;
	this.msr = null;

	this.countIntv;
	this.playbackPlayIntv;
	this.localVideo = document.getElementById("local_video");
	this.playbackVideo = document.getElementById("playback_video");

	this.countdownDivId = "#recordingtime";

	this.playbackFrame = 0;
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
	const constraints = {
		video: {
			width:  { min: 640, ideal: 640, max: 640 },
			height: { min: 480, ideal: 480,  max: 480 }
		},
		audio: false
	}
	navigator.mediaDevices.getUserMedia(constraints)
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
			// console.log("stop");
			that.playRecordedChunks(chunks);
			const blob = new Blob(chunks, { type: "video/webm" });
			clearInterval(that.countIntv);
			that.onRecordEnd(blob);
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

Camera.prototype.onRecordEnd = function(blob){}


Camera.prototype.stopRecording = function()
{
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


Camera.prototype.playRecordedChunks = function (chunks)
{
	const videoBlob = new Blob(chunks, { type: "video/webm" });
	const url = window.URL.createObjectURL(videoBlob);
	this.playRecordedUrl(url);
}

Camera.prototype.playRecordedBlob = function(blob)
{
	const url = window.URL.createObjectURL(blob);
	this.playRecordedUrl(url);
}

Camera.prototype.playRecordedUrl = function(url)
{
	const that = this;
	if (this.playbackVideo.src) {
		window.URL.revokeObjectURL(this.playbackVideo.src); // 解放
		this.playbackVideo.src = null;
	}
	this.playbackVideo.src = url;
	this.playbackVideo.loop = true;
	this.playbackVideo.play();

	/*more controlled but heavy*/	
	// setInterval(function(){
	// 	that.playbackVideo.currentTime = that.playbackFrame/30;
	// 	that.playbackFrame++;
	// 	if(that.playbackVideo.currentTime >= that.playbackVideo.duration){
	// 		that.playbackFrame = 0;
	// 	}
	// },1000/30);
}

Camera.prototype.getCurrentFrame = function(video)
{
	//return  this.playbackFrame;
	return Math.floor(video.currentTime * this.frameRate);
}

//---unused
Camera.prototype.download = function()
{
	const anchor = document.getElementById('download_link');
	anchor.download = 'recorded.webm'; // ファイル名
	anchor.href = this.playbackVideo.src;
}
