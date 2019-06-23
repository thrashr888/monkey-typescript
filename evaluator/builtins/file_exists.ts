import OObject, { Builtin, STRING_OBJ, OBoolean } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';
import fs from 'fs';

// checks if a file exists
// file_exists('README.md')
// file_exists('example.monkey')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `file_exists` must be STRING, got %s', args[0].Type());
  }

  let path = args[0].Inspect();

  return new OBoolean(fs.existsSync(path));
});
