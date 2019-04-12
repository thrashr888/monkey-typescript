import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';
import Eval from '../evaluator/evaluator';
import process from 'process';
import Environment from '../object/environment';

const PROMPT = '>> ';

export default function Start(input: NodeJS.ReadStream, out: NodeJS.WriteStream) {
  out.write(PROMPT);

  let env = new Environment();

  input.on('data', line => {
    if (line === 'exit\n') process.exit();

    let l = new Lexer(line);
    let p = new Parser(l);

    let program = p.ParseProgram();

    if (p.Errors().length !== 0) {
      printParserErrors(p.Errors());
      out.write(PROMPT);
      return;
    }

    let evaluated = Eval(program, env);
    if (evaluated !== null) {
      out.write(evaluated.Inspect());
      out.write('\n');
    }

    out.write(PROMPT);
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
