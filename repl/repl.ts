import process from 'process';

import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import Eval from '../evaluator/evaluator';
import { NewNodeEnvironment } from '../object/environment';
import OObject, { OInteger } from '../object/object';

const PROMPT = '>> ';

export default function Start(input: any, output: NodeJS.WriteStream, quiet = false) {
  if (!quiet) output.write(PROMPT);

  let env = NewNodeEnvironment();
  env.Logger.Follow((date: Date, messages: string) => {
    console.log(date, ...messages);
  });
  let lastOutput: OObject;

  input.on('data', (data: any) => {
    if (data === 'exit\n') process.exit(0);

    let l = new Lexer(data);
    let p = new Parser(l);

    let program = p.ParseProgram();

    if (p.Errors().length !== 0) {
      printParserErrors(process.stderr, p.Errors());
      if (!quiet) output.write(PROMPT);
      return;
    }

    let evaluated = Eval(program, env);
    if (evaluated !== null) {
      lastOutput = evaluated;
      if (!quiet) output.write(evaluated.Inspect());
      if (!quiet) output.write('\n');
    }

    if (!quiet) output.write(PROMPT);
  });

  input.on('end', () => {
    // return error code if script returns a number
    if (lastOutput instanceof OInteger) process.exit(lastOutput.Value);
    process.exit(0);
  });

  input.on('close', () => {
    process.exit(0);
  });

  input.on('error', (err: any) => {
    process.stderr.write(`\x1b[31m==> \t${err}\n\x1b[0m`);
  });
}

function printParserErrors(output: NodeJS.WriteStream, errors: string[]) {
  output.write(`\x1b[31m`); // red
  output.write('Woops! We ran into some monkey business here!\n');
  output.write('    Parser errors:\n');

  errors.forEach((msg: string) => output.write(`\t${msg}\n`));

  output.write('\x1b[0m');
}
