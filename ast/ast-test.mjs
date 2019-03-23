import { ASTProgram, LetStatement, Identifier } from './ast.mjs';
import Token from '../token/token';

export function TestAst(t) {
  TestString(t);
}

export function TestString(t) {
  let program = new ASTProgram();
  program.Statements = [
    new LetStatement(
      new Token(Token.LET, 'let'),
      new Identifier(new Token(Token.IDENT, 'myVar'), 'myVar'),
      new Identifier(new Token(Token.IDENT, 'anotherVar'), 'anotherVar')
    ),
  ];

  t.Assert(
    program.String() === 'let myVar = anotherVar;',
    'program.String() wrong. got=%s',
    program.String()
  );
}
