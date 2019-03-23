export default class Token {
  constructor(type, literal) {
    this.Type = type;
    this.Literal = literal;
  }
}

Token.ILLEGAL = 'ILLEGAL';
Token.EOF = 'EOF';

// Identifiers + literals
Token.IDENT = 'IDENT'; // add, foobar, x, y, ...
Token.INT = 'INT'; // 1343456

// Operators
Token.ASSIGN = '=';
Token.PLUS = '+';
Token.MINUS = '-';
Token.BANG = '!';
Token.ASTERISK = '*';
Token.SLASH = '/';
Token.LT = '<';
Token.GT = '>';
Token.EQ = '==';
Token.NOT_EQ = '!=';

// Delimiters
Token.COMMA = ',';
Token.SEMICOLON = ',';
Token.LPAREN = '(';
Token.RPAREN = ')';
Token.LBRACE = '{';
Token.RBRACE = '}';

// Keywords
Token.FUNCTION = 'FUNCTION';
Token.LET = 'LET';
Token.TRUE = 'TRUE';
Token.FALSE = 'FALSE';
Token.IF = 'IF';
Token.ELSE = 'ELSE';
Token.RETURN = 'RETURN';

export const Keywords = {
  fn: Token.FUNCTION,
  let: Token.LET,
  true: Token.TRUE,
  false: Token.FALSE,
  if: Token.IF,
  else: Token.ELSE,
  return: Token.RETURN,
};

export function LookupIdent(ident) {
  if (Keywords[ident]) return Keywords[ident];
  return Token.IDENT;
}
