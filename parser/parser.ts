import Token, { TokenType } from '../token/token';
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
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  Statement,
} from '../ast/ast';

export const LOWEST = 1,
  EQUALS = 2, // ==
  LESSGREATER = 3, // > or <
  SUM = 4, // +
  PRODUCT = 5, // *
  PREFIX = 6, // X or !X
  CALL = 7; // myFunction(X)

export const precedences = {
  [TokenType.EQ]: EQUALS,
  [TokenType.NOT_EQ]: EQUALS,
  [TokenType.LT]: LESSGREATER,
  [TokenType.GT]: LESSGREATER,
  [TokenType.PLUS]: SUM,
  [TokenType.MINUS]: SUM,
  [TokenType.SLASH]: PRODUCT,
  [TokenType.ASTERISK]: PRODUCT,
  [TokenType.LPAREN]: CALL,
};

export default class Parser {
  l: Lexer;
  errors: Array<string> = [];

  curToken: Token;
  peekToken: Token;

  prefixParseFns: { [index: string]: Function } = {};
  infixParseFns: { [index: string]: Function } = {};

  constructor(lexer: Lexer) {
    this.l = lexer;

    this.registerPrefix(TokenType.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(TokenType.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(TokenType.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(TokenType.MINUS, this.parsePrefixExpression.bind(this));

    this.registerPrefix(TokenType.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(TokenType.FALSE, this.parseBoolean.bind(this));

    this.registerPrefix(TokenType.LPAREN, this.parseGroupedExpression.bind(this));

    this.registerPrefix(TokenType.IF, this.parseIfExpression.bind(this));

    this.registerPrefix(TokenType.FUNCTION, this.parseFunctionLiteral.bind(this));

    [
      TokenType.PLUS,
      TokenType.MINUS,
      TokenType.SLASH,
      TokenType.ASTERISK,
      TokenType.EQ,
      TokenType.NOT_EQ,
      TokenType.LT,
      TokenType.GT,
    ].forEach(value => this.registerInfix(value, this.parseInfixExpression.bind(this)));

    this.registerInfix(TokenType.LPAREN, this.parseCallExpression.bind(this));

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
    let stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(TokenType.IDENT)) {
      return null;
    }

    stmt.Name = new Identifier(this.curToken, this.curToken.Literal);

    if (!this.expectPeek(TokenType.ASSIGN)) {
      return null;
    }

    this.nextToken();

    stmt.Value = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
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
    let stmt = new ExpressionStatement(this.curToken);

    stmt.Expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(TokenType.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence: number) {
    if (!this.prefixParseFns[this.curToken.Type]) {
      this.noPrefixParseFnError(this.curToken.Type);
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

  curTokenIs(t: string) {
    return this.curToken.Type === t;
  }

  peekTokenIs(t: string) {
    return this.peekToken.Type === t;
  }

  expectPeek(t: string) {
    if (this.peekTokenIs(t)) {
      this.nextToken();
      return true;
    } else {
      this.peekError(t);
      return false;
    }
  }

  peekError(t: string): void {
    if (this.peekToken === null) return;

    let msg = `expected next token to be ${t}, got ${this.peekToken.Type} instead`;
    this.errors.push(msg);
  }

  registerPrefix(tokenType: string, fn: Function) {
    this.prefixParseFns[tokenType] = fn;
  }

  registerInfix(tokenType: string, fn: Function) {
    this.infixParseFns[tokenType] = fn;
  }

  noPrefixParseFnError(t: string) {
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
    if (this.peekToken === null) return LOWEST;

    if (precedences[this.peekToken.Type]) return precedences[this.peekToken.Type];

    return LOWEST;
  }

  curPrecedence() {
    if (precedences[this.curToken.Type]) return precedences[this.curToken.Type];

    return LOWEST;
  }

  parseInfixExpression(left: Expression) {
    let expression = new InfixExpression(this.curToken, left, this.curToken.Literal);

    let precedence = this.curPrecedence();
    this.nextToken();
    expression.Right = this.parseExpression(precedence);

    return expression;
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
    let expression = new IfExpression(this.curToken);

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    this.nextToken();
    expression.Condition = this.parseExpression(LOWEST);

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    expression.Consequence = this.parseBlockStatement();

    if (this.peekTokenIs(TokenType.ELSE)) {
      this.nextToken();

      if (!this.expectPeek(TokenType.LBRACE)) {
        return null;
      }

      expression.Alternative = this.parseBlockStatement();
    }

    return expression;
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
    let lit = new FunctionLiteral(this.curToken);

    if (!this.expectPeek(TokenType.LPAREN)) {
      return null;
    }

    lit.Parameters = this.parseFunctionParameters();

    if (!this.expectPeek(TokenType.LBRACE)) {
      return null;
    }

    lit.Body = this.parseBlockStatement();

    return lit;
  }

  parseFunctionParameters() {
    let identifiers: Array<Identifier> = [];

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
    let exp = new CallExpression(this.curToken, func);
    exp.Arguments = this.parseCallArguments();
    return exp;
  }

  parseCallArguments(): Array<Expression> | null {
    let args: Array<Expression> = [];

    if (this.peekTokenIs(TokenType.RPAREN)) {
      this.nextToken();
      return args;
    }

    this.nextToken();
    args.push(this.parseExpression(LOWEST));

    while (this.peekTokenIs(TokenType.COMMA)) {
      this.nextToken();
      this.nextToken();
      args.push(this.parseExpression(LOWEST));
    }

    if (!this.expectPeek(TokenType.RPAREN)) {
      return null;
    }

    return args;
  }
}
