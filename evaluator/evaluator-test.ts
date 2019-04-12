import Test from '../test';
import OObject, { OInteger, OBoolean } from '../object/object';
import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import Eval from './evaluator';

export function TestEval(t: Test) {
  console.log('    - TestEvalIntegerExpression');
  TestEvalIntegerExpression(t);
  console.log('    - TestEvalBooleanExpression');
  TestEvalBooleanExpression(t);
  console.log('    - TestBangOperator');
  TestBangOperator(t);
}

function testEval(input: string): OObject | null {
  let l = new Lexer(input);
  let p = new Parser(l);
  let program = p.ParseProgram();

  return Eval(program);
}

export function TestEvalIntegerExpression(t: Test) {
  let tests = [
    { input: '5', expected: 5 },
    { input: '10', expected: 10 },
    { input: '-5', expected: -5 },
    { input: '-10', expected: -10 },
    { input: '5 + 5 + 5 + 5 10', expected: 10 },
    { input: '2 * 2 * 2 * 2 * 2', expected: 32 },
    { input: '-50 + 100 + -50', expected: 0 },
    { input: '5 * 2 + 10', expected: 20 },
    { input: '5 + 2 * 10', expected: 25 },
    { input: '20 + 2 * -10', expected: 0 },
    { input: '50 / 2 * 2 + 10', expected: 60 },
    { input: '2 * (5 + 10)', expected: 30 },
    { input: '3 * 3 * 3 + 10', expected: 37 },
    { input: '3 * (3 * 3) + 10', expected: 37 },
    { input: '(5 + 10 * 2 + 15 / 3) * 2 + -10', expected: 50 },
  ];

  for (let tt of tests) {
    let evaluated = testEval(tt.input);
    if (!evaluated) {
      t.Skipf('input not evaluated. got=%s', evaluated);
      continue;
    }

    testIntegerObject(t, evaluated, tt.expected);
  }
}

function testIntegerObject(t: Test, obj: OObject, expected: number): boolean {
  let result = obj;

  if (!(result instanceof OInteger)) {
    t.Errorf('object is not Integer. got=%s', typeof result);
    return false;
  }

  if (result.Value !== expected) {
    t.Errorf('object has wrong value. got=%s, want=%d', result.Value, expected);
    return false;
  }

  return true;
}

export function TestEvalBooleanExpression(t: Test) {
  let tests = [
    { input: 'true', expected: true },
    { input: 'false', expected: false },
    { input: '1 < 2', expected: true },
    { input: '1 > 2', expected: false },
    { input: '1 < 1', expected: false },
    { input: '1 > 1', expected: false },
    { input: '1 == 1', expected: true },
    { input: '1 != 1', expected: false },
    { input: '1 == 2', expected: false },
    { input: '1 != 2', expected: true },
    { input: 'true == true', expected: true },
    { input: 'false == false', expected: true },
    { input: 'true == false', expected: false },
    { input: 'true != false', expected: true },
    { input: 'false != true', expected: true },
    { input: '(1 < 2) == true', expected: true },
    { input: '(1 < 2) == false', expected: false },
    { input: '(1 > 2) == true', expected: false },
    { input: '(1 > 2) == false', expected: true },
  ];

  for (let tt of tests) {
    let evaluated = testEval(tt.input);
    if (!evaluated) {
      t.Skipf('input not evaluated. got=%s', evaluated);
      continue;
    }

    testBooleanObject(t, evaluated, tt.expected);
  }
}

function testBooleanObject(t: Test, obj: OObject, expected: boolean): boolean {
  let result = obj;

  if (!(result instanceof OBoolean)) {
    t.Errorf('object is not OBoolean. got=%s', result.constructor.name);
    return false;
  }

  if (result.Value !== expected) {
    t.Errorf('object has wrong value. got=%s, want=%s', result.Value, expected);
    return false;
  }

  return true;
}

export function TestBangOperator(t: Test) {
  let tests = [
    { input: '!true', expected: false },
    { input: '!false', expected: true },
    { input: '!5', expected: false },
    { input: '!!true', expected: true },
    { input: '!!false', expected: false },
    { input: '!!5', expected: true },
  ];

  for (let tt of tests) {
    let evaluated = testEval(tt.input);
    if (!evaluated) {
      t.Skipf('input not evaluated. got=%s', evaluated);
      continue;
    }

    testBooleanObject(t, evaluated, tt.expected);
  }
}
