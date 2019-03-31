import Token, { LookupIdent } from '../token/token';

export default class Lexer {
  input: string;
  position: number = 0; // current position in input (points to current char)
  readPosition: number = 0; // current reading position in input (after current char)
  ch: string | number | null = null; // current char under examination

  constructor(input: string) {
    this.input = input;

    this.readChar();
  }

  NextToken() {
    let tok;

    this.skipWhitespace();

    switch (this.ch) {
      case '=':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(Token.EQ, literal);
        } else {
          tok = new Token(Token.ASSIGN, this.ch);
        }
        break;
      case '+':
        tok = new Token(Token.PLUS, this.ch);
        break;
      case '-':
        tok = new Token(Token.MINUS, this.ch);
        break;
      case '!':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(Token.NOT_EQ, literal);
        } else {
          tok = new Token(Token.BANG, this.ch);
        }
        break;
      case '/':
        tok = new Token(Token.SLASH, this.ch);
        break;
      case '*':
        tok = new Token(Token.ASTERISK, this.ch);
        break;
      case '<':
        tok = new Token(Token.LT, this.ch);
        break;
      case '>':
        tok = new Token(Token.GT, this.ch);
        break;
      case ';':
        tok = new Token(Token.SEMICOLON, this.ch);
        break;
      case ',':
        tok = new Token(Token.COMMA, this.ch);
        break;
      case '{':
        tok = new Token(Token.LBRACE, this.ch);
        break;
      case '}':
        tok = new Token(Token.RBRACE, this.ch);
        break;
      case '(':
        tok = new Token(Token.LPAREN, this.ch);
        break;
      case ')':
        tok = new Token(Token.RPAREN, this.ch);
        break;
      case 0:
        tok = new Token(Token.EOF, '');
        break;

      default:
        if (isLetter(this.ch)) {
          let literal = this.readIdentifier();
          return new Token(literal, literal);
        } else if (isDigit(this.ch)) {
          return new Token(Token.INT, this.readNumber());
        } else {
          tok = new Token(Token.ILLEGAL, '' + this.ch);
        }
    }

    this.readChar();

    return tok;
  }

  skipWhitespace() {
    while (this.ch === ' ' || this.ch === '\t' || this.ch === '\n' || this.ch === '\r') {
      this.readChar();
    }
  }

  readChar() {
    if (this.readPosition >= this.input.length) {
      this.ch = 0;
    } else {
      this.ch = this.input[this.readPosition];
    }

    this.position = this.readPosition;
    this.readPosition += 1;
  }

  peekChar() {
    if (this.readPosition >= this.input.length) {
      return 0;
    } else {
      return this.input[this.readPosition];
    }
  }

  readIdentifier() {
    let position = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }

  readNumber() {
    let position = this.position;
    while (isDigit(this.ch)) {
      this.readChar();
    }
    return this.input.slice(position, this.position);
  }
}

function isLetter(ch: string | number | null) {
  if (!ch) return false;
  return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_' || ch === '-';
}

function isDigit(ch: string | number | null) {
  if (!ch) return false;
  if (typeof ch === 'number') return true;
  return '0123456789'.indexOf(ch) !== -1;
}
