'use strict';
import Proomise from './Proomise.js';

const a = new Proomise((resolve, reject) => {
    console.log('fuck you');
    reject('BIG ERROR');
}).then((str) => {
    console.log('I\'m fucking my ' + str);
    return new Proomise((r, j)=> {
        r('and you?');
    });
}).then((str)=> {
    if (str !== 'and you?') {
        console.log('出错了！！！');
    }
    console.log(str === 'and you?');
    console.log('I\'m fine thank you====================');
    return 'end';
}).then((str)=> {
    console.log(str);
}).thenError((error)=> {
    console.log(error);
});

console.log('Promise2 = ', a);