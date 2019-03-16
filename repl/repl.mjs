import { Lexer } from '../lexer/lexer';
import { Token } from '../token/token';

const PROMPT = '>> ';

export function Start(input) {
  console.log(PROMPT);

  let line = input;

  let l = Lexer(line);

  for (let tok = l.NextToken(); tok.Type != Token.EOF; tok = l.NextToken()) {
    console.log('%', tok);
  }
}
