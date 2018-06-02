

class Zerror extends Error {
  constructor(code, causeOrMessage) {
    super();

    this.isZerror = true;

    this.CODES = Zerror.CODES;

    this.code = null;
    this.message = null;

    this._cause = null;

    if (code) {
      this.code = code;
    }

    if (causeOrMessage instanceof Error) {
      this._cause = causeOrMessage;
    } else if (causeOrMessage != null) {
      this.message = causeOrMessage;
    }

    this.stack = this._prepareOwnStack();
  }

  cause() {
    if (this._cause) {
      return this._causeToString(this._cause);
    }

    return this._cause;
  }

  static is(err, code) {
    const instanceOfConstructor = err instanceof this;

    if (code) {
      return err.code === code;
    }

    return instanceOfConstructor;
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


module.exports = Zerror;
