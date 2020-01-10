import Zerror from '../src/Zerror';

class TestError extends Zerror {}

TestError.setCodes({
  TEST_CODE: 'this some test error message',
  ANOTHER_TEST_CODE: 'another message',
  TEST_CODE_WITH_PLACEHOLDERS: 'message id=%id%, type=%type%',
});

// tslint:disable-next-line max-classes-per-file
class AnotherTestError extends Zerror {}

AnotherTestError.setCodes({
  SOME_ANOTHER_TEST_CODE: 'some another test message',
});

// tslint:disable-next-line no-big-function
describe('Zerror', () => {
  describe('by default', () => {
    it('code=UNKNOWN_ERROR', () => {
      const err = new Zerror();
      expect(err.code).toEqual('UNKNOWN_ERROR');
    });

    it('message=unknown error', () => {
      const err = new Zerror();
      expect(err.message).toEqual('unknown error');
    });

    it('data=null', () => {
      const err = new Zerror();
      expect(err.data).toEqual(null);
    });

    it('_cause=null', () => {
      const err = new Zerror();
      // @ts-ignore
      expect(err._cause).toEqual(null);
    });

    it('isZerror=true', () => {
      const err = new Zerror();
      expect(err.isZerror).toEqual(true);
    });

    it('instanceof Zerror', () => {
      const err = new Zerror();
      expect(err).toBeInstanceOf(Zerror);
    });

    it('instanceof TestError', () => {
      const testError = new TestError();
      expect(testError).toBeInstanceOf(Zerror);
    });

    it('instanceof Error', () => {
      const err = new Zerror();
      expect(err).toBeInstanceOf(Error);

      const testError = new TestError();
      expect(testError).toBeInstanceOf(Zerror);
      expect(testError).toBeInstanceOf(Error);
    });
  });

  describe('if pass first string param with valid code', () => {
    it('should set error code and error message', () => {
      const err = new TestError(TestError.CODES.TEST_CODE);
      expect(err.code).toEqual('TEST_CODE');
      expect(err.message).toEqual('this some test error message');
    });
  });

  describe('if pass first string param with invalid code', () => {
    it('should set UNKNOWN_ERROR code and  message', () => {
      const err = new TestError('SOME_INVALID_CODE');
      expect(err.code).toEqual('UNKNOWN_ERROR');
      expect(err.message).toEqual('unknown error');
    });
  });

  describe('if pass first string param with valid code and second string param', () => {
    it('should set code and message', () => {
      const err = new TestError(TestError.CODES.TEST_CODE, 'this is another message');
      expect(err.code).toEqual('TEST_CODE');
      expect(err.message).toEqual('this is another message');
    });
  });

  describe('if pass first string param with invalid code and second string params', () => {
    it('should set code UNKNOWN_ERROR and message', () => {
      const err = new TestError('SOME_INVALID_CODE', 'this is another message');
      expect(err.code).toEqual('UNKNOWN_ERROR');
      expect(err.message).toEqual('this is another message');
    });
  });

  describe('if pass first object param with valid code', () => {
    it('should set code', () => {
      const err = new TestError({
        code: TestError.CODES.TEST_CODE,
      });

      expect(err.code).toEqual('TEST_CODE');
      expect(err.message).toEqual('this some test error message');
    });
  });

  describe('if pass first object param with invalid code', () => {
    it('should set code', () => {
      const err = new TestError({
        code: 'INVALID_CODE',
      });

      expect(err.code).toEqual('UNKNOWN_ERROR');
      expect(err.message).toEqual('unknown error');
    });
  });

  describe('if pass first object param with code and message', () => {
    it('should set code, message', () => {
      const err = new TestError({
        code: TestError.CODES.TEST_CODE,
        message: 'test message',
      });

      expect(err.code).toEqual('TEST_CODE');
      expect(err.message).toEqual('test message');
    });
  });

  describe('if pass first object param with code, message, data', () => {
    it('should set code, message, data', () => {
      const err = new TestError({
        code: TestError.CODES.TEST_CODE,
        message: 'test message',
        data: {
          id: '100500',
        },
      });

      expect(err.code).toEqual('TEST_CODE');
      expect(err.message).toEqual('test message');
      expect(err.data).toEqual({ id: '100500' });
    });
  });

  describe('if pass first object param with code, message, data, cause', () => {
    it('should set code, message, data, cause', () => {
      const cause = new Error('test');

      const err = new TestError({
        code: TestError.CODES.TEST_CODE,
        message: 'test message',
        data: {
          id: '100500',
        },
        cause,
      });

      expect(err.code).toEqual('TEST_CODE');
      expect(err.message).toEqual('test message');
      expect(err.data).toEqual({ id: '100500' });
      // @ts-ignore
      expect(err._cause).toEqual(cause);
    });
  });

  describe('if pass first object param with code and data', () => {
    it('should process message placeholders', () => {
      const err = new TestError({
        code: TestError.CODES.TEST_CODE_WITH_PLACEHOLDERS,
        data: {
          id: '100500',
          type: 'great',
        },
      });

      expect(err.code).toEqual('TEST_CODE_WITH_PLACEHOLDERS');
      expect(err.message).toEqual('message id=100500, type=great');
    });
  });

  describe('if pass first object param with code, message and data', () => {
    it('should process message placeholders', () => {
      const err = new TestError({
        code: TestError.CODES.TEST_CODE_WITH_PLACEHOLDERS,
        message: 'custom message id=%id%, type=%type%',
        data: {
          id: '100500',
          type: 'great',
        },
      });

      expect(err.code).toEqual('TEST_CODE_WITH_PLACEHOLDERS');
      expect(err.message).toEqual('custom message id=100500, type=great');
    });
  });

  describe('if pass first object param with code, message and data without placeholders', () => {
    it('should process message placeholders', () => {
      const err = new TestError({
        code: TestError.CODES.TEST_CODE_WITH_PLACEHOLDERS,
        message: 'custom message id=%id%, type=%type%',
        data: {
          fail: '1',
        },
      });

      expect(err.code).toEqual('TEST_CODE_WITH_PLACEHOLDERS');
      expect(err.message).toEqual('custom message id=%id%, type=%type%');
    });
  });

  describe('if pass only second string param', () => {
    it('should set only message', () => {
      const err = new Zerror(null, 'this is message');
      expect(err.code).toEqual('UNKNOWN_ERROR');
      expect(err.message).toEqual('this is message');
    });
  });

  describe('if pass only second object param', () => {
    it('should set only _cause', () => {
      const cause = new Error('test');
      const err = new Zerror(null, cause);
      expect(err.code).toEqual('UNKNOWN_ERROR');
      // @ts-ignore
      expect(err._cause).toEqual(cause);
    });
  });

  describe('method .is', () => {
    it('should return true if instance of', () => {
      const err = new TestError();
      expect(TestError.is(err)).toEqual(true);
    });

    it('should return false if not instance of', () => {
      const err = new Zerror();
      expect(TestError.is(err)).toEqual(false);
    });

    it('should return true if instanceof and code equal', () => {
      const err = new TestError('TEST_CODE');
      expect(TestError.is(err, 'TEST_CODE')).toEqual(true);
    });

    it('should return false if instanceof and code not equal', () => {
      const err = new TestError('TEST_CODE');
      expect(TestError.is(err, 'ANOTHER_CODE')).toEqual(false);
    });
  });

  describe('method .toString', () => {
    it('should contain error class', () => {
      const err = new TestError();
      expect(err.toString()).toMatch(/TestError/);
    });

    it('should contain error code', () => {
      const err = new TestError('TEST_CODE');
      expect(err.toString()).toMatch(/TEST_CODE/);
    });

    it('should contain error message', () => {
      const err = new TestError('TEST_CODE', 'test message');
      expect(err.toString()).toMatch(/TEST_CODE/);
      expect(err.toString()).toMatch(/test message/);
    });

    it('should contain _cause error stack of _cause instance of Zerror', () => {
      const cause = new AnotherTestError(
        AnotherTestError.CODES.SOME_ANOTHER_TEST_CODE,
        'zmessage',
      );
      const err = new TestError('TEST_CODE', cause);

      expect(err.toString()).toMatch(/TestError/);
      expect(err.toString()).toMatch(/TEST_CODE/);
      expect(err.toString()).toMatch(/AnotherTestError/);
      expect(err.toString()).toMatch(/SOME_ANOTHER_TEST_CODE/);
      expect(err.toString()).toMatch(/zmessage/);
    });

    it('should contain _cause error stack of _cause instance of Error', () => {
      const cause = new Error('some message');
      const err = new TestError('TEST_CODE', cause);

      expect(err.toString()).toMatch(/TEST_CODE/);
      expect(err.toString()).toMatch(/Error/);
      expect(err.toString()).toMatch(/some message/);
    });
  });

  describe('if pass cause, cause() call', () => {
    it('should return stack', () => {
      const cause = new TestError('ANOTHER_TEST_CODE');
      const err = new TestError('TEST_CODE', cause);

      const causeStr = err.cause();

      expect(causeStr).toMatch(/ANOTHER_TEST_CODE/);
      expect(causeStr).toMatch(/another message/);
    });
  });

  describe('if not pass cause, cause() call', () => {
    it('should return null', () => {
      const err = new TestError('TEST_CODE');

      const causeStr = err.cause();

      expect(causeStr).toEqual(null);
    });
  });
});
