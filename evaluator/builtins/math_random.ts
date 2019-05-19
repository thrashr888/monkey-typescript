import OObject, { Builtin, OInteger, OFloat, INTEGER_OBJ, FLOAT_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// returns a random int or float up to the given number
// math_random(15)
// math_random(0.001)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== INTEGER_OBJ && args[0].Type() !== FLOAT_OBJ) {
    return newError('argument to `number` must be INTEGER or FLOAT, got %s', args[0].Type());
  }

  let arg = args[0].Inspect();
  let max = 1;

  if (isFloat(arg)) {
    max = parseFloat(arg);
    return new OFloat(Math.random() * max);
  }

  max = parseInt(arg);
  return new OInteger(Math.floor(Math.random() * Math.floor(max)));
});

function isFloat(n: string): boolean {
  let val = parseFloat(n);
  return !isNaN(val) && n.indexOf('.') !== -1;
}
