import { AnyNodeType, Statement, ASTProgram, ExpressionStatement, IntegerLiteral } from '../ast/ast';
import OObject, { OInteger } from '../object/object';

export default function Eval(node: AnyNodeType | null): OObject | null {
  if (node instanceof ASTProgram) {
    return evalStatements(node.Statements);
  } else if (node instanceof ExpressionStatement) {
    return Eval(node.Expression);
  } else if (node instanceof IntegerLiteral) {
    return new OInteger(node.Value);
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
