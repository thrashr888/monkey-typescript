import { TestNextToken } from './lexer/lexer-test';
import { TestAll } from './parser/parser-test';

export default class Test {
  constructor() {
    this.count = 0;
  }

  Fatalf(format, ...values) {
    this.count++;
    throw new Error(format);
  }

  Errorf(format, ...values) {
    this.count++;
    console.error(format);
  }

  FailNow() {
    this.count++;
    throw new Error('Fail');
  }
}

export function main() {
  let t = new Test();

  TestNextToken(t);
  TestAll(t);
}

main();
