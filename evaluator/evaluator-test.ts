import Test from '../test';
import OObject, { OInteger } from '../object/object';
import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import Eval from './evaluator';

export function TestEval(t: Test) {
  TestEvalIntegerExpression(t);
}

export function TestEvalIntegerExpression(t: Test) {
  let tests = [{ input: '5', expected: 5 }, { input: '5', expected: 5 }];

  for (let tt of tests) {
    let evaluated = testEval(tt.input);
    if (!evaluated) {
      t.Skipf('input not evaluated. got=%s', evaluated);
      return;
    }

    testIntegerObject(t, evaluated, tt.expected);
  }
}

function testEval(input: string): OObject | null {
  let l = new Lexer(input);
  let p = new Parser(l);
  let program = p.ParseProgram();

  return Eval(program);
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
