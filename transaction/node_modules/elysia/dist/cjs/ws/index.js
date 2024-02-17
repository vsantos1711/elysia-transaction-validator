"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/ws/index.ts
var ws_exports = {};
__export(ws_exports, {
  ElysiaWS: () => ElysiaWS,
  websocket: () => websocket
});
module.exports = __toCommonJS(ws_exports);

// src/error.ts
var import_value2 = require("@sinclair/typebox/value");

// src/utils.ts
var import_typebox = require("@sinclair/typebox");
var import_value = require("@sinclair/typebox/value");
var import_compiler = require("@sinclair/typebox/compiler");

// src/handler.ts
var import_cookie2 = require("cookie");

// src/cookie.ts
var import_cookie = require("cookie");

// src/handler.ts
var hasHeaderShorthand = "toJSON" in new Headers();

// src/utils.ts
var isBun = typeof Bun !== "undefined";
var hasHash = isBun && typeof Bun.hash === "function";

// src/error.ts
var env = typeof Bun !== "undefined" ? Bun.env : typeof process !== "undefined" ? process?.env : void 0;
var ERROR_CODE = Symbol("ElysiaErrorCode");
var ELYSIA_RESPONSE = Symbol("ElysiaResponse");
var isProduction = (env?.NODE_ENV ?? env?.ENV) === "production";
var ValidationError = class _ValidationError extends Error {
  constructor(type, validator, value) {
    const error = isProduction ? void 0 : "Errors" in validator ? validator.Errors(value).First() : import_value2.Value.Errors(validator, value).First();
    const customError = error?.schema.error ? typeof error.schema.error === "function" ? error.schema.error(type, validator, value) : error.schema.error : void 0;
    const accessor = error?.path?.slice(1) || "root";
    let message = "";
    if (customError) {
      message = typeof customError === "object" ? JSON.stringify(customError) : customError + "";
    } else if (isProduction) {
      message = JSON.stringify({
        type,
        message: error?.message
      });
    } else {
      message = JSON.stringify(
        {
          type,
          at: accessor,
          message: error?.message,
          expected: import_value2.Value.Create(
            // @ts-ignore private field
            validator.schema
          ),
          found: value,
          errors: [...validator.Errors(value)]
        },
        null,
        2
      );
    }
    super(message);
    this.type = type;
    this.validator = validator;
    this.value = value;
    this.code = "VALIDATION";
    this.status = 400;
    Object.setPrototypeOf(this, _ValidationError.prototype);
  }
  get all() {
    return [...this.validator.Errors(this.value)];
  }
  static simplifyModel(validator) {
    const model = "schema" in validator ? validator.schema : validator;
    try {
      return import_value2.Value.Create(model);
    } catch {
      return model;
    }
  }
  get model() {
    return _ValidationError.simplifyModel(this.validator);
  }
  toResponse(headers) {
    return new Response(this.message, {
      status: 400,
      headers
    });
  }
};

// src/ws/index.ts
var websocket = {
  open(ws) {
    ws.data.open?.(ws);
  },
  message(ws, message) {
    ws.data.message?.(ws, message);
  },
  drain(ws) {
    ws.data.drain?.(ws);
  },
  close(ws, code, reason) {
    ws.data.close?.(ws, code, reason);
  }
};
var ElysiaWS = class {
  constructor(raw, data) {
    this.raw = raw;
    this.data = data;
    this.validator = raw.data.validator;
    if (raw.data.id) {
      this.id = raw.data.id;
    } else {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      this.id = array[0].toString();
    }
  }
  get id() {
    return this.raw.data.id;
  }
  set id(newID) {
    this.raw.data.id = newID;
  }
  get publish() {
    return (topic, data = void 0, compress) => {
      if (this.validator?.Check(data) === false)
        throw new ValidationError("message", this.validator, data);
      if (typeof data === "object")
        data = JSON.stringify(data);
      this.raw.publish(topic, data, compress);
      return this;
    };
  }
  get send() {
    return (data) => {
      if (this.validator?.Check(data) === false)
        throw new ValidationError("message", this.validator, data);
      if (Buffer.isBuffer(data)) {
        this.raw.send(data);
        return this;
      }
      if (typeof data === "object")
        data = JSON.stringify(data);
      this.raw.send(data);
      return this;
    };
  }
  get subscribe() {
    return (room) => {
      this.raw.subscribe(room);
      return this;
    };
  }
  get unsubscribe() {
    return (room) => {
      this.raw.unsubscribe(room);
      return this;
    };
  }
  get cork() {
    return (callback) => {
      this.raw.cork(callback);
      return this;
    };
  }
  get close() {
    return () => {
      this.raw.close();
      return this;
    };
  }
  get terminate() {
    return this.raw.terminate.bind(this.raw);
  }
  get isSubscribed() {
    return this.raw.isSubscribed.bind(this.raw);
  }
  get remoteAddress() {
    return this.raw.remoteAddress;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ElysiaWS,
  websocket
});
