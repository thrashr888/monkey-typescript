import OObject, { Builtin, OString, STRING_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// replace part of a string with another string
// string_replace('abc', 'b', 'c') => 'acc'
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 3) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== STRING_OBJ || args[2].Type() !== STRING_OBJ) {
    return newError(
      'arguments to `string_replace` must be STRING,STRING,STRING, got %s,%s,%s',
      args[0].Type(),
      args[1].Type(),
      args[2].Type()
    );
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();
  let arg3 = args[2].Inspect();

  return new OString(arg1.replace(arg2, arg3));
});
