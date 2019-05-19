import OObject, { Builtin, OString, STRING_OBJ, INTEGER_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// get the substr of a string
// string_substr('abcdef', 1, 3) => 'bc'
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 3) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== INTEGER_OBJ || args[2].Type() !== INTEGER_OBJ) {
    return newError(
      'arguments to `string_replace` must be STRING,INTEGER,INTEGER, got %s,%s,%s',
      args[0].Type(),
      args[1].Type(),
      args[2].Type()
    );
  }

  let arg1 = args[0].Inspect();
  let arg2 = parseInt(args[1].Inspect());
  let arg3 = parseInt(args[2].Inspect());

  return new OString(arg1.substring(arg2, arg3));
});
