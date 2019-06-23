export default class Position {
  Filename: string = ''; // filename, if any
  Offset: number = 0; // offset, starting at 0
  Line: number = 0; // line number, starting at 1
  Column: number = 0; // column number, starting at 1 (byte count)

  constructor(offset: number, line: number = 0, column?: number) {
    this.Offset = offset;
    this.Line = line;
    this.Column = column || 0;
  }

  valueOf(): number {
    return this.Offset;
  }

  IsValid(): boolean {
    return this.Line > 0;
  }

  // String returns a string in one of several forms:
  //
  //	file:line:column    valid position with file name
  //	line:column         valid position without file name
  //	file                invalid position with file name
  //	-                   invalid position without file name
  //
  String(): string {
    let s: string = this.Filename;

    if (this.IsValid()) {
      if (s !== '') {
        s += ':';
      }
      s += printf('line %s, column %s', this.Line, this.Column);
    }
    if (s === '') {
      s = '-';
    }
    return s;
  }
}

export const NoPos: Position = new Position(0);

function printf(...args: any[]): string {
  return [...args].reduce((p, c) => p.replace(/%s/, c));
}
