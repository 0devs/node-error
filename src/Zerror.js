
const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

class Zerror extends Error {
  constructor(code, causeOrMessage) {
    super();

    this.isZerror = true;

    this.CODES = this.constructor.CODES;

    this.code = null;
    this.message = null;

    this._cause = null;

    if (code) {
      if (this.CODES[code]) {
        this.code = code;
      } else {
        this.code = UNKNOWN_ERROR;
        this.message = 'unknown error';
      }

      if (this.constructor._codeMessages[this.code]) {
        this.message = this.constructor._codeMessages[this.code];
      }
    }

    if (causeOrMessage instanceof Error) {
      this._cause = causeOrMessage;
    } else if (causeOrMessage != null) {
      this.message = causeOrMessage;
    }

    this.stack = this._prepareOwnStack();
  }

  static is(err, code) {
    const instanceOfConstructor = err instanceof this;

    if (code) {
      return err.code === code;
    }

    return instanceOfConstructor;
  }

  static setCodes(codes) {
    this.CODES = this._prepareCodes(codes);
    this._codeMessages = this._prepareCodeMessages(codes);
  }

  static _prepareCodes(codes) {
    return Object.keys(codes).reduce(function (result, item) {
      result[item] = item;
      return result;
    }, {});
  }

  static _prepareCodeMessages(codes) {
    return codes;
  }

  cause() {
    if (this._cause) {
      return this._causeToString(this._cause);
    }

    return this._cause;
  }

  toString() {
    let stack = this.stack;

    if (this._cause) {
      stack += `\n${this._causeToString(this._cause)}`;
    }

    return stack;
  }

  _prepareOwnStack() {
    const stack = this._clearStack(this.stack);
    return [
      this._getErrorHeader(this),
      stack,
    ].join('');
  }

  _clearStack(stack) {
    if (typeof stack === 'string') {
      return stack.split('\n').slice(1).join('\n');
    }

    return stack;
  }

  _indentString(stack) {
    if (typeof stack === 'string') {
      return stack.split('\n').map(str => `    ${str}`).join('\n');
    }

    return stack;
  }

  _getErrorHeader(error) {
    const header = [
      error.constructor.name, ': ',
      error.code, '\n',
    ];

    if (error.message) {
      header.push(error.message, '\n');
    }

    return header.join('');
  }

  _causeToString(cause) {
    let str = null;

    if (cause.isZerror) {
      str = this._indentString(cause.toString());
    } else {
      str = this._indentString(cause.stack);
    }

    return `\n${str}`;
  }
}

Zerror.CODES = {
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

Zerror._codeMessages = {
  UNKNOWN_ERROR: 'unknown error',
};

module.exports = Zerror;
