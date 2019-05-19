import OObject, { Builtin, OString, ARRAY_OBJ, HASH_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';

// jsonStringify([1,2,"three"])
// jsonStringify({"a": "b", "c": 4})
// jsonStringify({"a": "b", "c": [4, 5, 6]})
// jsonStringify({"data": [ {"id": 1, "name": "a"}, {"id": 2, "name": "b"} ]})
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }
  if (args[0].Type() !== HASH_OBJ && args[0].Type() !== ARRAY_OBJ) {
    return newError('argument to `jsonStringify` must be ARRAY or HASH, got %s', args[0].Type());
  }

  return new OString(args[0].toString());
});
