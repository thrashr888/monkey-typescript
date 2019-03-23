import Lexer from '../lexer/lexer';
import Token from '../token/token';
import process from 'process';

const PROMPT = '>> ';

export function Start(input) {
  process.stdout.write(PROMPT);

  input.on('data', line => {
    if (line === 'exit\n') process.exit();

    let l = new Lexer(line);

    for (let tok = l.NextToken(); tok.Type !== Token.EOF; tok = l.NextToken()) {
      console.log('%', tok);
    }

    process.stdout.write(PROMPT);
  });
}
