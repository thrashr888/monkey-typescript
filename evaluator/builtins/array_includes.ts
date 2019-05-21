import OObject, {
  Builtin,
  OBoolean,
  OArray,
  STRING_OBJ,
  ARRAY_OBJ,
  INTEGER_OBJ,
  FLOAT_OBJ,
} from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// checks if an array includes another value
// array_includes([1], 1) => true
// array_includes([1], '1') => false
// array_includes([1], 2) => false
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (
    args[0].Type() !== ARRAY_OBJ ||
    (args[1].Type() !== STRING_OBJ && args[1].Type() !== INTEGER_OBJ && args[1].Type() !== FLOAT_OBJ)
  ) {
    return newError(
      'arguments to `string_replace` must be ARRAY,STRING|INTEGER|FLOAT got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let arg1 = args[0];
  let arg2 = args[1].toValue();
  if (arg1 instanceof OArray) {
    return new OBoolean(arg1.Elements.includes(arg2));
  }

  return newError('argument to `array_includes` not supported, got %s', arg1.Type());
});
