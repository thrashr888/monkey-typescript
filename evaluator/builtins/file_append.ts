import OObject, { Builtin, STRING_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';
import fs from 'fs';

// appends a string to a file
// file_append('temp.txt', 'testing file appends\n')
// file_append('temp.txt', 'testing file appends 2\n')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== STRING_OBJ && args[1].Type() !== STRING_OBJ) {
    return newError(
      'argument to `file_append` must be STRING,STRING, got %s',
      args[0].Type(),
      args[1].Type()
    );
  }

  let path = args[0].Inspect();
  let data = args[1].Inspect();

  fs.writeFileSync(path, data, 'utf8');
  return NULL;
});
