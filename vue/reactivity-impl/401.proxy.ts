import "./common";

const obj = new Proxy({ x: "x0"}, {
    get(target, key) {
        console.log("getter: ", {
            target,
            key,
        });
        return `${target[key]} after getter`;
    },
    set(target, key, newValue) {
        console.log("setter: ", {
            target,
            key,
            newValue
        });
        target[key] = `${newValue} after setter`;
        return true
    },
});

console.log("1: ", obj.x);
console.log("=====")

obj.x = "x1";
console.log("=====")

console.log("2: ", obj.x);
console.log("=====")

let { x } = obj;
console.log("3: ", x);

x = "x2";
console.log("4: ", x);