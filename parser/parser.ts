import Token from '../token/token';
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
  [Token.EQ]: EQUALS,
  [Token.NOT_EQ]: EQUALS,
  [Token.LT]: LESSGREATER,
  [Token.GT]: LESSGREATER,
  [Token.PLUS]: SUM,
  [Token.MINUS]: SUM,
  [Token.SLASH]: PRODUCT,
  [Token.ASTERISK]: PRODUCT,
  [Token.LPAREN]: CALL,
};

export default class Parser {
  l: Lexer;
  errors: Array<string> = [];

  curToken: Token | null = null;
  peekToken: Token | null = null;

  prefixParseFns: { [index: string]: Function } = {};
  infixParseFns: { [index: string]: Function } = {};

  constructor(lexer: Lexer) {
    this.l = lexer;

    this.registerPrefix(Token.IDENT, this.parseIdentifier.bind(this));
    this.registerPrefix(Token.INT, this.parseIntegerLiteral.bind(this));
    this.registerPrefix(Token.BANG, this.parsePrefixExpression.bind(this));
    this.registerPrefix(Token.MINUS, this.parsePrefixExpression.bind(this));

    this.registerPrefix(Token.TRUE, this.parseBoolean.bind(this));
    this.registerPrefix(Token.FALSE, this.parseBoolean.bind(this));

    this.registerPrefix(Token.LPAREN, this.parseGroupedExpression.bind(this));

    this.registerPrefix(Token.IF, this.parseIfExpression.bind(this));

    this.registerPrefix(Token.FUNCTION, this.parseFunctionLiteral.bind(this));

    [
      Token.PLUS,
      Token.MINUS,
      Token.SLASH,
      Token.ASTERISK,
      Token.EQ,
      Token.NOT_EQ,
      Token.LT,
      Token.GT,
    ].forEach(value => this.registerInfix(value, this.parseInfixExpression.bind(this)));

    this.registerInfix(Token.LPAREN, this.parseCallExpression.bind(this));

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

  parseStatement(): Statement | null {
    if (this.curToken === null) return null;

    switch (this.curToken.Type) {
      case Token.LET:
        return this.parseLetStatement();
      case Token.RETURN:
        return this.parseReturnStatement();
      default:
        return this.parseExpressionStatement();
    }
  }

  parseLetStatement(): Statement | null {
    if (this.curToken === null) return null;

    let stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(Token.IDENT)) {
      return null;
    }

    stmt.Name = new Identifier(this.curToken, this.curToken.Literal);

    if (!this.expectPeek(Token.ASSIGN)) {
      return null;
    }

    this.nextToken();

    stmt.Value = this.parseExpression(LOWEST);

    if (this.peekTokenIs(Token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement() {
    if (this.curToken === null) return null;

    let stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    stmt.ReturnValue = this.parseExpression(LOWEST);

    if (this.peekTokenIs(Token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpressionStatement() {
    if (this.curToken === null) return null;

    let stmt = new ExpressionStatement(this.curToken);

    stmt.Expression = this.parseExpression(LOWEST);

    if (this.peekTokenIs(Token.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseExpression(precedence: number) {
    if (this.curToken === null) return null;
    if (this.peekToken === null) return null;

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
    if (this.curToken === null) return null;
    return new Identifier(this.curToken, this.curToken.Literal);
  }

  parseIntegerLiteral() {
    if (this.curToken === null) return null;

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
    if (this.curToken === null) return null;

    return this.curToken.Type === t;
  }

  peekTokenIs(t: string) {
    if (this.peekToken === null) return null;

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
    if (this.curToken === null) return null;

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
    if (this.curToken === null) return null;

    if (precedences[this.curToken.Type]) return precedences[this.curToken.Type];

    return LOWEST;
  }

  parseInfixExpression(left: Expression) {
    if (this.curToken === null) return null;

    let expression = new InfixExpression(this.curToken, left, this.curToken.Literal);

    let precedence = this.curPrecedence();
    this.nextToken();
    expression.Right = this.parseExpression(precedence);

    return expression;
  }

  parseBoolean() {
    if (this.curToken === null) return null;

    return new AstBoolean(this.curToken, this.curTokenIs(Token.TRUE));
  }

  parseGroupedExpression() {
    this.nextToken();

    let exp = this.parseExpression(LOWEST);

    if (!this.expectPeek(Token.RPAREN)) {
      return null;
    }

    return exp;
  }

  parseIfExpression() {
    if (this.curToken === null) return null;

    let expression = new IfExpression(this.curToken);

    if (!this.expectPeek(Token.LPAREN)) {
      return null;
    }

    this.nextToken();
    expression.Condition = this.parseExpression(LOWEST);

    if (!this.expectPeek(Token.RPAREN)) {
      return null;
    }

    if (!this.expectPeek(Token.LBRACE)) {
      return null;
    }

    expression.Consequence = this.parseBlockStatement();

    if (this.peekTokenIs(Token.ELSE)) {
      this.nextToken();

      if (!this.expectPeek(Token.LBRACE)) {
        return null;
      }

      expression.Alternative = this.parseBlockStatement();
    }

    return expression;
  }

  parseBlockStatement() {
    if (this.curToken === null) return null;

    let block = new BlockStatement(this.curToken);

    this.nextToken();

    while (!this.curTokenIs(Token.RBRACE) && !this.curTokenIs(Token.EOF)) {
      let stmt = this.parseStatement();
      if (stmt !== null) {
        block.Statements.push(stmt);
      }
      this.nextToken();
    }

    return block;
  }

  parseFunctionLiteral() {
    if (this.curToken === null) return null;

    let lit = new FunctionLiteral(this.curToken);

    if (!this.expectPeek(Token.LPAREN)) {
      return null;
    }

    lit.Parameters = this.parseFunctionParameters();

    if (!this.expectPeek(Token.LBRACE)) {
      return null;
    }

    lit.Body = this.parseBlockStatement();

    return lit;
  }

  parseFunctionParameters() {
    if (this.curToken === null) return null;

    let identifiers: Array<Identifier> = [];

    if (this.peekTokenIs(Token.RPAREN)) {
      this.nextToken();
      return identifiers;
    }

    this.nextToken();

    let ident = new Identifier(this.curToken, this.curToken.Literal);
    identifiers.push(ident);

    while (this.peekTokenIs(Token.COMMA)) {
      this.nextToken();
      this.nextToken();

      ident = new Identifier(this.curToken, this.curToken.Literal);
      identifiers.push(ident);
    }

    if (!this.expectPeek(Token.RPAREN)) {
      return [];
    }

    return identifiers;
  }

  parseCallExpression(func: Expression) {
    if (this.curToken === null) return null;

    let exp = new CallExpression(this.curToken, func);
    exp.Arguments = this.parseCallArguments();
    return exp;
  }

  parseCallArguments(): Array<Expression> | null {
    let args: Array<Expression> = [];

    if (this.peekTokenIs(Token.RPAREN)) {
      this.nextToken();
      return args;
    }

    this.nextToken();
    args.push(this.parseExpression(LOWEST));

    while (this.peekTokenIs(Token.COMMA)) {
      this.nextToken();
      this.nextToken();
      args.push(this.parseExpression(LOWEST));
    }

    if (!this.expectPeek(Token.RPAREN)) {
      return null;
    }

    return args;
  }
}
