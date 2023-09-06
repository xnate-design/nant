const getBaseTag = (value: unknown) => {
  return Object.prototype.toString.call(value);
};

const objectTag = '[object Object]';
const stringTag = '[object String]';
const numberTag = '[object Number]';
const booleanTag = '[object Boolean]';
const arrayTag = '[object Array]';
const symbolTag = '[object Symbol]';
const nullTag = '[object Null]';
const undefinedTag = '[object Undefined]';

const asyncTag = '[object AsyncFunction]';
const funcTag = '[object Function]';
const genTag = '[object GeneratorFunction]';
const proxyTag = '[object Proxy]';

export function isObject(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === objectTag;
}

export function isString(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === stringTag;
}

export function isNumber(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === numberTag;
}

export function isBoolean(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === booleanTag;
}

export function isArray(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === arrayTag;
}

export function isSymbol(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === symbolTag;
}

export function isNull(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === nullTag;
}

export function isUndefined(value: unknown): value is Record<string, any> {
  return getBaseTag(value) === undefinedTag;
}

export function isFunction(value: unknown): value is Record<string, any> {
  const baseType = getBaseTag(value);
  return baseType === asyncTag || baseType === funcTag || baseType === genTag || baseType === proxyTag;
}
