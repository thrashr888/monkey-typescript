import OObject, { Builtin, OString } from '../../object/object';
import Eval, { newError, NULL } from '../evaluator';
import Environment from '../../object/environment';
import Lexer from '../../lexer/lexer';
import Parser from '../../parser/parser';

// eval("1+1")
// let a = 1; eval("let b = a + 2; b"); b + 3 => 6
export default new Builtin(function(env: Environment, ...args: OObject[]): OObject {
  if (args.length !== 1) {
    return newError('wrong number of arguments. got=%s, want=1', args.length);
  }

  let l = new Lexer(args[0].Inspect());
  let p = new Parser(l);
  let program = p.ParseProgram();

  let evaluated = Eval(program, env);

  if (evaluated) return new OString(evaluated.Inspect());

  return NULL;
});
