import Lexer from '../lexer/lexer';
import Parser from './parser';
import Test from '../test';
import {
  AstBoolean,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionLiteral,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  Statement,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
  HashLiteral,
} from '../ast/ast';

export function TestParser(t: Test) {
  console.log('║  ├ TestLetStatements');
  TestLetStatements(t);
  console.log('║  ├ TestReturnStatements');
  TestReturnStatements(t);
  console.log('║  ├ TestIdentifierExpression');
  TestIdentifierExpression(t);
  console.log('║  ├ TestIntegerExpression');
  TestIntegerExpression(t);
  console.log('║  ├ TestStringLiteralExpression');
  TestStringLiteralExpression(t);
  console.log('║  ├ TestParsingPrefixExpressions');
  TestParsingPrefixExpressions(t);
  console.log('║  ├ TestParsingInfixExpressions');
  TestParsingInfixExpressions(t);
  console.log('║  ├ TestOperatorPrecedenceParsing');
  TestOperatorPrecedenceParsing(t);
  console.log('║  ├ TestBooleanExpression');
  TestBooleanExpression(t);
  console.log('║  ├ TestIfExpression');
  TestIfExpression(t);
  console.log('║  ├ TestIfElseExpression');
  TestIfElseExpression(t);
  console.log('║  ├ TestFunctionLiteralParsing');
  TestFunctionLiteralParsing(t);
  console.log('║  ├ TestFunctionParameterParsing');
  TestFunctionParameterParsing(t);
  console.log('║  ├ TestCallExpressionParsing');
  TestCallExpressionParsing(t);
  console.log('║  ├ TestParsingArrayLiterals');
  TestParsingArrayLiterals(t);
  console.log('║  ├ TestParsingIndexExpressions');
  TestParsingIndexExpressions(t);
  console.log('║  ├ TestParsingHashLiteralsStringKeys');
  TestParsingHashLiteralsStringKeys(t);
  console.log('║  ├ TestParsingEmptyHashLiterals');
  TestParsingEmptyHashLiterals(t);
  console.log('║  └ TestParsingHashLiteralsWithExpressions');
  TestParsingHashLiteralsWithExpressions(t);
}

function TestLetStatements(t: Test) {
  let tests = [
    { input: 'let x = 5;', expectedIdentifier: 'x', expectedValue: 5 },
    { input: 'let y = true;', expectedIdentifier: 'y', expectedValue: true },
    { input: 'let foobar = y;', expectedIdentifier: 'foobar', expectedValue: 'y' },
  ];

  for (let i in tests) {
    let tt = tests[i];

    let l = new Lexer(tt.input);
    let p = new Parser(l);
    let program = p.ParseProgram();
    checkParserErrors(t, p);

    t.Assert(program !== null, 'ParseProgram() returned nil');
    t.Assert(
      program.Statements.length === 1,
      'program.Statements does not contain 3 statements. got=%d',
      program.Statements.length
    );

    let stmt = program.Statements[0];
    if (!testLetStatement(t, stmt, tt.expectedIdentifier)) {
      continue;
    }

    if (!(stmt instanceof LetStatement)) {
      t.Errorf(`s not got=LetStatement. got=${typeof stmt}`);
      continue;
    }

    let val = stmt.Value;
    if (!testLiteralExpression(t, val, tt.expectedValue)) {
      continue;
    }
  }
}

function checkParserErrors(t: Test, p: Parser) {
  let errors = p.Errors();
  if (errors.length === 0) return;

  t.Errorf('parser has %d errors', errors.length);

  for (let err of errors) {
    t.Errorf('parser error: %s', err);
  }

  t.FailNow();
}

function testLetStatement(t: Test, stmt: Statement, name: string): boolean {
  t.Assert(stmt.TokenLiteral() === 'let', `s.TokenLiteral not 'let'. got=${stmt.TokenLiteral()}`);

  if (!(stmt instanceof LetStatement)) {
    t.Errorf(`s not got=LetStatement. got=${typeof stmt}`);
    return false;
  }

  t.Assert(stmt.Name.Value === name, `stmt.Name.Value not ${name}. got=${stmt.Name.Value}`);
  t.Assert(
    stmt.Name.TokenLiteral() === name,
    `stmt.Name.TokenLiteral() not ${name}. got=${stmt.Name.TokenLiteral()}`
  );
  return true;
}

function TestReturnStatements(t: Test) {
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
    t.Assert(stmt instanceof ReturnStatement, 'stmt not type ReturnStatement. got=%s', typeof stmt);
    t.Assert(stmt.TokenLiteral() === 'return', 'stmt.TokenLiteral not "return". got=%s', stmt.TokenLiteral());
  }
}

function TestIdentifierExpression(t: Test) {
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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let ident = stmt.Expression;
  if (!(ident instanceof Identifier)) {
    t.Errorf('exp not type Identifier. got=%s', typeof ident);
    return;
  }

  t.Assert(ident.Value === 'foobar', 'ident.Value is not "foobar". got=%s', ident.Value);
  t.Assert(
    ident.TokenLiteral() === 'foobar',
    'ident.TokenLiteral is not "foobar". got=%s',
    ident.TokenLiteral()
  );
}

function TestIntegerExpression(t: Test) {
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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let literal = stmt.Expression;
  if (!(literal instanceof IntegerLiteral)) {
    t.Errorf('exp not type IntegerLiteral. got=%s', typeof literal);
    return;
  }

  t.Assert(literal.Value === 5, 'literal.Value is not 5. got=%s', literal.Value);
  t.Assert(literal.TokenLiteral() === '5', 'literal.TokenLiteral is not "5". got=%s', literal.TokenLiteral());
}

function TestStringLiteralExpression(t: Test) {
  let input = '"hello world"';

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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let literal = stmt.Expression;
  if (!(literal instanceof StringLiteral)) {
    t.Errorf('exp not type StringLiteral. got=%s', typeof literal);
    return;
  }

  t.Assert(literal.Value === 'hello world', 'literal.Value is not "hello world". got=%s', literal.Value);
  t.Assert(
    literal.TokenLiteral() === 'hello world',
    'literal.TokenLiteral is not "hello world". got=%s',
    literal.TokenLiteral()
  );
}

function TestParsingPrefixExpressions(t: Test) {
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
    if (!(stmt instanceof ExpressionStatement)) {
      t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
      continue;
    }

    let exp = stmt.Expression;
    if (!(exp instanceof PrefixExpression)) {
      t.Errorf('stmt not type PrefixExpression. got=%s', typeof exp);
      continue;
    }

    t.Assert(exp.Operator === tt.operator, 'exp.Operator is not %s. got=%s', tt.operator, exp.Operator);

    if (!testLiteralExpression(t, exp.Right, tt.value)) {
      continue;
    }
  }
}

function testIntegerLiteral(t: Test, il: Expression, value: Number): boolean {
  let integ = il;
  let ok;

  if (!(integ instanceof IntegerLiteral)) {
    t.Errorf('il not type IntegerLiteral. got=%s', il.constructor.name);
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

function TestParsingInfixExpressions(t: Test) {
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
    if (!(stmt instanceof ExpressionStatement)) {
      t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
      continue;
    }

    if (!testInfixExpression(t, stmt.Expression, tt.leftValue, tt.operator, tt.rightValue)) {
      continue;
    }
  }
}

function TestOperatorPrecedenceParsing(t: Test) {
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
    ['a * [1, 2, 3, 4][b * c] * d', '((a * ([1, 2, 3, 4][(b * c)])) * d)'],
    ['add(a * b[2], b[1], 2 * [1, 2][1])', 'add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))'],
  ];

  for (let i in tests) {
    let tt = tests[i];

    let l = new Lexer(tt[0]);
    let p = new Parser(l);
    let program = p.ParseProgram();
    checkParserErrors(t, p);

    let actual = program.String();
    t.Assert(actual === tt[1], 'operator precedence expected=%s got=%s', tt[1], actual);
  }
}

function testIdentifier(t: Test, exp: Expression, value: String): boolean {
  let ident = exp;

  if (!(ident instanceof Identifier)) {
    t.Errorf('exp is not Identifier. got=%s', exp);
    return false;
  }

  if (ident.Value !== value) {
    t.Errorf('ident.Value is not %s. got=%s', value, ident.Value);
    return false;
  }

  if (ident.TokenLiteral() !== '' + value) {
    t.Errorf('ident.TokenLiteral is not %s. got=%s', value, ident.TokenLiteral());
    return false;
  }

  return true;
}

function testBooleanLiteral(t: Test, exp: Expression, value: Boolean): boolean {
  let bo = exp;
  let ok;

  if (!(bo instanceof AstBoolean)) {
    t.Errorf('exp is not AstBoolean. got=%s', exp);
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

function testLiteralExpression(t: Test, exp: Expression, expected: any): boolean {
  if (typeof expected === 'number') {
    return testIntegerLiteral(t, exp, expected);
  } else if (typeof expected === 'string') {
    return testIdentifier(t, exp, expected);
  } else if (typeof expected === 'boolean') {
    return testBooleanLiteral(t, exp, expected);
  }

  t.Errorf('type of expected (%s) not handled. got=%s', typeof expected, exp.constructor.name);
  return false;
}

function testInfixExpression(t: Test, exp: Expression, left: any, operator: string, right: any): boolean {
  let opExp = exp;

  if (!(opExp instanceof InfixExpression)) {
    t.Errorf('exp not InfixExpression. got=%s(%s)', opExp.constructor.name, opExp);
    return false;
  }

  if (!testLiteralExpression(t, opExp.Left, left)) {
    return false;
  }

  if (opExp.Operator !== operator) {
    t.Errorf('opExp.Operator is not %s. got=%s', operator, opExp.Operator);
    return false;
  }

  if (!opExp.Right) {
    t.Errorf('opExp.Right is missing, not %s', right);
    return false;
  }

  if (!testLiteralExpression(t, opExp.Right, right)) {
    return false;
  }

  return true;
}

function TestBooleanExpression(t: Test) {
  let tests = [{ input: 'true', expected: true }, { input: 'false', expected: false }];

  for (let i in tests) {
    let tt = tests[i];

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
    if (!(stmt instanceof ExpressionStatement)) {
      t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
      continue;
    }

    let boolean = stmt.Expression;
    if (!(boolean instanceof AstBoolean)) {
      t.Errorf('exp not type AstBoolean. got=%s', typeof boolean);
      continue;
    }
    t.Assert(boolean.Value === tt.expected, 'boolean.Value is not %s. got=%s', tt.expected, boolean.Value);
  }
}

function TestIfExpression(t: Test) {
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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let exp = stmt.Expression;
  if (!(exp instanceof IfExpression)) {
    t.Errorf('stmt.Expression is not type IfExpression. got=%s', typeof exp);
    return;
  }

  if (!testInfixExpression(t, exp.Condition, 'x', '<', 'y')) {
    return;
  }

  t.Assert(
    exp.Consequence.Statements.length === 1,
    'consequence is no 1 statements. got=%s',
    exp.Consequence.Statements.length
  );

  let consequence = exp.Consequence.Statements[0];
  if (!(consequence instanceof ExpressionStatement)) {
    t.Errorf('Statements[0] is not ExpressionStatement. got=%s', typeof consequence);
    return;
  }

  if (!testIdentifier(t, consequence.Expression, 'x')) {
    return;
  }

  t.Assert(exp.Alternative === null, 'exp.Alternative.Statements was not null. got=%s', exp.Alternative);
}

function TestIfElseExpression(t: Test) {
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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let exp = stmt.Expression;
  if (!(exp instanceof IfExpression)) {
    t.Errorf('stmt.Expression is not type IfExpression. got=%s', typeof exp);
    return;
  }

  if (!testInfixExpression(t, exp.Condition, 'x', '<', 'y')) {
    return;
  }

  t.Assert(
    exp.Consequence.Statements.length === 1,
    'consequence is not 1 statements. got=%s',
    exp.Consequence.Statements.length
  );

  let consequence = exp.Consequence.Statements[0];
  if (!(consequence instanceof ExpressionStatement)) {
    t.Errorf('Statements[0] is not ExpressionStatement. got=%s', typeof consequence);
    return;
  }

  if (!testIdentifier(t, consequence.Expression, 'x')) {
    return;
  }

  if (!exp.Alternative) {
    t.Errorf('exp missing Alternative. got=%s', exp.Alternative);
    return;
  }

  t.Assert(
    exp.Alternative.Statements.length === 1,
    'exp.Alternative.Statements does not contain 1 statements. got=%s',
    exp.Alternative.Statements.length
  );

  let alternative = exp.Alternative.Statements[0];
  if (!(alternative instanceof ExpressionStatement)) {
    t.Errorf('Statements[0] is not ExpressionStatement. got=%s', typeof alternative);
    return;
  }

  if (!testIdentifier(t, alternative.Expression, 'y')) {
    return;
  }
}

function TestFunctionLiteralParsing(t: Test) {
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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let func = stmt.Expression;
  if (!(func instanceof FunctionLiteral)) {
    t.Errorf('stmt.Expression is not type FunctionLiteral. got=%s', typeof func);
    return;
  }

  t.Assert(
    func.Parameters.length === 2,
    'function literal parameters wrong. want 2. got=%s',
    func.Parameters.length
  );

  testLiteralExpression(t, func.Parameters[0], 'x');
  testLiteralExpression(t, func.Parameters[1], 'y');

  t.Assert(
    func.Body.Statements.length === 1,
    'function.Body.Statements has not 1 statements. got=%s',
    func.Body.Statements.length
  );

  let bodyStmt = func.Body.Statements[0];
  if (!(bodyStmt instanceof ExpressionStatement)) {
    t.Errorf('function body statement is not type ExpressionStatement. got=%s', typeof bodyStmt);
    return;
  }

  testInfixExpression(t, bodyStmt.Expression, 'x', '+', 'y');
}

function TestFunctionParameterParsing(t: Test) {
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
    if (!(stmt instanceof ExpressionStatement)) {
      t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
      continue;
    }

    let func = stmt.Expression;

    if (!(func instanceof FunctionLiteral)) {
      t.Errorf('func not type FunctionLiteral. got=%s', typeof func);
      continue;
    }

    t.Assert(
      func.Parameters.length === tt.expectedParams.length,
      'func.Parameters does not contain %d statements. got=%d',
      tt.expectedParams.length,
      func.Parameters.length
    );

    tt.expectedParams.forEach((ident, i) => {
      testLiteralExpression(t, (func as FunctionLiteral).Parameters[i], ident);
    });
  }
}

function TestCallExpressionParsing(t: Test) {
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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let exp = stmt.Expression;
  if (!(exp instanceof CallExpression)) {
    t.Errorf('stmt.Expression is not type CallExpression. got=%s', typeof exp);
    return;
  }

  if (!testIdentifier(t, exp.Function, 'add')) {
    return;
  }

  if (!exp.Arguments || exp.Arguments.length !== 3) {
    t.Errorf('wrong length of arguments. want 3. got=%s', exp.Arguments);
    return;
  }

  testLiteralExpression(t, exp.Arguments[0], 1);
  testInfixExpression(t, exp.Arguments[1], 2, '*', 3);
  testInfixExpression(t, exp.Arguments[2], 4, '+', 5);
}

function TestParsingArrayLiterals(t: Test) {
  let input = '[1, 2 * 2, 3 + 3]';

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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let array = stmt.Expression;
  if (!(array instanceof ArrayLiteral)) {
    t.Errorf('stmt.Expression is not type ArrayLiteral. got=%s', typeof array);
    return;
  }

  if (!array.Elements || array.Elements.length !== 3) {
    t.Errorf('wrong length of arguments. want 3. got=%s', array.Elements);
    return;
  }

  testIntegerLiteral(t, array.Elements[0], 1);
  testInfixExpression(t, array.Elements[1], 2, '*', 2);
  testInfixExpression(t, array.Elements[2], 3, '+', 3);
}

function TestParsingIndexExpressions(t: Test) {
  let input = 'myArray[1 + 1]';

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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let indexExp = stmt.Expression;
  if (!(indexExp instanceof IndexExpression)) {
    t.Errorf('stmt.Expression is not type IndexExpression. got=%s', typeof indexExp);
    return;
  }

  testIdentifier(t, indexExp.Left, 'myArray');
  testInfixExpression(t, indexExp.Index, 1, '+', 1);
}

function TestParsingHashLiteralsStringKeys(t: Test) {
  let input = '{"one": 1, "two": 2, "three": 3}';

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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let hash = stmt.Expression;
  if (!(hash instanceof HashLiteral)) {
    t.Errorf('stmt.Expression is not type HashLiteral. got=%s', typeof hash);
    return;
  }

  if (hash.Pairs.size !== 3) {
    t.Errorf('hash.Pairs has wrong length. got=%s', hash.Pairs.size);
  }

  let expected: { [index: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
  };

  hash.Pairs.forEach((value, key) => {
    let literal = key;
    if (!(literal instanceof StringLiteral)) {
      t.Errorf('key is not StringLiteral. got=%s', key.constructor.name);
    }

    let expectedValue = expected[literal.String()];

    testIntegerLiteral(t, value, expectedValue);
  });
}

function TestParsingEmptyHashLiterals(t: Test) {
  let input = '{}';

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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let hash = stmt.Expression;
  if (!(hash instanceof HashLiteral)) {
    t.Errorf('stmt.Expression is not type HashLiteral. got=%s', typeof hash);
    return;
  }

  if (hash.Pairs.size !== 0) {
    t.Errorf('hash.Pairs has wrong length. got=%s', hash.Pairs.size);
  }
}

function TestParsingHashLiteralsWithExpressions(t: Test) {
  let input = '{"one": 0 + 1, "two": 10 - 8, "three": 15 / 5}';

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
  if (!(stmt instanceof ExpressionStatement)) {
    t.Errorf('program.Statements[0] not type ExpressionStatement. got=%s', typeof stmt);
    return;
  }

  let hash = stmt.Expression;
  if (!(hash instanceof HashLiteral)) {
    t.Errorf('stmt.Expression is not type HashLiteral. got=%s', typeof hash);
    return;
  }

  if (hash.Pairs.size !== 3) {
    t.Errorf('hash.Pairs has wrong length. got=%s', hash.Pairs.size);
  }

  let tests: { [index: string]: Function } = {
    one: (e: Expression) => {
      testInfixExpression(t, e, 0, '+', 1);
    },
    two: (e: Expression) => {
      testInfixExpression(t, e, 10, '-', 8);
    },
    three: (e: Expression) => {
      testInfixExpression(t, e, 15, '/', 5);
    },
  };

  hash.Pairs.forEach((value, key) => {
    let literal = key;
    if (!(literal instanceof StringLiteral)) {
      t.Errorf('key is not StringLiteral. got=%s', key.constructor.name);
      return;
    }

    let testFunc = tests[literal.String()];
    if (!testFunc) {
      t.Errorf('No test function for key %s found', literal.String());
      return;
    }

    testFunc(value);
  });
}
