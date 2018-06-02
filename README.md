# @0devs/error

javascript errors with codes and causes


## install

```
npm i @0devs/error
```


## usage

```js
const Zerror = require('@0devs/error');

class MyError extends Zerror {}

MyError.CODES = {
    BAD_REQUEST: 'BAD_REQUEST',
};

const causeErr = new Error('shit happens');
const err = new MyError(MyError.CODES.BAD_REQUEST, causeErr);

console.log(err.toString());
```

got rich output:

```js
MyError: BAD_REQUEST
    at Object.<anonymous> (/private/tmp/test/test.js:10:13)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3

    Error: shit happens
        at Object.<anonymous> (/private/tmp/test/test.js:9:18)
        at Module._compile (module.js:635:30)
        at Object.Module._extensions..js (module.js:646:10)
        at Module.load (module.js:554:32)
        at tryModuleLoad (module.js:497:12)
        at Function.Module._load (module.js:489:3)
        at Function.Module.runMain (module.js:676:10)
        at startup (bootstrap_node.js:187:16)
        at bootstrap_node.js:608:3
```

ready for bunyan [stdSerializer.err](https://github.com/trentm/node-bunyan#standard-serializers)