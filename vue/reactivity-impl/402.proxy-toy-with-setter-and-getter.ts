﻿import type { Product, ProductKey } from "./common";

let activeEffect: Function | null = null;
const toy = new Proxy<Product>({ price: 10, cost: 20, quantity: 100 }, {
    get(target, key) {
        if (activeEffect !== null) {
            track(key as ProductKey, activeEffect);
        }
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


let totalPrice: number | undefined;
activeEffect = priceEffect;
priceEffect();
activeEffect = null;
function priceEffect() {
    totalPrice = toy.price * toy.quantity;
}

let totalCost: number | undefined;
activeEffect = costEffect;
costEffect();
activeEffect = null;
function costEffect() {
    totalCost = toy.cost * toy.quantity;
}

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