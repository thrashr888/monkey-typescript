import OObject, { Builtin, STRING_OBJ, OString, OBoolean } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// tests a string with a regex
// regex_test('[a-z]', 'abc') => true
// regex_test('[a-z]', '123') => false
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== STRING_OBJ || args[1].Type() !== STRING_OBJ) {
    return newError(
      'arguments to `regex_test` must be STRING,STRING, got %s,%s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let reg = args[0] as OString;
  let str = args[1] as OString;

  let regex = new RegExp(reg.toValue());
  if (regex.test(str.toValue())) {
    return new OBoolean(true);
  }

  return new OBoolean(false);
});
