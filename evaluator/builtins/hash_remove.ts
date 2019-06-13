import OObject, {
  BOOLEAN_OBJ,
  Builtin,
  FLOAT_OBJ,
  HASH_OBJ,
  INTEGER_OBJ,
  OHash,
  STRING_OBJ,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// remove a key from a hash
// hash_remove({'a': 1, 'b': 2}, 'a') => {'b': 2}
// hash_remove({'a': 1, 'b': 2}, 'c') => {'a': 1, 'b': 2}
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== HASH_OBJ) {
    return newError('arguments to `hash_remove` must be HASH, got %s,', args[0].Type());
  }
  if (![STRING_OBJ, INTEGER_OBJ, FLOAT_OBJ, BOOLEAN_OBJ].includes(args[1].Type())) {
    return newError('arguments to `hash_remove` must be STRING|INTEGER|FLOAT, got %s', args[1].Type());
  }

  let hash = args[0] as OHash;

  hash.Pairs.forEach(function(value, key, map) {
    if (value.Key.toValue() === args[1].toValue()) {
      hash.Pairs.delete(key);
    }
  });

  return hash;
});
