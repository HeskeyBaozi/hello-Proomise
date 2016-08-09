'use strict';
var Proomise = require('./ProomiseForTest.js').Proomise;


function done() {
    console.log('done!!!');
}


var a = new Proomise(function (resolve, reject) {
    resolve('Hello!');
}).then(function (value) {
    return new Proomise(function (r, j) {
        r(new Proomise(function (r, j) {
            r();
        }));
    });
});

setTimeout(function () {
    console.log(a);
}, 10);