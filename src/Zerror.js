
function isObject(obj) {
  return typeof obj === 'object' && obj != null;
}

function isString(str) {
  return typeof str === 'string';
}

class Zerror extends Error {
  constructor(codeOrOptions, causeOrMessage) {
    super();
    this.isZerror = true;
    this.CODES = this.constructor.CODES;

    this.code = 'UNKNOWN_ERROR';
    this.message = 'unknown error';
    this.data = null;

    this._cause = null;

    this._processCode(codeOrOptions);
    this._processMessage(codeOrOptions, causeOrMessage);
    this._processCause(codeOrOptions, causeOrMessage);
    this._processData(codeOrOptions);
    this._processMessagePlaceholder();

    this.stack = this._prepareOwnStack();
  }

  _processCode(codeOrOptions) {
    if (
      isObject(codeOrOptions)
      && codeOrOptions.code
      && this.CODES
      && this.CODES[codeOrOptions.code]
    ) {
      this.code = codeOrOptions.code;
    } else if (
      isString(codeOrOptions)
      && this.CODES
      && this.CODES[codeOrOptions]
    ) {
      this.code = codeOrOptions;
    }

    if (this.constructor._codeMessages[this.code]) {
      this.message = this.constructor._codeMessages[this.code];
    }
  }

  _processMessage(codeOrOptions, causeOrMessage) {
    if (isObject(codeOrOptions) && codeOrOptions.message) {
      this.message = codeOrOptions.message;
    }

    if (isString(causeOrMessage)) {
      this.message = causeOrMessage;
    }
  }

  _processCause(codeOrOptions, causeOrMessage) {
    if (isObject(codeOrOptions) && codeOrOptions.cause) {
      this._cause = codeOrOptions.cause;
    }

    if (isObject(causeOrMessage)) {
      this._cause = causeOrMessage;
    }
  }

  _processData(codeOrOptions) {
    if (isObject(codeOrOptions) && codeOrOptions.data) {
      this.data = codeOrOptions.data;
    }
  }

  _processMessagePlaceholder() {
    if (isObject(this.data) && isString(this.message)) {
      const regex = /%([a-zA-Z0-9_]+)%/g;

      let match = regex.exec(this.message);

      while (match !== null) {
        const placeholder = match[1];

        if (this.data[placeholder]) {
          this.message = this.message.replace(
            new RegExp(`%${placeholder}%`, 'g'),
            this.data[placeholder],
          );
        }

        match = regex.exec(this.message);
      }
    }
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
    return Object.keys(codes).reduce((tmp, item) => {
      const result = tmp;
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
    let { stack } = this;

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

export default Zerror;
