import OObject, { Builtin, OString } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// date_utc('2010/30/12')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length > 1) {
    return newError('wrong number of arguments. got=%s, want=1 or 0', args.length);
  }

  let date = new Date();
  if (args[0]) {
    date = new Date(args[0].Inspect());
  }

  return new OString(date.toUTCString());
});