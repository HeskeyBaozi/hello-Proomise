'use strict';

const Status = {
    PENDING: 'pending',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
};

export class Proomise {
    constructor(executor) {
        this.ProomiseStatus = Status.PENDING;
        this.ProomiseData = undefined;


        this.onResolvedCallback = [];
        this.onRejectedCallback = [];

        /**
         * 操作成功标志函数
         * 将本Proomise的状态转化为“已解决”
         * @param value “解决”状态时得到的参数，来自 resolve(value)
         */
        const resolve = (value) => {
            if (this.ProomiseStatus === Status.PENDING) {
                this.ProomiseStatus = Status.RESOLVED; // 状态永久改变
                this.ProomiseData = value; // 第一次 Proomise resolve(..这里的参数被传到了Proomise1.data中..)
                for (let callback of this.onResolvedCallback) { // 调用回调
                    callback(value);
                }
            }
        };

        /**
         * 操作失败标志函数
         * 将本Proomise的状态转化为“拒绝”
         * @param reason 异步操作失败的原因，来自 reject(reason)
         */
        const reject = (reason) => {
            if (this.ProomiseStatus === Status.PENDING) {
                this.ProomiseStatus = Status.REJECTED;
                this.ProomiseData = reason;
                for (let callback of this.onRejectedCallback) {
                    callback(reason);
                }
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    /**
     *
     * @param onFulfilled 应该是一个函数，在promise执行结束后必须被调用
     * @param onRejected 应该是一个函数，在promise拒绝执行后必须被调用
     * @return then 方法必须返回一个 promise 对象
     *         promise2 = promise1.then(onFulfilled, onRejected);
     *         代码实现在满足所有要求的情况下可以允许 promise2 === promise1
     *         每个实现都要文档说明其是否允许以及在何种条件下允许 promise2 === promise1
     */
    then(onFulfilled, onRejected) {

        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value)=>value;
        onRejected = typeof onRejected === 'function' ? onRejected : (reason)=>reason;

        let promise2 = new Proomise((resolve, reject)=> {
            if (this.ProomiseStatus === Status.RESOLVED) {
                try {
                    let returnValue = onFulfilled(this.ProomiseData);
                    resolveProomise(promise2, returnValue, resolve, reject);
                } catch (error) {
                    reject(error);
                }

            }

            if (this.ProomiseStatus === Status.REJECTED) {
                try {
                    let returnValue = onRejected(this.ProomiseData);
                    resolveProomise(promise2, returnValue, resolve, reject);
                } catch (error) {
                    reject(error);
                }

            }

            if (this.ProomiseStatus === Status.PENDING) {
                this.onResolvedCallback.push((value)=> {
                    try {
                        let returnValue = onFulfilled(value);
                        resolveProomise(promise2, returnValue, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });

                this.onRejectedCallback.push((reason)=> {
                    try {
                        let returnValue = onRejected(reason);
                        resolveProomise(promise2, returnValue, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                });
            }
        });

        return promise2;
    }
    catch(onRejected) {
        return this.then(null, onRejected);
    }

}

export const deferred = ()=> {
    let dfd = {};
    dfd.promise = new Proomise(function (resolve, reject) {
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
};

function resolveProomise(proomise2, returnValue, resolve, reject) {

    if (proomise2 === returnValue)
        reject(new TypeError());

    // 如果 returnValue 为 Promise ，则使 promise 接受 returnValue 的状态
    if (returnValue instanceof Proomise) {
        if (returnValue.ProomiseStatus === Status.PENDING) {
            returnValue.then((value)=> {
                resolveProomise(proomise2, value, resolve, reject);
            }, reject);
        } else
            returnValue.then(resolve, reject);
    }

    if (typeof returnValue === 'object' || typeof returnValue === 'function') {
        let then;
        try {
            then = returnValue.then;
        } catch (error) {
            reject(error);
        }

        if (typeof then === 'function') {
            let hasBeenCalled = false;
            try {
                then.call(returnValue, (y)=> {
                    if (hasBeenCalled)return;
                    hasBeenCalled = true;
                    resolveProomise(proomise2, y, resolve, reject);
                }, (r)=> {
                    if (hasBeenCalled)return;
                    hasBeenCalled = true;
                    reject(r);
                });
            } catch (error) {
                if (hasBeenCalled) {
                    // ignore the error
                } else {
                    reject(error);
                }
            }
        } else {
            resolve(returnValue);
        }
    } else {
        resolve(returnValue);
    }
}