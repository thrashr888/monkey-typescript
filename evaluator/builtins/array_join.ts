import OObject, { Builtin, OString, ARRAY_OBJ, STRING_OBJ, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// get the join of a array
// array_join(['a', 'b'], ', ') => "a, b"
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ || args[1].Type() !== STRING_OBJ) {
    return newError(
      'arguments to `array_join` must be ARRAY,STRING, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0] as OArray;
  let arg2 = args[1] as OString;

  let joined = arg1.Elements.join(arg2.Inspect());
  return new OString(joined);
});
