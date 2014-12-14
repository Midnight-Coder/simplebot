// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var tessel = require('tessel'),
  ambientlib = require('ambient-attx4'),
  servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['A']),
  ambient = ambientlib.use(tessel.port['B']);

//Onboard leds
var ledYellow = tessel.led[0].output(0),
    ledBlue = tessel.led[1].output(0),
    servo1 = 1,
    servo2 = 2;

var soundLevel = {
    pindrop: 0.01,
    quiet: 0.01464844,
    ambient: 0.01660156,
    loud: 0.02832031
};
var lightLevel = {
    ample: 0.07324219,
    dim: 0.03320312,
    flash: 0.513671875
};

ambient.on('ready', function () {
  // React to bright flashes of light
  ambient.setLightTrigger(lightLevel.flash);
  ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);
    toggleLED(ledBlue, 100, 1000);
    // Clear and reset the trigger
    ambient.clearLightTrigger();
    setTimeout(function () {
        ambient.setLightTrigger(lightLevel.flash);
    },1500);
  });

  // React to loud sounds
  ambient.setSoundTrigger(soundLevel.loud);
  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);
    toggleLED(ledYellow, 100, 1000);

    // Clear and reset the trigger
    ambient.clearSoundTrigger();
    setTimeout(function () {
        ambient.setSoundTrigger(soundLevel.loud);
    },1500);
  });
});

ambient.on('error', function (err) {
  console.log(err)
});

servo.on('ready', function () {
  var forward = 0.8,
    backward = 0.2,
    stop = 0.0815;

  servo.configure(servo1, 0, 1, function () {
    var intervalID = setInterval(function () {
      servo.move(servo1, forward);
    }, 500);

    setTimeout(function() {
      clearInterval(intervalID);
      readServoValue(servo1);
      servo.move(servo1, stop);
      readServoValue(servo1);
    }, 5000);
  });

  servo.configure(servo2, 0, 1, function () {
    var intervalID = setInterval(function () {
      servo.move(servo2, backward);
      readServoValue(servo2);
    }, 500);

    setTimeout(function() {
      clearInterval(intervalID);
      readServoValue(servo2);
      servo.move(servo2, stop);
      servo.move(servo1, stop);
      readServoValue(servo2);
    }, 5000);
  });

});
servo.on('error', function(err){
  console.log("Servo Err!!", err);
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

function readServoValue(servoName){
  servo.read( servoName, function(err, reading){
        if(err)
          console.log("error in reading : " + err);
        else
          console.log(servoName + "reading: " + reading);
      });
}
