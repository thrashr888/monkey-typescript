import OObject, { Builtin, STRING_OBJ, OString, OArray } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';

// splits a string by regex
// regex_split('(\d)', 'Hello 1 word. Sentence number 2.') => ['Hello ','1',' word. Sentence number ','2','.']
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
      'arguments to `regex_split` must be STRING,STRING,STRING|NULL got %s,%s,%s',
      args[0].Type(),
      args[1].Type(),
      args[2] ? args[2].Type() : null
    );
  }

  let reg = args[0] as OString;
  let str = args[1] as OString;
  let flag = args[2] as OString;

  let regex = new RegExp(reg.toValue(), flag ? flag.toValue() : undefined);

  let matches = str.toValue().split(regex);

  if (!matches) return new OArray([]);

  let out = matches.map(function(m) {
    return new OString(m);
  });

  return new OArray(out);
});
