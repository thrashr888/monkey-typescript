import OObject, { Builtin, OString, STRING_OBJ, INTEGER_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// get the repeat of a string
// string_repeat('ab', 2) => 'abab'
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== INTEGER_OBJ) {
    return newError(
      'arguments to `string_repeat` must be STRING,INTEGER, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0].Inspect();
  let arg2 = parseInt(args[1].Inspect());

  return new OString(arg1.repeat(arg2));
});
