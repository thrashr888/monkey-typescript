import OObject, { Builtin, OBoolean, STRING_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// checks if a string starts_with another string
// string_starts_with('abc', 'a') => true
// string_starts_with('abc', 'c') => false
// string_starts_with('abc', 'd') => false
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `string_starts_with` must be STRING, got %s', args[0].Type());
  }
  if (args[1].Type() !== STRING_OBJ) {
    return newError('argument to `string_starts_with` must be STRING, got %s', args[1].Type());
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();

  return new OBoolean(arg1.startsWith(arg2));
});
