import type { ProductKey } from "./common";

const toy = { price: 10, cost: 20, quantity: 100 };
const effectsMap: Record<ProductKey, Set<Function>> = {
    price: new Set(),
    cost: new Set(),
    quantity: new Set()
};

let totalPrice: number | undefined;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}

effectsMap.price.add(priceEffect);
effectsMap.quantity.add(priceEffect);

let totalCost: number | undefined;
function costEffect() {
    totalCost = toy.cost * toy.quantity;
}
effectsMap.cost.add(costEffect);
effectsMap.quantity.add(costEffect);

function templateAction(topic: string) {
    console.log(topic);
    console.log({ toy, totalPrice, totalCost })
    console.log();
}

priceEffect();
costEffect();
templateAction("init");

toy.price = 30;
effectsMap.price.forEach(effect => effect());
templateAction("update price");

toy.quantity *= 10;
effectsMap.quantity.forEach(effect => effect());
templateAction("update quantity");