import Test from "./lexer/lexer.test";
import Repl from "./repl/repl";

export function main() {
  Test();

  console.log("Hello! This is the Monkey programming language!");
  console.log("Feel free to type in commands");

  Repl.Start("let test = 1;");
}
