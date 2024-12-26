import "./common";

let activeEffect: Function | null = null;
const toy = reactive({ price: 10, cost: 20, quantity: 100 });

const effectsMap: Record<string, Set<Function>> = {};

function reactive<T extends object>(obj: T) {
    return new Proxy(obj, {
        get(target, key) {
            if (activeEffect !== null) {
                track(key as string);
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

function watchEffect(effect: Function) {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

function track(key: string) {
    if (!effectsMap[key]) {
        effectsMap[key] = new Set();
    }

    if (activeEffect !== null) {
        effectsMap[key].add(activeEffect);
    }
}

function trigger(key: string) {
    if (effectsMap[key]) {
        effectsMap[key].forEach(effect => effect());
    }
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