import OObject, {
  ARRAY_OBJ,
  BOOLEAN_OBJ,
  Builtin,
  FUNCTION_OBJ,
  OArray,
  OBoolean,
  OFunction,
  OInteger,
  ONull,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';
import { applyFunction } from '../evaluator';

// find item in an array
// array_find([-1, 2, 1, 5, 99, 4, 3, 2, 1], function(val){ val > 2 }) => 5
// array_find([5, 99, 4, 3, 2, 1], function(val, index){ index == 1 }) => 99
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ && args[1].Type() !== FUNCTION_OBJ) {
    return newError(
      'arguments to `array_find` must be ARRAY,[FUNCTION], got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arr = args[0] as OArray;
  let arg2 = args[1] as OFunction;

  function findOArray(a: OArray, fn: OObject): OObject | undefined {
    return a.Elements.find(function(value: OObject, index: number, arr: OObject[]): OObject {
      let args = [value, new OInteger(index), new OArray(arr)];
      let out = applyFunction(env, fn, args);
      if (out && out.Type() === BOOLEAN_OBJ) {
        // support boolean comparison "value > 3"
        return out.toValue();
      }
      return new OBoolean(false);
    });
  }

  let out = findOArray(arr, arg2);
  return out ? out : new ONull();
});
