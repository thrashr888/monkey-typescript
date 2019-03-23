import { ASTProgram, LetStatement, ReturnStatement, ExpressionStatement, Identifier } from '../ast/ast';
import Token from '../token/token';

export const LOWEST = 1,
  EQUALS = 2, // ==
  LESSGREATER = 3, // > or <
  SUM = 4, // +
  PRODUCT = 5, // *
  PREFIX = 6, // X or !X
  CALL = 7; // myFunction(X)

export default class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.errors = [];

    this.curToken = null;
    this.peekToken = null;

    this.prefixParseFns = {};
    this.registerPrefix(Token.IDENT, this.parseIdentifier.bind(this));

    this.infixParseFns = {};

    this.nextToken();
    this.nextToken();
  }

  Errors() {
    return this.errors;
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  ParseProgram() {
    let program = new ASTProgram();

    while (!this.curTokenIs(Token.EOF)) {
      let stmt = this.parseStatement();
      if (stmt !== null) {
        program.Statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement() {
    switch (this.curToken.Type) {
      case Token.LET:
        return this.parseLetStatement();
      case Token.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement() {
    let stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(Token.IDENT)) return null;

    stmt.Name = new Identifier(this.curToken, this.curToken.Literal);

    if (!this.expectPeek(Token.ASSIGN)) return null;

    while (!this.curTokenIs(Token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement() {
    let stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    // TODO add expression

    while (!this.curTokenIs(Token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement() {
    let stmt = new ExpressionStatement(this.curToken);

    stmt.Expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(Token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence) {
    if (!this.prefixParseFns[this.curToken.Type]) return null;

    let prefix = this.prefixParseFns[this.curToken.Type];
    if (prefix === null) return null;

    let leftExp = prefix();
    return leftExp;
  }

  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.Literal);
  }

  curTokenIs(t) {
    return this.curToken.Type === t;
  }

  peekTokenIs(t) {
    return this.peekToken.Type === t;
  }

  expectPeek(t) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  peekError(t) {
    let msg = `expected next token to be ${t}, got ${this.peekToken.Type} instead`;
    this.errors.push(msg);
  }

  registerPrefix(tokenType, fn) {
    this.prefixParseFns[tokenType] = fn;
  }
  registerInfix(tokenType, fn) {
    this.infixParseFns[tokenType] = fn;
  }
}
