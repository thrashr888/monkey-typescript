import OObject, { Builtin, STRING_OBJ, BOOLEAN_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';
import fs from 'fs';

// makes a directory
// file_mkdir('tmp')
// file_mkdir('a/b/c', true)
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length === 1 || args.length === 2) {
    return newError('wrong number of arguments. got=%s, want=1|2', args.length);
  }

  if (args[0].Type() !== STRING_OBJ && (args[1] && args[1].Type() !== BOOLEAN_OBJ)) {
    return newError(
      'argument to `file_mkdir` must be STRING|BOOLEAN?, got %s',
      args[0].Type(),
      args[1] ? args[1].Type() : null
    );
  }

  let path = args[0].Inspect();
  let recursive = args[1].toValue() as boolean;

  try {
    fs.mkdirSync(path, { recursive });
  } catch (e) {
    return newError(e.message);
  }

  return NULL;
});
