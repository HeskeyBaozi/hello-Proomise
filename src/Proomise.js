'use strict';

const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';



export default class Proomise {
    constructor(executor) {
        this.status = PENDING;
        this.data = undefined;


        this.onResolvedCallback = [];
        this.onRejectedCallback = [];

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.status = RESOLVED;
                this.data = value;
                for (let callback of this.onResolvedCallback) {
                    callback(value);
                }
            }
        };

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED;
                this.data = reason;
                for (let callback of this.onRejectedCallback) {
                    callback(reason);
                }
            }
        };

        try {
            setTimeout(executor, 0, resolve.bind(this), reject.bind(this));
        } catch (error) {
            reject.call(this, error);
        }
    }

    then(onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : (value) => { };
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { };

    }
}

let a = new Proomise((resolve, reject) => {
    console.log('Hello Promise');
});