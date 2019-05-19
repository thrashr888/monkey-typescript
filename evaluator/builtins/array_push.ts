import Environment from '../../object/environment';
import OObject, { Builtin, OArray, ARRAY_OBJ } from '../../object/object';
import { newError } from '../evaluator';

// let a = []; push(a, 1); a => [1]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }
  if (args[0].Type() !== ARRAY_OBJ) {
    return newError('argument to `push` must be ARRAY, got %s', args[0].Type());
  }

  let arr = args[0] as OArray;

  return new OArray([...arr.Elements, args[1]]);
});
