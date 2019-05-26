import Start from './repl/repl';
import process from 'process';
import os from 'os';
import fs from 'fs';

import { NewEnvironment, NewBrowserEnvironment, NewNodeEnvironment } from './object/environment';
import Lexer from './lexer/lexer';
import Parser from './parser/parser';
import Eval from './evaluator/evaluator';
export { NewEnvironment, NewBrowserEnvironment, NewNodeEnvironment, Lexer, Parser, Eval };

import {
  BOOLEAN_OBJ,
  BUILTIN_OBJ,
  ERROR_OBJ,
  COMMENT_OBJ,
  FUNCTION_OBJ,
  INTEGER_OBJ,
  FLOAT_OBJ,
  NULL_OBJ,
  RETURN_VALUE_OBJ,
  STRING_OBJ,
  ARRAY_OBJ,
  HASH_OBJ,
} from './object/object';
export const OObject = {
  BOOLEAN_OBJ,
  BUILTIN_OBJ,
  ERROR_OBJ,
  COMMENT_OBJ,
  FUNCTION_OBJ,
  INTEGER_OBJ,
  FLOAT_OBJ,
  NULL_OBJ,
  RETURN_VALUE_OBJ,
  STRING_OBJ,
  ARRAY_OBJ,
  HASH_OBJ,
};

export function main(argv: string[]): void {
  let output = process.stdout;

  if (argv[2]) {
    // load a file

    let filename: string = argv[2];

    const stream = fs.createReadStream(filename, { encoding: 'utf8' });

    Start(stream, output, true);
  } else {
    // run the REPL

    let username = os.userInfo().username;
    console.log(`Hello ${username}! This is the Monkey programming language!`);
    console.log('Feel free to type in commands');

    let input = process.stdin;
    input.setEncoding('utf-8');

    Start(input, output, false);
  }
}

// NodeJS runs a REPL or file loader
if (typeof process !== 'undefined' && typeof process.versions.node !== 'undefined') main(process.argv);
