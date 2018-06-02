const Zerror = require('../src/Zerror');

class TestError extends Zerror {}

describe('Zerror', () => {
  describe('by default', () => {
    it('code=null', () => {
      const err = new Zerror();
      expect(err.code).toEqual(null);
    });

    it('message=null', () => {
      const err = new Zerror();
      expect(err.message).toEqual(null);
    });

    it('_cause=null', () => {
      const err = new Zerror();
      expect(err._cause).toEqual(null);
    });
  });

  describe('if pass first param', () => {
    it('should set error code', () => {
      const err = new Zerror('SOME_CODE');
      expect(err.code).toEqual('SOME_CODE');
    });
  });

  describe('if pass second string param', () => {
    it('should set error code and message', () => {
      const err = new Zerror('SOME_CODE', 'this is message');
      expect(err.code).toEqual('SOME_CODE');
      expect(err.message).toEqual('this is message');
    });
  });

  describe('if pass second string param without first params', () => {
    it('should set only message', () => {
      const err = new Zerror(null, 'this is message');
      expect(err.code).toEqual(null);
      expect(err.message).toEqual('this is message');
    });
  });

  describe('if pass second Error param without first params', () => {
    it('should set only _cause', () => {
      const cause = new Error('test');
      const err = new Zerror(null, cause);
      expect(err.code).toEqual(null);
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
      const cause = new Zerror('ZCODE', 'zmessage');
      const err = new TestError('TEST_CODE', cause);

      expect(err.toString()).toMatch(/TEST_CODE/);
      expect(err.toString()).toMatch(/Zerror/);
      expect(err.toString()).toMatch(/ZCODE/);
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
});
