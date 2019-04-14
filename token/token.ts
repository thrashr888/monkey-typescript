export default class Token {
  Type: string;
  Literal: string;

  constructor(type: string, literal: string) {
    this.Type = type;
    this.Literal = literal;
  }
}

export type TokenTypeName = string;

export const TokenType: { [index: string]: TokenTypeName } = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',

  // Identifiers + literals
  IDENT: 'IDENT', // add, foobar, x, y, ...
  INT: 'INT', // 1343456
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
  LT: '<',
  GT: '>',
  EQ: '==',
  NOT_EQ: '!=',

  // Delimiters
  COMMA: ',',
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
