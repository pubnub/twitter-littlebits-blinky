/* Lite version for tutorial sans web client */

(function() {

	// Blinking LittleBit LED with Johnny-five

	var five = require('johnny-five');
	var board = new five.Board();
	var led;

	function pulse() {
		led.pulse(400);

		board.wait(4000, function(){
	        led.stop();
	    });

		board.repl.inject({
			led: led
		});
	}

	board.on('ready', function() {
		console.log('Board is ready!');
		led = new five.Led(5);
		pulse(led);
	});

	// Getting data from PubNub Twitter stream

	var channel = 'pubnub-twitter';
	var pubnub = require('pubnub').init({
		subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
	});

	var queries = ['lunch', 'sandwich', 'sushi', 'burrito']; // using static quesries for lite version

	pubnub.subscribe({
		channel: channel,
		callback: function(m) {
			if(!m || !m.text) return; 
		
			if (queries.some(function(v) { return m.text.toLowerCase().indexOf(v) > 0; })) {
				if(!led) {
					console.log('LittleBits board is not ready yet.');
					return;
				}
				console.log(m.user.screen_name + ': ' + m.text);
				pulse(led);
			}
		}
	});

})();