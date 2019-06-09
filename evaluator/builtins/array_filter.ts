import OObject, {
  ARRAY_OBJ,
  BOOLEAN_OBJ,
  Builtin,
  FUNCTION_OBJ,
  OArray,
  OBoolean,
  OFunction,
  OInteger,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';
import { applyFunction } from '../evaluator';

// [1,2,3,4].filter(function(value: number, index: number, array: number[]){
//   return value > 2
// })

// filter items in an array
// array_filter([3, 2, 1, 4], function(value){ value > 2 }) => [3, 4]
// array_filter([3, 2, 1, 4], function(value, index){ index > 1 }) => [1, 4]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ && args[1].Type() !== FUNCTION_OBJ) {
    return newError(
      'arguments to `array_filter` must be ARRAY,[FUNCTION], got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arr = args[0] as OArray;
  let arg2 = args[1] as OFunction;

  function filterOArray(a: OArray, fn: OFunction): OObject[] {
    return a.Elements.filter(function(value: OObject, index: number, arr: OObject[]): OObject {
      let args = [value, new OInteger(index), new OArray(arr)];
      let out = applyFunction(env, fn, args);
      if (out && out.Type() === BOOLEAN_OBJ) {
        // support boolean comparison "value > 3"
        return out.toValue();
      }
      return new OBoolean(false);
    });
  }

  return new OArray(filterOArray(arr, arg2));
});
