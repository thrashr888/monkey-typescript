import OObject, { Builtin, STRING_OBJ, OInteger } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// checks if a string index_of another string
// string_index_of('abc', 'b') => 1
// string_index_of('abc', 'a') => 0
// string_index_of('abc', 'd') => -1
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `string_index_of` must be STRING, got %s', args[0].Type());
  }
  if (args[1].Type() !== STRING_OBJ) {
    return newError('argument to `string_index_of` must be STRING, got %s', args[1].Type());
  }

  let arg1 = args[0].Inspect();
  let arg2 = args[1].Inspect();

  return new OInteger(arg1.indexOf(arg2));
});
