import OObject, {
  Builtin,
  OString,
  OInteger,
  OArray,
  OHash,
  HashPair,
  STRING_OBJ,
} from '../../object/object';
import { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';

// jsonParse('[1,2,"three"]')
// jsonParse('{"a": "b", "c": 4}')
// jsonParse('{ "data": [ {"id": 1, "name": "a"}, {"id": 2, "name": "b"} ] }')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }
  if (args[0].Type() !== STRING_OBJ || !(args[0] instanceof OString)) {
    return newError('argument to `jsonParse` must be STRING, got %s', args[0].Type());
  }

  let obj = JSON.parse(args[0].Inspect());
  return jsonParse(obj);
});

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
