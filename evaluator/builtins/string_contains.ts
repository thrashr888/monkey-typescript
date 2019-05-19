import OObject, { Builtin, OBoolean, STRING_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// checks if a string contains another string
// string_contains('abc', 'b') => true
// string_contains('abc', 'd') => false
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== STRING_OBJ) {
    return newError(
      'arguments to `string_replace` must be STRING,STRING, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();

  return new OBoolean(arg1.includes(arg2));
});
