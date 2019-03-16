export const Types = {
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",

  // Identifiers + literals
  IDENT: "IDENT", // add, foobar, x, y, ...
  INT: "INT", // 1343456

  // Operators
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  BANG: "!",
  ASTERISK: "*",
  SLASH: "/",

  LT: "<",
  GT: ">",

  EQ: "==",
  NOT_EQ: "!=",

  // Delimiters
  COMMA: ",",
  SEMICOLON: ",",

  LPAREN: "(",
  RPAREN: ")",
  LBRACE: "{",
  RBRACE: "}",

  // Keywords
  FUNCTION: "FUNCTION",
  LET: "LET",
  TRUE: "TRUE",
  FALSE: "FALSE",
  IF: "IF",
  ELSE: "ELSE",
  RETURN: "RETURN"
};

export const Token = {
  constructor(type, literal) {
    this.Type = type;
    this.Literal = literal;
  },

  Type: null,
  Literal: null
};

export const Keywords = {
  fn: FUNCTION,
  let: LET,
  true: TRUE,
  false: FALSE,
  if: IF,
  else: ELSE,
  return: RETURN
};

export function LookupIdent(ident) {
  if (Keywords[ident]) return Keywords[ident];
  return ident;
}
