'use strict';
var myPromise = require('./ProomiseForTest.js').Proomise;

function sleep(time) {
    console.log('--begin Sleep');
    var start = new Date();
    while (start.getTime() + time >= new Date().getTime()) {
    }
    console.log('--end Sleep');
}


console.time('promise1');
var promise1 = new myPromise(function (resolve, reject) {
    setTimeout(function () {
        resolve('Resolved!!');
    }, 200);
}).then(function (data) {
    console.log(data);
});
console.log(promise1);
console.timeEnd('promise1');