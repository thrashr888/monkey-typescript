import OObject, { Builtin, ARRAY_OBJ, INTEGER_OBJ, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// get the slice of a array
// array_slice(['a', 'b', 'c', 'd'], 1, 3) => ['b', 'c']
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length === 0 || args.length > 3) {
    return newError('wrong number of arguments. got=%s, want=1|2|3', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ) {
    return newError(
      'arguments to `array_slice` must be ARRAY,[INTEGER],[INTEGER], got %s,%s,%s',
      args[0].Type()
    );
  }

  if ((args[1] && args[1].Type() !== INTEGER_OBJ) || (args[2] && args[2].Type() !== INTEGER_OBJ)) {
    return newError(
      'arguments to `array_slice` must be ARRAY,[INTEGER],[INTEGER], got %s,%s,%s',
      args[0].Type(),
      args[1] ? args[1].Type() : null,
      args[1] ? args[2].Type() : null
    );
  }

  let arr = args[0] as OArray;
  let arg2 = parseInt(args[1].Inspect());
  let arg3 = parseInt(args[2].Inspect());

  return new OArray(arr.Elements.slice(arg2, arg3));
});
