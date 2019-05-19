import OObject, { Builtin, OString, STRING_OBJ } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// make a string lowercase
// string_lowercase('abc') => 'abc'
// string_lowercase('ABC') => 'abc'
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `string_lowercase` must be STRING, got %s', args[0].Type());
  }

  let arg = args[0].Inspect();
  return new OString(arg.toLowerCase());
});
