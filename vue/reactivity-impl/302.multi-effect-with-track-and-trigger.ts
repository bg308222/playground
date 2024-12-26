import type { ProductKey } from "./common";

const toy = { price: 10, cost: 20, quantity: 100 };
const effectsMap: Record<ProductKey, Set<Function>> = {
    price: new Set(),
    cost: new Set(),
    quantity: new Set()
};

function track(key: ProductKey, effect: Function) {
    effectsMap[key].add(effect);
}

function trigger(key: ProductKey) {
    effectsMap[key].forEach(effect => effect());
}


let totalPrice: number | undefined;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}
track("price", priceEffect);
track("quantity", priceEffect);

let totalCost: number | undefined;
function costEffect() {
    totalCost = toy.cost * toy.quantity;
}
track("cost", costEffect);
track("quantity", costEffect);

function templateAction(topic: string) {
    console.log(topic);
    console.log({ toy, totalPrice, totalCost })
    console.log();
}

priceEffect();
costEffect();
templateAction("init");

toy.price = 30;
trigger("price");
templateAction("update price");

toy.quantity *= 10;
trigger("quantity");
templateAction("update quantity");