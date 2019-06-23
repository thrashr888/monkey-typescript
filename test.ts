import { TestAst } from './ast/ast-test';
import { TestEval } from './evaluator/evaluator-test';
import { TestLexer } from './lexer/lexer-test';
import { TestParser } from './parser/parser-test';
import { TestObject } from './object/object-test';

export default class Test {
  TotalCount: number = 0;
  PassCount: number = 0;
  FailCount: number = 0;
  SkipCount: number = 0;

  constructor() {}

  Error(...args: any) {
    this.TotalCount++;
    this.FailCount++;
    console.error('\x1b[31m%s\x1b[0m', ...args);
  }
  // Errorf(format, ...args) {}
  Fail() {
    this.TotalCount++;
    this.FailCount++;
  }
  // FailNow() {}
  Failed() {
    return !!this.FailCount;
  }
  Fatal(...args: any) {
    this.TotalCount++;
    this.FailCount++;
    console.error('\x1b[31m%s\x1b[0m', ...args);
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
    console.info('\x1b[34mSkipped %s\x1b[0m', ...args);
  }
  // SkipNow() {}
  Skipf(format: string, ...args: any) {
    this.SkipCount++;
    console.info(`\x1b[34mSkipped ${format}\x1b[0m`, ...args);
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
    this.TotalCount++;
    this.FailCount++;
    throw new Error(format);
  }

  Errorf(format: string, ...args: any) {
    this.TotalCount++;
    this.FailCount++;

    var err = new Error();
    debugger;
    // Error.captureStackTrace(err, arguments.callee);
    // var stack = err.stack;
    // Error.prepareStackTrace = orig;

    console.error(`\x1b[31m${format}\x1b[0m`, ...args);
  }

  FailNow() {
    this.TotalCount++;
    this.FailCount++;
    throw new Error('FAIL');
  }
}

export function main() {
  let t = new Test();

  console.log(`\x1b[36m╔═════════════>\n║ \x1b[1mStart tests\n\x1b[0m\x1b[36m║\x1b[0m`);

  console.time('║ took');
  try {
    console.log('║\n╠══╕ \x1b[1mStart TestAst\x1b[0m');
    TestAst(t);
    console.log('║\n╠══╕ \x1b[1mStart TestLexer\x1b[0m');
    TestLexer(t);
    console.log('║\n╠══╕ \x1b[1mStart TestParser\x1b[0m');
    TestParser(t);
    console.log('║\n╠══╕ \x1b[1mStart TestEval\x1b[0m');
    TestEval(t);
    console.log('║\n╠══╕ \x1b[1mStart TestObject\x1b[0m');
    TestObject(t);
  } catch (e) {}
  console.log('║');
  console.timeEnd('║ took');

  if (t.FailCount > 0) {
    console.error(
      `\x1b[31m║\n╠══> \x1b[1m${t.FailCount} of ${t.TotalCount}\x1b[0m\x1b[31m tests failed ❌\n║\x1b[0m`
    );
    console.log(`\x1b[36m║ \x1b[1mEnd tests\n\x1b[0m\x1b[36m╚═══════════>\x1b[0m`);
    process.exit(1);
    return;
  }

  if (t.SkipCount > 0) {
    console.info(`\x1b[34m║\n╠══> \x1b[1m${t.SkipCount}\x1b[0m\x1b[34m tests skipped ℹ️\n║\x1b[0m`);
  }
  console.info(
    `\x1b[32m║\n╠══> \x1b[1m${t.PassCount} of ${t.TotalCount}\x1b[0m\x1b[32m assertions passed ✅\n║\x1b[0m`
  );

  console.log(`\x1b[36m║ \x1b[1mEnd tests\n\x1b[0m\x1b[36m╚═══════════>\x1b[0m`);

  process.exit(0);
}

main();
