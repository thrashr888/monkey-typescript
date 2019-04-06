import { TestAst } from './ast/ast-test';
import { TestEval } from './evaluator/evaluator-test';
import { TestLexer } from './lexer/lexer-test';
import { TestParser } from './parser/parser-test';

export default class Test {
  TotalCount: number = 0;
  PassCount: number = 0;
  FailCount: number = 0;
  SkipCount: number = 0;

  constructor() {}

  Error(...args: any) {
    this.FailCount++;
    console.error(...args);
  }
  // Errorf(format, ...args) {}
  Fail() {
    this.FailCount++;
  }
  // FailNow() {}
  Failed() {
    return !!this.FailCount;
  }
  Fatal(...args: any) {
    this.FailCount++;
    console.error(...args);
    throw new Error('FAIL');
  }
  // Fatalf(format, ...args) {}
  // Helper() {}
  Log(...args: any) {
    console.log(...args);
  }
  Logf(format: string, ...args: any) {
    console.log(format, ...args);
  }
  // Name() {}
  Skip(...args: any) {
    this.SkipCount++;
    console.info('Skipped', ...args);
  }
  // SkipNow() {}
  Skipf(format: string, ...args: any) {
    this.SkipCount++;
    console.info('Skipped', format, ...args);
  }
  Skipped() {
    return !!this.SkipCount;
  }

  Assert(test: boolean, message: string, ...args: any) {
    this.TotalCount++;

    if (test) {
      this.PassCount++;
      return;
    }

    this.Errorf(message, ...args);
  }

  Fatalf(format: string, ...args: any) {
    this.FailCount++;
    throw new Error(format);
  }

  Errorf(format: string, ...args: any) {
    this.FailCount++;

    var err = new Error();
    debugger;
    // Error.captureStackTrace(err, arguments.callee);
    // var stack = err.stack;
    // Error.prepareStackTrace = orig;

    console.error(format, ...args);
  }

  FailNow() {
    this.FailCount++;
    throw new Error('FAIL');
  }
}

export function main() {
  let t = new Test();

  TestAst(t);
  TestEval(t);
  TestLexer(t);
  TestParser(t);

  if (t.FailCount > 0) {
    console.log(`${t.FailCount}/${t.TotalCount} tests failed`);
    process.exit(1);
    return;
  }

  console.info(`${t.PassCount}/${t.TotalCount} tests passed`);
  process.exit(0);
}

main();
