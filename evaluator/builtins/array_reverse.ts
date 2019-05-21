import OObject, { Builtin, ARRAY_OBJ, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// reverse an array
// array_reverse([1,2,3]) => [3,2,1]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }
  if (args[0].Type() !== ARRAY_OBJ) {
    return newError('argument to `array_reverse` must be ARRAY, got %s', args[0].Type());
  }

  let arr = args[0] as OArray;
  return new OArray(arr.Elements.reverse());
});
