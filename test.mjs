import { TestAst } from './ast/ast-test';
import { TestLexer } from './lexer/lexer-test';
import { TestParser } from './parser/parser-test';

export default class Test {
  constructor() {
    this.TotalCount = 0;
    this.PassCount = 0;
    this.FailCount = 0;
    this.SkipCount = 0;
  }

  Error(...args) {
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
  Fatal(...args) {
    this.FailCount++;
    console.error(...args);
    throw new Error('FAIL');
  }
  // Fatalf(format, ...args) {}
  // Helper() {}
  Log(...args) {
    console.log(...args);
  }
  Logf(format, ...args) {
    console.log(format, ...args);
  }
  // Name() {}
  Skip(...args) {
    this.SkipCount++;
    console.info('Skipped', ...args);
  }
  // SkipNow() {}
  Skipf(format, ...args) {
    this.SkipCount++;
    console.info('Skipped', format, ...args);
  }
  Skipped() {
    return !!this.SkipCount;
  }

  Assert(test, message, ...args) {
    this.TotalCount++;

    if (test) {
      this.PassCount++;
      return;
    }

    this.Errorf(message, ...args);
  }

  Fatalf(format, ...args) {
    this.FailCount++;
    throw new Error(format);
  }

  Errorf(format, ...args) {
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
