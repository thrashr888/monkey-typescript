import { Lexer } from '../lexer/lexer';
import { Types } from '../token/token';
import process from 'process';

const PROMPT = '>> ';

export function Start(input) {
  process.stdout.write(PROMPT);

  input.on('data', line => {
    if (line === 'exit\n') process.exit();

    let l = new Lexer(line);

    for (let tok = l.NextToken(); tok.Type !== Types.EOF; tok = l.NextToken()) {
      console.log('%', tok);
    }

    process.stdout.write(PROMPT);
  });
}
