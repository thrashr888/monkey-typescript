import Token, { TokenType, LookupIdent } from '../token/token';

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
          tok = new Token(TokenType.EQ, literal);
        } else {
          tok = new Token(TokenType.ASSIGN, this.ch);
        }
        break;
      case '+':
        tok = new Token(TokenType.PLUS, this.ch);
        break;
      case '-':
        tok = new Token(TokenType.MINUS, this.ch);
        break;
      case '!':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.NOT_EQ, literal);
        } else {
          tok = new Token(TokenType.BANG, this.ch);
        }
        break;
      case '/':
        tok = new Token(TokenType.SLASH, this.ch);
        break;
      case '*':
        tok = new Token(TokenType.ASTERISK, this.ch);
        break;
      case '%':
        tok = new Token(TokenType.REM, this.ch);
        break;
      case '<':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.LTE, literal);
        } else {
          tok = new Token(TokenType.LT, this.ch);
        }
        break;
      case '>':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.GTE, literal);
        } else {
          tok = new Token(TokenType.GT, this.ch);
        }
        break;
      case ';':
        tok = new Token(TokenType.SEMICOLON, this.ch);
        break;
      case ',':
        tok = new Token(TokenType.COMMA, this.ch);
        break;
      case '{':
        tok = new Token(TokenType.LBRACE, this.ch);
        break;
      case '}':
        tok = new Token(TokenType.RBRACE, this.ch);
        break;
      case '(':
        tok = new Token(TokenType.LPAREN, this.ch);
        break;
      case ')':
        tok = new Token(TokenType.RPAREN, this.ch);
        break;
      case '[':
        tok = new Token(TokenType.LBRACKET, this.ch);
        break;
      case ']':
        tok = new Token(TokenType.RBRACKET, this.ch);
        break;
      case '"':
        tok = new Token(TokenType.STRING, this.readString());
        break;
      case ':':
        tok = new Token(TokenType.COLON, this.ch);
        break;
      case 0:
        tok = new Token(TokenType.EOF, '');
        break;

      default:
        if (isLetter(this.ch)) {
          let literal = this.readIdentifier();
          return new Token(LookupIdent(literal), literal);
        } else if (isDigit(this.ch)) {
          let literal = this.readNumber();
          if (isFloat(literal)) {
            return new Token(TokenType.FLOAT, literal);
          }
          return new Token(TokenType.INT, literal);
        } else {
          tok = new Token(TokenType.ILLEGAL, '' + this.ch);
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

  readString() {
    let position = this.position + 1;
    while (true) {
      this.readChar();
      if (this.ch === '"' || this.ch === 0) {
        break;
      }
    }
    return this.input.slice(position, this.position);
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

function isLetter(ch: string | number | null): boolean {
  if (!ch) return false;
  return ('a' <= ch && ch <= 'z') || ('A' <= ch && ch <= 'Z') || ch === '_' || ch === '-';
}

function isDigit(ch: string | number | null): boolean {
  if (!ch) return false;
  if (typeof ch === 'number') return true;
  return '0123456789.'.indexOf(ch) !== -1;
}

function isFloat(n: string): boolean {
  let val = parseFloat(n);
  return !isNaN(val) && n.indexOf('.') !== -1;
}
