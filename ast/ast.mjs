export class Node {
  TokenLiteral() {
    return '';
  }
}
export class Statement extends Node {
  statementNode() {}
}

export class Expression extends Node {
  expressionNode() {}
}

export class ASTProgram {
  constructor() {
    this.Statements = [];
  }

  TokenLiteral() {
    if (this.Statements.length > 0) {
      return this.Statements[0].TokenLiteral();
    } else {
      return '';
    }
  }
}

export class LetStatement extends Statement {
  constructor(token) {
    super(...arguments);

    this.Token = token;
    this.Name = null;
    this.Value = null;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }
}

export class Identifier extends Expression {
  constructor(token, value) {
    super(...arguments);

    this.Token = token;
    this.Value = value;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }
}
