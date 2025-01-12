export {};

const effectsMap: Record<string, Set<Function>> = {
    price: new Set(),
    cost: new Set(),
    quantity: new Set()
};

const toy = new Proxy({ price: 10, cost: 20, quantity: 100 }, {
    set(target, key, newValue) {
        target[key] = newValue;
        trigger(key as string);
        return true;
    }
});

let totalPrice: number | undefined;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}
priceEffect();
console.log("1. priceEffect: ", totalPrice); // 1000
track("price", priceEffect);
track("quantity", priceEffect);

let totalCost: number | undefined;
function costEffect() {
    totalCost = toy.cost * toy.quantity;
}
costEffect();
console.log("1. costEffect: ", totalCost); // 2000
track("cost", costEffect);
track("quantity", costEffect);

toy.price = 30;
console.log("2. priceEffect: ", totalPrice); // 3000
console.log("2. costEffect: ", totalCost); // 2000

toy.quantity *= 10;
console.log("3. priceEffect: ", totalPrice); // 30000
console.log("3. costEffect: ", totalCost); // 20000

function track(key: string, effect: Function) {
    effectsMap[key].add(effect);
}

function trigger(key: string) {
    effectsMap[key].forEach(effect => effect());
}