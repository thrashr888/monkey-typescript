export default class Parser {
  constructor(lexer) {
    this.l = lexer;
    this.curToken = null;
    this.peekToken = null;

    this.nextToken();
    this.nextToken();
  }

  nextToken() {
    this.curToken = this.peekToken;
    this.peekToken = this.l.NextToken();
  }

  ParseProgram() {
    return {
      Statements: [
        {
          TokenLiteral: () => 'let',
          Name: {
            Value: 'x',
            TokenLiteral: () => 'x',
          },
        },
        {
          TokenLiteral: () => 'let',
          Name: {
            Value: 'y',
            TokenLiteral: () => 'y',
          },
        },
        {
          TokenLiteral: () => 'let',
          Name: {
            Value: 'foobar',
            TokenLiteral: () => 'foobar',
          },
        },
      ],
    };
  }
}
