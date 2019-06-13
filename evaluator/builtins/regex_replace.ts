import OObject, { Builtin, STRING_OBJ, OString } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// replaces parts of a string based on a regex
// regex_replace('dog', 'ferret', 'The quick brown fox jumps over the lazy dog. If the dog reacted, was it really lazy?', 'gi')
// regex_replace('xmas', 'Christmas', 'Twas the night before Xmas...', 'i')
// regex_replace('(\w+)\s(\w+)', '$2, $1', 'John Smith')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 3 && args.length !== 4) {
    return newError('wrong number of arguments. got=%s, want=3|4', args.length);
  }

  if (
    args[0].Type() !== STRING_OBJ ||
    args[1].Type() !== STRING_OBJ ||
    args[2].Type() !== STRING_OBJ ||
    (args[3] && args[3].Type() !== STRING_OBJ)
  ) {
    return newError(
      'arguments to `regex_replace` must be STRING,STRING,STRING,STRING|NULL got %s,%s,%s,%s',
      args[0].Type(),
      args[1].Type(),
      args[2].Type(),
      args[3] ? args[3].Type() : null
    );
  }

  let reg = args[0] as OString;
  let repl = args[1] as OString;
  let str = args[2] as OString;
  let flag = args[3] as OString;

  let regex = new RegExp(reg.toValue(), flag ? flag.toValue() : undefined);
  let newString = str.toValue().replace(regex, repl.toValue());

  return new OString(newString);
});
