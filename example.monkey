sprint('Begin Example')
sprint('=============')

// just prints what you send it
let print = function(msg) {
  return sprint("=>", msg);
};

print(0);

let a = "1";
print(a);

let b = [1, 2, "three"];
print(b[1]);

let c = {"a": "bee", "c": "three"};
print(c["c"]);

let obj = jsonParse('{"a": "bee", "c": "three"}');
print(obj['a']);

let bigObj = {"data": [
  {
    "id": 1,
    "name": "first"
  },
  {
    "id": 2,
    "name": "second"
  }
]};
let json = jsonStringify(bigObj);
print(json)

print("logic equals " + string( b[0] >= number(a) or b[1] < 50) )

// a string using single quotes
sprint('===========')
sprint('End Example')

// return an error
return 1