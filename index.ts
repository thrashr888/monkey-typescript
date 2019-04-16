import Start from './repl/repl';
import process from 'process';
import os from 'os';

import { NewEnvironment } from './object/environment';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import Eval from './evaluator/evaluator';

export { NewEnvironment, Lexer, Parser, Eval };

export function main(): void {
  let username = os.userInfo().username;
  console.log(`Hello ${username}! This is the Monkey programming language!`);
  console.log('Feel free to type in commands');

  let input = process.stdin;
  input.setEncoding('utf-8');

  let output = process.stdout;

  Start(input, output);
}

main();
