import Environment from '../../object/environment';
import OObject, { Builtin, OArray, ARRAY_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';

// let a = [1, 2, 3]; rest(a); a => [2, 3]
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }
  if (args[0].Type() !== ARRAY_OBJ) {
    return newError('argument to `rest` must be ARRAY, got %s', args[0].Type());
  }

  let arr = args[0] as OArray;
  let length = arr.Elements.length;
  if (length > 0) {
    let newElements = arr.Elements.slice(1);
    return new OArray(newElements);
  }

  return NULL;
});
