import Token from '../token/token';
import {
  ASTProgram,
  LetStatement,
  ReturnStatement,
  ExpressionStatement,
  Identifier,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression,
} from '../ast/ast.mjs';

export const LOWEST = 1,
  EQUALS = 2, // ==
  LESSGREATER = 3, // > or <
  SUM = 4, // +
  PRODUCT = 5, // *
  PREFIX = 6, // X or !X
  CALL = 7; // myFunction(X)

export const precedences = {
  [Token.EQ]: EQUALS,
  [Token.NOT_EQ]: EQUALS,
  [Token.LT]: LESSGREATER,
  [Token.GT]: LESSGREATER,
  [Token.PLUS]: SUM,
  [Token.MINUS]: SUM,
  [Token.SLASH]: PRODUCT,
  [Token.ASTERISK]: PRODUCT,
};

export default class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.errors = [];

    this.curToken = null;
    this.peekToken = null;

    this.prefixParseFns = {};
    this.registerPrefix(Token.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(Token.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(Token.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(Token.MINUS, this.parsePrefixExpression.bind(this));

    this.infixParseFns = {};
    // [
    //   Token.PLUS,
    //   Token.MINUS,
    //   Token.SLASH,
    //   Token.ASTERISK,
    //   Token.EQ,
    //   Token.NOT_EQ,
    //   Token.LT,
    //   Token.GT,
    // ].forEach(value => this.registerInfix(value, this.parseInfixExpression.bind(this)));

    this.registerInfix(Token.PLUS, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.MINUS, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.SLASH, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.ASTERISK, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.NOT_EQ, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.LT, this.parseInfixExpression.bind(this));
    this.registerInfix(Token.GT, this.parseInfixExpression.bind(this));

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
    if (!this.prefixParseFns[this.curToken.Type]) {
      this.noPrefixParseFnError(this.curToken.Type);
      return null;
    }

    let prefix = this.prefixParseFns[this.curToken.Type];
    let leftExp = prefix();

    while (!this.peekTokenIs(Token.SEMICOLON) && precedence < this.peekPrecedence()) {
      if (!this.infixParseFns[this.peekToken.Type]) {
        return leftExp;
      }

      let infix = this.infixParseFns[this.peekToken.Type];

      this.nextToken();

      leftExp = infix(leftExp);
    }

    return leftExp;
  }

  parseIdentifier() {
    return new Identifier(this.curToken, this.curToken.Literal);
  }

  parseIntegerLiteral() {
    let lit = new IntegerLiteral(this.curToken);

    try {
      let value = parseInt(this.curToken.Literal, 10);
      lit.Value = value;

      return lit;
    } catch {
      let msg = `could not parse ${this.curToken.Literal} as integer`;
      this.errors.push(msg);
      return null;
    }
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

  noPrefixParseFnError(t) {
    let msg = `no prefix parse function for ${t} found`;
    this.errors.push(msg);
  }

  parsePrefixExpression() {
    let expression = new PrefixExpression(this.curToken, this.curToken.Literal);

    this.nextToken();

    expression.Right = this.parseExpression(PREFIX);

    return expression;
  }

  peekPrecedence() {
    if (precedences[this.peekToken.Type]) return precedences[this.peekToken.Type];

    return LOWEST;
  }

  curPrecedence() {
    if (precedences[this.curToken.Type]) return precedences[this.curToken.Type];

    return LOWEST;
  }

  parseInfixExpression(left) {
    let expression = new InfixExpression(this.curToken, left, this.curToken.Literal);

    let precedence = this.curPrecedence();
    this.nextToken();
    expression.Right = this.parseExpression(precedence);

    return expression;
  }
}
