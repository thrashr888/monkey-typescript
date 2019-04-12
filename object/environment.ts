import { NullableOObject } from './object';

export default class Environment {
  store: Map<string, NullableOObject> = new Map<string, NullableOObject>();

  Get(name: string): NullableOObject {
    let obj = this.store.get(name);
    return obj ? obj : null;
  }

  Set(name: string, val: NullableOObject): NullableOObject {
    this.store.set(name, val);
    return val;
  }
}
