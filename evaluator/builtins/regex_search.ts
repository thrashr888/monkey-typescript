import OObject, { Builtin, STRING_OBJ, OString, OInteger } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// returns index of regex match in a string
// regex_search('[a-z]', '123abc') => 3
// regex_search('[a-z]', 'abcDEF') => 0
// regex_search('[a-z]', '123') => -1
// regex_search('see (chapter \d+(\.\d)*)', 'For more information, see Chapter 3.4.5.1', 'i') => 22
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2 && args.length !== 3) {
    return newError('wrong number of arguments. got=%s, want=2|3', args.length);
  }

  if (
    args[0].Type() !== STRING_OBJ ||
    args[1].Type() !== STRING_OBJ ||
    (args[2] && args[2].Type() !== STRING_OBJ)
  ) {
    return newError(
      'arguments to `regex_search` must be STRING,STRING,STRING|NULL got %s,%s,%s',
      args[0].Type(),
      args[1].Type(),
      args[2] ? args[2].Type() : null
    );
  }

  let reg = args[0] as OString;
  let str = args[1] as OString;
  let flag = args[2] as OString;

  let regex = new RegExp(reg.toValue(), flag ? flag.toValue() : undefined);
  let matchIndex = str.toValue().search(regex);

  return new OInteger(matchIndex);
});
