// src/type-system.ts
import { TypeSystem } from "@sinclair/typebox/system";
import {
  Type,
  FormatRegistry
} from "@sinclair/typebox";
import { Value as Value3 } from "@sinclair/typebox/value";

// src/error.ts
import { Value as Value2 } from "@sinclair/typebox/value";

// src/utils.ts
import { Kind } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { TypeCompiler } from "@sinclair/typebox/compiler";

// src/handler.ts
import { serialize } from "cookie";

// src/cookie.ts
import { parse } from "cookie";

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
    const error = isProduction ? void 0 : "Errors" in validator ? validator.Errors(value).First() : Value2.Errors(validator, value).First();
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
          expected: Value2.Create(
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
      return Value2.Create(model);
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
import {
  TypeSystemPolicy,
  TypeSystem as TypeSystem2,
  TypeSystemDuplicateFormat,
  TypeSystemDuplicateTypeKind
} from "@sinclair/typebox/system";
import { TypeCompiler as TypeCompiler2, TypeCheck as TypeCheck2 } from "@sinclair/typebox/compiler";
var t = Object.assign({}, Type);
try {
  TypeSystem.Format(
    "email",
    (value) => /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
      value
    )
  );
  TypeSystem.Format(
    "uuid",
    (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value
    )
  );
  TypeSystem.Format(
    "date",
    (value) => !Number.isNaN(new Date(value).getTime())
  );
  TypeSystem.Format(
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
var Files = TypeSystem.Type(
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
FormatRegistry.Set("numeric", (value) => !!value && !isNaN(+value));
FormatRegistry.Set("boolean", (value) => value === "true" || value === "false");
FormatRegistry.Set("ObjectString", (value) => {
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
    const schema = Type.Number(property);
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
      if (property && !Value3.Check(schema, number))
        throw new ValidationError("property", schema, number);
      return number;
    }).Encode((value) => value);
  },
  BooleanString: (property) => {
    const schema = Type.Boolean(property);
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
      if (property && !Value3.Check(schema, value))
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
  File: TypeSystem.Type("File", validateFile),
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
export {
  ElysiaType,
  TypeCheck2 as TypeCheck,
  TypeCompiler2 as TypeCompiler,
  TypeSystem2 as TypeSystem,
  TypeSystemDuplicateFormat,
  TypeSystemDuplicateTypeKind,
  TypeSystemPolicy,
  t
};
