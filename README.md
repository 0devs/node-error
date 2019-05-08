# @0devs/error

custom typescript and javascript errors with codes and causes for node and browsers (without any dependencies)

## install

```
npm i @0devs/error
```

## usage

1. extend your error class from `@0devs/error`

```ts
// typescript - see javascript examples below
import Zerror from "@0devs/error";

class MyError extends Zerror {
  // this required for typescript types and autocomplete
  public static CODES = {
    BAD_REQUEST: "bad request: %status%"
  };
}

// this required for correctly set codes in error class
MyError.setCodes(MyError.CODES);
```

2. you can create errors in several ways:

```ts
// pass only error code
new MyError(MyError.CODES.BAD_REQUEST);
/* output:
    MyError: BAD_REQUEST
    bad request: %status%
*/

// pass error code and message
new MyError(MyError.CODES.BAD_REQUEST, "really bad request");
/* output:
     MyError: BAD_REQUEST
     really bad request
*/

// pass error code and cause error
new MyError(MyError.CODES.BAD_REQUEST, new Error("shit happens"));
/* output:
     MyError: BAD_REQUEST
     bad request: %status%
         <error stack trace>

         Error: shit happens
           <cause error stack trace>
*/

// pass any of options as object
new MyError({
  code: MyError.CODES.BAD_REQUEST,
  message: "really bad request",
  cause: new Error("shit happens"),
});
/* output:
     MyError: BAD_REQUEST
     really bad request
     ...
        Error: shit happens
*/

// pass data if you need replace placeholder in error message
//
// MyError.CODES.BAD_REQUEST below has placeholder in message
//     BAD_REQUEST: "bad request: %status%"
new MyError({
  code: MyError.CODES.BAD_REQUEST,
  data: {
    status: 500,
  }
});
/* output:
    MyError: BAD_REQUEST
    bad request: 500
 */

// you can use placeholders in custom error message
new MyError({
  code: MyError.CODES.BAD_REQUEST,
  message: "shit happens on %method% with status: %status%",
  data: {
    method: "GET",
    status: 500,
  },
}
/* output:
    MyError: BAD_REQUEST
    shit happens on GET with status: 500
 */

```


## usage - javascript

```js
const Zerror = require('@0devs/error');

class MyError extends Zerror {}

MyError.CODES = {
    BAD_REQUEST: 'bad request',
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

## usage - typescript

```ts
import Zerror from "@0devs/error";

class MyError extends Zerror {
  // this required for typescript types and autocomplete
  public static CODES = {
    BAD_REQUEST: "bad request"
  };
}

// this required for correctly set codes in error object
MyError.setCodes(MyError.CODES);

// autocomplete works for codes
// MyError.CODES.BAD_

```

ready for bunyan [stdSerializer.err](https://github.com/trentm/node-bunyan#standard-serializers)

## links

- https://stackoverflow.com/questions/34099996/console-log-formats-error-object-different-from-error-prototype-tostring
