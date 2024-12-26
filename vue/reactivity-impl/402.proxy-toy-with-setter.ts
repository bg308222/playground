import type { Product, ProductKey } from "./common";

const toy = new Proxy<Product>({ price: 10, cost: 20, quantity: 100 }, {
    get(target, key) {
        // track(key as ProductKey, () => {});
        return target[key];
    },
    set(target, key, value) {
        target[key] = value;
        trigger(key as ProductKey);
        return true;
    }
});

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


let totalPrice;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}
track("price", priceEffect);
track("quantity", priceEffect);

let totalCost;
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

templateAction("init");

toy.price = 30;
templateAction("update price");

toy.quantity *= 10;
templateAction("update quantity");