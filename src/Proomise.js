'use strict';

const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';


export default class Proomise {
    constructor(executor) {
        this.ProomiseStatus = PENDING;
        this.ProomiseData = undefined;

        this.onResolvedCallback = [];
        this.onRejectedCallback = [];

        /**
         * 操作成功标志函数
         * 将本Proomise的状态转化为“已解决”
         * @param value “解决”状态时得到的参数，来自 resolve(value)
         */
        const resolve = (value) => {
            if (this.ProomiseStatus === PENDING) {
                this.ProomiseStatus = RESOLVED; // 状态永久改变
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
            if (this.ProomiseStatus === PENDING) {
                this.ProomiseStatus = REJECTED;
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

    then(onResolved, onRejected) {
        onResolved = typeof onResolved === 'function' ? onResolved : (value) => {
        };
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => {
        };
        if (this.ProomiseStatus === RESOLVED) {
            /**
             * then 的返回值是一个Proomise（外层）
             * 这个Proomise（外层）是根据 then上的参数函数来确定的！
             * 如果这个参数函数返回的是一个Proomise（内层），且这个内层Proomise的状态已经确定
             * 所以x.then(..这里的参数函数会立即执行..)
             * 值得注意的是，立即执行的函数（即then里面的参数）是
             * 外层Proomise的操作成功和失败的标志函数
             * 也就是说，立即执行的这些函数会改变外层Proomise的状态
             * 即then返回的Proomise由其参数函数返回的Proomise确定
             * （其实这里也可以无限递归
             *   笑）
             */
            return new Proomise((resolve, reject)=> {
                /**
                 * this.ProomiseData === Proomise1.ProomiseData === @param Proomise.resolve(...)
                 */
                try {
                    let returnValue = onResolved(this.ProomiseData);
                    if (returnValue instanceof Proomise) { // 如果then中设定函数返回值依然是个Proomise（立即执行的异步操作）的话
                        returnValue.then(resolve, reject); // 内层Proomise决定外层Proomise
                    } else
                        resolve(returnValue);
                } catch (error) {
                    reject(error);
                }

            }); // 最终，返回then注册的回调函数的返回值成了then新生成Promise的data
        }

        if (this.ProomiseStatus === REJECTED) {
            return new Proomise((resolve, reject)=> {
                try {
                    let returnValue = onRejected(this.ProomiseData);
                    if (returnValue instanceof Proomise) {
                        returnValue.then(resolve, reject);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }
    }

    thenError(onRejected) {
        return this.then(null, onRejected);
    }
}