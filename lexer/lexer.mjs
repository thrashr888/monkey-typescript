import { Types, Token, LookupIdent } from '../token/token.mjs';

export class Lexer {
  constructor(input) {
    this.input = input;
    this.position = 0; // current position in input (points to current char)
    this.readPosition = 0; // current reading position in input (after current char)
    this.ch = null; // current char under examination
  }

  NextToken() {
    let tok = new Token();

    this.skipWhitespace();

    switch (this.ch) {
      case '=':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(Types.EQ, literal);
        } else {
          tok = new Token(Types.ASSIGN, this.ch);
        }
        break;
      case '+':
        tok = new Token(Types.PLUS, this.ch);
        break;
      case '-':
        tok = new Token(Types.MINUS, this.ch);
        break;
      case '!':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(Types.NOT_EQ, literal);
        } else {
          tok = new Token(Types.BANG, this.ch);
        }
        break;
      case '/':
        tok = new Token(Types.SLASH, this.ch);
        break;
      case '*':
        tok = new Token(Types.ASTERISK, this.ch);
        break;
      case '<':
        tok = new Token(Types.LT, this.ch);
        break;
      case '>':
        tok = new Token(Types.GT, this.ch);
        break;
      case ';':
        tok = new Token(Types.SEMICOLON, this.ch);
        break;
      case ',':
        tok = new Token(Types.COMMA, this.ch);
        break;
      case '{':
        tok = new Token(Types.LBRACE, this.ch);
        break;
      case '}':
        tok = new Token(Types.RBRACE, this.ch);
        break;
      case '(':
        tok = new Token(Types.LPAREN, this.ch);
        break;
      case ')':
        tok = new Token(Types.RPAREN, this.ch);
        break;
      case 0:
        tok.Literal = '';
        tok.Type = Types.EOF;
        break;

      default:
        if (isLetter(this.ch)) {
          tok.Literal = this.readIdentifier();
          tok.Type = LookupIdent(tok.Literal);
          return tok;
        } else if (isDigit(this.ch)) {
          tok.Type = Types.INT;
          tok.Literal = this.readNumber();
          return tok;
        } else {
          tok = new Token(Types.ILLEGAL, this.ch);
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

function isLetter(ch) {
  if (!ch) return false;
  return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_' || ch === '-';
}

function isDigit(ch) {
  if (!ch) return false;
  return '0123456789'.indexOf(ch) !== -1;
}

export function NewLexer(input) {
  let l = new Lexer(input);
  l.readChar();
  return l;
}
