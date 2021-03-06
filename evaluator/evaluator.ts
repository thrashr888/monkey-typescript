import builtins from './builtins';
import {
  AnyNodeType,
  AstBoolean,
  ASTProgram,
  BlockStatement,
  CallExpression,
  Expression,
  ExpressionStatement,
  WhileLiteral,
  ForLiteral,
  FunctionLiteral,
  Identifier,
  IfExpression,
  InfixExpression,
  IntegerLiteral,
  FloatLiteral,
  LetStatement,
  PrefixExpression,
  ReturnStatement,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
  HashLiteral,
  Comment,
  ImportSpec,
  IncrementExpression,
  DecrementExpression,
  RangeLiteral,
} from '../ast/ast';
import OObject, {
  AnyObject,
  Builtin,
  ERROR_OBJ,
  INTEGER_OBJ,
  FLOAT_OBJ,
  NullableOObject,
  OBoolean,
  OError,
  OFunction,
  OInteger,
  OFloat,
  ONull,
  OString,
  RETURN_VALUE_OBJ,
  ReturnValue,
  OArray,
  ARRAY_OBJ,
  HashPair,
  OHash,
  Hashable,
  HASH_OBJ,
  STRING_OBJ,
  OComment,
} from '../object/object';
import Environment, { NewEnclosedEnvironment } from '../object/environment';
import Lexer from '../lexer/lexer';
import Parser from '../parser/parser';

export const NULL = new ONull(),
  TRUE = new OBoolean(true),
  FALSE = new OBoolean(false);

export default function Eval(node: AnyNodeType | null, env: Environment): NullableOObject {
  if (node instanceof ASTProgram) {
    return evalProgram(node, env);
  } else if (node instanceof ImportSpec) {
    return evalImportSpec(node, env);
  } else if (node instanceof ExpressionStatement) {
    return Eval(node.Expression, env);
  } else if (node instanceof FloatLiteral) {
    return new OFloat(node.Value);
  } else if (node instanceof IntegerLiteral) {
    return new OInteger(node.Value);
  } else if (node instanceof StringLiteral) {
    return new OString(node.Value);
  } else if (node instanceof RangeLiteral) {
    let left = Eval(node.Left, env);
    if (isError(left)) return left;
    let right = Eval(node.Right, env);
    if (isError(right)) return right;
    return evalInfixExpression(node.Operator, left, right);
  } else if (node instanceof Comment) {
    return new OComment(node.Value);
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
    if (node.Index) return evalLetStatement(node, env);
    // simple value set
    let val = Eval(node.Value, env);
    if (isNotError(val)) env.Set(node.Name.Value, val);
    return val;
  } else if (node instanceof Identifier) {
    return evalIdentifier(node, env);
  } else if (node instanceof IncrementExpression) {
    return evalIncrementIdentifier(node, env);
  } else if (node instanceof DecrementExpression) {
    return evalDecrementIdentifier(node, env);
  } else if (node instanceof WhileLiteral) {
    return evalWhile(node.Expression, node.Body, env);
  } else if (node instanceof ForLiteral) {
    return evalFor(node.Initiate, node.Check, node.Iterate, node.Body, env);
  } else if (node instanceof FunctionLiteral) {
    return new OFunction(node.Parameters, node.Body, env);
  } else if (node instanceof CallExpression) {
    let func = Eval(node.Function, env);
    if (isNotError(func)) {
      let args = evalExpressions(node.Arguments, env);
      if (args.length === 1 && isError(args[0])) {
        return args[0];
      }
      return applyFunction(env, func, args);
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
    let rightIndex = Eval(node.RightIndex, env);
    return evalIndexExpression(left, index, node.HasColon, rightIndex);
  } else if (node instanceof HashLiteral) {
    return evalHashLiteral(node, env);
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

// import("example/basic.monkey")
// import("example/basic.monkey") as basic; basic['foo']
// import("example/empty.monkey")
// import("example/example.monkey"); a;
// import("example/example.monkey") as testing; testing['a']
function evalImportSpec(importSpec: ImportSpec, env: Environment): NullableOObject {
  let globalEnv = env.GlobalEnv();
  if (!globalEnv.FileLoader) return NULL;

  let path = importSpec.Path.Value;
  let content = '';

  // cache file contents to global env
  let cacheKey = '_files.' + path;
  let cache = globalEnv.Get(cacheKey);
  if (cache) {
    content = cache.toString();
  } else {
    content = globalEnv.FileLoader.Load(path);
    globalEnv.Set(cacheKey, new OString(content));
  }

  let l = new Lexer(content);
  let p = new Parser(l);
  let program = p.ParseProgram();

  // scope if name is provided, otherwise shared
  if (importSpec.Name) {
    let evaluated = Eval(program, NewEnclosedEnvironment(env));
    env.Set(importSpec.Name.Value, evaluated);
  } else {
    Eval(program, env);
  }

  return null;
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

/*
let a = {'b': 1};
let a['c'] = 2;
a['c']
let a['hi'] = function(x){print("Hello " + x + "!")}
a['hi']("World")
*/
function evalLetStatement(stmt: LetStatement, env: Environment): NullableOObject {
  if (!stmt.Index) return NULL;

  // Eval the parts of the statement
  // let (a)['c'] = 2; // ident name
  let name = stmt.Name;
  // let (a)['c'] = 2; // ident value
  let hash = evalIdentifier(stmt.Name, env) as OHash;
  // let a[('c')] = 2; // hash index
  let key = Eval(stmt.Index.Index, env) as OString;
  if (!key) return NULL;
  // let a['c'] = (2); // new value
  let val = Eval(stmt.Value, env);

  // Set the new value
  let pair = new HashPair(key, val ? val : NULL);
  hash.Pairs.set(key.HashKey().Match, pair);

  // Overwrite the env's hash
  env.Set(name.Value, hash);

  return val;
}

// let a = 0; while(a<=500000){ let a = a + 1; } a;
// while(true){}
function evalWhile(expression: Expression, body: BlockStatement, env: Environment): NullableOObject {
  let result: NullableOObject = null;

  let loopCount = 0;
  while (true) {
    result = Eval(expression, env);

    if (++loopCount > 1000000) {
      // prevent infinite loop
      return newError('loop count of 1,000,000 exeeded');
    } else if (result instanceof ONull) {
      break;
    } else if (result instanceof OBoolean && result.Value === true) {
      Eval(body, env);
    } else if (result instanceof OBoolean && result.Value === false) {
      break;
    } else {
      break;
    }
  }

  return result;
}

// for(let i = 1; i <= 10; let i = i + 1){ print(i * 2) }
function evalFor(
  initiate: Expression,
  check: Expression,
  iterate: Expression,
  body: BlockStatement,
  env: Environment
): NullableOObject {
  let loopCount = 0;
  Eval(initiate, env);

  while (true) {
    let result = Eval(check, env);
    if (++loopCount > 1000000) {
      // prevent infinite loop
      return newError('loop count of 1,000,000 exeeded');
    } else if (result instanceof ONull) {
      break;
    } else if (result instanceof OBoolean && result.Value === true) {
      Eval(body, env);
    } else if (result instanceof OBoolean && result.Value === false) {
      break;
    } else {
      break;
    }

    Eval(iterate, env);
  }

  return NULL;
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
    case '~':
      return evalNotPrefixOperatorExpression(right);
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

  if (right.Type() !== INTEGER_OBJ && right.Type() !== FLOAT_OBJ) {
    return newError('unknown operator: -%s', right.Type());
  } else if (!(right instanceof OInteger) && !(right instanceof OFloat)) {
    return NULL;
  }

  let value = right.Value;
  if (right instanceof OFloat) return new OFloat(-value);
  return new OInteger(-value);
}

function evalNotPrefixOperatorExpression(right: AnyObject | null): OObject {
  if (!right) return FALSE;

  if (right.Type() !== INTEGER_OBJ) {
    return newError('unknown operator: -%s', right.Type());
  } else if (!(right instanceof OInteger)) {
    return NULL;
  }

  let value = right.Value;
  return new OInteger(~value);
}

function evalInfixExpression(operator: string, left: NullableOObject, right: NullableOObject): OObject {
  if (left instanceof OInteger && right instanceof OInteger) {
    return evalIntegerInfixExpression(operator, left, right);
  } else if (left instanceof OFloat && right instanceof OFloat) {
    return evalFloatInfixExpression(operator, left, right);
  } else if (left instanceof OInteger && right instanceof OFloat) {
    return evalFloatInfixExpression(operator, left, right);
  } else if (left instanceof OFloat && right instanceof OInteger) {
    return evalFloatInfixExpression(operator, left, right);
  } else if (left instanceof OString && right instanceof OString) {
    return evalStringInfixExpression(operator, left, right);
  } else if (operator === '==') {
    return nativeBoolToBooleanObject(left === right);
  } else if (operator === '!=') {
    return nativeBoolToBooleanObject(left !== right);
  } else if (operator === 'and' || operator === '&&') {
    // if left AND right are TRUE
    if (!left || !(left instanceof OBoolean)) return nativeBoolToBooleanObject(false);
    if (!right || !(right instanceof OBoolean)) return nativeBoolToBooleanObject(false);
    return nativeBoolToBooleanObject(left.Value && right.Value);
  } else if (operator === 'or' || operator === '||') {
    // if left OR right are TRUE
    if (left && left instanceof OBoolean && left.Value) return nativeBoolToBooleanObject(true);
    if (right && right instanceof OBoolean && right.Value) return nativeBoolToBooleanObject(true);
    return nativeBoolToBooleanObject(false);
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
    case '%':
      return new OInteger(leftVal % rightVal);
    case '&':
      return new OInteger(leftVal & rightVal);
    case '|':
      return new OInteger(leftVal | rightVal);
    case '^':
      return new OInteger(leftVal ^ rightVal);
    case '<<':
      return new OInteger(leftVal << rightVal);
    case '>>':
      return new OInteger(leftVal >> rightVal);
    case '>>>':
      return new OInteger(leftVal >>> rightVal);
    case '**':
      return new OInteger(leftVal ** rightVal);
    case '<':
      return nativeBoolToBooleanObject(leftVal < rightVal);
    case '>':
      return nativeBoolToBooleanObject(leftVal > rightVal);
    case '<=':
      return nativeBoolToBooleanObject(leftVal <= rightVal);
    case '>=':
      return nativeBoolToBooleanObject(leftVal >= rightVal);
    case '==':
      return nativeBoolToBooleanObject(leftVal === rightVal);
    case '!=':
      return nativeBoolToBooleanObject(leftVal !== rightVal);
    case '..':
      return evalRangeObject(leftVal, rightVal, false);
    case '...':
      return evalRangeObject(leftVal, rightVal, true);
    default:
      return newError('unknown operator: %s %s %s', left.Type(), operator, right.Type());
  }
}

function evalRangeObject(left: number, right: number, include: boolean): OObject {
  let arr = [];
  right = include ? right + 1 : right; // `..` vs. `...`
  for (let i = left; i < right; i++) {
    arr.push(new OInteger(i));
  }
  return new OArray(arr);
}

function evalFloatInfixExpression(
  operator: string,
  left: OFloat | OInteger,
  right: OFloat | OInteger
): OObject {
  let leftVal = left.Value;
  let rightVal = right.Value;

  switch (operator) {
    case '+':
      return new OFloat(leftVal + rightVal);
    case '-':
      return new OFloat(leftVal - rightVal);
    case '*':
      return new OFloat(leftVal * rightVal);
    case '/':
      return new OFloat(leftVal / rightVal);
    case '%':
      return new OFloat(leftVal % rightVal);
    case '**':
      return new OFloat(leftVal ** rightVal);
    case '<':
      return nativeBoolToBooleanObject(leftVal < rightVal);
    case '>':
      return nativeBoolToBooleanObject(leftVal > rightVal);
    case '<=':
      return nativeBoolToBooleanObject(leftVal <= rightVal);
    case '>=':
      return nativeBoolToBooleanObject(leftVal >= rightVal);
    case '==':
      return nativeBoolToBooleanObject(leftVal === rightVal);
    case '!=':
      return nativeBoolToBooleanObject(leftVal !== rightVal);
    default:
      return newError('unknown operator: %s %s %s', left.Type(), operator, right.Type());
  }
}

function evalStringInfixExpression(operator: string, left: OString, right: OString): OObject {
  if (operator === '+') {
    let leftVal = left.Value;
    let rightVal = right.Value;
    return new OString(leftVal + rightVal);
  } else if (operator === '==') {
    let leftVal = left.Value;
    let rightVal = right.Value;
    return new OBoolean(leftVal === rightVal);
  } else if (operator === '<') {
    let leftVal = left.Value;
    let rightVal = right.Value;
    return new OBoolean(leftVal < rightVal);
  } else if (operator === '>') {
    let leftVal = left.Value;
    let rightVal = right.Value;
    return new OBoolean(leftVal > rightVal);
  }

  return newError('unknown operator: %s %s %s', left.Type(), operator, right.Type());
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

  return newError('identifier not found: %s at %s', node.Value, node.Token.Position.String());
}

function evalIncrementIdentifier(node: IncrementExpression, env: Environment): NullableOObject {
  let val = env.Get(node.Name.Value);
  if (val) {
    let incremented = new OInteger(val.toValue() + 1);
    env.Set(node.Name.Value, incremented);
    return node.Prefix ? incremented : val;
  }

  return newError('identifier not found: %s at %s', node.Name.Value, node.Token.Position.String());
}

function evalDecrementIdentifier(node: IncrementExpression, env: Environment): NullableOObject {
  let val = env.Get(node.Name.Value);
  if (val) {
    let decremented = new OInteger(val.toValue() - 1);
    env.Set(node.Name.Value, decremented);
    return node.Prefix ? decremented : val;
  }

  return newError('identifier not found: %s at %s', node.Name.Value, node.Token.Position.String());
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

function evalIndexExpression(
  left: OObject | null,
  index: OObject | null,
  hasColon: boolean,
  rightIndex: OObject | null = null
): OObject {
  if (left === null) return NULL;

  if (left.Type() === ARRAY_OBJ) {
    return evalArrayIndexExpression(left, index, hasColon, rightIndex);
  } else if (left.Type() === STRING_OBJ) {
    return evalStringIndexExpression(left, index, hasColon, rightIndex);
  } else if (index !== null && left.Type() === HASH_OBJ) {
    return evalHashIndexExpression(left, index);
  } else {
    return newError(
      'index operator not supported: %s[%s:%s]',
      left.Type(),
      index ? index.Type() : null,
      rightIndex ? rightIndex.Type() : null
    );
  }
}

// 'abc'[:2]
// 'abcd'[2:]
function evalStringIndexExpression(
  str: OObject,
  index: OObject | null,
  hasColon: boolean = false,
  rightIndex: OObject | null
): OObject {
  let strObject = str as OString;
  let idx = index ? (index as OInteger).Value : null;
  let rIdx = rightIndex ? (rightIndex as OInteger).Value : null;

  let newStr = strObject.Inspect();

  // order matters here
  if (idx && hasColon && !rIdx) {
    // [1:]
    return new OString(newStr.substring(idx));
  } else if (idx && !rIdx) {
    // [1]
    return new OString(newStr[idx]);
  } else if (idx && rIdx) {
    // [1:2]
    return new OString(newStr.substring(idx, rIdx));
  } else if (rIdx && hasColon && !idx) {
    // [:1]
    return new OString(newStr.substring(0, rIdx));
  }
  return NULL;
}

// [1,2,3,4][:2]
// [1,2,3,4][2:]
function evalArrayIndexExpression(
  array: OObject,
  index: OObject | null,
  hasColon: boolean = false,
  rightIndex: OObject | null
): OObject {
  let arrayObject = array as OArray;
  let idx = index ? (index as OInteger).Value : null;
  let rIdx = rightIndex ? (rightIndex as OInteger).Value : null;

  // order maters here
  if (idx && hasColon && !rIdx) {
    // [1:]
    return new OArray(arrayObject.Elements.slice(idx));
  } else if (idx && !rIdx) {
    // [1]
    return arrayObject.Elements[idx];
  } else if (idx && rIdx) {
    // [1:2]
    return new OArray(arrayObject.Elements.slice(idx, rIdx));
  } else if (rIdx && hasColon && !idx) {
    // [:1]
    return new OArray(arrayObject.Elements.slice(0, rIdx));
  }
  return NULL;
}

function evalHashLiteral(node: HashLiteral, env: Environment): OObject {
  let pairs = new Map<string, HashPair>();

  node.Pairs.forEach((valueNode, keyNode) => {
    let key = Eval(keyNode, env);
    if (isError(key) || !key) {
      return key;
    }

    let hashKey = key as Hashable;
    if (!(hashKey instanceof OBoolean || hashKey instanceof OInteger || hashKey instanceof OString)) {
      return newError('unusable as hash key: %s', (hashKey as OObject).Type());
    }

    let value = Eval(valueNode, env);
    if (isError(value) || !value) {
      return value;
    }

    let hashed = hashKey.HashKey();
    pairs.set(hashed.Match, new HashPair(hashKey, value));
  });

  return new OHash(pairs);
}

function evalHashIndexExpression(hash: OObject, index: OObject): OObject {
  let hashObject = hash;
  if (!(hashObject instanceof OHash)) {
    return newError('unusable as hash object: %s', (hashObject as OObject).Type());
  }

  let key = index;
  if (!(key instanceof OBoolean || key instanceof OInteger || key instanceof OString)) {
    return newError('unusable as hash key: %s', (key as OObject).Type());
  }

  let pair = hashObject.Pairs.get(key.HashKey().Match);
  if (!pair) {
    return NULL;
  }

  return pair.Value;
}

export function applyFunction(env: Environment, fn: OObject, args: OObject[]): NullableOObject {
  let func = fn;
  if (func instanceof OFunction) {
    let extendedEnv = extendedFunctionEnv(func, args);
    let evaluated = Eval(func.Body, extendedEnv);
    return unwrapReturnValue(evaluated);
  } else if (func instanceof Builtin) {
    return func.Fn(env, ...args);
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
