import OObject, { Builtin, OInteger, OFloat, INTEGER_OBJ, FLOAT_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// returns a cos value for an int or float
// math_cos(15)
// math_cos(-15)
// math_cos(0.001)
// math_cos(-0.001)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== INTEGER_OBJ && args[0].Type() !== FLOAT_OBJ) {
    return newError('argument to `math_cos` must be INTEGER or FLOAT, got %s', args[0].Type());
  }

  let arg = args[0].Inspect();
  return new OFloat(Math.cos(parseFloat(arg)));
});
