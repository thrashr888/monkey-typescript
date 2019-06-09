import OObject, {
  ARRAY_OBJ,
  BOOLEAN_OBJ,
  Builtin,
  FUNCTION_OBJ,
  INTEGER_OBJ,
  OArray,
  OFunction,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';
import { applyFunction } from '../evaluator';

// sort an array
// array_sort([3, 2, 1], function(a, b){ a > b }) => [1, 2, 3]
// array_sort(['d', 'a', 'c', 'b'], function(a, b){ a > b }) => ['a', 'b', 'c', 'd']
// let sorter  = function(a, b){ if(a>b){1}else{-1} }; array_sort([3, 2, 1, 4], sorter) => [1, 2, 3, 4]
// let reverser  = function(a, b){ -1 }; array_sort([3, 2, 1, 4], reverser) => [1, 2, 3, 4]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ && args[1].Type() !== FUNCTION_OBJ) {
    return newError(
      'arguments to `array_sort` must be ARRAY,[FUNCTION], got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arr = args[0] as OArray;
  let arg2 = args[1] as OFunction;

  function sortOArray(a: OArray, fn: OFunction): OObject[] {
    return a.Elements.sort(function(a: OObject, b: OObject): number {
      let out = applyFunction(env, fn, [a, b]);
      let dir = out ? out.toValue() : 0;
      if (out && out.Type() === INTEGER_OBJ) {
        // support number comparison "a > b ? 1 : -1"
        return dir;
      }
      if (out && out.Type() === BOOLEAN_OBJ) {
        // support boolean comparison "a > b"
        return dir ? 1 : -1;
      }
      return 0;
    });
  }

  return new OArray(sortOArray(arr, arg2));
});
