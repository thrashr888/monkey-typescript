import OObject, { Builtin, OInteger, OFloat, INTEGER_OBJ, FLOAT_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// returns a pow value for an int or float
// math_pow(15, 15)
// math_pow(0.001, 12)
// math_pow(2, 2.1)
// math_pow(1.1, 1.1)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== INTEGER_OBJ && args[0].Type() !== FLOAT_OBJ) {
    return newError('argument to `math_pow` must be INTEGER or FLOAT, got %s', args[0].Type());
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();

  let res = Math.pow(parseFloat(arg1), parseFloat(arg2));

  if (numIsFloat(res)) {
    return new OFloat(res);
  }

  return new OInteger(res);
});

function numIsFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}
