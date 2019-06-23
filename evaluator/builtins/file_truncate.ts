import OObject, { Builtin, STRING_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';
import fs from 'fs';

// empties a file
// file_truncate('README.md')
// file_truncate('example.monkey')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `file_truncate` must be STRING, got %s', args[0].Type());
  }

  let path = args[0].Inspect();

  try {
    fs.truncateSync(path);
  } catch (e) {
    return newError(e.message);
  }

  return NULL;
});
