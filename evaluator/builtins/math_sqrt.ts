import OObject, { Builtin, OInteger, OFloat, INTEGER_OBJ, FLOAT_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// returns a sqrt value for an int or float
// math_sqrt(15)
// math_sqrt(-15)
// math_sqrt(0.001)
// math_sqrt(-0.001)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== INTEGER_OBJ && args[0].Type() !== FLOAT_OBJ) {
    return newError('argument to `math_sqrt` must be INTEGER or FLOAT, got %s', args[0].Type());
  }

  let arg = args[0].Inspect();

  if (strIsFloat(arg)) {
    let res = Math.sqrt(parseFloat(arg));
    return new OFloat(res);
  }

  let res = Math.sqrt(parseInt(arg));
  if (numIsFloat(res)) {
    return new OFloat(res);
  }

  return new OInteger(res);
});

function strIsFloat(n: string): boolean {
  let val = parseFloat(n);
  return !isNaN(val) && n.indexOf('.') !== -1;
}

function numIsFloat(n: number) {
  return Number(n) === n && n % 1 !== 0;
}
