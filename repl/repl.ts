import process from 'process';
import fs from 'fs';
import readline, { cursorTo, clearLine, moveCursor } from 'readline';

import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import Eval from '../evaluator/evaluator';
import { NewNodeEnvironment } from '../object/environment';
import OObject, { OInteger } from '../object/object';

const PROMPT = '>> ';
let inputHistory: string[] = [];
let inputText: string;

export default function Start(
  input: fs.ReadStream | NodeJS.ReadStream,
  output: NodeJS.WriteStream,
  errors: NodeJS.WriteStream,
  quiet = false
) {
  let env = NewNodeEnvironment();
  env.Logger.Follow((date: Date, messages: string) => {
    console.log('\n', date, ...messages);
  });
  let lastOutput: OObject;
  let posX: number = 0;

  if ((input as NodeJS.ReadStream) && (input as NodeJS.ReadStream).setRawMode) {
    readline.emitKeypressEvents(input);
    (input as any).setRawMode(true);
  }
  var rl = readline.createInterface({ input, output, prompt: PROMPT, terminal: false });

  if (!quiet) rl.prompt();

  let inputHistoryIndex = 0;
  input.on('keypress', function(s: any, key: any) {
    if (key.sequence === '\u0003') {
      // command - C
      process.exit(0);
    }
    if (key.sequence === '\u0004') {
      // command - D
      process.exit(0);
    }
    // console.log('key: %s', key);
    // console.log(key.name);

    // https://www.howtogeek.com/howto/ubuntu/keyboard-shortcuts-for-bash-command-shell-for-ubuntu-debian-suse-redhat-linux-etc/
    if (key.sequence === '\u0001') {
      // ctrl - a
      // move to beginning of line
      cursorTo(output, PROMPT.length);
      posX = 0;
    } else if (key.sequence === '\u0005') {
      // ctrl - 3
      // move to end of line
      cursorTo(output, PROMPT.length + inputText.length);
      posX = inputText.length;
    } else if (key.sequence === '\u0015') {
      // ctrl - u
      // delete before cursor
      inputText = inputText.substring(posX, inputText.length);
      posX = 0;

      // replace prev input
      clearLine(output, 0);
      cursorTo(output, 0);

      // write to input and output
      rl.prompt();
      output.write(inputText);
      cursorTo(output, posX + PROMPT.length);
    } else if (key.sequence === '\u000b') {
      // ctrl - k
      // delete after cursor
      inputText = inputText.substring(0, posX - 1) + inputText.substring(posX, inputText.length);

      // replace prev input
      clearLine(output, 0);
      cursorTo(output, 0);

      // write to input and output
      rl.prompt();
      output.write(inputText);
      cursorTo(output, posX + PROMPT.length - 1);
      posX = inputText.length;
    } else if (key.sequence === '\u001a') {
      // ctrl - z
      // erase line
      clearLine(output, 0);
      cursorTo(output, 0);
      rl.prompt();
      posX = 0;
      inputText = '';
    } else if (key.name === 'left') {
      if (posX > 0) {
        moveCursor(output, -1, 0);
        posX--;
      }
    } else if (key.name === 'right') {
      if (posX < inputText.length) {
        moveCursor(output, +1, 0);
        posX++;
      }
    } else if (key.name === 'up') {
      if (inputHistory.length > 0) {
        // don't go past 0
        if (inputHistoryIndex < inputHistory.length) {
          inputHistoryIndex++;
        } else {
          return;
        }

        // get from history
        let inputItem = inputHistory[inputHistory.length - inputHistoryIndex];
        inputText = inputItem;

        // replace prev input
        clearLine(output, 0);
        cursorTo(output, 0);
        rl.prompt();

        // write to input and output
        rl.write(inputText);
        output.write(inputText);
        posX = inputText.length;
      }
    } else if (key.name === 'down') {
      if (inputHistory.length > 0) {
        // don't go past 0
        let inputItem;
        if (inputHistoryIndex > 1) {
          inputHistoryIndex--;
          inputItem = inputHistory[inputHistory.length - inputHistoryIndex];
        } else if (inputHistoryIndex > 0) {
          inputHistoryIndex--;
          inputItem = '';
        } else {
          return;
        }

        // get from history
        inputText = inputItem;

        // replace prev input
        clearLine(output, 0);
        cursorTo(output, 0);
        rl.prompt();

        // write to input and output
        rl.write(inputText);
        output.write(inputText);
        posX = inputText.length;
      }
    } else if (key.name === 'backspace') {
      // remove from end of text
      if (inputText) {
        inputText = inputText.substring(0, posX - 1) + inputText.substring(posX, inputText.length);
      } else {
        inputText = '';
      }

      // replace prev input
      clearLine(output, 0);
      cursorTo(output, 0);

      // write to input and output
      rl.prompt();
      output.write(inputText);
      cursorTo(output, posX + PROMPT.length - 1);
      if (posX > 1) posX--;
    } else if (key.name === 'return' || key.name === 'enter') {
      inputHistoryIndex = 0;
      output.write('\n');
      rl.prompt();
      inputText = '';
      posX = inputText.length;
    } else if (key.ctrl === false && key.meta === false && key.shift === false) {
      // normal text input
      if (inputText !== undefined && inputText !== '') {
        inputText = inputText.substring(0, posX) + key.sequence + inputText.substring(posX, inputText.length);
      } else {
        inputText = key.sequence;
      }
      posX++;

      // replace prev input
      clearLine(output, 0);
      cursorTo(output, 0);

      // write to input and output
      rl.prompt();
      output.write(inputText);
      cursorTo(output, posX + PROMPT.length);
    } else {
      output.write(key.sequence);
      inputText += key.sequence;
      posX = inputText.length;
    }
  });

  rl.on('line', function(line) {
    // TODO fix for file reading input
    line = inputText !== undefined ? inputText : line;
    switch (line) {
      case 'exit':
      case 'quit':
      case 'q':
        rl.close();
        process.exit(0);
        break;
      default:
        if (line !== '') inputHistory.push(line);

        let l = new Lexer(line);
        let p = new Parser(l);
        let program = p.ParseProgram();

        if (p.Errors().length !== 0) {
          printParserErrors(errors, p.Errors());
          // if (!quiet) rl.prompt();
          return;
        }

        let evaluated = Eval(program, env);
        if (evaluated !== null) {
          lastOutput = evaluated;
          if (!quiet) output.write('\n' + evaluated.Inspect());
        }
        break;
    }
  });

  rl.on('end', () => {
    // return error code if script returns a number
    if (lastOutput instanceof OInteger) process.exit(lastOutput.Value);
    rl.close();
    process.exit(0);
  });

  rl.on('close', () => {
    rl.close();
    process.exit(0);
  });

  rl.on('error', (err: any) => {
    errors.write(`\x1b[31m==> \t${err}\n\x1b[0m`);
  });
}

function printParserErrors(output: NodeJS.WriteStream, errs: string[]) {
  output.write(`\n\x1b[31m`); // red
  output.write('Woops! We ran into some monkey business here!\n');
  output.write('    Parser errors:\n');

  errs.forEach((msg: string) => output.write(`\t${msg}\n`));

  output.write('\x1b[0m');
}
