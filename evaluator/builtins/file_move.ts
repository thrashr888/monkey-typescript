import OObject, { Builtin, STRING_OBJ } from '../../object/object';
import { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';
import fs from 'fs';

// moves contents of a file into another
// file_move('source.txt', 'destination.txt')
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 2) {
    return newError('wrong number of arguments. got=%s, want=2', args.length);
  }

  if (args[0].Type() !== STRING_OBJ && args[1].Type() !== STRING_OBJ) {
    return newError('argument to `file_move` must be STRING|STRING, got %s', args[0].Type(), args[1].Type());
  }

  let source = args[0].Inspect();
  let dest = args[0].Inspect();

  try {
    fs.renameSync(source, dest);
  } catch (e) {
    return newError(e.message);
  }

  return NULL;
});
