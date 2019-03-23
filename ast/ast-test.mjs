import { ASTProgram, LetStatement, Identifier } from './ast';
import { Token, Types } from '../token/token';

export function TestAst(t) {
  TestString(t);
}

export function TestString(t) {
  let program = new ASTProgram();
  program.Statements = [
    new LetStatement(
      new Token(Types.LET, 'let'),
      new Identifier(new Token(Types.IDENT, 'myVar'), 'myVar'),
      new Identifier(new Token(Types.IDENT, 'anotherVar'), 'anotherVar')
    ),
  ];

  t.Assert(
    program.String() === 'let myVar = anotherVar;',
    'program.String() wrong. got=%s',
    program.String()
  );
}
