import Start from './repl/repl';
import process from 'process';
import os from 'os';

export function main(): void {
  let username = os.userInfo().username;
  console.log(`Hello ${username}! This is the Monkey programming language!`);
  console.log('Feel free to type in commands');

  let input = process.stdin;
  input.setEncoding('utf-8');

  Start(input);
}

main();
