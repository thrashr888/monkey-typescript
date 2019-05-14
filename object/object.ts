import { Identifier, BlockStatement, Expression } from '../ast/ast';
import Environment from './environment';
import Configuration from '../evaluator/configuration';

export const BOOLEAN_OBJ = 'BOOLEAN',
  BUILTIN_OBJ = 'BUILTIN',
  ERROR_OBJ = 'ERROR',
  COMMENT_OBJ = 'COMMENT',
  FUNCTION_OBJ = 'FUNCTION',
  INTEGER_OBJ = 'INTEGER',
  FLOAT_OBJ = 'FLOAT',
  NULL_OBJ = 'NULL',
  RETURN_VALUE_OBJ = 'RETURN_VALUE',
  STRING_OBJ = 'STRING',
  ARRAY_OBJ = 'ARRAY',
  HASH_OBJ = 'HASH';

export type AnyObject = OObject | OInteger | OFloat | OBoolean | OString | ONull;
export type NullableOObject = OObject | null;
export type NullableString = string | null;
export type Hashable = OBoolean | OInteger | OFloat | OString;
export type HasValue = OBoolean | OInteger | OFloat | ReturnValue | OString | OArray | OHash;

export default interface OObject {
  Type(): string;
  Inspect(): string;
  toString(): string; // for JSON conversion
  toValue(): any; // for inspection
}

export class HashKey {
  Type: string;
  Value: number;
  Match: string;

  constructor(type: string, value: number) {
    this.Type = type;
    this.Value = value;
    this.Match = this.Type + this.Value;
  }
}

export interface BuiltinFunction {
  (env: Environment, ...args: OObject[]): OObject;
}

export class OBoolean implements OObject {
  Value: boolean;

  constructor(value: boolean) {
    this.Value = value;
  }

  Type() {
    return BOOLEAN_OBJ;
  }
  Inspect() {
    return this.Value ? 'true' : 'false';
  }
  toString() {
    return this.Value ? 'true' : 'false';
  }
  toValue() {
    return this.Value ? true : false;
  }
  HashKey(): HashKey {
    let value: number;

    if (this.Value) {
      value = 1;
    } else {
      value = 0;
    }

    return new HashKey(this.Type(), value);
  }
}

export class OInteger implements OObject {
  Value: number;

  constructor(value: number) {
    this.Value = value;
  }

  Type() {
    return INTEGER_OBJ;
  }
  Inspect() {
    return String(this.Value);
  }
  toString() {
    return String(this.Value);
  }
  toValue() {
    return this.Value;
  }
  HashKey(): HashKey {
    return new HashKey(this.Type(), this.Value);
  }
}
export class OFloat implements OObject {
  Value: number;

  constructor(value: number) {
    this.Value = value;
  }

  Type() {
    return FLOAT_OBJ;
  }
  Inspect() {
    return String(this.Value);
  }
  toString() {
    return String(this.Value);
  }
  toValue() {
    return this.Value;
  }
  HashKey(): HashKey {
    return new HashKey(this.Type(), this.Value);
  }
}

export class ONull implements OObject {
  Type() {
    return NULL_OBJ;
  }
  Inspect() {
    if (Configuration.outputNULL) return 'null';
    return '';
  }
  toString() {
    return 'null';
  }
  toValue() {
    return null;
  }
}

export class ReturnValue implements OObject {
  Value: OObject;

  constructor(value: OObject) {
    this.Value = value;
  }

  Type() {
    return RETURN_VALUE_OBJ;
  }
  Inspect() {
    return this.Value.Inspect();
  }
  toString() {
    return this.Value.Inspect();
  }
  toValue() {
    return this.Value.toValue();
  }
}

export class OError implements OObject {
  Message: string;

  constructor(message: string) {
    this.Message = message;
  }

  Type() {
    return ERROR_OBJ;
  }
  Inspect() {
    return `Error: ${this.Message}`;
  }
  toString() {
    return `"Error: ${this.Message}"`;
  }
  toValue() {
    return new Error(this.Message);
  }
}

export class OFunction implements OObject {
  Parameters: Identifier[];
  Body: BlockStatement;
  Env: Environment;

  constructor(parameters: Identifier[], body: BlockStatement, env: Environment) {
    this.Parameters = parameters;
    this.Body = body;
    this.Env = env;
  }

  Type() {
    return FUNCTION_OBJ;
  }
  Inspect() {
    if (!Configuration.outputFunctionBody) return 'fn';

    let params: string[] = this.Parameters.map(p => p.String());

    return `fn(${params.join(', ')}) {\n  ${this.Body.String()}\n}`;
  }
  toString() {
    return `fn`;
  }
  toValue() {
    return new Error('OFunction values not implemented');
  }
}

function hashCode(str: string): number {
  return Array.from(str).reduce((s, c) => (Math.imul(31, s) + c.charCodeAt(0)) | 0, 0);
}

export class OString implements OObject {
  Value: string;

  constructor(value: string) {
    this.Value = value;
  }

  Type() {
    return STRING_OBJ;
  }
  Inspect() {
    return this.Value;
  }
  toString() {
    return `"${this.Value}"`;
  }
  toValue() {
    return this.Value;
  }
  HashKey(): HashKey {
    let value = hashCode(this.Value);
    return new HashKey(this.Type(), value);
  }
}

export class OComment implements OObject {
  Message: string;

  constructor(message: string) {
    this.Message = message;
  }

  Type() {
    return STRING_OBJ;
  }
  Inspect() {
    return `# ${this.Message}`;
  }
  toString() {
    return '';
  }
  toValue() {
    return this.Message;
  }
  HashKey(): HashKey {
    let message = hashCode(this.Message);
    return new HashKey(this.Type(), message);
  }
}

export class Builtin implements OObject {
  Fn: BuiltinFunction;

  constructor(fn: BuiltinFunction) {
    this.Fn = fn;
  }

  Type() {
    return BUILTIN_OBJ;
  }
  Inspect() {
    return 'builtin function';
  }
  toString() {
    return '"builtin function"';
  }
  toValue() {
    return new Error('Builtin values not implemented');
  }
}

export class OArray implements OObject {
  Elements: OObject[];

  constructor(elements: OObject[]) {
    this.Elements = elements;
  }

  Type() {
    return ARRAY_OBJ;
  }
  Inspect() {
    let elements: NullableString[] = this.Elements.map(e => (e ? e.Inspect() : null));

    return `[${elements.join(', ')}]`;
  }
  toString() {
    let elements: NullableString[] = this.Elements.map(e => (e ? e.toString() : null));

    return `[${elements.join(', ')}]`;
  }
  toValue() {
    let elements: NullableString[] = this.Elements.map(e => (e ? e.toValue() : null));

    return elements;
  }
}

export type HashPairs = Map<string, HashPair>;

export class HashPair {
  Key: OObject;
  Value: OObject;

  constructor(key: OObject, value: OObject) {
    this.Key = key;
    this.Value = value;
  }
}

export class OHash implements OObject {
  Pairs: HashPairs = new Map<string, HashPair>();

  constructor(pairs: HashPairs) {
    this.Pairs = pairs;
  }

  Type() {
    return HASH_OBJ;
  }
  Inspect() {
    let pairs: string[] = [];

    this.Pairs.forEach(v => pairs.push(`${v.Key.Inspect()}:${v.Value.Inspect()}`));

    return `{${pairs.join(', ')}}`;
  }
  toString() {
    let pairs: string[] = [];

    this.Pairs.forEach(v => pairs.push(`${v.Key.toString()}: ${v.Value.toString()}`));

    return `{${pairs.join(', ')}}`;
  }
  toValue() {
    let obj: { [index: string]: any } = {};

    this.Pairs.forEach(v => (obj[v.Key.toString()] = v.Value.toString()));

    return obj;
  }
}
