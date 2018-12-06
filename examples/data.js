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

const err = new ApiError({
  code: ApiError.CODES.INTERNAL_ERROR,
  message: 'some message %id% %type%',
  data: {
    id: 100500,
    type: 'test',
  },
  cause,
});

console.log(err.message);



