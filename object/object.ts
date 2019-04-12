type ObjectType = string;

export const INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL',
  RETURN_VALUE_OBJ = 'RETURN_VALUE',
  ERROR_OBJ = 'ERROR';

export type AnyObject = OInteger | OBoolean | ONull;

export default interface OObject {
  Type(): string;
  Inspect(): string;
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
