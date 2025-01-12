export {};

const obj = new Proxy({ x: 1}, {
    get(target, key) {
        console.log("Through getter");
        return target[key];
    },
    set(target, key, newValue) {
        console.log("Through setter");
        target[key] = newValue;
        return true;
    },
});

console.log("===== Testing getter =====");
console.log("Result: ", obj.x);

console.log("===== Testing setter =====");
obj.x = 2;
console.log("Result: ", obj.x);