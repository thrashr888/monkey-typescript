export const Types = {
  ILLEGAL: 'ILLEGAL',
  EOF: 'EOF',

  // Identifiers + literals
  IDENT: 'IDENT', // add, foobar, x, y, ...
  INT: 'INT', // 1343456

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
  SEMICOLON: ',',

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

export class Token {
  constructor(type, literal) {
    this.Type = type;
    this.Literal = literal;
  }
}

export const Keywords = {
  fn: Types.FUNCTION,
  let: Types.LET,
  true: Types.TRUE,
  false: Types.FALSE,
  if: Types.IF,
  else: Types.ELSE,
  return: Types.RETURN,
};

export function LookupIdent(ident) {
  if (Keywords[ident]) return Keywords[ident];
  return Types.IDENT;
}
