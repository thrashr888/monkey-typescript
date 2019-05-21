import OObject, { Builtin, ARRAY_OBJ, OArray, OString, OInteger, OFloat } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// return the max value in an array
// array_max([1,2,3]) => 3
// array_max(['a', 'b', 'c']) => 'c'
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ) {
    return newError('arguments to `array_max` must be ARRAY, got %s,', args[0].Type());
  }

  let arr = args[0] as OArray;

  let sorted = arr.Elements.sort(function(a: OObject, b: OObject): number {
    return a.Inspect() >= a.Inspect() ? 1 : -1;
  });

  let out = sorted[0];

  if (out instanceof OInteger) {
    return new OInteger(out.toValue());
  } else if (out instanceof OFloat) {
    return new OFloat(out.toValue());
  } else {
    // treat as string by default
    return new OString(out.Inspect());
  }
});
