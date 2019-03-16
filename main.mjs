import { Start } from './repl/repl';
import { TestNextToken } from './lexer/lexer-test';

export function main() {
  TestNextToken();

  console.log('Hello! This is the Monkey programming language!');
  console.log('Feel free to type in commands');

  Start('let test = 1;');
}

main();
