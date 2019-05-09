import { NullableOObject } from './object';
import Logger from './logger';

export default class Environment {
  store: Map<string, NullableOObject> = new Map<string, NullableOObject>();
  outer: Environment | null = null;
  Logger: Logger = new Logger();

  constructor(logger: Logger) {
    this.Logger = logger;
  }

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
  let logger = new Logger();
  let env = new Environment(logger);
  return env;
}

export function NewEnclosedEnvironment(outer: Environment): Environment {
  let env = new Environment(outer.Logger);
  env.outer = outer;
  return env;
}
