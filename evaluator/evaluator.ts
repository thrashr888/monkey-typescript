import builtins from './builtins';
import {
  AnyNodeType,
  AstBoolean,
  ASTProgram,
  BlockStatement,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionLiteral,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
} from '../ast/ast';
import OObject, {
  AnyObject,
  Builtin,
  ERROR_OBJ,
  INTEGER_OBJ,
  NullableOObject,
  OBoolean,
  OError,
  OFunction,
  OInteger,
  ONull,
  OString,
  RETURN_VALUE_OBJ,
  ReturnValue,
  OArray,
  ARRAY_OBJ,
} from '../object/object';
import Environment, { NewEnclosedEnvironment } from '../object/environment';

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
  } else if (node instanceof StringLiteral) {
    return new OString(node.Value);
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
  } else if (node instanceof FunctionLiteral) {
    return new OFunction(node.Parameters, node.Body, env);
  } else if (node instanceof CallExpression) {
    let func = Eval(node.Function, env);
    if (isNotError(func)) {
      let args = evalExpressions(node.Arguments, env);
      if (args.length === 1 && isError(args[0])) {
        return args[0];
      }
      return applyFunction(func, args);
    }
    return func;
  } else if (node instanceof ArrayLiteral) {
    let elements = evalExpressions(node.Elements, env);
    if (elements.length === 1 && isError(elements[0])) {
      return elements[0];
    }
    return new OArray(elements);
  } else if (node instanceof IndexExpression) {
    let left = Eval(node.Left, env);
    if (isError(left)) return left;
    let index = Eval(node.Index, env);
    if (isError(index)) return index;
    return evalIndexExpression(left, index);
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
  } else if (left instanceof OString && right instanceof OString) {
    return evalStringInfixExpression(operator, left, right);
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

function evalStringInfixExpression(operator: string, left: OString, right: OString): OObject {
  if (operator !== '+') {
    return newError('unknown operator: %s %s %s', left.Type(), operator, right.Type());
  }

  let leftVal = left.Value;
  let rightVal = right.Value;
  return new OString(leftVal + rightVal);
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
  if (val) {
    return val;
  }

  if (builtins[node.Value]) {
    return builtins[node.Value];
  }

  return newError('identifier not found: %s', node.Value);
}

function evalExpressions(exps: Expression[], env: Environment): OObject[] {
  let result: OObject[] = [];

  for (let e of exps) {
    let evaluated = Eval(e, env);
    if (isNotError(evaluated)) {
      result.push(evaluated);
      continue;
    }
    if (isError(evaluated)) {
      return [evaluated];
    }
  }

  return result;
}

function evalIndexExpression(left: OObject | null, index: OObject | null): OObject {
  if (left === null || index === null) return NULL;

  if (left.Type() === ARRAY_OBJ && index.Type() === INTEGER_OBJ) {
    return evalArrayIndexExpression(left, index);
  } else {
    return newError('index operator not supported: %s', left.Type());
  }
}

function evalArrayIndexExpression(array: OObject, index: OObject): OObject {
  let arrayObject = array as OArray;
  let idx = (index as OInteger).Value;
  let max = arrayObject.Elements.length - 1;

  if (idx < 0 || idx > max) {
    return NULL;
  }

  return arrayObject.Elements[idx];
}

function applyFunction(fn: OObject, args: OObject[]): NullableOObject {
  let func = fn;
  if (func instanceof OFunction) {
    let extendedEnv = extendedFunctionEnv(func, args);
    let evaluated = Eval(func.Body, extendedEnv);
    return unwrapReturnValue(evaluated);
  } else if (func instanceof Builtin) {
    return func.Fn(...args);
  }

  return newError('not a function: %s', fn.Type());
}

function extendedFunctionEnv(fn: OFunction, args: OObject[]): Environment {
  let env = NewEnclosedEnvironment(fn.Env);

  for (let [paramIdx, param] of fn.Parameters.entries()) {
    env.Set(param.Value, args[paramIdx]);
  }

  return env;
}

function unwrapReturnValue(obj: NullableOObject): NullableOObject {
  let returnValue = obj;
  if (returnValue instanceof ReturnValue) {
    return returnValue.Value;
  }

  return obj;
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

export function newError(format: string, ...args: any[]): OError {
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
