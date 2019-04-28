import https from 'https';

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
  INTEGER_OBJ,
  OFunction,
} from '../object/object';
import Eval, { newError, NULL } from './evaluator';

var builtins: { [s: string]: Builtin } = {
  len: new Builtin(function(...args: OObject[]): OObject {
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

  first: new Builtin(function(...args: OObject[]): OObject {
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

  last: new Builtin(function(...args: OObject[]): OObject {
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

  rest: new Builtin(function(...args: OObject[]): OObject {
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

  push: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 2) {
      return newError('wrong number of arguments. got=%s, want=2', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `push` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;

    return new OArray([...arr.Elements, args[1]]);
  }),

  puts: new Builtin(function(...args: OObject[]): OObject {
    console.log(args.map(a => a.Inspect()).join(' '));

    return NULL;
  }),

  // turns an object into a string
  string: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    return new OString(args[0].Inspect());
  }),

  // turns a string into a float or integer
  number: new Builtin(function(...args: OObject[]): OObject {
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
  jsonParse: new Builtin(function(...args: OObject[]): OObject {
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
  jsonStringify: new Builtin(function(...args: OObject[]): OObject {
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
