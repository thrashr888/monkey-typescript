import OObject, { Builtin, OString, STRING_OBJ, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// split a string by another string
// string_split('ab', '') => ['a', 'b']
// string_split('ab,cd', ',') => ['ab', 'cd']
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== STRING_OBJ) {
    return newError(
      'arguments to `string_split` must be STRING,STRING, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();

  let arr = arg1.split(arg2).map(s => new OString(s));
  return new OArray(arr);
});
