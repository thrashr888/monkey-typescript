import { Types } from '../token/token';
import { Lexer } from './lexer';

export function TestNextToken() {
  let input = `let five = 5;
let ten = 10;

let add = fn(x, y) {
  x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
  return true;
} else {
  return false;
}

10 == 10;
10 != 9;
`;

  let tests = [
    [Types.LET, 'let'],
    [Types.IDENT, 'five'],
    [Types.ASSIGN, '='],
    [Types.INT, '5'],
    [Types.SEMICOLON, ';'],
    [Types.LET, 'let'],
    [Types.IDENT, 'ten'],
    [Types.ASSIGN, '='],
    [Types.INT, '10'],
    [Types.SEMICOLON, ';'],
    [Types.LET, 'let'],
    [Types.IDENT, 'add'],
    [Types.ASSIGN, '='],
    [Types.FUNCTION, 'fn'],
    [Types.LPAREN, '('],
    [Types.IDENT, 'x'],
    [Types.COMMA, ','],
    [Types.IDENT, 'y'],
    [Types.RPAREN, ')'],
    [Types.LBRACE, '{'],
    [Types.IDENT, 'x'],
    [Types.PLUS, '+'],
    [Types.IDENT, 'y'],
    [Types.SEMICOLON, ';'],
    [Types.RBRACE, '}'],
    [Types.SEMICOLON, ';'],
    [Types.LET, 'let'],
    [Types.IDENT, 'result'],
    [Types.ASSIGN, '='],
    [Types.IDENT, 'add'],
    [Types.LPAREN, '('],
    [Types.IDENT, 'five'],
    [Types.COMMA, ','],
    [Types.IDENT, 'ten'],
    [Types.RPAREN, ')'],
    [Types.SEMICOLON, ';'],
    [Types.BANG, '!'],
    [Types.MINUS, '-'],
    [Types.SLASH, '/'],
    [Types.ASTERISK, '*'],
    [Types.INT, '5'],
    [Types.SEMICOLON, ';'],
    [Types.INT, '5'],
    [Types.LT, '<'],
    [Types.INT, '10'],
    [Types.GT, '>'],
    [Types.INT, '5'],
    [Types.SEMICOLON, ';'],
    [Types.IF, 'if'],
    [Types.LPAREN, '('],
    [Types.INT, '5'],
    [Types.LT, '<'],
    [Types.INT, '10'],
    [Types.RPAREN, ')'],
    [Types.LBRACE, '{'],
    [Types.RETURN, 'return'],
    [Types.TRUE, 'true'],
    [Types.SEMICOLON, ';'],
    [Types.RBRACE, '}'],
    [Types.ELSE, 'else'],
    [Types.LBRACE, '{'],
    [Types.RETURN, 'return'],
    [Types.FALSE, 'false'],
    [Types.SEMICOLON, ';'],
    [Types.RBRACE, '}'],
    [Types.INT, '10'],
    [Types.EQ, '=='],
    [Types.INT, '10'],
    [Types.SEMICOLON, ';'],
    [Types.INT, '10'],
    [Types.NOT_EQ, '!='],
    [Types.INT, '9'],
    [Types.SEMICOLON, ';'],
    [Types.EOF, ''],
  ];

  let l = new Lexer(input);

  for (let i in tests) {
    let tt = tests[i];
    let tok = l.NextToken();

    console.assert(tok.Type === tt[0], `tests[${i}] - tokentype wrong. expected=${tt[0]}, got=${tok.Type}`);
    console.assert(
      tok.Literal === tt[1],
      `tests[${i}] - literal wrong. expected=${tt[1]}, got=${tok.Literal}`
    );
  }
}
