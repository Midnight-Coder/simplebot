// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This servo module demo turns the servo around
1/10 of its full rotation  every 500ms, then
resets it after 10 turns, reading out position
to the console at each movement.
*********************************************/

var tessel = require('tessel');
var servolib = require('servo-pca9685');

var servo = servolib.use(tessel.port['A']);

var servo1 = 1; // We have a servo plugged in at position 1
// var servo2 = 2; // We have another servo plugged in at position 2
servo.on('ready', function () {
  var forward = 0.8,
    backward = 0.2,
    stop = 0.0815;

  //  Set the minimum and maximum duty cycle for servo.
  //  If the servo doesn't move to its full extent or stalls out
  //  and gets hot, try tuning these values (0.05 and 0.12).
  //  Moving them towards each other = less movement range
  //  Moving them apart = more range, more likely to stall and burn out

  servo.configure(servo1, 0.05, 0.12, function () {
    var intervalID = setInterval(function () {
      console.log('Servo 1 Position (in range 0-1):', forward);
      servo.move(servo1, forward);
    }, 500); // Every 500 milliseconds

    setTimeout(function() {
      console.log('Servo 1 Position stop');
      clearInterval(intervalID);

      servo.read( servo1, function(err, reading){
        if(err)
          console.log("error in reading : " + err);
        else
          console.log("servo1 reading: " + reading);
      });

      servo.move(servo1, stop);

      servo.read( servo1, function(err, reading){
        if(err)
          console.log("error in reading : " + err);
        else
          console.log("servo1 reading: " + reading);
      });
    }, 3000);
  });

  // servo.configure(servo2, 0.05, 0.12, function () {
  //   setInterval(function () {
  //     console.log('Servo 2 Position (in range 0-1):', backward);
  //     servo.move(servo2, backward);
  //   }, 500); // Every 500 milliseconds
  // });
});
servo.on('error', function(err){
  console.log("Err!!", err);
});