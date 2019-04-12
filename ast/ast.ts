import Token from '../token/token';

export type AnyNodeType = Node | Statement | Expression | ASTProgram;

export interface Node {
  TokenLiteral(): string;
  String(): string;
}

export class ASTProgram implements Node {
  Statements: Statement[] = [];

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

export interface Statement extends Node {}

export interface Expression extends Node {}

export class LetStatement implements Statement {
  Token: Token;
  Name: Identifier;
  Value: Expression | Identifier;

  constructor(token: Token, name: Identifier, value: Expression | Identifier) {
    this.Token = token;
    this.Name = name;
    this.Value = value;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
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

export class ReturnStatement implements Statement {
  Token: Token;
  ReturnValue: Expression | null;

  constructor(token: Token, returnValue = null) {
    this.Token = token;
    this.ReturnValue = returnValue;
  }

  TokenLiteral(): string {
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

export class ExpressionStatement implements Statement {
  Token: Token;
  Expression: Expression;

  constructor(token: Token, expression: Expression) {
    this.Token = token;
    this.Expression = expression;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    if (this.Expression !== null) return this.Expression.String();

    return '';
  }
}

export class Identifier implements Expression {
  Token: Token;
  Value: string;

  constructor(token: Token, value: string) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    return this.Value;
  }
}

export class IntegerLiteral implements Expression {
  Token: Token;
  Value: number;

  constructor(token: Token, value: number) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    return this.Token.Literal;
  }
}

export class PrefixExpression implements Expression {
  Token: Token;
  Operator: string;
  Right: Expression;

  constructor(token: Token, operator: string, right: Expression) {
    this.Token = token;
    this.Operator = operator;
    this.Right = right;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    if (this.Right !== null) {
      return `(${this.Operator}${this.Right.String()})`;
    }
    return `(${this.Operator})`;
  }
}

export class InfixExpression implements Expression {
  Token: Token;
  Left: Expression;
  Operator: string;
  Right: Expression;

  constructor(token: Token, left: Expression, operator: string, right: Expression) {
    this.Token = token;
    this.Left = left;
    this.Operator = operator;
    this.Right = right;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
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

export class AstBoolean implements Expression {
  Token: Token;
  Value: boolean;

  constructor(token: Token, value: boolean) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    return this.Token.Literal;
  }
}

export class IfExpression implements Expression {
  Token: Token;
  Condition: Expression;
  Consequence: BlockStatement;
  Alternative: BlockStatement | null;

  constructor(
    token: Token,
    expression: Expression,
    consequence: BlockStatement,
    alternative: BlockStatement | null = null
  ) {
    this.Token = token;
    this.Condition = expression;
    this.Consequence = consequence;
    this.Alternative = alternative;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String() {
    let out = '';

    if (this.Condition != null) out += `${this.Condition.String()} `;
    if (this.Consequence != null) out += `${this.Consequence.String()}`;

    if (this.Alternative != null) out += `else ${this.Alternative.String()}`;

    return out;
  }
}

export class BlockStatement implements Statement {
  Token: Token;
  Statements: Statement[] = [];

  constructor(token: Token, statements = []) {
    this.Token = token;
    this.Statements = statements;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    let out = '';

    for (let s of this.Statements) {
      out += s.String();
    }

    return out;
  }
}

export class FunctionLiteral implements Statement {
  Token: Token;
  Parameters: Identifier[] = [];
  Body: BlockStatement;

  constructor(token: Token, parameters: Identifier[] = [], body: BlockStatement) {
    this.Token = token;
    this.Parameters = parameters;
    this.Body = body;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
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

export class CallExpression implements Expression {
  Token: Token;
  Function: Expression;
  Arguments: Expression[];

  constructor(token: Token, func: Expression, args: Expression[] = []) {
    this.Token = token;
    this.Function = func;
    this.Arguments = args;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    let out = '';

    let args: string[] = [];

    if (this.Arguments) args = this.Arguments.map(a => a.String());

    out += `${this.Function.String()}(`;
    out += args.join(', ');
    out += `)`;

    return out;
  }
}

export class StringLiteral implements Expression {
  Token: Token;
  Value: string;

  constructor(token: Token, value: string) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral(): string {
    return this.Token.Literal;
  }

  String(): string {
    return this.Token.Literal;
  }
}
