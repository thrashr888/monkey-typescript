import OObject, { Builtin, STRING_OBJ, OBoolean, OString } from '../../object/object';
import { newError } from '../evaluator';
import Environment from '../../object/environment';
import fs from 'fs';

// gets the real path of a given path (resolves `.` and `..`)
// file_realpath('./tmp')
// file_realpath('../sibling/b')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  if (args[0].Type() !== STRING_OBJ) {
    return newError('argument to `file_realpath` must be STRING, got %s', args[0].Type());
  }

  let path = args[0].Inspect();

  return new OString(fs.realpathSync(path, { encoding: 'utf8' }));
});
