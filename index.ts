import Start from './repl/repl';
import process from 'process';
import os from 'os';
import fs from 'fs';

import { NewEnvironment } from './object/environment';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import Eval from './evaluator/evaluator';
import Object from './object/object';

export { NewEnvironment, Lexer, Parser, Eval, Object };

export function main(argv: string[]): void {
  let output = process.stdout;

  if (argv[2]) {
    let filename: string = argv[2];

    const stream = fs.createReadStream(filename, { encoding: 'utf8' });

    Start(stream, output, true);
    return;
  }

  let username = os.userInfo().username;
  console.log(`Hello ${username}! This is the Monkey programming language!`);
  console.log('Feel free to type in commands');

  let input = process.stdin;
  input.setEncoding('utf-8');

  Start(input, output, false);
}

// NodeJS runs a REPL or file loader
if (typeof process !== 'undefined' && typeof process.versions.node !== 'undefined') main(process.argv);
