import util from 'util';
import {
  AnyNodeType,
  Statement,
  ASTProgram,
  ExpressionStatement,
  IntegerLiteral,
  AstBoolean,
  PrefixExpression,
  InfixExpression,
  BlockStatement,
  IfExpression,
  ReturnStatement,
} from '../ast/ast';
import OObject, {
  OInteger,
  OBoolean,
  ONull,
  AnyObject,
  INTEGER_OBJ,
  ReturnValue,
  RETURN_VALUE_OBJ,
  OError,
  ERROR_OBJ,
} from '../object/object';

export const NULL = new ONull(),
  TRUE = new OBoolean(true),
  FALSE = new OBoolean(false);

export default function Eval(node: AnyNodeType | null): OObject | null {
  if (node instanceof ASTProgram) {
    return evalProgram(node);
  } else if (node instanceof ExpressionStatement) {
    return Eval(node.Expression);
  } else if (node instanceof IntegerLiteral) {
    return new OInteger(node.Value);
  } else if (node instanceof AstBoolean) {
    return nativeBoolToBooleanObject(node.Value);
  } else if (node instanceof PrefixExpression) {
    let right = Eval(node.Right);
    if (isError(right)) return right;
    return evalPrefixExpression(node.Operator, right);
  } else if (node instanceof InfixExpression) {
    let left = Eval(node.Left);
    if (isError(left)) return left;
    let right = Eval(node.Right);
    if (isError(right)) return right;
    return evalInfixExpression(node.Operator, left, right);
  } else if (node instanceof BlockStatement) {
    return evalBlockStatement(node);
  } else if (node instanceof IfExpression) {
    return evalIfExpression(node);
  } else if (node instanceof ReturnStatement) {
    let val = Eval(node.ReturnValue);
    if (isError(val)) return val;
    return val ? new ReturnValue(val) : null;
  }

  return null;
}

function evalProgram(program: ASTProgram): OObject | null {
  let result: OObject | null = null;

  for (let statement of program.Statements) {
    result = Eval(statement);

    if (result instanceof ReturnValue) {
      return result.Value;
    } else if (result instanceof OError) {
      return result;
    }
  }

  return result;
}

function evalBlockStatement(program: BlockStatement): OObject | null {
  let result: OObject | null = null;

  for (let statement of program.Statements) {
    result = Eval(statement);

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

function evalPrefixExpression(operator: string, right: OObject | null): OObject {
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

function evalInfixExpression(operator: string, left: OObject | null, right: OObject | null): OObject {
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

function evalIfExpression(ie: IfExpression): OObject | null {
  let condition = Eval(ie.Condition);
  if (isError(condition)) return condition;

  if (isTruthy(condition)) {
    return Eval(ie.Consequence);
  } else if (ie.Alternative !== null) {
    return Eval(ie.Alternative);
  } else {
    return NULL;
  }
}

function isTruthy(obj: OObject | null): boolean {
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

function isError(obj: OObject | null): boolean {
  if (obj !== null) {
    return obj.Type() === ERROR_OBJ;
  }
  return false;
}
