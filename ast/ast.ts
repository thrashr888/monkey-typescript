import Token from '../token/token';

export class Node {
  Token: Token;

  constructor(token: Token) {
    this.Token = token;
  }

  TokenLiteral(): string {
    if (this.Token !== null && this.Token.Literal !== null) return '' + this.Token.Literal;
    return '';
  }

  String(): string {
    return '';
  }
}

export class Statement extends Node {}

export class Expression extends Node {}

export class ASTProgram {
  Statements: Array<Statement> = [];

  constructor(statements = []) {
    this.Statements = statements;
  }

  TokenLiteral(): string {
    if (this.Statements.length > 0) {
      return this.Statements[0].TokenLiteral();
    } else {
      return '';
    }
  }

  String(): string {
    let stmts = this.Statements.map(s => s.String());
    return stmts.join('');
  }
}

export class LetStatement extends Statement {
  Name: Identifier | null;
  Value: Expression | Identifier | null;

  constructor(token: Token, name: Identifier | null = null, value: Expression | Identifier | null = null) {
    super(token);

    this.Name = name;
    this.Value = value;
  }

  String(): string {
    let out = '';

    out += `${this.TokenLiteral()}`;
    if (this.Name !== null) out += ` ${this.Name.String()} = `;
    if (this.Value !== null) out += this.Value.String();
    out += ';';

    return out;
  }
}

export class ReturnStatement extends Statement {
  ReturnValue: Expression | null;

  constructor(token: Token, returnValue = null) {
    super(token);

    this.Token = token;
    this.ReturnValue = returnValue;
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
  Expression: Expression | null;

  constructor(token: Token, expression = null) {
    super(token);

    this.Token = token;
    this.Expression = expression;
  }

  String(): string {
    if (this.Expression !== null) return this.Expression.String();

    return '';
  }
}

export class Identifier extends Expression {
  Value: string;

  constructor(token: Token, value: string) {
    super(token);

    this.Token = token;
    this.Value = value;
  }

  String(): string {
    return this.Value;
  }
}

export class IntegerLiteral extends Expression {
  Value: number | null = null;

  constructor(token: Token, value = null) {
    super(token);

    this.Token = token;
    this.Value = value;
  }
}

export class PrefixExpression extends Expression {
  Operator: string | null;
  Right: Expression | null;

  constructor(token: Token, operator = null, right = null) {
    super(token);

    this.Token = token;
    this.Operator = operator;
    this.Right = right;
  }

  String(): string {
    if (this.Right !== null) `(${this.Operator}${this.Right.String()})`;
    return `(${this.Operator})`;
  }
}

export class InfixExpression extends Expression {
  Left: Expression | null;
  Operator: string | null;
  Right: Expression | null;

  constructor(token: Token, left = null, operator = null, right = null) {
    super(token);

    this.Token = token;
    this.Left = left;
    this.Operator = operator;
    this.Right = right;
  }

  String(): string {
    let out = '(';
    if (this.Left !== null) out += `${this.Left.String()} `;
    out += `${this.Operator}`;
    if (this.Right !== null) out += ` ${this.Right.String()}`;
    out += ')';
    return out;
  }
}

export class AstBoolean extends Expression {
  Value: boolean;

  constructor(token: Token, value: boolean) {
    super(token);

    this.Token = token;
    this.Value = value;
  }
}

export class IfExpression extends Expression {
  Condition: Expression | null;
  Consequence: BlockStatement | null;
  Alternative: BlockStatement | null;

  constructor(token: Token, expression = null, consequence = null, alternative = null) {
    super(token);

    this.Token = token;
    this.Condition = expression;
    this.Consequence = consequence;
    this.Alternative = alternative;
  }

  String() {
    let out = '';

    if (this.Condition != null) out += `${this.Condition.String()} `;
    if (this.Consequence != null) out += `${this.Consequence.String()}`;

    if (this.Alternative != null) out += `else ${this.Alternative.String()}`;

    return out;
  }
}

export class BlockStatement extends Statement {
  Statements: Array<Statement> = [];

  constructor(token: Token, statements = []) {
    super(token);

    this.Token = token;
    this.Statements = statements;
  }

  String(): string {
    let out = '';

    for (let s of this.Statements) {
      out += s.String();
    }

    return out;
  }
}

export class FunctionLiteral extends BlockStatement {
  Parameters: Array<Identifier> = [];
  Body: BlockStatement | null;

  constructor(token: Token, parameters = [], body = null) {
    super(token);

    this.Token = token;
    this.Parameters = parameters;
    this.Body = body;
  }

  String(): string {
    let out = '';

    let params = this.Parameters.map(p => p.String());

    out += `${this.TokenLiteral()}(`;
    out += params.join(', ');
    out += `)`;

    if (this.Body !== null) out += ` ${this.Body.String()}`;

    return out;
  }
}

export class CallExpression extends Expression {
  Function: Expression;
  Arguments: Array<Expression> | null;

  constructor(token: Token, func: Expression, args = []) {
    super(token);

    this.Token = token;
    this.Function = func;
    this.Arguments = args;
  }

  String(): string {
    let out = '';

    let args: Array<string> = [];

    if (this.Arguments) args = this.Arguments.map(a => a.String());

    out += `${this.Function.String()}(`;
    out += args.join(', ');
    out += `)`;

    return out;
  }
}
