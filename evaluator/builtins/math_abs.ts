import OObject, { Builtin, OInteger, OFloat, INTEGER_OBJ, FLOAT_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// returns a absolute value for an int or float
// math_abs(15)
// math_abs(-15)
// math_abs(0.001)
// math_abs(-0.001)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== INTEGER_OBJ && args[0].Type() !== FLOAT_OBJ) {
    return newError('argument to `math_abs` must be INTEGER or FLOAT, got %s', args[0].Type());
  }

  let arg = args[0].Inspect();

  if (isFloat(arg)) {
    return new OFloat(Math.abs(parseFloat(arg)));
  }

  return new OInteger(Math.abs(parseInt(arg)));
});

function isFloat(n: string): boolean {
  let val = parseFloat(n);
  return !isNaN(val) && n.indexOf('.') !== -1;
}
