import OObject, { Builtin, OString } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// locale_date('en-US')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  let date = new Date();
  try {
    let str = date.toLocaleString(args[0].Inspect());
    return new OString(str);
  } catch (err) {
    return newError('error parsing date', err.message);
  }
});
