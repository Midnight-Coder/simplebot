// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['B']);
//Onboard leds
var ledYellow = tessel.led[0].output(0);
var ledBlue = tessel.led[1].output(0);

ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, ldata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sdata) {
        if (err) throw err;
        console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
    });
  })}, 500); // The readings will happen every .5 seconds unless the trigger is hit

  ambient.setLightTrigger(0.5);

  // Set a light level trigger: 0-1
  ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);
    toggleLED(ledBlue, 100, 1000);

    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();
    //After 1.5 seconds reset light trigger
    setTimeout(function () {
        ambient.setLightTrigger(0.5);
    },1500);
  });

  // Set a sound level trigger: 0-1
  ambient.setSoundTrigger(0.2);

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);
    toggleLED(ledYellow, 100, 1000);
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {
        ambient.setSoundTrigger(0.2);
    },1500);
  });
});

ambient.on('error', function (err) {
  console.log(err)
});

function toggleLED(led, interval, duration){
  var intervalID;
  interval = interval || 100;
  duration = duration || 2000;

  intervalID = setInterval(function () {
    led.toggle();
  }, interval);
  setTimeout(function() {
    clearInterval(intervalID);
  }, duration);
}
