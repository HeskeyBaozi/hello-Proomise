'use strict';
var adapter = require('./ProomiseForTest.js');
var dummy = {dummy: 'dummy'};

var resolved = function (value) {
    return new adapter.Proomise(function (resolve, reject) {
        resolve(value);
    });
};

var rejected = function (reason) {
    var d = adapter.deferred();
    d.reject(reason);
    return d.promise;
};

var y = resolved({
    then: function (onFulfilled) {
        console.log(onFulfilled);
        setTimeout(function () {
            onFulfilled(dummy);
        }, 10000);
    },
    y: 'y'
});

var k = resolved(resolved(dummy));

var x = {
    then: function (resolvePromise) {
        setTimeout(function () {
            //console.log('resolvePromise = ', resolvePromise);
            resolvePromise(y);
        }, 50);

    },
    x: 'x'
};


var trueResolved = function (value) {
    return new Promise(function (resolve, reject) {
        resolve(value);
    });
};
var truepromise2 = trueResolved(dummy).then(function (data) {
    return x;
});

var promise2 = resolved(dummy).then(function (data) {
    return x;
});

setTimeout(function () {
    console.log('finnally:', promise2);
}, 200);