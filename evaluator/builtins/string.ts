import OObject, { Builtin, OString } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// turns an object into a string
// string(3.1459)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  return new OString(args[0].Inspect());
});
