import OObject, {
  Builtin,
  OString,
  OInteger,
  OArray,
  OHash,
  HashPair,
  ARRAY_OBJ,
  STRING_OBJ,
  HASH_OBJ,
  OFloat,
  OError,
} from '../object/object';
import { newError, NULL } from './evaluator';
import Environment from '../object/environment';

var builtins: { [s: string]: Builtin } = {
  // let a = [1, 2, 3]; len(a) => 3
  len: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    let arg = args[0];
    if (arg instanceof OArray) {
      return new OInteger(arg.Elements.length);
    } else if (arg instanceof OString) {
      return new OInteger(arg.Value.length);
    }

    return newError('argument to `len` not supported, got %s', arg.Type());
  }),

  // let a = [1, 2, 3]; first(a) => 1
  first: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `first` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;
    let length = arr.Elements.length;
    if (length > 0) {
      return arr.Elements[0];
    }

    return NULL;
  }),

  // let a = [1, 2, 3]; last(a) => 3
  last: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `last` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;
    let length = arr.Elements.length;
    if (length > 0) {
      return arr.Elements[length - 1];
    }

    return NULL;
  }),

  // let a = [1, 2, 3]; rest(a); a => [2, 3]
  rest: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `rest` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;
    let length = arr.Elements.length;
    if (length > 0) {
      let newElements = arr.Elements.slice(1);
      return new OArray(newElements);
    }

    return NULL;
  }),

  // let a = []; push(a, 1); a => [1]
  push: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 2) {
      return newError('wrong number of arguments. got=%s, want=2', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `push` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;

    return new OArray([...arr.Elements, args[1]]);
  }),

  // puts(1, 'ok', 'hello', 3.1459) => '1', 'ok', 'hello', '3.1459'
  puts: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    env.Logger.Log(args.map(a => a.Inspect()).join(' '));

    return NULL;
  }),

  // put(1, 'ok', 'hello', 3.1459) => 1, 'ok', 'hello', 3.1459
  put: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    env.Logger.Log(
      ...args.map(a => {
        try {
          // may contain an unimplemented value
          return a.toValue();
        } catch (err) {
          return NULL;
        }
      })
    );

    return NULL;
  }),

  // iso_date('2010/30/12')
  iso_date: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length > 1) {
      return newError('wrong number of arguments. got=%s, want=1 or 0', args.length);
    }

    let date = new Date();
    if (args[0]) {
      date = new Date(args[0].Inspect());
    }

    return new OString(date.toISOString());
  }),

  // utc_date('2010/30/12')
  utc_date: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length > 1) {
      return newError('wrong number of arguments. got=%s, want=1 or 0', args.length);
    }

    let date = new Date();
    if (args[0]) {
      date = new Date(args[0].Inspect());
    }

    return new OString(date.toUTCString());
  }),

  // locale_date('2010/30/12', 'en-US')
  locale_date: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 2) {
      return newError('wrong number of arguments. got=%s, want=2', args.length);
    }

    let date = new Date();

    if (args[0]) {
      date = new Date(args[0].Inspect());
    }

    return new OString(date.toLocaleString(args[1].Inspect()));
  }),

  // now()
  now: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length > 1) {
      return newError('wrong number of arguments. got=%s, want=1 or 0', args.length);
    }

    return new OInteger(Date.now());
  }),

  // locale_date('en-US')
  locale_now: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    let date = new Date();
    try {
      let str = date.toLocaleString(args[0].Inspect());
      return new OString(str);
    } catch (err) {
      return newError('error parsing date', err.message);
    }
  }),

  // turns an object into a string
  // string(3.1459)
  string: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    return new OString(args[0].Inspect());
  }),

  // turns a string into a float or integer
  // number('3.1459')
  number: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    if (args[0].Type() !== STRING_OBJ) {
      return newError('argument to `number` must be STRING, got %s', args[0].Type());
    }

    let arg = args[0].Inspect();
    if (isFloat(arg)) {
      let number = parseFloat(arg);
      return new OFloat(number);
    }

    let number = parseInt(arg);
    return new OInteger(number);
  }),

  // jsonParse('[1,2,"three"]')
  // jsonParse('{"a": "b", "c": 4}')
  // jsonParse('{ "data": [ {"id": 1, "name": "a"}, {"id": 2, "name": "b"} ] }')
  jsonParse: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== STRING_OBJ || !(args[0] instanceof OString)) {
      return newError('argument to `jsonParse` must be STRING, got %s', args[0].Type());
    }

    let obj = JSON.parse(args[0].Inspect());
    return jsonParse(obj);
  }),

  // jsonStringify([1,2,"three"])
  // jsonStringify({"a": "b", "c": 4})
  // jsonStringify({"a": "b", "c": [4, 5, 6]})
  // jsonStringify({"data": [ {"id": 1, "name": "a"}, {"id": 2, "name": "b"} ]})
  jsonStringify: new Builtin(function(env: Environment, ...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== HASH_OBJ && args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `jsonStringify` must be ARRAY or HASH, got %s', args[0].Type());
    }

    return new OString(args[0].toString());
  }),
};

function isFloat(n: string): boolean {
  let val = parseFloat(n);
  return !isNaN(val) && n.indexOf('.') !== -1;
}

// jsonParse('[1,2,"three"]')
// jsonParse('{"a": "b", "c": 4, "d": null}')
function jsonParse(input: any): OObject {
  if (Array.isArray(input)) {
    return new OArray(input.map(v => jsonParse(v)));
  } else if (input === null) {
    return NULL;
  } else if (typeof input === 'object') {
    let pairs = new Map();
    Object.keys(input).forEach((key: string) => {
      let hashKey = new OString(key);
      let hashed = hashKey.HashKey();
      pairs.set(hashed.Match, new HashPair(hashKey, jsonParse(input[key])));
    });
    return new OHash(pairs);
  } else if (typeof input === 'number') {
    return new OInteger(input);
  } else if (typeof input === 'string') {
    return new OString(input);
  }

  return NULL;
}

export default builtins;
