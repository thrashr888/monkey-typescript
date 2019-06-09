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

// [1, 2, 3, 4].reduce(function(
//   previousValue: number,
//   currentValue: number,
//   currentIndex: number,
//   arr: number[]
// ) {
//   return previousValue + currentValue;
// });

// reduce items in an array
// array_reduce([3, 2, 1, 4, 5], function(previousValue, currentValue){ previousValue + currentValue }) => 15
// array_reduce([{'a':1}, {'a':2}, {'a':3}], function(previousValue, currentValue){ previousValue['a'] + currentValue['a'] }) => 6

// array_reduce([{'a':1}, {'a':2}, {'a':3}], function(previousValue, currentValue, i, arr){ previousValue['a'] + arr[i]['a'] })
// array_reduce([{'a':1}, {'a':2}, {'a':3}], function(previousValue, currentValue, i, arr){ i })
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ && args[1].Type() !== FUNCTION_OBJ) {
    return newError(
      'arguments to `array_reduce` must be ARRAY,[FUNCTION], got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arr = args[0] as OArray;
  let arg2 = args[1] as OFunction;

  function reduceOArray(a: OArray, fn: OFunction): OObject {
    return a.Elements.reduce(function(
      previousValue: OObject,
      currentValue: OObject,
      currentIndex: number,
      arr: OObject[]
    ): OObject {
      let args = [previousValue, currentValue, new OInteger(currentIndex), new OArray(arr)];
      let ret = applyFunction(env, fn, args);
      return ret ? ret : new ONull();
    });
  }

  let out = reduceOArray(arr, arg2);
  return out ? out : new ONull();
});
