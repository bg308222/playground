export {};

const effectsMap: Record<string, Set<Function>> = {
    price: new Set(),
    cost: new Set(),
    quantity: new Set()
};

const toy = { price: 10, cost: 20, quantity: 100 };

let totalPrice: number | undefined;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}
priceEffect();
console.log("1. priceEffect: ", totalPrice); // 1000
effectsMap.price.add(priceEffect);
effectsMap.quantity.add(priceEffect);

let totalCost: number | undefined;
function costEffect() {
    totalCost = toy.cost * toy.quantity;
}
costEffect();
console.log("1. costEffect: ", totalCost); // 2000
effectsMap.cost.add(costEffect);
effectsMap.quantity.add(costEffect);

toy.price = 30;
effectsMap.price.forEach(effect => effect());
console.log("2. priceEffect: ", totalPrice); // 3000
console.log("2. costEffect: ", totalCost); // 2000

toy.quantity *= 10;
effectsMap.quantity.forEach(effect => effect());
console.log("3. priceEffect: ", totalPrice); // 30000
console.log("3. costEffect: ", totalCost); // 20000