import OObject, {
  ARRAY_OBJ,
  Builtin,
  FUNCTION_OBJ,
  OArray,
  OFunction,
  OInteger,
  ONull,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';
import { applyFunction } from '../evaluator';

// [1, 2, 3, 4].map(function(value: number, index: number, array: number[]) {
//   return value * 2;
// });

// map items in an array
// array_map([3, 2, 1, 4], function(value){ value * 2 }) => [6, 4, 2, 8]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ && args[1].Type() !== FUNCTION_OBJ) {
    return newError(
      'arguments to `array_map` must be ARRAY,[FUNCTION], got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arr = args[0] as OArray;
  let arg2 = args[1] as OFunction;

  function mapOArray(a: OArray, fn: OFunction): OObject[] {
    return a.Elements.map(function(value: OObject, index: number, arr: OObject[]): OObject {
      let args = [value, new OInteger(index), new OArray(arr)];
      let ret = applyFunction(env, fn, args);
      return ret ? ret : new ONull();
    });
  }

  return new OArray(mapOArray(arr, arg2));
});
