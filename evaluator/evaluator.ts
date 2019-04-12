import {
  AnyNodeType,
  Statement,
  ASTProgram,
  ExpressionStatement,
  IntegerLiteral,
  AstBoolean,
  PrefixExpression,
  InfixExpression,
} from '../ast/ast';
import OObject, { OInteger, OBoolean, ONull, AnyObject, INTEGER_OBJ } from '../object/object';

export const NULL = new ONull(),
  TRUE = new OBoolean(true),
  FALSE = new OBoolean(false);

export default function Eval(node: AnyNodeType | null): OObject | null {
  if (node instanceof ASTProgram) {
    return evalStatements(node.Statements);
  } else if (node instanceof ExpressionStatement) {
    return Eval(node.Expression);
  } else if (node instanceof IntegerLiteral) {
    return new OInteger(node.Value);
  } else if (node instanceof AstBoolean) {
    return nativeBoolToBooleanObject(node.Value);
  } else if (node instanceof PrefixExpression) {
    let right = Eval(node.Right);
    return evalPrefixExpression(node.Operator, right);
  } else if (node instanceof InfixExpression) {
    let left = Eval(node.Left);
    let right = Eval(node.Right);
    return evalInfixExpression(node.Operator, left, right);
  }

  return null;
}

function evalStatements(stmts: Statement[]): OObject | null {
  let result: OObject | null = null;

  for (let statement of stmts) {
    result = Eval(statement);
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
      return evalMinusOperatorExpression(right);
    default:
      return NULL;
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

function evalMinusOperatorExpression(right: AnyObject | null): OObject {
  if (!right) return FALSE;

  if (right.Type() !== INTEGER_OBJ) {
    return NULL;
  } else if (!(right instanceof OInteger)) {
    return NULL;
  }

  let value = right.Value;
  return new OInteger(-value);
}

function evalInfixExpression(operator: string, left: OObject | null, right: OObject | null): OObject {
  if (!left) return NULL;

  if (left instanceof OInteger && right instanceof OInteger) {
    return evalIntegerInfixExpression(operator, left, right);
  } else if (operator === '==') {
    return nativeBoolToBooleanObject(left === right);
  } else if (operator === '!=') {
    return nativeBoolToBooleanObject(left !== right);
  } else {
    return NULL;
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
      return NULL;
  }
}
