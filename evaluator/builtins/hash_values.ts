import OObject, { Builtin, HASH_OBJ, OArray, OHash } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// return the values of a hash
// hash_values({'a': 1, 'b': 2}) => [1, 2]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== HASH_OBJ) {
    return newError('arguments to `hash_values` must be HASH, got %s,', args[0].Type());
  }

  let hash = args[0] as OHash;

  let arr = [];
  for (let v of hash.Pairs.values()) {
    arr.push(v.Value);
  }

  return new OArray(arr);
});
