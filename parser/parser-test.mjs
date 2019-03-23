import { Lexer } from '../lexer/lexer';
import Parser from './parser';

export function TestParser(t) {
  TestLetStatements(t);
}

export function TestLetStatements(t) {
  let input = `
let x = 5;
let y = 10;
let foobar = 838383;
`;

  let l = new Lexer(input);
  let p = new Parser(l);
  let program = p.ParseProgram();

  t.Assert(program !== null, 'ParseProgram() returned nil');
  t.Assert(
    program.Statements.length === 3,
    'program.Statements does not contain 3 statements. got=%d',
    program.Statements.length
  );

  let tests = [['x'], ['y'], ['foobar']];

  for (let i in tests) {
    let tt = tests[i];
    let stmt = program.Statements[i];

    t.Assert(testLetStatement(t, stmt, tt[0]), 'testLetStatement failed');
  }
}

function testLetStatement(t, stmt, name) {
  t.Assert(stmt.TokenLiteral() === 'let', `s.TokenLiteral not 'let'. got=${stmt.TokenLiteral()}`);
  t.Assert(typeof stmt === 'object', `s not got=object. got=${typeof stmt}`);
  t.Assert(stmt.Name.Value === name, `stmt.Name.Value not ${name}. got=${stmt.Name.Value}`);
  t.Assert(
    stmt.Name.TokenLiteral() === name,
    `stmt.Name.TokenLiteral() not ${name}. got=${stmt.Name.TokenLiteral()}`
  );
  return true;
}
