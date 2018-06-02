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
```