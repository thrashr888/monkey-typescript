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
  EXPONENT: '**',
  SLASH: '/',
  REM: '%',
  LT: '<',
  GT: '>',
  LTE: '<=',
  GTE: '>=',
  EQ: '==',
  NOT_EQ: '!=',

  // Bitwise
  BIT_AND: '&',
  BIT_OR: '|',
  BIT_XOR: '^',
  BIT_NOT: '~',
  BIT_LSHIFT: '<<',
  BIT_RSHIFT: '>>',
  BIT_ZRSHIFT: '>>>',

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
  LAND: 'AND',
  LOR: 'OR',
  FUNCTION: 'FUNCTION',
  WHILE: 'WHILE',
  LET: 'LET',
  TRUE: 'TRUE',
  FALSE: 'FALSE',
  IF: 'IF',
  ELSE: 'ELSE',
  RETURN: 'RETURN',
};

// keyword strings are defined here as the index
// for example, this is where a function is defined as "function"
export const Keywords: { [index: string]: string } = {
  function: TokenType.FUNCTION,
  while: TokenType.WHILE,
  let: TokenType.LET,
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  if: TokenType.IF,
  else: TokenType.ELSE,
  return: TokenType.RETURN,
  and: TokenType.LAND,
  or: TokenType.LOR,
};

export function LookupIdent(ident: string): string {
  if (Keywords[ident]) return Keywords[ident];
  return TokenType.IDENT;
}
