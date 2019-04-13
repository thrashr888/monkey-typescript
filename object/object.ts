import { Identifier, BlockStatement } from '../ast/ast';
import Environment from './environment';

export const INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL',
  RETURN_VALUE_OBJ = 'RETURN_VALUE',
  ERROR_OBJ = 'ERROR',
  FUNCTION_OBJ = 'FUNCTION',
  STRING_OBJ = 'STRING',
  BUILTIN_OBJ = 'BUILTIN';

export type AnyObject = OInteger | OBoolean | ONull;
export type NullableOObject = OObject | null;

export default interface OObject {
  Type(): string;
  Inspect(): string;
}

export interface BuiltinFunction {
  (...args: OObject[]): OObject;
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
