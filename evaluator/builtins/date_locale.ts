import OObject, { Builtin, OString } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// date_locale('2010/30/12', 'en-US')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  let date = new Date();

  if (args[0]) {
    date = new Date(args[0].Inspect());
  }

  return new OString(date.toLocaleString(args[1].Inspect()));
});
