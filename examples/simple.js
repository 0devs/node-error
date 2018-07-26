const Zerror = require('../lib/Zerror').default;

class FsError extends Zerror {}

FsError.setCodes({
  NOSPC: 'no space on device',
});


const err = new FsError(FsError.CODES.NOSPC);
console.log(err.toString());


const err1 = new FsError(FsError.CODES.NOSPC, 'some another message');
console.log(err1.toString());
