import Environment from '../../object/environment';
import OObject, { Builtin, STRING_OBJ, OString } from '../../object/object';
import { NULL, newError } from '../evaluator';

import { sprintf } from 'sprintf-js';

// string_format("ok: %s, 1: %d, pi: %f", 'ok', 1, 3.1459) => ok: ok, 1: 1, pi: 3.1459
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length === 0) {
    return newError('wrong number of arguments. got=%s, want=>0', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('arguments to `string_format` must be STRING,[...ANY] got %s', args[0].Type());
  }

  let arg1 = args.shift() as OObject;
  let format = arg1.Inspect();

  let out = sprintf(format, ...args.map(a => a.toValue()));

  return new OString(out);
});
