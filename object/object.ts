import { Identifier, BlockStatement } from '../ast/ast';
import Environment from './environment';

export const BOOLEAN_OBJ = 'BOOLEAN',
  BUILTIN_OBJ = 'BUILTIN',
  ERROR_OBJ = 'ERROR',
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
export type Hashable = OBoolean | OInteger | OFloat | OString;

export default interface OObject {
  Type(): string;
  Inspect(): string;
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
  (...args: OObject[]): OObject;
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
  HashKey(): HashKey {
    return new HashKey(this.Type(), this.Value);
  }
}

export class ONull implements OObject {
  Type() {
    return NULL_OBJ;
  }
  Inspect() {
    return 'null';
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
    let params: string[] = this.Parameters.map(p => p.String());

    return `fn(${params.join(', ')}) {\n ${this.Body.String()}\n}`;
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
  HashKey(): HashKey {
    let value = hashCode(this.Value);
    return new HashKey(this.Type(), value);
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
    let elements: string[] = this.Elements.map(e => e.Inspect());

    return `[${elements.join(', ')}]`;
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
}
