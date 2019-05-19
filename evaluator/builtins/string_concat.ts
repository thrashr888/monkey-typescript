import OObject, { Builtin, OString, STRING_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// concat a string with another string
// string_concat('ab', '') => ['a', 'b']
// string_concat('ab,cd', ',') => ['ab', 'cd']
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== STRING_OBJ) {
    return newError(
      'arguments to `string_concat` must be STRING,STRING, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();

  return new OString(arg1.concat(arg2));
});
