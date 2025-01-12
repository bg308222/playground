export interface Product {
    price: number;
    cost: number;
    quantity: number;
}

let activeEffect: Function | null = null;
const effectsMap: Record<string, Set<Function>> = {
    price: new Set(),
    cost: new Set(),
    quantity: new Set()
};

function track(key: string, effect: Function) {
    effectsMap[key].add(effect);
}

function trigger(key: string) {
    effectsMap[key].forEach(effect => effect());
}

export function watchEffect(effect: Function) {
    activeEffect = effect;
    effect();
    activeEffect = null;
}

export function reactive<T extends object>(object: T) {
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