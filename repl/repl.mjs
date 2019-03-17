import { Lexer } from '../lexer/lexer';
import { Types } from '../token/token';

const PROMPT = '>> ';

export function Start(input) {
  console.log(PROMPT, input);

  let line = input;

  let l = new Lexer(line);

  for (let tok = l.NextToken(); tok.Type !== Types.EOF; tok = l.NextToken()) {
    console.log('%', tok.Type);
  }
}
