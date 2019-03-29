export class Node {
  TokenLiteral() {
    return this.Token.Literal;
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

  String() {
    return this.Value;
  }
}

export class IntegerLiteral extends Identifier {
  constructor(token, value) {
    super(...arguments);

    this.Token = token;
    this.Value = value;
  }

  String() {
    return this.Token.Literal;
  }
}

export class PrefixExpression extends Expression {
  constructor(token, operator = null, right = null) {
    super(...arguments);

    this.Token = token;
    this.Operator = operator;
    this.Right = right;
  }

  String() {
    return `(${this.Operator}${this.Right.String()})`;
  }
}

export class InfixExpression extends Expression {
  constructor(token, left = null, operator = null, right = null) {
    super(...arguments);

    this.Token = token;
    this.Left = left;
    this.Operator = operator;
    this.Right = right;
  }

  String() {
    return `(${this.Left.String()} ${this.Operator} ${this.Right.String()})`;
  }
}
