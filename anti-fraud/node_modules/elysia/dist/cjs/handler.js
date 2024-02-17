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

// src/handler.ts
var handler_exports = {};
__export(handler_exports, {
  cookieToHeader: () => cookieToHeader,
  errorToResponse: () => errorToResponse,
  isNotEmpty: () => isNotEmpty,
  mapCompactResponse: () => mapCompactResponse,
  mapEarlyResponse: () => mapEarlyResponse,
  mapResponse: () => mapResponse,
  parseSetCookies: () => parseSetCookies
});
module.exports = __toCommonJS(handler_exports);
var import_cookie2 = require("cookie");

// src/utils.ts
var import_typebox = require("@sinclair/typebox");
var import_value = require("@sinclair/typebox/value");
var import_compiler = require("@sinclair/typebox/compiler");
var isBun = typeof Bun !== "undefined";
var hasHash = isBun && typeof Bun.hash === "function";
var StatusMap = {
  Continue: 100,
  "Switching Protocols": 101,
  Processing: 102,
  "Early Hints": 103,
  OK: 200,
  Created: 201,
  Accepted: 202,
  "Non-Authoritative Information": 203,
  "No Content": 204,
  "Reset Content": 205,
  "Partial Content": 206,
  "Multi-Status": 207,
  "Already Reported": 208,
  "Multiple Choices": 300,
  "Moved Permanently": 301,
  Found: 302,
  "See Other": 303,
  "Not Modified": 304,
  "Temporary Redirect": 307,
  "Permanent Redirect": 308,
  "Bad Request": 400,
  Unauthorized: 401,
  "Payment Required": 402,
  Forbidden: 403,
  "Not Found": 404,
  "Method Not Allowed": 405,
  "Not Acceptable": 406,
  "Proxy Authentication Required": 407,
  "Request Timeout": 408,
  Conflict: 409,
  Gone: 410,
  "Length Required": 411,
  "Precondition Failed": 412,
  "Payload Too Large": 413,
  "URI Too Long": 414,
  "Unsupported Media Type": 415,
  "Range Not Satisfiable": 416,
  "Expectation Failed": 417,
  "I'm a teapot": 418,
  "Misdirected Request": 421,
  "Unprocessable Content": 422,
  Locked: 423,
  "Failed Dependency": 424,
  "Too Early": 425,
  "Upgrade Required": 426,
  "Precondition Required": 428,
  "Too Many Requests": 429,
  "Request Header Fields Too Large": 431,
  "Unavailable For Legal Reasons": 451,
  "Internal Server Error": 500,
  "Not Implemented": 501,
  "Bad Gateway": 502,
  "Service Unavailable": 503,
  "Gateway Timeout": 504,
  "HTTP Version Not Supported": 505,
  "Variant Also Negotiates": 506,
  "Insufficient Storage": 507,
  "Loop Detected": 508,
  "Not Extended": 510,
  "Network Authentication Required": 511
};

// src/cookie.ts
var import_cookie = require("cookie");

// src/error.ts
var import_value2 = require("@sinclair/typebox/value");
var env = typeof Bun !== "undefined" ? Bun.env : typeof process !== "undefined" ? process?.env : void 0;
var ERROR_CODE = Symbol("ElysiaErrorCode");
var ELYSIA_RESPONSE = Symbol("ElysiaResponse");
var isProduction = (env?.NODE_ENV ?? env?.ENV) === "production";

// src/cookie.ts
var Cookie = class {
  constructor(_value, property = {}) {
    this._value = _value;
    this.property = property;
  }
  get() {
    return this._value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    if (typeof value === "object") {
      if (JSON.stringify(this.value) === JSON.stringify(value))
        return;
    } else if (this.value === value)
      return;
    this._value = value;
    this.sync();
  }
  add(config) {
    const updated = Object.assign(
      this.property,
      typeof config === "function" ? config(Object.assign(this.property, this.value)) : config
    );
    if ("value" in updated) {
      this._value = updated.value;
      delete updated.value;
    }
    this.property = updated;
    return this.sync();
  }
  set(config) {
    const updated = typeof config === "function" ? config(Object.assign(this.property, this.value)) : config;
    if ("value" in updated) {
      this._value = updated.value;
      delete updated.value;
    }
    this.property = updated;
    return this.sync();
  }
  remove(options) {
    if (this.value === void 0)
      return;
    this.set({
      domain: options?.domain,
      expires: /* @__PURE__ */ new Date(0),
      maxAge: 0,
      path: options?.path,
      sameSite: options?.sameSite,
      secure: options?.secure,
      value: ""
    });
  }
  get domain() {
    return this.property.domain;
  }
  set domain(value) {
    if (this.property.domain === value)
      return;
    this.property.domain = value;
    this.sync();
  }
  get expires() {
    return this.property.expires;
  }
  set expires(value) {
    if (this.property.expires?.getTime() === value?.getTime())
      return;
    this.property.expires = value;
    this.sync();
  }
  get httpOnly() {
    return this.property.httpOnly;
  }
  set httpOnly(value) {
    if (this.property.domain === value)
      return;
    this.property.httpOnly = value;
    this.sync();
  }
  get maxAge() {
    return this.property.maxAge;
  }
  set maxAge(value) {
    if (this.property.maxAge === value)
      return;
    this.property.maxAge = value;
    this.sync();
  }
  get path() {
    return this.property.path;
  }
  set path(value) {
    if (this.property.path === value)
      return;
    this.property.path = value;
    this.sync();
  }
  get priority() {
    return this.property.priority;
  }
  set priority(value) {
    if (this.property.priority === value)
      return;
    this.property.priority = value;
    this.sync();
  }
  get sameSite() {
    return this.property.sameSite;
  }
  set sameSite(value) {
    if (this.property.sameSite === value)
      return;
    this.property.sameSite = value;
    this.sync();
  }
  get secure() {
    return this.property.secure;
  }
  set secure(value) {
    if (this.property.secure === value)
      return;
    this.property.secure = value;
    this.sync();
  }
  toString() {
    return typeof this.value === "object" ? JSON.stringify(this.value) : this.value?.toString() ?? "";
  }
  sync() {
    if (!this.name || !this.setter)
      return this;
    if (!this.setter.cookie)
      this.setter.cookie = {
        [this.name]: Object.assign(this.property, {
          value: this.toString()
        })
      };
    else
      this.setter.cookie[this.name] = Object.assign(this.property, {
        value: this.toString()
      });
    return this;
  }
};

// src/handler.ts
var hasHeaderShorthand = "toJSON" in new Headers();
var isNotEmpty = (obj) => {
  for (const x in obj)
    return true;
  return false;
};
var handleFile = (response, set) => {
  const size = response.size;
  if (size && set && set.status !== 206 && set.status !== 304 && set.status !== 412 && set.status !== 416 || !set && size) {
    if (set) {
      if (set.headers instanceof Headers) {
        if (hasHeaderShorthand)
          set.headers = set.headers.toJSON();
        else
          for (const [key, value] of set.headers.entries())
            if (key in set.headers)
              set.headers[key] = value;
      }
      return new Response(response, {
        status: set.status,
        headers: Object.assign(
          {
            "accept-ranges": "bytes",
            "content-range": `bytes 0-${size - 1}/${size}`
          },
          set.headers
        )
      });
    }
    return new Response(response, {
      headers: {
        "accept-ranges": "bytes",
        "content-range": `bytes 0-${size - 1}/${size}`
      }
    });
  }
  return new Response(response);
};
var parseSetCookies = (headers, setCookie) => {
  if (!headers || !Array.isArray(setCookie))
    return headers;
  headers.delete("Set-Cookie");
  for (let i = 0; i < setCookie.length; i++) {
    const index = setCookie[i].indexOf("=");
    headers.append(
      "Set-Cookie",
      `${setCookie[i].slice(0, index)}=${setCookie[i].slice(index + 1)}`
    );
  }
  return headers;
};
var cookieToHeader = (cookies) => {
  if (!cookies || typeof cookies !== "object" || !isNotEmpty(cookies))
    return void 0;
  const set = [];
  for (const [key, property] of Object.entries(cookies)) {
    if (!key || !property)
      continue;
    if (Array.isArray(property.value)) {
      for (let i = 0; i < property.value.length; i++) {
        let value = property.value[i];
        if (value === void 0 || value === null)
          continue;
        if (typeof value === "object")
          value = JSON.stringify(value);
        set.push((0, import_cookie2.serialize)(key, value, property));
      }
    } else {
      let value = property.value;
      if (value === void 0 || value === null)
        continue;
      if (typeof value === "object")
        value = JSON.stringify(value);
      set.push((0, import_cookie2.serialize)(key, property.value, property));
    }
  }
  if (set.length === 0)
    return void 0;
  if (set.length === 1)
    return set[0];
  return set;
};
var mapResponse = (response, set) => {
  if (response?.[response.$passthrough])
    response = response[response.$passthrough];
  if (response?.[ELYSIA_RESPONSE]) {
    set.status = response[ELYSIA_RESPONSE];
    response = response.response;
  }
  if (isNotEmpty(set.headers) || set.status !== 200 || set.redirect || set.cookie) {
    if (typeof set.status === "string")
      set.status = StatusMap[set.status];
    if (set.redirect) {
      set.headers.Location = set.redirect;
      if (!set.status || set.status < 300 || set.status >= 400)
        set.status = 302;
    }
    if (set.cookie && isNotEmpty(set.cookie))
      set.headers["Set-Cookie"] = cookieToHeader(set.cookie);
    if (set.headers["Set-Cookie"] && Array.isArray(set.headers["Set-Cookie"]))
      set.headers = parseSetCookies(
        new Headers(set.headers),
        set.headers["Set-Cookie"]
      );
    switch (response?.constructor?.name) {
      case "String":
        return new Response(response, set);
      case "Blob":
        return handleFile(response, set);
      case "Object":
      case "Array":
        return Response.json(response, set);
      case "ReadableStream":
        if (!set.headers["content-type"]?.startsWith(
          "text/event-stream"
        ))
          set.headers["content-type"] = "text/event-stream; charset=utf-8";
        return new Response(
          response,
          set
        );
      case void 0:
        if (!response)
          return new Response("", set);
        return Response.json(response, set);
      case "Response":
        const inherits = { ...set.headers };
        if (hasHeaderShorthand)
          set.headers = response.headers.toJSON();
        else
          for (const [key, value] of response.headers.entries())
            if (key in set.headers)
              set.headers[key] = value;
        for (const key in inherits)
          response.headers.append(key, inherits[key]);
        return response;
      case "Error":
        return errorToResponse(response, set);
      case "Promise":
        return response.then(
          (x) => mapResponse(x, set)
        );
      case "Function":
        return mapResponse(response(), set);
      case "Number":
      case "Boolean":
        return new Response(
          response.toString(),
          set
        );
      case "Cookie":
        if (response instanceof Cookie)
          return new Response(response.value, set);
        return new Response(response?.toString(), set);
      default:
        if (response instanceof Response) {
          const inherits2 = { ...set.headers };
          if (hasHeaderShorthand)
            set.headers = response.headers.toJSON();
          else
            for (const [key, value] of response.headers.entries())
              if (key in set.headers)
                set.headers[key] = value;
          for (const key in inherits2)
            response.headers.append(
              key,
              inherits2[key]
            );
          return response;
        }
        if (response instanceof Promise)
          return response.then((x) => mapResponse(x, set));
        if (response instanceof Error)
          return errorToResponse(response, set);
        const r = JSON.stringify(response);
        if (r.charCodeAt(0) === 123) {
          if (!set.headers["Content-Type"])
            set.headers["Content-Type"] = "application/json";
          return new Response(
            JSON.stringify(response),
            set
          );
        }
        return new Response(r, set);
    }
  } else
    switch (response?.constructor?.name) {
      case "String":
        return new Response(response);
      case "Blob":
        return handleFile(response, set);
      case "Object":
      case "Array":
        return new Response(JSON.stringify(response), {
          headers: {
            "content-type": "application/json"
          }
        });
      case "ReadableStream":
        return new Response(response, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8"
          }
        });
      case void 0:
        if (!response)
          return new Response("");
        return new Response(JSON.stringify(response), {
          headers: {
            "content-type": "application/json"
          }
        });
      case "Response":
        return response;
      case "Error":
        return errorToResponse(response, set);
      case "Promise":
        return response.then((x) => {
          const r2 = mapCompactResponse(x);
          if (r2 !== void 0)
            return r2;
          return new Response("");
        });
      case "Function":
        return mapCompactResponse(response());
      case "Number":
      case "Boolean":
        return new Response(response.toString());
      case "Cookie":
        if (response instanceof Cookie)
          return new Response(response.value, set);
        return new Response(response?.toString(), set);
      default:
        if (response instanceof Response)
          return new Response(response.body, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        if (response instanceof Promise)
          return response.then((x) => mapResponse(x, set));
        if (response instanceof Error)
          return errorToResponse(response, set);
        const r = JSON.stringify(response);
        if (r.charCodeAt(0) === 123)
          return new Response(JSON.stringify(response), {
            headers: {
              "Content-Type": "application/json"
            }
          });
        return new Response(r);
    }
};
var mapEarlyResponse = (response, set) => {
  if (response === void 0 || response === null)
    return;
  if (
    // @ts-ignore
    response?.$passthrough
  )
    response = response[response.$passthrough];
  if (response?.[ELYSIA_RESPONSE]) {
    set.status = response[ELYSIA_RESPONSE];
    response = response.response;
  }
  if (isNotEmpty(set.headers) || set.status !== 200 || set.redirect || set.cookie) {
    if (typeof set.status === "string")
      set.status = StatusMap[set.status];
    if (set.redirect) {
      set.headers.Location = set.redirect;
      if (!set.status || set.status < 300 || set.status >= 400)
        set.status = 302;
    }
    if (set.cookie && isNotEmpty(set.cookie))
      set.headers["Set-Cookie"] = cookieToHeader(set.cookie);
    if (set.headers["Set-Cookie"] && Array.isArray(set.headers["Set-Cookie"]))
      set.headers = parseSetCookies(
        new Headers(set.headers),
        set.headers["Set-Cookie"]
      );
    switch (response?.constructor?.name) {
      case "String":
        return new Response(response, set);
      case "Blob":
        return handleFile(response, set);
      case "Object":
      case "Array":
        return Response.json(response, set);
      case "ReadableStream":
        if (!set.headers["content-type"]?.startsWith(
          "text/event-stream"
        ))
          set.headers["content-type"] = "text/event-stream; charset=utf-8";
        return new Response(
          response,
          set
        );
      case void 0:
        if (!response)
          return;
        return Response.json(response, set);
      case "Response":
        const inherits = Object.assign({}, set.headers);
        if (hasHeaderShorthand)
          set.headers = response.headers.toJSON();
        else
          for (const [key, value] of response.headers.entries())
            if (!(key in set.headers))
              set.headers[key] = value;
        for (const key in inherits)
          response.headers.append(key, inherits[key]);
        if (response.status !== set.status)
          set.status = response.status;
        return response;
      case "Promise":
        return response.then((x) => {
          const r2 = mapEarlyResponse(x, set);
          if (r2 !== void 0)
            return r2;
          return;
        });
      case "Error":
        return errorToResponse(response, set);
      case "Function":
        return mapEarlyResponse(response(), set);
      case "Number":
      case "Boolean":
        return new Response(
          response.toString(),
          set
        );
      case "Cookie":
        if (response instanceof Cookie)
          return new Response(response.value, set);
        return new Response(response?.toString(), set);
      default:
        if (response instanceof Response) {
          const inherits2 = { ...set.headers };
          if (hasHeaderShorthand)
            set.headers = response.headers.toJSON();
          else
            for (const [key, value] of response.headers.entries())
              if (key in set.headers)
                set.headers[key] = value;
          for (const key in inherits2)
            response.headers.append(
              key,
              inherits2[key]
            );
          return response;
        }
        if (response instanceof Promise)
          return response.then((x) => mapEarlyResponse(x, set));
        if (response instanceof Error)
          return errorToResponse(response, set);
        const r = JSON.stringify(response);
        if (r.charCodeAt(0) === 123) {
          if (!set.headers["Content-Type"])
            set.headers["Content-Type"] = "application/json";
          return new Response(
            JSON.stringify(response),
            set
          );
        }
        return new Response(r, set);
    }
  } else
    switch (response?.constructor?.name) {
      case "String":
        return new Response(response);
      case "Blob":
        return handleFile(response, set);
      case "Object":
      case "Array":
        return new Response(JSON.stringify(response), {
          headers: {
            "content-type": "application/json"
          }
        });
      case "ReadableStream":
        return new Response(response, {
          headers: {
            "Content-Type": "text/event-stream; charset=utf-8"
          }
        });
      case void 0:
        if (!response)
          return new Response("");
        return new Response(JSON.stringify(response), {
          headers: {
            "content-type": "application/json"
          }
        });
      case "Response":
        return response;
      case "Promise":
        return response.then((x) => {
          const r2 = mapEarlyResponse(x, set);
          if (r2 !== void 0)
            return r2;
          return;
        });
      case "Error":
        return errorToResponse(response, set);
      case "Function":
        return mapCompactResponse(response());
      case "Number":
      case "Boolean":
        return new Response(response.toString());
      case "Cookie":
        if (response instanceof Cookie)
          return new Response(response.value, set);
        return new Response(response?.toString(), set);
      default:
        if (response instanceof Response)
          return new Response(response.body, {
            headers: {
              "Content-Type": "application/json"
            }
          });
        if (response instanceof Promise)
          return response.then((x) => mapEarlyResponse(x, set));
        if (response instanceof Error)
          return errorToResponse(response, set);
        const r = JSON.stringify(response);
        if (r.charCodeAt(0) === 123)
          return new Response(JSON.stringify(response), {
            headers: {
              "Content-Type": "application/json"
            }
          });
        return new Response(r);
    }
};
var mapCompactResponse = (response) => {
  if (
    // @ts-ignore
    response?.$passthrough
  )
    response = response[response.$passthrough];
  if (response?.[ELYSIA_RESPONSE])
    return mapResponse(response.response, {
      // @ts-ignore
      status: response[ELYSIA_RESPONSE],
      headers: {}
    });
  switch (response?.constructor?.name) {
    case "String":
      return new Response(response);
    case "Blob":
      return handleFile(response);
    case "Object":
    case "Array":
      return new Response(JSON.stringify(response), {
        headers: {
          "content-type": "application/json"
        }
      });
    case "ReadableStream":
      return new Response(response, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8"
        }
      });
    case void 0:
      if (!response)
        return new Response("");
      return new Response(JSON.stringify(response), {
        headers: {
          "content-type": "application/json"
        }
      });
    case "Response":
      return response;
    case "Error":
      return errorToResponse(response);
    case "Promise":
      return response.then(
        mapCompactResponse
      );
    case "Function":
      return mapCompactResponse(response());
    case "Number":
    case "Boolean":
      return new Response(response.toString());
    default:
      if (response instanceof Response)
        return new Response(response.body, {
          headers: {
            "Content-Type": "application/json"
          }
        });
      if (response instanceof Promise)
        return response.then(mapCompactResponse);
      if (response instanceof Error)
        return errorToResponse(response);
      const r = JSON.stringify(response);
      if (r.charCodeAt(0) === 123)
        return new Response(JSON.stringify(response), {
          headers: {
            "Content-Type": "application/json"
          }
        });
      return new Response(r);
  }
};
var errorToResponse = (error, set) => new Response(
  JSON.stringify({
    name: error?.name,
    message: error?.message,
    cause: error?.cause
  }),
  {
    status: set?.status !== 200 ? set?.status ?? 500 : 500,
    headers: set?.headers
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cookieToHeader,
  errorToResponse,
  isNotEmpty,
  mapCompactResponse,
  mapEarlyResponse,
  mapResponse,
  parseSetCookies
});
