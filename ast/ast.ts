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

  TokenLiteral() {
    if (this.Statements.length > 0) {
      return this.Statements[0].TokenLiteral();
    } else {
      return '';
    }
  }

  String() {
    return this.Statements.map(s => s.String()).join('');
  }
}

export interface Statement extends Node {}

export interface Expression extends Node {}

export class LetStatement implements Statement {
  Token: Token;
  Name: Identifier;
  Value: Expression | Identifier;
  Index: IndexExpression | null;

  constructor(
    token: Token,
    name: Identifier,
    value: Expression | Identifier,
    index: IndexExpression | null = null
  ) {
    this.Token = token;
    this.Name = name;
    this.Value = value;
    this.Index = index;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return `${this.TokenLiteral()} ${this.Name.String()}${
      this.Index ? this.Index.String() : ''
    } = ${this.Value.String()};`;
  }
}

export class ImportSpec implements Statement {
  Token: Token;
  Path: StringLiteral;
  Name: Identifier | null;

  constructor(token: Token, path: StringLiteral, name: Identifier | null = null) {
    this.Token = token;
    this.Path = path;
    this.Name = name;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return `import("${this.Path.String()}")${this.Name ? ` as ${this.Name.String()}` : ''}`;
  }
}

export class ReturnStatement implements Statement {
  Token: Token;
  ReturnValue: Expression | null;

  constructor(token: Token, returnValue = null) {
    this.Token = token;
    this.ReturnValue = returnValue;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    let out = `${this.TokenLiteral()} = `;

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

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return this.Expression.String();
  }
}

export class Identifier implements Expression {
  Token: Token;
  Value: string;

  constructor(token: Token, value: string) {
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

export class Comment implements Expression {
  Token: Token;
  Value: string;

  constructor(token: Token, value: string) {
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

export class IntegerLiteral implements Expression {
  Token: Token;
  Value: number;

  constructor(token: Token, value: number) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return this.Token.Literal;
  }
}

export class FloatLiteral implements Expression {
  Token: Token;
  Value: number;

  constructor(token: Token, value: number) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
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

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return `(${this.Operator}${this.Right.String()})`;
  }
}
export class IncrementExpression implements Expression {
  Token: Token;
  Name: Identifier;
  Prefix: boolean; // --i vs i++

  constructor(token: Token, name: Identifier, prefix: boolean) {
    this.Token = token;
    this.Name = name;
    this.Prefix = prefix;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return this.Prefix ? `(++${this.Name})` : `(${this.Name}++)`;
  }
}

export class DecrementExpression implements Expression {
  Token: Token;
  Name: Identifier;
  Prefix: boolean; // --i vs i++

  constructor(token: Token, name: Identifier, prefix: boolean) {
    this.Token = token;
    this.Name = name;
    this.Prefix = prefix;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return this.Prefix ? `(--${this.Name})` : `(${this.Name}--)`;
  }
}

export class RangeLiteral implements Expression {
  Left: IntegerLiteral;
  Operator: string;
  Right: IntegerLiteral;

  constructor(left: IntegerLiteral, operator: string, right: IntegerLiteral) {
    this.Left = left;
    this.Operator = operator;
    this.Right = right;
  }

  TokenLiteral() {
    return this.Operator;
  }

  String() {
    return `(${this.Left.String()} ${this.Operator} ${this.Right.String()})`;
  }
}

export class InfixExpression implements Expression {
  Token: Token;
  Left: Expression;
  Operator: string;
  Right: Expression | null = null;

  constructor(token: Token, left: Expression, operator: string, right: Expression | null) {
    this.Token = token;
    this.Left = left;
    this.Operator = operator;
    this.Right = right;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return `(${this.Left.String()} ${this.Operator} ${this.Right ? this.Right.String() : ''})`;
  }
}

export class AstBoolean implements Expression {
  Token: Token;
  Value: boolean;

  constructor(token: Token, value: boolean) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
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

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    let out = `${this.Condition.String()} ${this.Consequence.String()}`;

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

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return this.Statements.map(s => s.String()).join('');
  }
}

export class WhileLiteral implements Statement {
  Token: Token;
  Expression: Expression;
  Body: BlockStatement;

  constructor(token: Token, expression: Expression, body: BlockStatement) {
    this.Token = token;
    this.Expression = expression;
    this.Body = body;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return `${this.TokenLiteral()}(${this.Expression.String()}) ${this.Body.String()}`;
  }
}

export class ForLiteral implements Statement {
  Token: Token;
  Initiate: Statement;
  Check: ExpressionStatement;
  Iterate: Statement;
  Body: BlockStatement;

  constructor(
    token: Token,
    initiate: Statement,
    check: ExpressionStatement,
    iterate: Statement,
    body: BlockStatement
  ) {
    this.Token = token;
    this.Initiate = initiate;
    this.Check = check;
    this.Iterate = iterate;
    this.Body = body;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return `${this.TokenLiteral()}(${this.Initiate.String()};${this.Check.String()};${this.Iterate.String()}) ${this.Body.String()}`;
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

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    let params: string[] = this.Parameters.map(p => p.String());

    return `${this.TokenLiteral()}(${params.join(', ')}) ${this.Body.String()}`;
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

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    let args: string[] = this.Arguments.map(a => a.String());

    return `${this.Function.String()}(${args.join(', ')})`;
  }
}

export class StringLiteral implements Expression {
  Token: Token;
  Value: string;

  constructor(token: Token, value: string) {
    this.Token = token;
    this.Value = value;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }

  String() {
    return this.Token.Literal;
  }
}

export class ArrayLiteral implements Expression {
  Token: Token;
  Elements: Expression[] = [];

  constructor(token: Token, elements: Expression[] = []) {
    this.Token = token;
    this.Elements = elements;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }
  String() {
    let out = '';
    let elements: string[] = this.Elements.map(e => e.String());
    out += `[${elements.join(', ')}]`;
    return out;
  }
}

export class IndexExpression implements Expression {
  Token: Token;
  Left: Expression;
  Index: Expression | null = null;
  HasColon: boolean;
  RightIndex: Expression | null = null;

  constructor(
    token: Token,
    left: Expression,
    index: Expression | null = null,
    hasColon: boolean = false,
    rightIndex: Expression | null = null
  ) {
    this.Token = token;
    this.Left = left;
    this.Index = index;
    this.HasColon = hasColon;
    this.RightIndex = rightIndex;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }
  String() {
    let index = this.Index ? `:${this.Index.String()}` : null;
    let rightIndex = this.RightIndex ? `:${this.RightIndex.String()}` : null;
    return `(${this.Left.String()}[${index}${rightIndex}])`;
  }
}

export class HashLiteral implements Expression {
  Token: Token;
  Pairs: Map<Expression, Expression> = new Map<Expression, Expression>();

  constructor(token: Token, pairs: Map<Expression, Expression>) {
    this.Token = token;
    this.Pairs = pairs;
  }

  TokenLiteral() {
    return this.Token.Literal;
  }
  String() {
    let pairs: string[] = [];

    this.Pairs.forEach((v, k) => pairs.push(`${k.String()}:${v.String()}`));

    return `{${pairs.join(', ')}}`;
  }
}
