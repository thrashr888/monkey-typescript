import OObject, { Builtin, OInteger, STRING_OBJ, OFloat } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// turns a string into a float or integer
// number('3.1459')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `number` must be STRING, got %s', args[0].Type());
  }

  let arg = args[0].Inspect();
  if (isFloat(arg)) {
    let number = parseFloat(arg);
    return new OFloat(number);
  }

  let number = parseInt(arg);
  return new OInteger(number);
});

function isFloat(n: string): boolean {
  let val = parseFloat(n);
  return !isNaN(val) && n.indexOf('.') !== -1;
}
