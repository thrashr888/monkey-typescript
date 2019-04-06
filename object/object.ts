type ObjectType = string;

export const INTEGER_OBJ = 'INTEGER',
  BOOLEAN_OBJ = 'BOOLEAN',
  NULL_OBJ = 'NULL';

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
