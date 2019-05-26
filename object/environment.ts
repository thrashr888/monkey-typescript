import OObject, {
  NullableOObject,
  OBoolean,
  OHash,
  HashPair,
  OString,
  OInteger,
  OArray,
  OFloat,
  ONull,
} from './object';
import Logger from './logger';
import process from 'process';

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

type StringKeyedObject = { [s: string]: string | number | boolean | null };

export function NewNodeEnvironment(): Environment {
  let logger = new Logger();
  let env = new Environment(logger);

  env.Set('__arch', new OString(process.arch));
  env.Set('__argv', jsArrayToMonkey(process.argv));
  env.Set('__env', jsObjectToMonkey(process.env as StringKeyedObject));
  env.Set('__environment', new OString('node'));
  env.Set('__node', new OBoolean(true));
  env.Set('__pid', new OInteger(process.pid));
  env.Set('__platform', new OString(process.platform));
  env.Set('__version', new OString(process.version));

  let versions = process.versions as unknown;
  env.Set('__versions', jsObjectToMonkey(versions as StringKeyedObject));

  return env;
}

declare let window: any;
export function NewBrowserEnvironment(): Environment {
  let logger = new Logger();
  let env = new Environment(logger);

  env.Set('__browser', new OBoolean(true));
  env.Set('__environment', new OString('browser'));

  let location: any = window.location;
  env.Set(
    '__location',
    jsObjectToMonkey({
      hash: location.hash,
      host: location.host,
      hostname: location.hostname,
      href: location.href,
      origin: location.origin,
      pathname: location.pathname,
      port: location.port,
      protocol: location.protocol,
    })
  );

  let screen: any = window.screen;
  env.Set(
    '__screen',
    jsObjectToMonkey({
      availHeight: screen.availHeight,
      availLeft: screen.availLeft,
      availTop: screen.availTop,
      availWidth: screen.availWidth,
      colorDepth: screen.colorDepth,
      height: screen.height,
      pixelDepth: screen.pixelDepth,
      width: screen.width,
    })
  );

  let navigator: any = window.navigator;
  env.Set(
    '__navigator',
    jsObjectToMonkey({
      appCodeName: navigator.appCodeName,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      cookieEnabled: navigator.cookieEnabled,
      deviceMemory: navigator.deviceMemory,
      doNotTrack: navigator.doNotTrack,
      language: navigator.language,
      maxTouchPoints: navigator.maxTouchPoints,
      onLine: navigator.onLine,
      platform: navigator.platform,
      product: navigator.product,
      productSub: navigator.productSub,
      userAgent: navigator.userAgent,
      vendor: navigator.vendor,
      vendorSub: navigator.vendorSub,
    })
  );

  let connection: any = window.navigator.connection;
  env.Set(
    '__connection',
    jsObjectToMonkey({
      effectiveType: connection.effectiveType,
      rtt: connection.rtt,
      downlink: connection.downlink,
    })
  );

  return env;
}

function jsObjectToMonkey(obj: StringKeyedObject): NullableOObject {
  let pairs = new Map<string, HashPair>();
  for (let key in obj) {
    let value: OObject = new ONull();

    if (typeof obj[key] === 'string') {
      value = new OString(obj[key] as string);
    } else if (typeof obj[key] === 'number') {
      value = new OInteger(obj[key] as number);
    } else if (typeof obj[key] === 'boolean') {
      value = new OBoolean(obj[key] as boolean);
    } else if (!obj[key]) {
      value = new ONull();
    }

    let hashKey = new OString(key);
    let hashed = hashKey.HashKey();

    pairs.set(hashed.Match, new HashPair(hashKey, value));
  }
  return new OHash(pairs);
}

function jsArrayToMonkey(arr: string[]): OArray {
  return new OArray(arr.map(s => new OString(s)));
}
