//---0で桁を合わせる用関数
function zeroPadding(num, digit)
{
	let zeroStr = "";
	for(let i=0;i<digit;i++){
		zeroStr += "0";
	}
	const numDigit = String(num).length;
	return zeroStr.slice(numDigit) + num;
}

function initRequestAnimationFrame(){
	if ( !window.requestAnimationFrame ) {
		window.requestAnimationFrame = ( function() {
			return window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
				window.setTimeout( callback, 1000 / 30 );
			};
		} )();
	}	
}

var now = window.performance && (
    performance.now || 
    performance.mozNow || 
    performance.msNow || 
    performance.oNow || 
    performance.webkitNow );

function getTime () {
    return ( now && now.call( performance ) ) || ( new Date().getTime() );
}


