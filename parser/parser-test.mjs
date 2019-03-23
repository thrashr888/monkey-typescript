import Lexer from '../lexer/lexer';
import Parser from './parser';

export function TestParser(t) {
  TestLetStatements(t);
  TestReturnStatements(t);
  TestIdentifierExpression(t);
  TestIntegerExpression(t);
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
  checkParserErrors(t, p);

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

function checkParserErrors(t, p) {
  let errors = p.Errors();
  if (errors.length === 0) return;

  t.Errorf('parser has %d errors', errors.length);
  for (let err of errors) {
    t.Errorf('parser error: %s', err);
  }

  t.FailNow();
}

function testLetStatement(t, stmt, name) {
  t.Assert(stmt.TokenLiteral() === 'let', `s.TokenLiteral not 'let'. got=${stmt.TokenLiteral()}`);
  t.Assert(stmt.constructor.name === 'LetStatement', `s not got=LetStatement. got=${stmt.constructor.name}`);
  t.Assert(stmt.Name.Value === name, `stmt.Name.Value not ${name}. got=${stmt.Name.Value}`);
  t.Assert(
    stmt.Name.TokenLiteral() === name,
    `stmt.Name.TokenLiteral() not ${name}. got=${stmt.Name.TokenLiteral()}`
  );
  return true;
}

export function TestReturnStatements(t) {
  let input = `
return 5;
return 10;
return 838383;
`;

  let l = new Lexer(input);
  let p = new Parser(l);
  let program = p.ParseProgram();
  checkParserErrors(t, p);

  t.Assert(program !== null, 'ParseProgram() returned nil');
  t.Assert(
    program.Statements.length === 3,
    'program.Statements does not contain 3 statements. got=%d',
    program.Statements.length
  );

  for (let stmt of program.Statements) {
    t.Assert(
      stmt.constructor.name === 'ReturnStatement',
      `stmt not type ReturnStatement. got=${stmt.constructor.name}`
    );
    t.Assert(stmt.TokenLiteral() === 'return', `stmt.TokenLiteral not 'return'. got=${stmt.TokenLiteral()}`);
  }
}

export function TestIdentifierExpression(t) {
  let input = 'foobar';

  let l = new Lexer(input);
  let p = new Parser(l);
  let program = p.ParseProgram();
  checkParserErrors(t, p);

  t.Assert(
    program.Statements.length === 1,
    'program.Statements does not contain 1 statements. got=%d',
    program.Statements.length
  );
  let stmt = program.Statements[0];
  t.Assert(
    stmt.constructor.name === 'ExpressionStatement',
    `program.Statements[0] not type ExpressionStatement. got=${stmt.constructor.name}`
  );
  let ident = stmt.Expression;
  t.Assert(ident.constructor.name === 'Identifier', `exp not type Identifier. got=${ident.constructor.name}`);
  t.Assert(ident.Value === 'foobar', `ident.Value is not 'foobar'. got=${ident.Value}`);
  t.Assert(
    ident.TokenLiteral() === 'foobar',
    `ident.TokenLiteral is not 'foobar'. got=${ident.TokenLiteral()}`
  );
}

export function TestIntegerExpression(t) {
  let input = '5';

  let l = new Lexer(input);
  let p = new Parser(l);
  let program = p.ParseProgram();
  checkParserErrors(t, p);

  t.Assert(
    program.Statements.length === 1,
    'program.Statements does not contain 1 statements. got=%d',
    program.Statements.length
  );
  let stmt = program.Statements[0];
  t.Assert(
    stmt.constructor.name === 'ExpressionStatement',
    `program.Statements[0] not type ExpressionStatement. got=${stmt.constructor.name}`
  );
  let literal = stmt.Expression;
  t.Assert(
    literal.constructor.name === 'IntegerLiteral',
    `exp not type IntegerLiteral. got=${literal.constructor.name}`
  );
  t.Assert(literal.Value === 5, `literal.Value is not 5. got=${literal.Value}`);
  t.Assert(literal.TokenLiteral() === '5', `literal.TokenLiteral is not '5'. got=${literal.TokenLiteral()}`);
}
