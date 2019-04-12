type ObjectType = string;

export const INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL',
  RETURN_VALUE_OBJ = 'RETURN_VALUE';

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
  Inspect(): string {
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
  Inspect(): string {
    return this.Value ? 'true' : 'false';
  }
}

export class ONull implements OObject {
  Type() {
    return NULL_OBJ;
  }
  Inspect(): string {
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
  Inspect(): string {
    return this.Value.Inspect();
  }
}
