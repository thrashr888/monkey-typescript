export class Node {
  TokenLiteral() {
    return '';
  }

  String() {
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

  String() {
    let out = '';

    for (let s of this.Statements) {
      out += s.String();
    }

    return out;
  }
}

export class LetStatement extends Statement {
  constructor(token, name = null, value = null) {
    super(...arguments);

    this.Token = token;
    this.Name = name;
    this.Value = value;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    let out = '';

    out += `${this.TokenLiteral()} ${this.Name.String()} = `;
    if (this.Value !== null) out += this.Value.String();
    out += ';';

    return out;
  }
}

export class ReturnStatement extends Statement {
  constructor(token) {
    super(...arguments);

    this.Token = token;
    this.ReturnValue = null;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    let out = '';

    out += `${this.TokenLiteral()}  = `;
    if (this.ReturnValue !== null) out += this.ReturnValue.String();
    out += ';';

    return out;
  }
}

export class ExpressionStatement extends Statement {
  constructor(token) {
    super(...arguments);

    this.Token = token;
    this.Expression = null;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    if (this.Expression !== null) {
      return this.Expression.String();
    }
    return '';
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

  String() {
    return this.Value;
  }
}
