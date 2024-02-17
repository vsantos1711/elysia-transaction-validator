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

// src/type-system.ts
var type_system_exports = {};
__export(type_system_exports, {
  ElysiaType: () => ElysiaType,
  TypeCheck: () => import_compiler2.TypeCheck,
  TypeCompiler: () => import_compiler2.TypeCompiler,
  TypeSystem: () => import_system2.TypeSystem,
  TypeSystemDuplicateFormat: () => import_system2.TypeSystemDuplicateFormat,
  TypeSystemDuplicateTypeKind: () => import_system2.TypeSystemDuplicateTypeKind,
  TypeSystemPolicy: () => import_system2.TypeSystemPolicy,
  t: () => t
});
module.exports = __toCommonJS(type_system_exports);
var import_system = require("@sinclair/typebox/system");
var import_typebox2 = require("@sinclair/typebox");
var import_value3 = require("@sinclair/typebox/value");

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

// src/type-system.ts
var import_system2 = require("@sinclair/typebox/system");
var import_compiler2 = require("@sinclair/typebox/compiler");
var t = Object.assign({}, import_typebox2.Type);
try {
  import_system.TypeSystem.Format(
    "email",
    (value) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
      value
    )
  );
  import_system.TypeSystem.Format(
    "uuid",
    (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
  import_system.TypeSystem.Format(
    "date",
    (value) => !Number.isNaN(new Date(value).getTime())
  );
  import_system.TypeSystem.Format(
    "date-time",
    (value) => !Number.isNaN(new Date(value).getTime())
  );
} catch {
}
var parseFileUnit = (size) => {
  if (typeof size === "string")
    switch (size.slice(-1)) {
      case "k":
        return +size.slice(0, size.length - 1) * 1024;
      case "m":
        return +size.slice(0, size.length - 1) * 1048576;
      default:
        return +size;
    }
  return size;
};
var validateFile = (options, value) => {
  if (!(value instanceof Blob))
    return false;
  if (options.minSize && value.size < parseFileUnit(options.minSize))
    return false;
  if (options.maxSize && value.size > parseFileUnit(options.maxSize))
    return false;
  if (options.extension)
    if (typeof options.extension === "string") {
      if (!value.type.startsWith(options.extension))
        return false;
    } else {
      for (let i = 0; i < options.extension.length; i++)
        if (value.type.startsWith(options.extension[i]))
          return true;
      return false;
    }
  return true;
};
var Files = import_system.TypeSystem.Type(
  "Files",
  (options, value) => {
    if (!Array.isArray(value))
      return validateFile(options, value);
    if (options.minItems && value.length < options.minItems)
      return false;
    if (options.maxItems && value.length > options.maxItems)
      return false;
    for (let i = 0; i < value.length; i++)
      if (!validateFile(options, value[i]))
        return false;
    return true;
  }
);
import_typebox2.FormatRegistry.Set("numeric", (value) => !!value && !isNaN(+value));
import_typebox2.FormatRegistry.Set("boolean", (value) => value === "true" || value === "false");
import_typebox2.FormatRegistry.Set("ObjectString", (value) => {
  let start = value.charCodeAt(0);
  if (start === 9 || start === 10 || start === 32)
    start = value.trimStart().charCodeAt(0);
  if (start !== 123 && start !== 91)
    return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
});
var ElysiaType = {
  Numeric: (property) => {
    const schema = import_typebox2.Type.Number(property);
    return t.Transform(
      t.Union(
        [
          t.String({
            format: "numeric",
            default: 0
          }),
          t.Number(property)
        ],
        property
      )
    ).Decode((value) => {
      const number = +value;
      if (isNaN(number))
        return value;
      if (property && !import_value3.Value.Check(schema, number))
        throw new ValidationError("property", schema, number);
      return number;
    }).Encode((value) => value);
  },
  BooleanString: (property) => {
    const schema = import_typebox2.Type.Boolean(property);
    return t.Transform(
      t.Union(
        [
          t.String({
            format: "boolean",
            default: false
          }),
          t.Boolean(property)
        ],
        property
      )
    ).Decode((value) => {
      if (typeof value === "string")
        return value === "true";
      if (property && !import_value3.Value.Check(schema, value))
        throw new ValidationError("property", schema, value);
      return value;
    }).Encode((value) => value);
  },
  ObjectString: (properties, options) => t.Transform(
    t.Union(
      [
        t.String({
          format: "ObjectString",
          default: ""
        }),
        t.Object(properties, options)
      ],
      options
    )
  ).Decode((value) => {
    if (typeof value === "string")
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    return value;
  }).Encode((value) => JSON.stringify(value)),
  File: import_system.TypeSystem.Type("File", validateFile),
  Files: (options = {}) => t.Transform(t.Union([Files(options)])).Decode((value) => {
    if (Array.isArray(value))
      return value;
    return [value];
  }).Encode((value) => value),
  Nullable: (schema) => t.Union([t.Null(), schema]),
  /**
   * Allow Optional, Nullable and Undefined
   */
  MaybeEmpty: (schema) => t.Union([t.Null(), t.Undefined(), schema]),
  Cookie: (properties, options) => t.Object(properties, options)
};
t.BooleanString = ElysiaType.BooleanString;
t.ObjectString = ElysiaType.ObjectString;
t.Numeric = ElysiaType.Numeric;
t.File = (arg = {}) => ElysiaType.File({
  default: "File",
  ...arg,
  extension: arg?.type,
  type: "string",
  format: "binary"
});
t.Files = (arg = {}) => ElysiaType.Files({
  ...arg,
  elysiaMeta: "Files",
  default: "Files",
  extension: arg?.type,
  type: "array",
  items: {
    ...arg,
    default: "Files",
    type: "string",
    format: "binary"
  }
});
t.Nullable = (schema) => ElysiaType.Nullable(schema);
t.MaybeEmpty = ElysiaType.MaybeEmpty;
t.Cookie = ElysiaType.Cookie;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ElysiaType,
  TypeCheck,
  TypeCompiler,
  TypeSystem,
  TypeSystemDuplicateFormat,
  TypeSystemDuplicateTypeKind,
  TypeSystemPolicy,
  t
});
