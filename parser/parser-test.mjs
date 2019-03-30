import Lexer from '../lexer/lexer';
import Parser from './parser';

export function TestParser(t) {
  TestLetStatements(t);
  TestReturnStatements(t);
  TestIdentifierExpression(t);
  TestIntegerExpression(t);
  TestParsingPrefixExpressions(t);
  TestParsingInfixExpressions(t);
  TestOperatorPrecedenceParsing(t);
  TestBooleanExpression(t);
  TestIfExpression(t);
  TestIfElseExpression(t);
  TestFunctionLiteralParsing(t);
  TestFunctionParameterParsing(t);
  TestCallExpressionParsing(t);
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
      'stmt not type ReturnStatement. got=%s',
      stmt.constructor.name
    );
    t.Assert(stmt.TokenLiteral() === 'return', 'stmt.TokenLiteral not "return". got=%s', stmt.TokenLiteral());
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
    'program.Statements[0] not type ExpressionStatement. got=%s',
    stmt.constructor.name
  );
  let ident = stmt.Expression;
  t.Assert(
    ident.constructor.name === 'Identifier',
    'exp not type Identifier. got=%s',
    ident.constructor.name
  );
  t.Assert(ident.Value === 'foobar', 'ident.Value is not "foobar". got=%s', ident.Value);
  t.Assert(
    ident.TokenLiteral() === 'foobar',
    'ident.TokenLiteral is not "foobar". got=%s',
    ident.TokenLiteral()
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
    'program.Statements[0] not type ExpressionStatement. got=%s',
    stmt.constructor.name
  );
  let literal = stmt.Expression;
  t.Assert(
    literal.constructor.name === 'IntegerLiteral',
    'exp not type IntegerLiteral. got=%s',
    literal.constructor.name
  );
  t.Assert(literal.Value === 5, 'literal.Value is not 5. got=%s', literal.Value);
  t.Assert(literal.TokenLiteral() === '5', 'literal.TokenLiteral is not "5". got=%s', literal.TokenLiteral());
}

export function TestParsingPrefixExpressions(t) {
  let prefixTests = [
    { input: '!5', operator: '!', value: 5 },
    { input: '-15', operator: '-', value: 15 },
    { input: '!true', operator: '!', value: true },
    { input: '!false', operator: '!', value: false },
  ];

  for (let i in prefixTests) {
    let tt = prefixTests[i];

    let l = new Lexer(tt.input);
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
      'program.Statements[0] not type ExpressionStatement. got=%s',
      stmt.constructor.name
    );
    let exp = stmt.Expression;
    t.Assert(
      exp.constructor.name === 'PrefixExpression',
      'stmt not type PrefixExpression. got=%s',
      exp.constructor.name
    );
    t.Assert(exp.Operator === tt.operator, 'exp.Operator is not %s. got=%s', tt.operator, exp.Operator);

    if (!testLiteralExpression(t, exp.Right, tt.value)) {
      return;
    }
  }
}

function testIntegerLiteral(t, il, value) {
  let integ = il;
  let ok;

  ok = il.constructor.name === 'IntegerLiteral';
  if (!ok) {
    t.Assert(ok, 'il not type IntegerLiteral. got=%s', il.constructor.name);
    return false;
  }

  ok = integ.Value === value;
  if (!ok) {
    t.Assert(ok, 'integ.Value is not %s. got=%s', value, integ.Value);
    return false;
  }

  ok = integ.TokenLiteral() === '' + value; // is a string
  if (!ok) {
    t.Assert(ok, 'integ.TokenLiteral is not "%s". got=%s', '' + value, integ.TokenLiteral());
    return false;
  }

  return true;
}

function TestParsingInfixExpressions(t) {
  let infixTests = [
    { input: '5 + 5;', leftValue: 5, operator: '+', rightValue: 5 },
    { input: '5 - 5;', leftValue: 5, operator: '-', rightValue: 5 },
    { input: '5 * 5;', leftValue: 5, operator: '*', rightValue: 5 },
    { input: '5 / 5;', leftValue: 5, operator: '/', rightValue: 5 },
    { input: '5 > 5;', leftValue: 5, operator: '>', rightValue: 5 },
    { input: '5 < 5;', leftValue: 5, operator: '<', rightValue: 5 },
    { input: '5 == 5;', leftValue: 5, operator: '==', rightValue: 5 },
    { input: '5 != 5;', leftValue: 5, operator: '!=', rightValue: 5 },
    { input: 'true == true', leftValue: true, operator: '==', rightValue: true },
    { input: 'true != false', leftValue: true, operator: '!=', rightValue: false },
    { input: 'false == false', leftValue: false, operator: '==', rightValue: false },
  ];
  for (let i in infixTests) {
    let tt = infixTests[i];

    let l = new Lexer(tt.input);
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
      'program.Statements[0] not type ExpressionStatement. got=%s',
      stmt.constructor.name
    );

    if (!testInfixExpression(t, stmt.Expression, tt.leftValue, tt.operator, tt.rightValue)) {
      return;
    }
  }
}

function TestOperatorPrecedenceParsing(t) {
  let tests = [
    ['-a * b', '((-a) * b)'],
    ['!-a', '(!(-a))'],
    ['a + b + c', '((a + b) + c)'],
    ['a + b - c', '((a + b) - c)'],
    ['a * b * c', '((a * b) * c)'],
    ['a * b / c', '((a * b) / c)'],
    ['a + b / c', '(a + (b / c))'],
    ['a + b * c + d / e - f', '(((a + (b * c)) + (d / e)) - f)'],
    ['3 + 4; -5 * 5', '(3 + 4)((-5) * 5)'],
    ['5 > 4 == 3 < 4', '((5 > 4) == (3 < 4))'],
    ['5 < 4 != 3 > 4', '((5 < 4) != (3 > 4))'],
    ['3 + 4 * 5 == 3 * 1 + 4 * 5', '((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))'],
    ['true', 'true'],
    ['false', 'false'],
    ['3 > 5 == false', '((3 > 5) == false)'],
    ['3 < 5 == true', '((3 < 5) == true)'],
    ['1 + (2 + 3) + 4', '((1 + (2 + 3)) + 4)'],
    ['(5 + 5) * 2', '((5 + 5) * 2)'],
    ['2 / (5 + 5)', '(2 / (5 + 5))'],
    ['(5 + 5) * 2 * (5 + 5)', '(((5 + 5) * 2) * (5 + 5))'],
    ['-(5 + 5)', '(-(5 + 5))'],
    ['!(true == true)', '(!(true == true))'],
    ['a + add(b * c) + d', '((a + add((b * c))) + d)'],
    ['add(a, b, 1, 2 * 3, 4 + 5, add(6, 7 * 8))', 'add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))'],
    ['add(a + b + c * d / f + g)', 'add((((a + b) + ((c * d) / f)) + g))'],
  ];
  for (let i in tests) {
    let tt = tests[i];

    let l = new Lexer(tt[0]);
    let p = new Parser(l);
    let program = p.ParseProgram();
    checkParserErrors(t, p);

    let actual = program.String();
    t.Assert(actual === tt[1], 'expected=%s got=%s', tt[1], actual);
  }
}

function testIdentifier(t, exp, value) {
  let ident = exp;
  let ok;

  ok = ident.constructor.name === 'Identifier';
  if (!ok) {
    t.Assert(ok, 'exp is not Identifier. got=%s', exp);
    return false;
  }

  ok = ident.Value === value;
  if (!ok) {
    t.Assert(ok, 'ident.Value is not %s. got=%s', value, ident.Value);
    return false;
  }

  ok = ident.TokenLiteral() === '' + value;
  if (!ok) {
    t.Assert(ok, 'ident.TokenLiteral is not %s. got=%s', value, ident.TokenLiteral());
    return false;
  }

  return true;
}

function testBooleanLiteral(t, exp, value) {
  let bo = exp;
  let ok;

  ok = bo.constructor.name === 'AstBoolean';
  if (!ok) {
    t.Assert(ok, 'exp is not AstBoolean. got=%s', exp);
    return false;
  }

  ok = bo.Value === value;
  if (!ok) {
    t.Assert(ok, 'bo.Value is not %s. got=%s', value, bo.Value);
    return false;
  }

  ok = bo.TokenLiteral() === '' + value;
  if (!ok) {
    t.Assert(ok, 'bo.TokenLiteral is not %s. got=%s', value, bo.TokenLiteral());
    return false;
  }

  return true;
}

function testLiteralExpression(t, exp, expected) {
  switch (expected.constructor.name) {
    case 'Number':
      return testIntegerLiteral(t, exp, expected);
    case 'String':
      return testIdentifier(t, exp, expected);
    case 'Boolean':
      return testBooleanLiteral(t, exp, expected);
    default:
      t.Errorf('type of exp not handled. got=%s', exp.constructor.name);
      return false;
  }
}

function testInfixExpression(t, exp, left, operator, right) {
  let opExp = exp;
  let ok;

  ok = opExp.constructor.name === 'InfixExpression';
  if (!ok) {
    t.Assert(ok, 'exp not InfixExpression. got=%s(%s)', opExp.constructor.name, opExp);
    return false;
  }

  if (!testLiteralExpression(t, opExp.Left, left)) {
    return false;
  }

  ok = opExp.Operator === operator;
  if (!ok) {
    t.Assert(ok, 'opExp.Operator is not %s. got=%s', operator, opExp.Operator);
    return false;
  }

  if (!testLiteralExpression(t, opExp.Right, right)) {
    return false;
  }

  return true;
}

export function TestBooleanExpression(t) {
  let tests = [['true', true], ['false', false]];
  for (let i in tests) {
    let tt = tests[i];

    let l = new Lexer(tt[0]);
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
      'program.Statements[0] not type ExpressionStatement. got=%s',
      stmt.constructor.name
    );

    let boolean = stmt.Expression;
    t.Assert(
      boolean.constructor.name === 'AstBoolean',
      'exp not type AstBoolean. got=%s',
      boolean.constructor.name
    );
    t.Assert(boolean.Value === tt[1], 'boolean.Value is not %s. got=%s', tt[1], boolean.Value);
  }
}

function TestIfExpression(t) {
  let input = 'if (x < y) { x }';

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
    'program.Statements[0] not type ExpressionStatement. got=%s',
    stmt.constructor.name
  );

  let exp = stmt.Expression;
  t.Assert(
    exp.constructor.name === 'IfExpression',
    'stmt.Expression is not type IfExpression. got=',
    exp.constructor.name
  );

  if (!testInfixExpression(t, exp.Condition, 'x', '<', 'y')) {
    return;
  }

  t.Assert(
    exp.Consequence.Statements.length === 1,
    'consequence is no 1 statements. got=%s',
    exp.Consequence.Statements.length
  );

  let consequence = exp.Consequence.Statements[0];
  t.Assert(
    consequence.constructor.name === 'ExpressionStatement',
    'Statements[0] is not ExpressionStatement. got=%s',
    consequence.constructor.name
  );

  if (!testIdentifier(t, consequence.Expression, 'x')) {
    return;
  }

  t.Assert(exp.Alternative === null, 'exp.Alternative.Statements was not null. got=%s', exp.Alternative);
}

function TestIfElseExpression(t) {
  let input = 'if (x < y) { x } else { y }';

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
    'program.Statements[0] not type ExpressionStatement. got=%s',
    stmt.constructor.name
  );

  let exp = stmt.Expression;
  t.Assert(
    exp.constructor.name === 'IfExpression',
    'stmt.Expression is not type IfExpression. got=',
    exp.constructor.name
  );

  if (!testInfixExpression(t, exp.Condition, 'x', '<', 'y')) {
    return;
  }

  t.Assert(
    exp.Consequence.Statements.length === 1,
    'consequence is not 1 statements. got=%s',
    exp.Consequence.Statements.length
  );

  let consequence = exp.Consequence.Statements[0];
  t.Assert(
    consequence.constructor.name === 'ExpressionStatement',
    'Statements[0] is not ExpressionStatement. got=%s',
    consequence.constructor.name
  );

  if (!testIdentifier(t, consequence.Expression, 'x')) {
    return;
  }

  t.Assert(
    exp.Alternative.Statements.length === 1,
    'exp.Alternative.Statements does not contain 1 statements. got=%s',
    exp.Alternative.Statements.length
  );

  let alternative = exp.Alternative.Statements[0];
  t.Assert(
    alternative.constructor.name === 'ExpressionStatement',
    'Statements[0] is not ExpressionStatement. got=%s',
    alternative.constructor.name
  );

  if (!testIdentifier(t, alternative.Expression, 'y')) {
    return;
  }
}

function TestFunctionLiteralParsing(t) {
  let input = 'fn(x, y) { x + y; }';

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
    'program.Statements[0] not type ExpressionStatement. got=%s',
    stmt.constructor.name
  );

  let func = stmt.Expression;
  t.Assert(
    func.constructor.name === 'FunctionLiteral',
    'stmt.Expression is not type FunctionLiteral. got=',
    func.constructor.name
  );
  t.Assert(
    func.Parameters.length === 2,
    'function literal parameters wrong. want 2. got=',
    func.Parameters.length
  );

  testLiteralExpression(t, func.Parameters[0], 'x');
  testLiteralExpression(t, func.Parameters[1], 'y');

  t.Assert(
    func.Body.Statements.length === 1,
    'function.Body.Statements has not 1 statements. got=',
    func.Body.Statements.length
  );

  let bodyStmt = func.Body.Statements[0];
  t.Assert(
    bodyStmt.constructor.name === 'ExpressionStatement',
    'function body statement is not type ExpressionStatement. got=',
    bodyStmt.constructor.name
  );

  testInfixExpression(t, bodyStmt.Expression, 'x', '+', 'y');
}

function TestFunctionParameterParsing(t) {
  let tests = [
    { input: 'fn() {};', expectedParams: [] },
    { input: 'fn(x) {};', expectedParams: ['x'] },
    { input: 'fn(x, y, z) {};', expectedParams: ['x', 'y', 'z'] },
  ];
  for (let i in tests) {
    let tt = tests[i];

    let l = new Lexer(tt.input);
    let p = new Parser(l);
    let program = p.ParseProgram();
    checkParserErrors(t, p);

    let stmt = program.Statements[0];
    let func = stmt.Expression;

    t.Assert(
      func.Parameters.length === tt.expectedParams.length,
      'func.Parameters does not contain %d statements. got=%d',
      tt.expectedParams.length,
      func.Parameters.length
    );

    tt.expectedParams.forEach((ident, i) => {
      testLiteralExpression(t, func.Parameters[i], ident);
    });
  }
}

function TestCallExpressionParsing(t) {
  let input = 'add(1, 2 * 3, 4 + 5)';

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
    'program.Statements[0] not type ExpressionStatement. got=%s',
    stmt.constructor.name
  );

  let exp = stmt.Expression;
  t.Assert(
    exp.constructor.name === 'CallExpression',
    'stmt.Expression is not type CallExpression. got=',
    exp.constructor.name
  );

  if (!testIdentifier(t, exp.Function, 'add')) {
    return;
  }

  t.Assert(exp.Arguments.length === 3, 'wrong length of arguments. want 3. got=', exp.Arguments.length);

  testLiteralExpression(t, exp.Arguments[0], 1);
  testInfixExpression(t, exp.Arguments[1], 2, '*', 3);
  testInfixExpression(t, exp.Arguments[2], 4, '+', 5);
}
