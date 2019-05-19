import OObject, { Builtin, OInteger } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// date_now() => 1557649110366
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length > 1) {
    return newError('wrong number of arguments. got=%s, want=1 or 0', args.length);
  }

  return new OInteger(Date.now());
});
