﻿export {};

let activeEffect: Function | null = null;
const effectsMap: Record<string, Set<Function>> = {
    price: new Set(),
    cost: new Set(),
    quantity: new Set()
};

const toy = reactive({ price: 10, cost: 20, quantity: 100 });

watchEffect(() => {
    const totalPrice = toy.price * toy.quantity;
    console.log("price effect: ", totalPrice);
});
watchEffect(() => {
    const totalCost = toy.cost * toy.quantity;
    console.log("cost effect: ", totalCost);
});

console.log("===== Set price =====");
toy.price = 30;

console.log("===== Set quantity =====");
toy.quantity *= 10;

function track(key: string, effect: Function) {
    effectsMap[key].add(effect);
}

function trigger(key: string) {
    effectsMap[key].forEach(effect => effect());
}

function watchEffect(effect: Function) {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

function reactive<T extends object>(object: T) {
    return new Proxy(object, {
        get(target, key) {
            if (activeEffect !== null) {
                track(key as string, activeEffect);
            }
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            trigger(key as string);
            return true;
        }
    })
}