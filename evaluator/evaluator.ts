import util from 'util';
import {
  AnyNodeType,
  ASTProgram,
  ExpressionStatement,
  IntegerLiteral,
  AstBoolean,
  PrefixExpression,
  InfixExpression,
  BlockStatement,
  IfExpression,
  ReturnStatement,
  LetStatement,
  Identifier,
} from '../ast/ast';
import OObject, {
  AnyObject,
  NullableOObject,
  OInteger,
  OBoolean,
  ONull,
  ReturnValue,
  OError,
  INTEGER_OBJ,
  RETURN_VALUE_OBJ,
  ERROR_OBJ,
} from '../object/object';
import Environment from '../object/environment';

export const NULL = new ONull(),
  TRUE = new OBoolean(true),
  FALSE = new OBoolean(false);

export default function Eval(node: AnyNodeType | null, env: Environment): NullableOObject {
  if (node instanceof ASTProgram) {
    return evalProgram(node, env);
  } else if (node instanceof ExpressionStatement) {
    return Eval(node.Expression, env);
  } else if (node instanceof IntegerLiteral) {
    return new OInteger(node.Value);
  } else if (node instanceof AstBoolean) {
    return nativeBoolToBooleanObject(node.Value);
  } else if (node instanceof PrefixExpression) {
    let right = Eval(node.Right, env);
    if (isError(right)) return right;
    return evalPrefixExpression(node.Operator, right);
  } else if (node instanceof InfixExpression) {
    let left = Eval(node.Left, env);
    if (isError(left)) return left;
    let right = Eval(node.Right, env);
    if (isError(right)) return right;
    return evalInfixExpression(node.Operator, left, right);
  } else if (node instanceof BlockStatement) {
    return evalBlockStatement(node, env);
  } else if (node instanceof IfExpression) {
    return evalIfExpression(node, env);
  } else if (node instanceof ReturnStatement) {
    let val = Eval(node.ReturnValue, env);
    if (isError(val)) return val;
    return val ? new ReturnValue(val) : null;
  } else if (node instanceof LetStatement) {
    let val = Eval(node.Value, env);
    if (isNotError(val)) env.Set(node.Name.Value, val);
    return val;
  } else if (node instanceof Identifier) {
    return evalIdentifier(node, env);
  }

  return null;
}

function evalProgram(program: ASTProgram, env: Environment): NullableOObject {
  let result: NullableOObject = null;

  for (let statement of program.Statements) {
    result = Eval(statement, env);

    if (result instanceof ReturnValue) {
      return result.Value;
    } else if (result instanceof OError) {
      return result;
    }
  }

  return result;
}

function evalBlockStatement(program: BlockStatement, env: Environment): NullableOObject {
  let result: NullableOObject = null;

  for (let statement of program.Statements) {
    result = Eval(statement, env);

    if (result !== null) {
      let rt = result.Type();
      if (rt === RETURN_VALUE_OBJ || rt === ERROR_OBJ) {
        return result;
      }
    }
  }

  return result;
}

function nativeBoolToBooleanObject(input: boolean): OBoolean {
  if (input) {
    return TRUE;
  }
  return FALSE;
}

function evalPrefixExpression(operator: string, right: NullableOObject): OObject {
  switch (operator) {
    case '!':
      return evalBangOperatorExpression(right);
    case '-':
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError('unknown operator: %s%s', operator, right ? right.Type() : null);
  }
}

function evalBangOperatorExpression(right: AnyObject | null): OObject {
  if (!right) return FALSE;

  if (right instanceof ONull) {
    return TRUE;
  } else if (right instanceof OBoolean && right.Value === true) {
    return FALSE;
  } else if (right instanceof OBoolean && right.Value === false) {
    return TRUE;
  }

  return FALSE;
}

function evalMinusPrefixOperatorExpression(right: AnyObject | null): OObject {
  if (!right) return FALSE;

  if (right.Type() !== INTEGER_OBJ) {
    return newError('unknown operator: -%s', right.Type());
  } else if (!(right instanceof OInteger)) {
    return NULL;
  }

  let value = right.Value;
  return new OInteger(-value);
}

function evalInfixExpression(operator: string, left: NullableOObject, right: NullableOObject): OObject {
  if (left instanceof OInteger && right instanceof OInteger) {
    return evalIntegerInfixExpression(operator, left, right);
  } else if (operator === '==') {
    return nativeBoolToBooleanObject(left === right);
  } else if (operator === '!=') {
    return nativeBoolToBooleanObject(left !== right);
  } else if (left !== null && right !== null && left.Type() !== right.Type()) {
    return newError('type mismatch: %s %s %s', left.Type(), operator, right.Type());
  } else {
    return newError(
      'unknown operator: %s %s %s',
      left ? left.Type() : null,
      operator,
      right ? right.Type() : null
    );
  }
}

function evalIntegerInfixExpression(operator: string, left: OInteger, right: OInteger): OObject {
  let leftVal = left.Value;
  let rightVal = right.Value;

  switch (operator) {
    case '+':
      return new OInteger(leftVal + rightVal);
    case '-':
      return new OInteger(leftVal - rightVal);
    case '*':
      return new OInteger(leftVal * rightVal);
    case '/':
      return new OInteger(leftVal / rightVal);
    case '<':
      return nativeBoolToBooleanObject(leftVal < rightVal);
    case '>':
      return nativeBoolToBooleanObject(leftVal > rightVal);
    case '==':
      return nativeBoolToBooleanObject(leftVal === rightVal);
    case '!=':
      return nativeBoolToBooleanObject(leftVal !== rightVal);
    default:
      return newError('unknown operator: %s %s %s', left.Type(), operator, right.Type());
  }
}

function evalIfExpression(ie: IfExpression, env: Environment): NullableOObject {
  let condition = Eval(ie.Condition, env);
  if (isError(condition)) return condition;

  if (isTruthy(condition)) {
    return Eval(ie.Consequence, env);
  } else if (ie.Alternative !== null) {
    return Eval(ie.Alternative, env);
  } else {
    return NULL;
  }
}

function evalIdentifier(node: Identifier, env: Environment): NullableOObject {
  let val = env.Get(node.Value);
  if (val === null) {
    return newError('identifier not found: %s', node.Value);
  }

  return val;
}

function isTruthy(obj: NullableOObject): boolean {
  switch (obj) {
    case NULL:
      return false;
    case TRUE:
      return true;
    case FALSE:
      return false;
    default:
      return true;
  }
}

function newError(format: string, ...args: any[]): OError {
  return new OError(printf(format, ...args));
}

function printf(...args: any[]): string {
  return [...args].reduce((p, c) => p.replace(/%s/, c));
}

function isError(obj: NullableOObject): obj is OObject {
  if (obj !== null) {
    return obj.Type() === ERROR_OBJ;
  }
  return false;
}

function isNotError(obj: NullableOObject): obj is OObject {
  if (obj !== null) {
    return obj.Type() !== ERROR_OBJ;
  }
  return true;
}
