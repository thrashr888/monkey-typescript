import Environment from '../../object/environment';
import OObject, { Builtin } from '../../object/object';
import { NULL } from '../evaluator';

// sprint(1, 'ok', 'hello', 3.1459) => '1', 'ok', 'hello', '3.1459'
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  env.Logger.Log(args.map(a => a.Inspect()).join(' '));

  return NULL;
});
