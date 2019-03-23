import { TestNextToken } from './lexer/lexer-test';
import { TestParser } from './parser/parser-test';

export default class Test {
  constructor() {
    this.TotalCount = 0;
    this.PassCount = 0;
    this.FailCount = 0;
  }

  Assert(test, message, ...values) {
    this.TotalCount++;

    if (test) {
      this.PassCount++;
      return;
    }

    this.Errorf(message, ...values);
  }

  Fatalf(format, ...values) {
    this.FailCount++;
    throw new Error(format);
  }

  Errorf(format, ...values) {
    this.FailCount++;

    // var err = new Error();
    // Error.captureStackTrace(err, arguments.callee);
    // var stack = err.stack;
    // Error.prepareStackTrace = orig;

    console.error(format, ...values);
  }

  FailNow() {
    this.FailCount++;
    throw new Error('FAIL');
  }
}

export function main() {
  let t = new Test();

  TestNextToken(t);
  TestParser(t);

  if (t.FailCount > 0) {
    console.log(`${t.FailCount}/${t.TotalCount} tests failed`);
    process.exit(1);
    return;
  }

  console.info(`${t.PassCount} tests passed`);
  process.exit(0);
}

main();
