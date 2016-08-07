'use strict';
import Proomise from './Proomise.js';

const a = new Proomise((resolve, reject) => {
    console.log('fuck you');
    resolve('daddy');
}).then((str) => {
    console.log('I\'m fucking my ' + str);
});
