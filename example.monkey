let log = fn(msg) {
  return puts("Log:", msg);
};

log(0);

let a = "1";
log(a);

let b = [1, 2, "three"];
log(b[1]);

let c = {"a": "bee", "c": "three"};
log(c["c"]);
