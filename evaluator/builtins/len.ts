import Environment from '../../object/environment';
import OObject, { Builtin, OString, OInteger, OArray } from '../../object/object';
import { newError } from '../evaluator';

// let a = [1, 2, 3]; len(a) => 3
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  let arg = args[0];
  if (arg instanceof OArray) {
    return new OInteger(arg.Elements.length);
  } else if (arg instanceof OString) {
    return new OInteger(arg.Value.length);
  }

  return newError('argument to `len` not supported, got %s', arg.Type());
});
