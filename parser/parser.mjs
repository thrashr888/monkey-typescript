import { Types } from '../token/token.mjs';
import { ASTProgram, LetStatement, Identifier } from '../ast/ast.mjs';

export default class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.curToken = null;
    this.peekToken = null;

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  ParseProgram() {
    let program = new ASTProgram();

    while (this.curToken.Type !== Types.EOF) {
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
      return false;
    }
  }
}
