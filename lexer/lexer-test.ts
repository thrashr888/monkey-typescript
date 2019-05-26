import { TokenType } from '../token/token';
import Lexer from './lexer';
import Test from '../test';

export function TestLexer(t: Test) {
  console.log('║  └ TestNextToken');
  TestNextToken(t);
}

export function TestNextToken(t: Test) {
  let input = `let five = 5;
let ten = 10;

let add = function(x, y) {
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
"foobar"
"foo bar"
[1, 2];
{"foo": "bar"}
1 >= 2
2 <= 1
123.45
`;

  let tests = [
    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'five'],
    [TokenType.ASSIGN, '='],
    [TokenType.INT, '5'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'ten'],
    [TokenType.ASSIGN, '='],
    [TokenType.INT, '10'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'add'],
    [TokenType.ASSIGN, '='],
    [TokenType.FUNCTION, 'function'],
    [TokenType.LPAREN, '('],
    [TokenType.IDENT, 'x'],
    [TokenType.COMMA, ','],
    [TokenType.IDENT, 'y'],
    [TokenType.RPAREN, ')'],
    [TokenType.LBRACE, '{'],
    [TokenType.IDENT, 'x'],
    [TokenType.PLUS, '+'],
    [TokenType.IDENT, 'y'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.RBRACE, '}'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.LET, 'let'],
    [TokenType.IDENT, 'result'],
    [TokenType.ASSIGN, '='],
    [TokenType.IDENT, 'add'],
    [TokenType.LPAREN, '('],
    [TokenType.IDENT, 'five'],
    [TokenType.COMMA, ','],
    [TokenType.IDENT, 'ten'],
    [TokenType.RPAREN, ')'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.BANG, '!'],
    [TokenType.MINUS, '-'],
    [TokenType.SLASH, '/'],
    [TokenType.ASTERISK, '*'],
    [TokenType.INT, '5'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.INT, '5'],
    [TokenType.LT, '<'],
    [TokenType.INT, '10'],
    [TokenType.GT, '>'],
    [TokenType.INT, '5'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.IF, 'if'],
    [TokenType.LPAREN, '('],
    [TokenType.INT, '5'],
    [TokenType.LT, '<'],
    [TokenType.INT, '10'],
    [TokenType.RPAREN, ')'],
    [TokenType.LBRACE, '{'],
    [TokenType.RETURN, 'return'],
    [TokenType.TRUE, 'true'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.RBRACE, '}'],
    [TokenType.ELSE, 'else'],
    [TokenType.LBRACE, '{'],
    [TokenType.RETURN, 'return'],
    [TokenType.FALSE, 'false'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.RBRACE, '}'],
    [TokenType.INT, '10'],
    [TokenType.EQ, '=='],
    [TokenType.INT, '10'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.INT, '10'],
    [TokenType.NOT_EQ, '!='],
    [TokenType.INT, '9'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.STRING, 'foobar'],
    [TokenType.STRING, 'foo bar'],
    [TokenType.LBRACKET, '['],
    [TokenType.INT, '1'],
    [TokenType.COMMA, ','],
    [TokenType.INT, '2'],
    [TokenType.RBRACKET, ']'],
    [TokenType.SEMICOLON, ';'],
    [TokenType.LBRACE, '{'],
    [TokenType.STRING, 'foo'],
    [TokenType.COLON, ':'],
    [TokenType.STRING, 'bar'],
    [TokenType.RBRACE, '}'],
    [TokenType.INT, '1'],
    [TokenType.GTE, '>='],
    [TokenType.INT, '2'],
    [TokenType.INT, '2'],
    [TokenType.LTE, '<='],
    [TokenType.INT, '1'],
    [TokenType.FLOAT, '123.45'],
    [TokenType.EOF, ''],
  ];

  let l = new Lexer(input);

  for (let i in tests) {
    let tt = tests[i];
    let tok = l.NextToken();

    t.Assert(tok.Type === tt[0], `tests[${i}] - type wrong. expected=${tt[0]}, got=${tok.Type}`);
    t.Assert(tok.Literal === tt[1], `tests[${i}] - literal wrong. expected=${tt[1]}, got=${tok.Literal}`);
  }
}
