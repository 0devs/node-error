const Zerror = require('../lib/Zerror').default;

class FsError extends Zerror {}

FsError.setCodes({
  NOSPC: 'no space on device',
});

class ApiError extends Zerror {}

ApiError.setCodes({
  INTERNAL_ERROR: 'some shit happens',
});

const cause = new FsError(FsError.CODES.NOSPC);

const err = new ApiError(ApiError.CODES.INTERNAL_ERROR, cause);

console.log(err.toString());
