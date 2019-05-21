import OObject, { Builtin, ARRAY_OBJ, INTEGER_OBJ, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// flatten an array
// array_flat([1, [2, [3, 4, [5, 6]], 7], 8], 2) => [1, 2, 3, 4, [5, 6], 7, 8]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length > 3) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ) {
    return newError('arguments to `array_flat` must be ARRAY,[INTEGER], got %s,%s', args[0].Type());
  }

  if (args[1] && args[1].Type() !== INTEGER_OBJ) {
    return newError(
      'arguments to `array_flat` must be ARRAY,[INTEGER], got %s,%s',
      args[0].Type(),
      args[1] ? args[1].Type() : null
    );
  }

  let arr = args[0] as OArray;
  let arg2 = args[1] ? parseInt(args[1].Inspect()) : 1;

  function flattenOArray(a: OArray, depth: number = 1): OObject[] {
    let out: OObject[] = [];
    for (let i = 0; i < a.Elements.length; i++) {
      let toAdd = a.Elements[i];
      if (toAdd instanceof OArray && depth > 0) {
        out.push(...flattenOArray(toAdd, depth - 1));
      } else {
        out.push(toAdd);
      }
    }
    return out;
  }

  return new OArray(flattenOArray(arr, arg2));
});
