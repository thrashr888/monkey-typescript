import { OString, OInteger } from './object';
import Test from '../test';

export function TestObject(t: Test) {
  console.log('║  └ TestStringHashKey');
  TestStringHashKey(t);
}

export function TestStringHashKey(t: Test) {
  let hello1 = new OString('Hello World');
  let hello2 = new OString('Hello World');

  let diff1 = new OString('My name is johnny');
  let diff2 = new OString('My name is johnny');

  let num1 = new OString('My name is johnny');
  let num2 = new OInteger(-375126709); // hash of above string

  if (hello1.HashKey().Match !== hello2.HashKey().Match) {
    t.Errorf(
      'strings with same content have different hash keys: %s,%s',
      hello1.HashKey().Match,
      hello2.HashKey().Match
    );
  }

  if (diff1.HashKey().Match !== diff2.HashKey().Match) {
    t.Errorf(
      'strings with same content have different hash keys: %s,%s',
      diff1.HashKey().Match,
      diff2.HashKey().Match
    );
  }

  if (hello1.HashKey().Match === diff2.HashKey().Match) {
    t.Errorf(
      'strings with different content have same hash keys: %s,%s',
      hello1.HashKey().Match,
      diff2.HashKey().Match
    );
  }

  if (num1.HashKey().Match === num2.HashKey().Match) {
    t.Errorf(
      'objects with different type have different hash keys: %s,%s',
      num1.HashKey().Match,
      num2.HashKey().Match
    );
  }
}
