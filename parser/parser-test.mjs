import { Lexer } from '../lexer/lexer';
import Parser from './parser';

export function TestAll(t) {
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

  console.assert(program !== null, 'ParseProgram() returned nil');
  console.assert(
    program.Statements.length === 3,
    'program.Statements does not contain 3 statements. got=%d',
    program.Statements.length
  );

  let tests = [['x'], ['y'], ['foobar']];

  for (let i in tests) {
    let tt = tests[i];
    let stmt = program.Statements[i];

    console.assert(testLetStatement(t, stmt, tt[0]), 'testLetStatement failed');
  }
}

function testLetStatement(t, stmt, name) {
  console.assert(stmt.TokenLiteral() === 'let', `s.TokenLiteral not 'let'. got=${stmt.TokenLiteral()}`);
  console.assert(typeof stmt === 'object', `s not got=object. got=${typeof stmt}`);
  console.assert(stmt.Name.Value === name, `stmt.Name.Value not ${name}. got=${stmt.Name.Value}`);
  console.assert(
    stmt.Name.TokenLiteral() === name,
    `stmt.Name.TokenLiteral() not ${name}. got=${stmt.Name.TokenLiteral()}`
  );
  return true;
}
