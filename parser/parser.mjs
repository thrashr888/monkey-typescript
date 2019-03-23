import { ASTProgram, LetStatement, ReturnStatement, Identifier } from '../ast/ast';
import { Types } from '../token/token';

export default class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.curToken = null;
    this.peekToken = null;
    this.errors = [];

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

    while (!this.curTokenIs(Types.EOF)) {
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
      case Types.LET:
        return this.parseLetStatement();
      case Types.RETURN:
        return this.parseReturnStatement();
      default:
        return null;
    }
  }

  parseLetStatement() {
    let stmt = new LetStatement(this.curToken);

    if (!this.expectPeek(Types.IDENT)) return null;

    stmt.Name = new Identifier(this.curToken, this.curToken.Literal);

    if (!this.expectPeek(Types.ASSIGN)) return null;

    while (!this.curTokenIs(Types.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
  }

  parseReturnStatement() {
    let stmt = new ReturnStatement(this.curToken);

    this.nextToken();

    // TODO add expression

    while (!this.curTokenIs(Types.SEMICOLON)) {
      this.nextToken();
    }

    return stmt;
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
}
