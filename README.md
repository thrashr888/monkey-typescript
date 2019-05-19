# Monkey

An extended [Monkey](https://interpreterbook.com/) language interpreter in Typescript.

## The Extended Monkey Language

In `example.monkey`:

```javascript
let log = fn(msg) { puts(msg); true; };
let and = fn(a, b) { if (a) { if (b) { return true; } return false; }; return false; };
let or = fn(a, b) { if (a) { return true; }; if (b) { return true; }; return false; };

log(0);

let a = "1";
log(a);

let b = [1, 2, "three"];
log(b[1]);

let c = { "a": "bee", "c": "three" };
log(c['c']); // three

and(1, false); // false
or(1, false); // true
```

    $ npx monkey-typescript example.monkey
    Log: 0
    Log: 1
    Log: 2
    Log: three
    null

## REPL

    $ npx monkey-typescript
    Hello thrashr888! This is the Monkey programming language!
    Feel free to type in commands
    >>

## Usage

    $ npm install monkey-typescript

```typescript
import { NewEnvironment, Lexer, Parser, Eval } from 'monkey-typescript';

let env = NewEnvironment();
let l = new Lexer('puts("hello!"); let a = 5; 5 * 55;');
let p = new Parser(l);
let program = p.ParseProgram();

if (p.Errors().length !== 0) {
  console.log(p.Errors().forEach(msg => console.log(`\t${msg}`)));
  return;
}

let evaluated = Eval(program, env);
console.log(evaluated.Inspect());
```

Using `require`:

```javascript
var monkeyTypescript = require('monkey-typescript');

let env = monkeyTypescript.NewEnvironment();
let l = new monkeyTypescript.Lexer('puts("hello!"); let a = 5; 5 * 55;');
let p = new monkeyTypescript.Parser(l);
let program = p.ParseProgram();

if (p.Errors().length !== 0) {
  console.log(p.Errors().forEach(msg => console.log(`\t${msg}`)));
  return;
}

let evaluated = monkeyTypescript.Eval(program, env);
console.log(evaluated.Inspect());
```

## Development

Contributions welcome!

### Build

    $ nvm use
    $ npm install

### Run

    $ npm start

or:

    $ ts-node index.ts

### Test

    $ npm run test

or watch for file changes:

    $ npm run test:live

## npm Publish

    $ npm run build
    # bump version number in `package.json`
    $ npm publish

## Docker Publish

    # publish to npm
    # bump version number in `Dockerfile`
    $ docker build . -t=thrashr888/monkey-typescript:latest
    $ docker push thrashr888/monkey-typescript:latest
    $ docker build . -t=thrashr888/monkey-typescript:v0.0.24
    $ docker push thrashr888/monkey-typescript:v0.0.24
    $ docker run -it monkey-typescript

## TODO

- [ ] Gracefully handle non-text Lexer input (like Promises)
- [ ] Add file running to Dockerfile (`docker run -it monkey-typescript example.monkey`)
- [ ] Add Environment variables to global scope
- [ ] Support empty input/files
- [ ] Add `import "filename.monkey"`
- [ ] Add `import "monkey.thrasher.dev/b7f8sd9at/file.monkey"`
- [ ] Add `sprintf`
- [ ] Add `[0:1]` array/string indexing
- [ ] Add `i++`
- [ ] Add `for(let i = 0; i < 10; i++){}` loop
- [ ] Add browser vs. nodejs `__env` global variable
- [ ] string_template("%s, %d", var1, var2)
- [ ] RegExp
  - [ ] test
  - [ ] match
  - [ ] search
  - [ ] replace
  - [ ] split
- [x] Add math builtins
  - [x] abs
  - [x] ceil
  - [x] floor
  - [x] log
  - [x] round
  - [x] sqrt
  - [x] pow
  - [x] sin
  - [x] cos
  - [x] tan
  - [x] trunc
- [x] Add string builtins
  - [x] contains
  - [x] concat
  - [x] includes
  - [x] repeat
  - [x] slice
  - [x] replace
  - [x] split
  - [x] trim
  - [x] starts_with
  - [x] ends_with
  - [x] index_of
  - [x] reverse
  - [x] lowercase
  - [x] uppercase
  - [x] substr
  - [x] substring
- [ ] Add array builtins
  - [x] first
  - [x] last
  - [x] len
  - [x] push
  - [x] rest
  - [ ] map
  - [ ] reduce
  - [ ] filter
  - [ ] sort
  - [ ] concat
  - [ ] find
  - [ ] flat
  - [ ] slice
  - [ ] contains
  - [ ] join
  - [ ] reverse
  - [ ] shift
  - [ ] unshift
  - [ ] min
  - [ ] max
- [ ] Add object builtins
  - [ ] keys
  - [ ] values
  - [ ] filter
  - [ ] contains_key
  - [ ] remove
- [ ] Add http I/O
- [ ] Add local file I/O

## Credits

Original Monkey language and source code from the book ["Writing an Interpreter
in Go" by Thorsten Ball](https://interpreterbook.com/). Translated to Typescript
by Paul Thrasher. It's a great book. Buy it!

## Typescript Interpreter and Extensions MIT LICENSE

Copyright (c) 2019 Paul Thrasher

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Monkey Language and Go Interpreter MIT LICENSE

Copyright (c) 2016-2017 Thorsten Ball

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
