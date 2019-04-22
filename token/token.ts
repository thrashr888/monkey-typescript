import Position from './position';

export default class Token {
  Type: string;
  Literal: string;
  Position: Position;

  constructor(type: string, literal: string, position?: Position) {
    this.Type = type;
    this.Literal = literal;
    this.Position = position || new Position(0, 0, 0);
  }
}

export type TokenTypeName = string;

export const TokenType: { [index: string]: TokenTypeName } = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',
  COMMENT: 'COMMENT',

  // Identifiers + literals
  IDENT: 'IDENT', // add, foobar, x, y, ...
  INT: 'INT', // 1343456
  FLOAT: 'FLOAT', // 123.456
  STRING: 'STRING', // "foo", "Hello, World!"

  LBRACKET: '[', // for arrays
  RBRACKET: ']',

  // Operators
  ASSIGN: '=',
  PLUS: '+',
  MINUS: '-',
  BANG: '!',
  ASTERISK: '*',
  SLASH: '/',
  REM: '%',
  LT: '<',
  GT: '>',
  LTE: '<=',
  GTE: '>=',
  EQ: '==',
  NOT_EQ: '!=',

  // Delimiters
  COMMA: ',',
  PERIOD: '.',
  COLON: ':',
  SEMICOLON: ';',
  LPAREN: '(',
  RPAREN: ')',
  LBRACE: '{',
  RBRACE: '}',

  // Keywords
  FUNCTION: 'FUNCTION',
  LET: 'LET',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  IF: 'IF',
  ELSE: 'ELSE',
  RETURN: 'RETURN',
};

export const Keywords: { [index: string]: string } = {
  fn: TokenType.FUNCTION,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
};

export function LookupIdent(ident: string): string {
  if (Keywords[ident]) return Keywords[ident];
  return TokenType.IDENT;
}
