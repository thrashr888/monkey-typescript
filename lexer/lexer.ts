import Token, { TokenType, LookupIdent } from '../token/token';
import Position from '../token/position';

export default class Lexer {
  input: string;
  line: number = 1;
  column: number = 0;
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

    let pos = new Position(this.position, this.line, this.column);

    switch (this.ch) {
      case '=':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.EQ, literal, pos);
        } else {
          tok = new Token(TokenType.ASSIGN, this.ch, pos);
        }
        break;
      case '+':
        tok = new Token(TokenType.PLUS, this.ch, pos);
        break;
      case '-':
        tok = new Token(TokenType.MINUS, this.ch, pos);
        break;
      case '!':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.NOT_EQ, literal, pos);
        } else {
          tok = new Token(TokenType.BANG, this.ch, pos);
        }
        break;
      case '/':
        if (this.peekChar() === '/') {
          this.readChar();
          tok = new Token(TokenType.COMMENT, this.readComment(), pos);
          break;
        } else {
          tok = new Token(TokenType.SLASH, this.ch, pos);
        }
        break;
      case '#':
        tok = new Token(TokenType.COMMENT, this.readComment(), pos);
        break;
      case '*':
        tok = new Token(TokenType.ASTERISK, this.ch, pos);
        break;
      case '%':
        tok = new Token(TokenType.REM, this.ch, pos);
        break;
      case '<':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.LTE, literal, pos);
        } else {
          tok = new Token(TokenType.LT, this.ch, pos);
        }
        break;
      case '>':
        if (this.peekChar() === '=') {
          let ch = this.ch;
          this.readChar();
          let literal = ch + this.ch;
          tok = new Token(TokenType.GTE, literal, pos);
        } else {
          tok = new Token(TokenType.GT, this.ch, pos);
        }
        break;
      case ';':
        tok = new Token(TokenType.SEMICOLON, this.ch, pos);
        break;
      case ',':
        tok = new Token(TokenType.COMMA, this.ch, pos);
        break;
      case '{':
        tok = new Token(TokenType.LBRACE, this.ch, pos);
        break;
      case '}':
        tok = new Token(TokenType.RBRACE, this.ch, pos);
        break;
      case '(':
        tok = new Token(TokenType.LPAREN, this.ch, pos);
        break;
      case ')':
        tok = new Token(TokenType.RPAREN, this.ch, pos);
        break;
      case '[':
        tok = new Token(TokenType.LBRACKET, this.ch, pos);
        break;
      case ']':
        tok = new Token(TokenType.RBRACKET, this.ch, pos);
        break;
      case '"':
        tok = new Token(TokenType.STRING, this.readString(), pos);
        break;
      case "'":
        tok = new Token(TokenType.STRING, this.readString("'"), pos);
        break;
      case ':':
        tok = new Token(TokenType.COLON, this.ch, pos);
        break;
      case 0:
        tok = new Token(TokenType.EOF, '', pos);
        break;

      default:
        if (isLetter(this.ch)) {
          let literal = this.readIdentifier();
          return new Token(LookupIdent(literal), literal, pos);
        } else if (isDigit(this.ch)) {
          let literal = this.readNumber();
          if (isFloat(literal)) {
            return new Token(TokenType.FLOAT, literal, pos);
          }
          return new Token(TokenType.INT, literal, pos);
        } else {
          tok = new Token(TokenType.ILLEGAL, '' + this.ch, pos);
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

    if (this.ch === '\n') {
      this.column = 0;
      this.line++;
    }

    this.position = this.readPosition;
    this.column++;
    this.readPosition++;
  }

  readString(type: string = '"') {
    let position = this.position + 1;
    while (true) {
      this.readChar();
      if (this.ch === type || this.ch === 0) {
        break;
      }
    }
    return this.input.slice(position, this.position);
  }

  readComment() {
    let position = this.position + 1;
    while (true) {
      this.readChar();
      if (this.ch === '\n' || this.ch === '\r') {
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

function isNewline(ch: string | number | null): boolean {
  return ch === '\n' || ch === '\r';
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
