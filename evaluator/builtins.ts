import OObject, { Builtin, OString, OInteger, OArray, ARRAY_OBJ } from '../object/object';
import { newError, NULL } from './evaluator';

var builtins: { [s: string]: Builtin } = {
  len: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }

    let arg = args[0];
    if (arg instanceof OArray) {
      return new OInteger(arg.Elements.length);
    } else if (arg instanceof OString) {
      return new OInteger(arg.Value.length);
    }

    return newError('argument to `len` not supported, got %s', arg.Type());
  }),
  first: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `first` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;
    let length = arr.Elements.length;
    if (length > 0) {
      return arr.Elements[0];
    }

    return NULL;
  }),
  last: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `last` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;
    let length = arr.Elements.length;
    if (length > 0) {
      return arr.Elements[length - 1];
    }

    return NULL;
  }),
  rest: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 1) {
      return newError('wrong number of arguments. got=%s, want=1', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `rest` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;
    let length = arr.Elements.length;
    if (length > 0) {
      let newElements = arr.Elements.slice(1);
      return new OArray(newElements);
    }

    return NULL;
  }),
  push: new Builtin(function(...args: OObject[]): OObject {
    if (args.length !== 2) {
      return newError('wrong number of arguments. got=%s, want=2', args.length);
    }
    if (args[0].Type() !== ARRAY_OBJ) {
      return newError('argument to `last` must be ARRAY, got %s', args[0].Type());
    }

    let arr = args[0] as OArray;

    return new OArray([...arr.Elements, args[1]]);
  }),
  puts: new Builtin(function(...args: OObject[]): OObject {
    for (let arg of args) {
      console.log(arg.Inspect());
    }

    return NULL;
  }),
};

export default builtins;
