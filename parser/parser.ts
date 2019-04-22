import Token, { TokenType, TokenTypeName } from '../token/token';
import Lexer from '../lexer/lexer';
import {
  AstBoolean,
  ASTProgram,
  BlockStatement,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionLiteral,
  Identifier,
  Comment,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  FloatLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  Statement,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
  HashLiteral,
} from '../ast/ast';

export const LOWEST = 1,
  LOR = 2, // or
  LAND = 3, // and
  EQUALS = 4, // ==
  LESSGREATER = 5, // > or <
  SUM = 6, // +
  PRODUCT = 7, // *
  PREFIX = 8, // X or !X
  CALL = 9, // myFunction(X)
  INDEX = 10; // array[index]

export const precedences: { [index: string]: number } = {
  [TokenType.LOR]: EQUALS,
  [TokenType.LAND]: EQUALS,
  [TokenType.EQ]: EQUALS,
  [TokenType.NOT_EQ]: EQUALS,
  [TokenType.LT]: LESSGREATER,
  [TokenType.LTE]: LESSGREATER,
  [TokenType.GT]: LESSGREATER,
  [TokenType.GTE]: LESSGREATER,
  [TokenType.PLUS]: SUM,
  [TokenType.MINUS]: SUM,
  [TokenType.SLASH]: PRODUCT,
  [TokenType.ASTERISK]: PRODUCT,
  [TokenType.REM]: PRODUCT,
  [TokenType.LPAREN]: CALL,
  [TokenType.LBRACKET]: INDEX,
};

export default class Parser {
  l: Lexer;
  errors: string[] = [];

  curToken: Token;
  peekToken: Token;

  prefixParseFns: { [index: string]: Function } = {};
  infixParseFns: { [index: string]: Function } = {};

  constructor(lexer: Lexer) {
    this.l = lexer;

    this.registerPrefix(TokenType.COMMENT, this.parseComment.bind(this));
    this.registerPrefix(TokenType.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(TokenType.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(TokenType.FLOAT, this.parseFloatLiteral.bind(this));
    this.registerPrefix(TokenType.STRING, this.parseStringLiteral.bind(this));
    this.registerPrefix(TokenType.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(TokenType.MINUS, this.parsePrefixExpression.bind(this));

    this.registerPrefix(TokenType.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(TokenType.FALSE, this.parseBoolean.bind(this));

    this.registerPrefix(TokenType.LPAREN, this.parseGroupedExpression.bind(this));

    this.registerPrefix(TokenType.IF, this.parseIfExpression.bind(this));
    this.registerPrefix(TokenType.FUNCTION, this.parseFunctionLiteral.bind(this));
    this.registerPrefix(TokenType.LBRACKET, this.parseArrayLiteral.bind(this));
    this.registerPrefix(TokenType.LBRACE, this.parseHashLiteral.bind(this));

    [
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.SLASH,
      TokenType.ASTERISK,
      TokenType.EQ,
      TokenType.NOT_EQ,
      TokenType.LT,
      TokenType.LTE,
      TokenType.GT,
      TokenType.GTE,
      TokenType.REM,
      TokenType.LAND,
      TokenType.LOR,
    ].forEach(value => this.registerInfix(value, this.parseInfixExpression.bind(this)));

    this.registerInfix(TokenType.LPAREN, this.parseCallExpression.bind(this));
    this.registerInfix(TokenType.LBRACKET, this.parseIndexExpression.bind(this));

    // equivalent to calling this.nextToken() twice
    this.peekToken = this.l.NextToken();
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
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

    while (!this.curTokenIs(TokenType.EOF)) {
      let stmt = this.parseStatement();
      if (stmt !== null) {
        program.Statements.push(stmt);
      }
      this.nextToken();
    }

    return program;
  }

  parseStatement(): Statement | null {
    switch (this.curToken.Type) {
      case TokenType.LET:
        return this.parseLetStatement();
      case TokenType.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement(): Statement | null {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    let Name = new Identifier(this.curToken, this.curToken.Literal);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    this.nextToken();

    let Value = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return new LetStatement(curToken, Name, Value);
  }

  parseReturnStatement() {
    let stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    stmt.ReturnValue = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement() {
    let curToken = this.curToken;

    let Expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return new ExpressionStatement(curToken, Expression);
  }

  parseExpression(precedence: number) {
    if (!this.prefixParseFns[this.curToken.Type]) {
      this.noPrefixParseFnError(this.curToken);
      return null;
    }

    let prefix = this.prefixParseFns[this.curToken.Type];
    let leftExp = prefix();

    while (!this.peekTokenIs(TokenType.SEMICOLON) && precedence < this.peekPrecedence()) {
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

  parseComment() {
    return new Comment(this.curToken, this.curToken.Literal);
  }

  formatError(t: Token, msg: string): string {
    return `${msg} at ${t.Position.String()}`;
  }

  parseIntegerLiteral() {
    try {
      let value = parseInt(this.curToken.Literal, 10);
      let lit = new IntegerLiteral(this.curToken, value);
      return lit;
    } catch {
      let msg = this.formatError(this.curToken, `could not parse ${this.curToken.Literal} as integer`);
      this.errors.push(msg);
      return null;
    }
  }

  parseFloatLiteral() {
    try {
      let value = parseFloat(this.curToken.Literal);
      let lit = new FloatLiteral(this.curToken, value);
      return lit;
    } catch {
      let msg = this.formatError(this.curToken, `could not parse ${this.curToken.Literal} as float`);
      this.errors.push(msg);
      return null;
    }
  }

  parseStringLiteral() {
    return new StringLiteral(this.curToken, this.curToken.Literal);
  }

  curTokenIs(t: TokenTypeName) {
    return this.curToken.Type === t;
  }

  peekTokenIs(t: TokenTypeName) {
    return this.peekToken.Type === t;
  }

  expectPeek(t: TokenTypeName) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  peekError(t: TokenTypeName): void {
    if (this.peekToken === null) return;

    let msg = this.formatError(
      this.peekToken,
      `expected next token to be ${t}, got ${this.peekToken.Type} instead`
    );
    this.errors.push(msg);
  }

  registerPrefix(tokenType: TokenTypeName, fn: Function) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: TokenTypeName, fn: Function) {
    this.infixParseFns[tokenType] = fn;
  }

  noPrefixParseFnError(t: Token) {
    let msg = this.formatError(t, `no prefix parse function for ${t.Type} found: ${t.Literal}`);
    this.errors.push(msg);
  }

  parsePrefixExpression() {
    let curToken = this.curToken;
    let curLiteral = this.curToken.Literal;

    this.nextToken();

    return new PrefixExpression(curToken, curLiteral, this.parseExpression(PREFIX));
  }

  peekPrecedence() {
    if (this.peekToken === null) return LOWEST;

    if (precedences[this.peekToken.Type]) return precedences[this.peekToken.Type];

    return LOWEST;
  }

  curPrecedence() {
    if (precedences[this.curToken.Type]) return precedences[this.curToken.Type];

    return LOWEST;
  }

  parseInfixExpression(left: Expression) {
    let curToken = this.curToken;
    let curLiteral = this.curToken.Literal;

    let precedence = this.curPrecedence();
    this.nextToken();

    return new InfixExpression(curToken, left, curLiteral, this.parseExpression(precedence));
  }

  parseBoolean() {
    return new AstBoolean(this.curToken, this.curTokenIs(TokenType.TRUE));
  }

  parseGroupedExpression() {
    this.nextToken();

    let exp = this.parseExpression(LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return exp;
  }

  parseIfExpression() {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();
    let Condition = this.parseExpression(LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Consequence = this.parseBlockStatement();

    let Alternative = null;
    if (this.peekTokenIs(TokenType.ELSE)) {
      this.nextToken();

      if (!this.expectPeek(TokenType.LBRACE)) {
        return null;
      }

      Alternative = this.parseBlockStatement();
    }

    return new IfExpression(curToken, Condition, Consequence, Alternative);
  }

  parseBlockStatement() {
    let block = new BlockStatement(this.curToken);

    this.nextToken();

    while (!this.curTokenIs(TokenType.RBRACE) && !this.curTokenIs(TokenType.EOF)) {
      let stmt = this.parseStatement();
      if (stmt !== null) {
        block.Statements.push(stmt);
      }
      this.nextToken();
    }

    return block;
  }

  parseFunctionLiteral() {
    let curToken = this.curToken;

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    let Parameters = this.parseFunctionParameters();

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    let Body = this.parseBlockStatement();

    return new FunctionLiteral(this.curToken, Parameters, Body);
  }

  parseFunctionParameters(): Identifier[] {
    let identifiers: Identifier[] = [];

    if (this.peekTokenIs(TokenType.RPAREN)) {
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    let ident = new Identifier(this.curToken, this.curToken.Literal);
    identifiers.push(ident);

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();

      ident = new Identifier(this.curToken, this.curToken.Literal);
      identifiers.push(ident);
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return [];
    }

    return identifiers;
  }

  parseCallExpression(func: Expression) {
    return new CallExpression(this.curToken, func, this.parseExpressionList(TokenType.RPAREN));
  }

  parseArrayLiteral(): Expression {
    return new ArrayLiteral(this.curToken, this.parseExpressionList(TokenType.RBRACKET));
  }

  parseExpressionList(end: TokenTypeName): Expression[] {
    let list: Expression[] = [];

    if (this.peekTokenIs(end)) {
      this.nextToken();
      return list;
    }

    this.nextToken();
    list.push(this.parseExpression(LOWEST));

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      list.push(this.parseExpression(LOWEST));
    }

    if (!this.expectPeek(end)) {
      return [];
    }

    return list;
  }

  parseIndexExpression(left: Expression): Expression | null {
    let curToken = this.curToken;

    this.nextToken();

    let exp = new IndexExpression(curToken, left, this.parseExpression(LOWEST));

    if (!this.expectPeek(TokenType.RBRACKET)) {
      return null;
    }

    return exp;
  }

  parseHashLiteral(): Expression | null {
    let hash = new HashLiteral(this.curToken, new Map());

    while (!this.peekTokenIs(TokenType.RBRACE)) {
      this.nextToken();
      let key = this.parseExpression(LOWEST);

      if (!this.expectPeek(TokenType.COLON)) {
        return null;
      }

      this.nextToken();
      let value = this.parseExpression(LOWEST);

      hash.Pairs.set(key, value);

      if (!this.peekTokenIs(TokenType.RBRACE) && !this.expectPeek(TokenType.COMMA)) {
        return null;
      }
    }

    if (!this.expectPeek(TokenType.RBRACE)) {
      return null;
    }

    return hash;
  }
}
