import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import Eval from '../evaluator/evaluator';
import process from 'process';

const PROMPT = '>> ';

export default function Start(input: NodeJS.ReadStream) {
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

    let evaluated = Eval(program);
    if (evaluated !== null) {
      console.log(evaluated.Inspect());
    }

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

function printParserErrors(errors: string[]) {
  console.log(MONKEY_FACE);
  console.log('Woops! We ran into some monkey business here!');
  console.log(' parser errors:');
  errors.forEach((msg: string) => console.log(`\t${msg}`));
}
