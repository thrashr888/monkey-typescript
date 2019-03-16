import { Types, Token } from "../token/token";

export const Lexer = {
  input: null,
  position: 0, // current position in input (points to current char)
  readPosition: 0, // current reading position in input (after current char)
  ch: null, // current char under examination

  constructor(input) {
    this.input = input;
  },

  NextToken() {
    let tok;

    this.skipWhitespace();

    switch (this.ch) {
      case "=":
        tok = Token(Types.ASSIGN, this.ch);
        break;
      case "+":
        tok = Token(Types.PLUS, this.ch);
      case "-":
        tok = Token(Types.MINUS, this.ch);
      default:
        tok = Token(Types.ILLEGAL, this.ch);
    }

    this.readChar();

    return tok;
  },

  skipWhitespace() {
    if (
      this.ch == " " ||
      this.ch == "\t" ||
      this.ch == "\n" ||
      this.ch == "\r"
    ) {
      this.readChar();
    }
  },

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = 0;
    } else {
      this.ch = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  },

  peekChar() {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition];
    }
  },

  readIdentifier() {
    let position = this.position;
    if (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  },

  readNumber() {
    let position = this.position;
    if (isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }
};

function isLetter(ch) {
  return (
    ("a" <= ch && ch <= "z") ||
    ("A" <= ch && ch <= "Z") ||
    ch == "_" ||
    ch == "-"
  );
}

function isDigit(ch) {
  return "0" <= ch && ch <= "9";
}

export function New(input) {
  let l = Lexer(input);
  l.readChar();
  return l;
}

function newToken(tokenType, ch) {
  return Token(tokenType, ch);
}
