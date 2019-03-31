import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import process from 'process';

const PROMPT = '>> ';

export function Start(input: NodeJS.ReadStream) {
  process.stdout.write(PROMPT);

  let prevLine;

  input.on('data', line => {
    if (line === 'exit\n') process.exit();

    let l = new Lexer(line);
    let p = new Parser(l);

    let program = p.ParseProgram();

    if (p.Errors().length !== 0) {
      printParserErrors(p.Errors());
      process.stdout.write(PROMPT);
      return;
    }

    console.log(program.String());

    prevLine = line;
    process.stdout.write(PROMPT);
  });
}

const MONKEY_FACE = `            __,__
   .--.  .-"     "-.  .--.
  / .. \\/  .-. .-.  \\/ .. \\
 | |  '|  /   Y   \\  |'  | |
 | \\   \\  \\ 0 | 0 /  /   / |
  \\ '- ,\\.-"""""""-./, -' /
   ''-' /_   ^ ^   _\\ '-''
       |  \\._   _./  |
       \\   \\ '~' /   /
        '._ '-=-' _.'
           '-----'
`;

function printParserErrors(errors: Array<string>) {
  console.log(MONKEY_FACE);
  console.log('Woops! We ran into some monkey business here!');
  console.log(' parser errors:');
  errors.forEach((msg: string) => console.log(`\t${msg}`));
}
