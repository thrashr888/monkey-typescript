import OObject, { Builtin, STRING_OBJ, OString, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// finds regex matches in a string
// regex_match('[a-z]', 'abc') => ['a']
// regex_match('[a-z]', 'abc', 'g') => ['a','b','c']
// regex_match('[a-z]', 'abcDEF', 'gi') => ['a','b','c','D','E','F']
// regex_match('abc([A-Z]*)', 'abcDEF') => ['abcDEF','DEF']
// regex_match('see (chapter \d+(\.\d)*)', 'For more information, see Chapter 3.4.5.1', 'i')
// => ['see Chapter 3.4.5.1', 'Chapter 3.4.5.1', '.1']
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
      'arguments to `regex_match` must be STRING,STRING|NULL, got %s,%s,%s',
      args[0].Type(),
      args[1].Type(),
      args[2] ? args[2].Type() : null
    );
  }

  let reg = args[0] as OString;
  let str = args[1] as OString;
  let flag = args[2] as OString;

  let regex = new RegExp(reg.toValue(), flag ? flag.toValue() : undefined);

  let matches = str.toValue().match(regex);

  if (!matches) return new OArray([]);

  let out = matches.map(function(m) {
    return new OString(m);
  });

  return new OArray(out);
});
