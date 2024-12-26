import "./common";

let a = 1, b = 2;
let sum;
function effect() {
    sum = a + b;
}

a = 2;
effect();
console.log({a, b, sum});

b = 7;
effect();
console.log({a, b, sum});