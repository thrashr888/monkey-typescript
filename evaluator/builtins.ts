import OObject, { Builtin, OString, OInteger } from '../object/object';
import { newError } from './evaluator';

var builtins: { [s: string]: Builtin } = {
  len: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    let arg = args[0];
    if (arg instanceof OString) {
      return new OInteger(arg.Value.length);
    }

    return newError('argument to `len` not supported, got %s', args[0].Type());
  }),
};

export default builtins;
