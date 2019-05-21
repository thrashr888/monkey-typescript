import Environment from '../../object/environment';
import OObject, { Builtin, OArray, ARRAY_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';

// let a = [1,2]; array_shift(a) => 2
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }
  if (args[0].Type() !== ARRAY_OBJ) {
    return newError('argument to `array_shift` must be ARRAY, got %s', args[0].Type());
  }

  let arr = args[0] as OArray;
  let ret = arr.Elements.shift();

  if (ret) return ret;

  return NULL;
});
