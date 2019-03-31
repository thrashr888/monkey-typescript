import Token from '../token/token';
import Lexer from './lexer';
import Test from '../test';

export function TestLexer(t: Test) {
  TestNextToken(t);
}

export function TestNextToken(t: Test) {
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
    [Token.LET, 'let'],
    [Token.IDENT, 'five'],
    [Token.ASSIGN, '='],
    [Token.INT, '5'],
    [Token.SEMICOLON, ';'],
    [Token.LET, 'let'],
    [Token.IDENT, 'ten'],
    [Token.ASSIGN, '='],
    [Token.INT, '10'],
    [Token.SEMICOLON, ';'],
    [Token.LET, 'let'],
    [Token.IDENT, 'add'],
    [Token.ASSIGN, '='],
    [Token.FUNCTION, 'fn'],
    [Token.LPAREN, '('],
    [Token.IDENT, 'x'],
    [Token.COMMA, ','],
    [Token.IDENT, 'y'],
    [Token.RPAREN, ')'],
    [Token.LBRACE, '{'],
    [Token.IDENT, 'x'],
    [Token.PLUS, '+'],
    [Token.IDENT, 'y'],
    [Token.SEMICOLON, ';'],
    [Token.RBRACE, '}'],
    [Token.SEMICOLON, ';'],
    [Token.LET, 'let'],
    [Token.IDENT, 'result'],
    [Token.ASSIGN, '='],
    [Token.IDENT, 'add'],
    [Token.LPAREN, '('],
    [Token.IDENT, 'five'],
    [Token.COMMA, ','],
    [Token.IDENT, 'ten'],
    [Token.RPAREN, ')'],
    [Token.SEMICOLON, ';'],
    [Token.BANG, '!'],
    [Token.MINUS, '-'],
    [Token.SLASH, '/'],
    [Token.ASTERISK, '*'],
    [Token.INT, '5'],
    [Token.SEMICOLON, ';'],
    [Token.INT, '5'],
    [Token.LT, '<'],
    [Token.INT, '10'],
    [Token.GT, '>'],
    [Token.INT, '5'],
    [Token.SEMICOLON, ';'],
    [Token.IF, 'if'],
    [Token.LPAREN, '('],
    [Token.INT, '5'],
    [Token.LT, '<'],
    [Token.INT, '10'],
    [Token.RPAREN, ')'],
    [Token.LBRACE, '{'],
    [Token.RETURN, 'return'],
    [Token.TRUE, 'true'],
    [Token.SEMICOLON, ';'],
    [Token.RBRACE, '}'],
    [Token.ELSE, 'else'],
    [Token.LBRACE, '{'],
    [Token.RETURN, 'return'],
    [Token.FALSE, 'false'],
    [Token.SEMICOLON, ';'],
    [Token.RBRACE, '}'],
    [Token.INT, '10'],
    [Token.EQ, '=='],
    [Token.INT, '10'],
    [Token.SEMICOLON, ';'],
    [Token.INT, '10'],
    [Token.NOT_EQ, '!='],
    [Token.INT, '9'],
    [Token.SEMICOLON, ';'],
    [Token.EOF, ''],
  ];

  let l = new Lexer(input);

  for (let i in tests) {
    let tt = tests[i];
    let tok = l.NextToken();

    t.Assert(tok.Type === tt[0], `tests[${i}] - tokentype wrong. expected=${tt[0]}, got=${tok.Type}`);
    t.Assert(tok.Literal === tt[1], `tests[${i}] - literal wrong. expected=${tt[1]}, got=${tok.Literal}`);
  }
}
