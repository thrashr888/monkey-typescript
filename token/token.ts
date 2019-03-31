export default class Token {
  static ILLEGAL = 'ILLEGAL';
  static EOF = 'EOF';

  // Identifiers + literals
  static IDENT = 'IDENT'; // add, foobar, x, y, ...
  static INT = 'INT'; // 1343456

  // Operators
  static ASSIGN = '=';
  static PLUS = '+';
  static MINUS = '-';
  static BANG = '!';
  static ASTERISK = '*';
  static SLASH = '/';
  static LT = '<';
  static GT = '>';
  static EQ = '==';
  static NOT_EQ = '!=';

  // Delimiters
  static COMMA = ',';
  static SEMICOLON = ';';
  static LPAREN = '(';
  static RPAREN = ')';
  static LBRACE = '{';
  static RBRACE = '}';

  // Keywords
  static FUNCTION = 'FUNCTION';
  static LET = 'LET';
  static TRUE = 'TRUE';
  static FALSE = 'FALSE';
  static IF = 'IF';
  static ELSE = 'ELSE';
  static RETURN = 'RETURN';

  Type: string;
  Literal: string;

  constructor(type: string, literal: string) {
    this.Type = type;
    this.Literal = literal;
  }
}

export const Keywords: { [index: string]: string } = {
  fn: Token.FUNCTION,
  let: Token.LET,
  true: Token.TRUE,
  false: Token.FALSE,
  if: Token.IF,
  else: Token.ELSE,
  return: Token.RETURN,
};

export function LookupIdent(ident: string): string {
  if (Keywords[ident]) return Keywords[ident];
  return Token.IDENT;
}
