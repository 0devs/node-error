export interface IZerrorOptions {
  code?: string;
  message?: string;
  cause?: Zerror | Error;
  data?: IZerrorData;
}

declare interface IZerrorData {
  [index: string]: any;
}

interface IZerrorCodes {
  [index: string]: string;
}

interface IZerrorConstructor {
  (): void;
  CODES: IZerrorCodes;
  _codeMessages: IZerrorCodes;
}

function isZerrorOptions(obj: any): obj is IZerrorOptions {
  // TODO check
  return typeof obj === "object" && obj != null;
}

function isZerrorData(obj: any): obj is IZerrorData {
  // TODO check
  return typeof obj === "object" && obj != null;
}

function isString(str: any): str is string {
  return typeof str === "string";
}

function isCause(obj: any): obj is Error {
  // TODO check
  return typeof obj === "object" && obj != null;
}

function isZerror(err: any): err is Zerror {
  return err && err.isZerror === true;
}

export type CodeOrOptions = IZerrorOptions | string | null;
export type CauseOrMessage = Zerror | Error | string;

class Zerror extends Error {
  public static CODES: IZerrorCodes = {
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
  };

  public static is(err: Zerror | Error, code?: string) {
    const instanceOfConstructor = err instanceof this;

    if (err instanceof Zerror && code) {
      return err.code === code;
    }

    return instanceOfConstructor;
  }

  public static setCodes(codes: IZerrorCodes) {
    // @ts-ignore
    this.CODES = this._prepareCodes(codes);
    this.prototype.CODES = this.CODES;
    // @ts-ignore
    this._codeMessages = this._prepareCodeMessages(codes);
  }

  public static _prepareCodes(codes: IZerrorCodes) {
    return Object.keys(codes).reduce((tmp: {[index: string]: string}, item: string) => {
      const result = tmp;
      result[item] = item;
      return result;
    }, {});
  }

  public static _prepareCodeMessages(codes: IZerrorCodes) {
    return codes;
  }
  private static _codeMessages: IZerrorCodes = {
    UNKNOWN_ERROR: "unknown error",
  };

  public CODES: IZerrorCodes = {
    UNKNOWN_ERROR: "UNKNOWN_ERROR",
  };

  public isZerror: boolean;
  public message: string;
  public stack?: string;
  public code: string;
  public data: IZerrorData | null;

  private _cause: Zerror | Error | null;

  // TODO any
  constructor(codeOrOptions?: CodeOrOptions, causeOrMessage?: CauseOrMessage) {
    super();

    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      // @ts-ignore
      this.__proto__ = actualProto;
    }

    // TODO Error.captureStackTrace
    this.isZerror = true;

    // @ts-ignore
    if (Error.captureStackTrace) {
      // @ts-ignore
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error()).stack;
    }

    this.CODES = (this.constructor as IZerrorConstructor).CODES;
    this.code = "UNKNOWN_ERROR";
    this.message = "unknown error";
    this.data = null;

    this._cause = null;

    this._processCode(codeOrOptions);
    this._processMessage(codeOrOptions, causeOrMessage);
    this._processCause(codeOrOptions, causeOrMessage);
    this._processData(codeOrOptions);
    this._processMessagePlaceholder();

    this.stack = this._prepareOwnStack();
  }

  public _processCode(codeOrOptions?: CodeOrOptions) {
    if (
      isZerrorOptions(codeOrOptions)
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

    if ((this.constructor as IZerrorConstructor)._codeMessages[this.code]) {
      this.message = (this.constructor as IZerrorConstructor)._codeMessages[this.code];
    }
  }

  public _processMessage(codeOrOptions?: CodeOrOptions, causeOrMessage?: CauseOrMessage) {
    if (isZerrorOptions(codeOrOptions) && codeOrOptions.message) {
      this.message = codeOrOptions.message;
    }

    if (isString(causeOrMessage)) {
      this.message = causeOrMessage;
    }
  }

  public _processCause(codeOrOptions?: CodeOrOptions, causeOrMessage?: CauseOrMessage) {
    if (isZerrorOptions(codeOrOptions) && codeOrOptions.cause) {
      this._cause = codeOrOptions.cause;
    }

    if (isCause(causeOrMessage)) {
      this._cause = causeOrMessage;
    }
  }

  public _processData(codeOrOptions?: CodeOrOptions) {
    if (isZerrorOptions(codeOrOptions) && codeOrOptions.data) {
      this.data = codeOrOptions.data;
    }
  }

  public _processMessagePlaceholder() {
    if (isZerrorData(this.data) && isString(this.message)) {
      const regex = /%([a-zA-Z0-9_]+)%/g;
      let match = regex.exec(this.message);
      while (match !== null) {
        const placeholder = match[1];

        if (this.data[placeholder]) {
          this.message = this.message.replace(
            new RegExp(`%${placeholder}%`, "g"),
            this.data[placeholder],
          );
        }
        match = regex.exec(this.message);
      }
    }
  }

  public cause() {
    if (this._cause) {
      return this._causeToString(this._cause);
    }

    return this._cause;
  }

  public toString() {
    // @ts-ignore
    // this._processMessagePlaceholder();

    let stack = this.stack ? this.stack : "";

    if (this._cause) {
      stack += `\n${this._causeToString(this._cause)}`;
    }

    return stack;
  }

  public _prepareOwnStack() {
    const stack = this.stack ? this._clearStack(this.stack) : "";

    return [
      this._getErrorHeader(this),
      stack,
    ].join("");
  }

  public _clearStack(stack: string) {
    if (typeof stack === "string") {
      return stack.split("\n").slice(1).join("\n");
    }

    return stack;
  }

  public _indentString(stack: string) {
    if (typeof stack === "string") {
      return stack.split("\n").map((str) => `    ${str}`).join("\n");
    }

    return stack;
  }

  public _getErrorHeader(error: Zerror | Error) {
    const header = [
      error.constructor.name, ": ",
      // @ts-ignore check
      error.code,
      "\n",
    ];

    if (error.message) {
      header.push(error.message, "\n");
    }

    return header.join("");
  }

  public _causeToString(cause: Zerror | Error) {
    let str = null;

    if (isZerror(cause)) {
      str = this._indentString(cause.toString());
    } else {
      str = this._indentString(cause.stack ? cause.stack : "");
    }

    return `\n${str}`;
  }
}

// @ts-ignore
// Zerror.__proto__ = Error.prototype;

export default Zerror;
