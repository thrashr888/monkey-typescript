import OObject, { Builtin, ARRAY_OBJ, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// get the concat of a array
// array_concat(['a', 'b'], ['c', 'd']) => ['a', b', 'c', 'd']
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== ARRAY_OBJ || args[1].Type() !== ARRAY_OBJ) {
    return newError(
      'arguments to `array_concat` must be ARRAY,ARRAY, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0] as OArray;
  let arg2 = args[1] as OArray;
  return new OArray(arg1.Elements.concat(arg2.Elements));
});
