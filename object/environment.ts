import { NullableOObject } from './object';

export default class Environment {
  store: Map<string, NullableOObject> = new Map<string, NullableOObject>();
  outer: Environment | null = null;

  Get(name: string): NullableOObject {
    let obj = this.store.get(name);
    if (!obj && this.outer !== null) {
      obj = this.outer.Get(name);
    }
    return obj ? obj : null;
  }

  Set(name: string, val: NullableOObject): NullableOObject {
    this.store.set(name, val);
    return val;
  }
}

export function NewEnvironment(): Environment {
  let env = new Environment();
  return env;
}

export function NewEnclosedEnvironment(outer: Environment): Environment {
  let env = new Environment();
  env.outer = outer;
  return env;
}
