import type { Product, ProductKey } from "./common";

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

function watchEffect(effect: Function) {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

function track(key: ProductKey, effect: Function) {
    effectsMap[key].add(effect);
}

function trigger(key: ProductKey) {
    effectsMap[key].forEach(effect => effect());
}


watchEffect(() => {
    const totalPrice = toy.price * toy.quantity;
    console.log("price effect: ", { toy, totalPrice});
})

watchEffect(() => {
    const totalCost = toy.cost * toy.quantity;
    console.log("cost effect: ", { toy, totalCost});
})



console.log("============ init finished: ", toy);
toy.price = 30;
toy.quantity *= 10;