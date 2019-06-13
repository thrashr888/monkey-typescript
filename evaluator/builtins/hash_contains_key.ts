import OObject, {
  BOOLEAN_OBJ,
  Builtin,
  FLOAT_OBJ,
  HASH_OBJ,
  INTEGER_OBJ,
  OBoolean,
  OHash,
  STRING_OBJ,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// check if a hash contains a key
// hash_contains_key({'a': 1, 'b': 2}, 'a') => true
// hash_contains_key({'a': 1, 'b': 2}, 'c') => false
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== HASH_OBJ) {
    return newError('arguments to `hash_contains_key` must be HASH, got %s,', args[0].Type());
  }
  if (![STRING_OBJ, INTEGER_OBJ, FLOAT_OBJ, BOOLEAN_OBJ].includes(args[1].Type())) {
    return newError(
      'arguments to `hash_contains_key` must be STRING|INTEGER|FLOAT|BOOLEAN, got %s,',
      args[1].Type()
    );
  }

  let hash = args[0] as OHash;

  for (let v of hash.Pairs.values()) {
    if (v.Key.toValue() === args[1].toValue()) {
      return new OBoolean(true);
    }
  }

  return new OBoolean(false);
});
