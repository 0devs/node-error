import Zerror from "./Zerror";

class MyError extends Zerror {
  public static CODES = {
    BAD_REQUEST: "bad request: %status%",
  };
}

// setCodes required
MyError.setCodes(MyError.CODES);

// @ts-ignore
// console.log(TestError.CODES, Zerror.CODES);
// { TEST_CODE: 'TEST_CODE' } { UNKNOWN_ERROR: 'UNKNOWN_ERROR' }

let e = new MyError(MyError.CODES.BAD_REQUEST);
// @ts-ignore
console.log(e.toString());

e = new MyError(MyError.CODES.BAD_REQUEST, "really bad request");
// @ts-ignore
console.log(e.toString());

e = new MyError(MyError.CODES.BAD_REQUEST, new Error("shit happens"));
// @ts-ignore
console.log(e.toString());

// e = ;

// @ts-ignore
console.log(new MyError({
  code: MyError.CODES.BAD_REQUEST,
  message: "really bad request",
  cause: new Error("shit happens"),
}).toString());

// @ts-ignore
console.log(new MyError({
  code: MyError.CODES.BAD_REQUEST,
  data: {
    status: 500,
  },
}).toString());

// @ts-ignore
console.log(new MyError({
  code: MyError.CODES.BAD_REQUEST,
  message: "shit happens on %method% with status: %status%",
  data: {
    method: "GET",
    status: 500,
  },
}).toString());
